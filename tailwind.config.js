/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{js,ts,tsx,html}',
  ],
  prefix: '',
  variants: {
    extend: {
      lineClamp: ['hover'],
    },
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          25: 'fef0ec21', // Even lighter shade
          50: '#fef0ec54', // Lighter shade
          75: '#fef0ecc9', // Lightened from 100
          100: '#FEF0EC',
          200: '#FFDCD1',
          300: '#FFB59E',
          400: '#FC9272',
          500: '#FF784F',
          600: '#FA5320',
          700: '#D44519',
          800: '#903013',
          900: '#5D2514',
          1000: '#4B1A0B',
        },
        textPrimary: {
          1: '#000000f5',
          2: '#000000d9',
          3: '#000000d1',
          4: '#0006',
        },
        secondary: {
          // Added secondary color palette
          100: '#E0F7FA',
          200: '#B2EBF2',
          300: '#80DEEA',
          400: '#4DD0E1',
          500: '#26C6DA',
        },
        'grey-line2-normal': 'rgba(114, 118, 139, 0.16)', // For border color
        'grey-fill1-hover': 'rgba(114, 118, 139, 0.08)', // For hover background
        'brand-primary-hover': '#f97e59',
        'brand-bg-normal': 'rgb(240, 240, 240)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Georgia', 'ui-serif', 'serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Added responsive font sizes
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['24px', { lineHeight: '1.7' }],
        '2xl': ['30px', { lineHeight: '1.8' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/line-clamp')],
};
