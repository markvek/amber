export const colors = {
  // Brand — core color system (neutral, Facebook-style: grays plus one blue)
  primary: '#1360C4', // deepened Facebook blue: primary actions, main CTAs (white text 6.0:1 AA)
  primaryHover: '#0E4E9E', // darker navy: hover/active state, reads by lightness not hue
  primaryLight: '#EBF2FC', // pale blue tint: active nav, selected rows (primary text 5.3:1)

  secondary: '#4B4F56', // charcoal-slate: secondary actions, labels (white text 7:1)
  secondaryLight: '#E4E6EB', // gray fill: secondary buttons, use with neutral900 text

  accent: '#0E4E9E', // restrained navy: emphasis, callouts (differentiated by darkness)
  accentLight: '#DCE7F5', // cool tint: accent chips, badges

  dark: '#242526', // dark-surface charcoal: footers, headers (white text 15.4:1)

  // Semantic — ordered by lightness so states never rely on hue alone
  success: '#1E7A44', // dark green: completion, positive feedback (white 5.4:1)
  warning: '#8A5300', // desaturated dark ochre: caution, incomplete (white 6.3:1)
  error: '#B42318', // blue-leaning dark red: errors, destructive (white 6.6:1)
  info: '#1259B3', // deep blue distinct from primary by darkness (white 6.8:1)
  select: '#5B4BC4', // dark indigo: selection highlights (white 6.5:1)

  // Neutrals — Facebook grayscale for structure
  neutral900: '#1C1E21', // near-black: dark text, strong contrast (16.7:1 on white)
  neutral700: '#3E4042', // dark gray: headings on tinted surfaces, hover text
  neutral500: '#65676B', // mid gray: icons, secondary UI (5.7:1 on white)
  neutral300: '#CED0D4', // divider/border gray: non-text use only
  neutral100: '#E4E6EB', // hover fills, input backgrounds, skeletons
  neutral50: '#F7F8FA', // faintest cool gray: zebra rows, wells

  // Surface & text
  surface: '#ffffff', // pure white: cards, modals, primary surfaces
  surfaceMuted: '#F7F8FA', // quiet cool gray: inset panels within cards
  background: '#F0F2F5', // Facebook page-canvas gray: makes white cards float
  textPrimary: '#1C1E21', // near-black: main body text (14.9:1 on background)
  textSecondary: '#606266', // meta-text gray: labels, meta (5.5:1 on background)
  textInverse: '#ffffff', // white: text on dark/brand/semantic fills
} as const

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
} as const

export type ColorToken = keyof typeof colors
export type FontSizeToken = keyof typeof typography.sizes
export type FontWeightToken = keyof typeof typography.weights
export type SpacingToken = keyof typeof spacing
export type RadiusToken = keyof typeof radii
export type ShadowToken = keyof typeof shadows
