import type { CSSProperties } from 'react'

export interface GrainOverlayProps {
  /** 0–1 grain strength; 0.25 reads as textured paper, 0.5+ is heavy film grain */
  intensity?: number
  /** 'fixed' covers the viewport (app-wide use); 'absolute' fills the nearest positioned ancestor (demos, cards) */
  position?: 'fixed' | 'absolute'
  /** Grain speckle scale in px — smaller tiles read as finer grain */
  size?: number
  style?: CSSProperties
}

const noiseDataUri = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100" height="100" filter="url(%23noise)"/></svg>')`

/**
 * Paper-grain texture overlay. Renders above content with pointer-events
 * disabled and multiply blending, so it darkens/texturizes whatever is
 * beneath it — page canvas and cards alike — without blocking interaction.
 */
export function GrainOverlay({
  intensity = 0.25,
  position = 'fixed',
  size = 100,
  style,
}: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      style={{
        position,
        inset: 0,
        backgroundImage: noiseDataUri,
        backgroundRepeat: 'repeat',
        backgroundSize: `${size}px ${size}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: intensity,
        mixBlendMode: 'multiply',
        ...style,
      }}
    />
  )
}
