/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#662117',
        'primary-foreground': '#ffffff',
        'primary-hover': '#5a1a11',
        'primary-light': '#e8d5cf',
        secondary: '#AE4625',
        'secondary-foreground': '#ffffff',
        'secondary-light': '#e5cfc4',
        accent: '#D58E3A',
        'accent-foreground': '#ffffff',
        'accent-light': '#f0dcc8',
        dark: '#303724',

        // Semantic
        success: '#16a34a',
        warning: '#d97706',
        error: '#C62F1D',
        info: '#0284c7',
        select: '#1D6363',
        destructive: '#C62F1D',
        'destructive-foreground': '#ffffff',

        // Neutrals
        neutral: {
          900: '#111827',
          700: '#374151',
          500: '#6b7280',
          300: '#d1d5db',
          100: '#f3f4f6',
          50: '#f9fafb',
        },

        // Surface & text
        surface: '#ffffff',
        'surface-muted': '#f9fafb',
        background: '#FCF2DD',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        'text-inverse': '#ffffff',

        // Standard Tailwind names for compatibility
        foreground: '#111827',
        muted: '#f3f4f6',
        'muted-foreground': '#6b7280',
        popover: '#ffffff',
        'popover-foreground': '#111827',
        card: '#ffffff',
        'card-foreground': '#111827',
        border: '#d1d5db',
        input: '#ffffff',
        ring: '#1D6363',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
