/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#1360C4',
        'primary-foreground': '#ffffff',
        'primary-hover': '#0E4E9E',
        'primary-light': '#EBF2FC',
        secondary: '#4B4F56',
        'secondary-foreground': '#ffffff',
        'secondary-light': '#E4E6EB',
        accent: '#0E4E9E',
        'accent-foreground': '#ffffff',
        'accent-light': '#DCE7F5',
        dark: '#242526',

        // Semantic
        success: '#1E7A44',
        warning: '#8A5300',
        error: '#B42318',
        info: '#1259B3',
        select: '#5B4BC4',
        destructive: '#B42318',
        'destructive-foreground': '#ffffff',

        // Neutrals
        neutral: {
          900: '#1C1E21',
          700: '#3E4042',
          500: '#65676B',
          300: '#CED0D4',
          100: '#E4E6EB',
          50: '#F7F8FA',
        },

        // Surface & text
        surface: '#ffffff',
        'surface-muted': '#F7F8FA',
        background: '#F0F2F5',
        'text-primary': '#1C1E21',
        'text-secondary': '#606266',
        'text-inverse': '#ffffff',

        // Standard Tailwind names for compatibility
        foreground: '#1C1E21',
        muted: '#E4E6EB',
        'muted-foreground': '#606266',
        popover: '#ffffff',
        'popover-foreground': '#1C1E21',
        card: '#ffffff',
        'card-foreground': '#1C1E21',
        border: '#CED0D4',
        input: '#ffffff',
        ring: '#1360C4',
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
