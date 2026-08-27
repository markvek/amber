export const colors = {
  // Brand — core color system
  primary: '#662117', // Color 1: primary actions, main CTAs, buttons
  primaryHover: '#5a1a11', // darker shade: hover/active state
  primaryLight: '#e8d5cf', // light shade: backgrounds, light fills

  secondary: '#AE4625', // Color 2: secondary actions, section highlights
  secondaryLight: '#e5cfc4', // light secondary: soft backgrounds

  accent: '#D58E3A', // Color 3: emphasis, callouts, tips, accents
  accentLight: '#f0dcc8', // light accent: backgrounds, accent fills

  dark: '#303724', // Color 4: dark neutral, strong text, dark components

  // Semantic — meaningful colors
  success: '#16a34a', // Green: completion, validation, positive feedback
  warning: '#d97706', // Amber: caution, incomplete, needs attention
  error: '#C62F1D', // Red: error states, destructive actions, stop
  info: '#0284c7', // Blue: information, tips, neutral alerts
  select: '#1D6363', // Teal: selected states, selection highlights, active states

  // Neutrals — grayscale for structure
  neutral900: '#111827', // near-black: dark text, strong contrast
  neutral700: '#374151', // dark gray: secondary text, borders
  neutral500: '#6b7280', // mid gray: disabled text, hints
  neutral300: '#d1d5db', // light gray: dividers, subtle borders
  neutral100: '#f3f4f6', // lighter gray: hover states, subtle backgrounds
  neutral50: '#f9fafb', // near-white: minimal backgrounds

  // Surface & text
  surface: '#ffffff', // pure white: cards, modals, primary surfaces
  surfaceMuted: '#f9fafb', // almost-white: alternate surface (lists, sections)
  background: '#FCF2DD', // cream: page background (use with grainy texture)
  textPrimary: '#111827', // dark: main body text
  textSecondary: '#6b7280', // gray: secondary text, labels, meta
  textInverse: '#ffffff', // white: text on dark backgrounds
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
