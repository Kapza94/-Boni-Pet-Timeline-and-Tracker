/** @type {import('tailwindcss').Config} */
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
        // Canvas (deep ambient)
        canvas: {
          DEFAULT: 'oklch(22% 0.022 270)',
          deep: 'oklch(15% 0.018 270)',
          soft: 'oklch(28% 0.020 270)',
        },
        // Ambient pastel blobs
        blob: {
          lavender: 'oklch(78% 0.135 290)',
          rose: 'oklch(80% 0.115 22)',
          peach: 'oklch(82% 0.105 55)',
          sky: 'oklch(80% 0.095 230)',
        },
        // Ink on canvas (light)
        ink: {
          1: 'oklch(98% 0.004 80)',
          2: 'rgba(255, 255, 255, 0.78)',
          3: 'rgba(255, 255, 255, 0.58)',
          4: 'rgba(255, 255, 255, 0.38)',
          5: 'rgba(255, 255, 255, 0.16)',
        },
        // Ink on glass (dark)
        'on-glass': {
          1: 'oklch(22% 0.014 270)',
          2: 'oklch(40% 0.012 270)',
          3: 'oklch(58% 0.010 270)',
          4: 'oklch(75% 0.008 270)',
        },
        // Glass fills
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.40)',
          strong: 'rgba(255, 255, 255, 0.62)',
          thin: 'rgba(255, 255, 255, 0.22)',
        },
        'glass-border': {
          DEFAULT: 'rgba(255, 255, 255, 0.55)',
          strong: 'rgba(255, 255, 255, 0.72)',
        },
        // Emerald (active/success)
        emerald: {
          300: 'oklch(86% 0.090 165)',
          400: 'oklch(80% 0.130 165)',
          500: 'oklch(72% 0.155 165)',
          600: 'oklch(62% 0.150 165)',
          glow: 'oklch(80% 0.14 165 / 0.55)',
        },
        // Honey (warmth)
        honey: {
          300: 'oklch(83.5% 0.110 68)',
          400: 'oklch(76.5% 0.135 65)',
          500: 'oklch(70.0% 0.150 60)',
          600: 'oklch(62.0% 0.145 55)',
        },
        // Ambient semantic
        ambient: {
          warn: 'oklch(82% 0.13 70 / 0.55)',
          attention: 'oklch(80% 0.14 25 / 0.55)',
          info: 'oklch(80% 0.12 230 / 0.55)',
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
