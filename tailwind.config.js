/** @type {import('tailwindcss').Config} */
//
// NativeWind / Tailwind config. Colors land in production via RN's
// `@react-native/normalize-colors`, which doesn't parse oklch — see
// `theme/tokens.ts` for the source-of-truth comments mapping each hex
// back to its designer-side oklch.
//
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './theme/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#171a25',
          deep: '#080b13',
          soft: '#252933',
        },
        blob: {
          lavender: '#b6a8ff',
          rose: '#ff9f9c',
          peach: '#f9b281',
          sky: '#7ac9ef',
        },
        ink: {
          1: '#faf8f5',
          2: 'rgba(255, 255, 255, 0.78)',
          3: 'rgba(255, 255, 255, 0.58)',
          4: 'rgba(255, 255, 255, 0.38)',
          5: 'rgba(255, 255, 255, 0.16)',
        },
        'on-glass': {
          1: '#181a21',
          2: '#45474e',
          3: '#787a80',
          4: '#acaeb3',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.40)',
          strong: 'rgba(255, 255, 255, 0.62)',
          thin: 'rgba(255, 255, 255, 0.22)',
        },
        'glass-border': {
          DEFAULT: 'rgba(255, 255, 255, 0.55)',
          strong: 'rgba(255, 255, 255, 0.72)',
        },
        emerald: {
          300: '#97e4c2',
          400: '#5ed8a9',
          500: '#00c28c',
          600: '#00a16f',
          glow: 'rgba(81, 218, 167, 0.55)',
        },
        honey: {
          300: '#f9bb78',
          400: '#ed9f4c',
          500: '#e18528',
          600: '#c76a18',
        },
        ambient: {
          warn: 'rgba(250, 180, 95, 0.55)',
          attention: 'rgba(255, 152, 144, 0.55)',
          info: 'rgba(96, 204, 252, 0.55)',
        },
      },
      fontFamily: {
        display: ['SFProDisplay-Regular', 'system-ui', 'sans-serif'],
        editorial: ['InstrumentSerif_400Regular', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['11px', '1.45'],
        sm: ['13px', '1.45'],
        base: ['15px', '1.45'],
        md: ['17px', '1.3'],
        lg: ['20px', '1.22'],
        xl: ['24px', '1.22'],
        '2xl': ['28px', '1.22'],
        '3xl': ['34px', '1.08'],
        '4xl': ['44px', '1.04'],
        '5xl': ['56px', '1.04'],
      },
      letterSpacing: {
        tight: '-0.022em',
        snug: '-0.012em',
        normal: '-0.003em',
        wide: '0.04em',
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '22px',
        xl: '28px',
        '2xl': '36px',
        pill: '999px',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
      },
      transitionDuration: {
        quick: '140ms',
        base: '240ms',
        slow: '420ms',
        ambient: '900ms',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        'in-out-soft': 'cubic-bezier(0.45, 0, 0.20, 1)',
        spring: 'cubic-bezier(0.34, 1.36, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
