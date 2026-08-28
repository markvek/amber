import { radii } from '../../edu-ui/tokens'

/**
 * Hue pairs for book tiles: a solid glyph color and the pale tint it sits on.
 * Solids are all dark enough to read against their own tint.
 */
const bookColors = [
  { solid: '#1360C4', tint: '#EBF2FC' }, // blue
  { solid: '#5B4BC4', tint: '#EAE7F8' }, // indigo
  { solid: '#1E7A44', tint: '#E6F2EA' }, // green
  { solid: '#8A5300', tint: '#F7EFE2' }, // ochre
  { solid: '#B42318', tint: '#FBEAE8' }, // red
  { solid: '#0F6E70', tint: '#E4F0F0' }, // teal
  { solid: '#8A2C6B', tint: '#F7E8F1' }, // plum
  { solid: '#3E4042', tint: '#EBECED' }, // slate
] as const

/**
 * Hashes the seed so a given book keeps its color across reloads — random to
 * look at, stable to use.
 */
function colorFor(seed: string | number) {
  const s = String(seed)
  let hash = 0
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return bookColors[hash % bookColors.length]
}

/** A book glyph tinted by a color derived from `seed`. Fills its parent tile. */
export function BookIcon({ seed }: { seed: string | number }) {
  const { solid, tint } = colorFor(seed)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tint,
        borderRadius: radii.md,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        {/* Closed book: solid cover with a lighter spine stripe — legible at 22px */}
        <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill={solid} />
        <rect x="6.4" y="3" width="1.5" height="18" fill="#fff" opacity="0.4" />
      </svg>
    </div>
  )
}
