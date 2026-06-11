import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── Paleta Fretebras / FreteLXP ──────────────────────────────
      colors: {
        navy:   '#0D1B36',
        brand: {
          DEFAULT: '#00AEEF',
          dark:    '#0084C1',
          light:   '#E6F7FE',
        },
        success: {
          DEFAULT: '#12B76A',
          light:   '#ECFDF3',
        },
        warning: {
          DEFAULT: '#F79009',
          light:   '#FFFAEB',
        },
        danger: {
          DEFAULT: '#F04438',
          light:   '#FEF3F2',
        },
        gray: {
          50:  '#F7F8FA',
          100: '#EAECF0',
          200: '#D0D5DD',
          400: '#98A2B3',
          600: '#475467',
          800: '#1D2939',
        },
      },
      // ── Tipografia ───────────────────────────────────────────────
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      // ── Border radius ────────────────────────────────────────────
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      // ── Espaçamento base 4 px ────────────────────────────────────
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
      },
    },
  },
  plugins: [],
}

export default config
