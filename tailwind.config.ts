import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F7FA',
        card: '#FFFFFF',
        primary: '#00AEEF',
        navy: '#001833',
        'text-primary': '#0D1B2A',
        'text-secondary': '#4A5568',
        success: '#27A25A',
        warning: '#F5B800',
        orange: '#E06830',
        bronze: '#CD7F32',
        silver: '#A8A9AD',
        gold: '#FFD700',
        platinum: '#E5E4E2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'dash-move': 'dashMove 2s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
      keyframes: {
        dashMove: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-40' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
