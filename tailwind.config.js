/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd6ff',
          300: '#8fbcff',
          400: '#5b9bff',
          500: '#2f7bff',
          600: '#1d62f0',
          700: '#1a4fcc',
          800: '#1c43a4',
          900: '#1d3b82',
          950: '#152550',
        },
        navy: {
          50: '#f1f4f9',
          100: '#e2e8f2',
          200: '#c5d0e3',
          300: '#97a8c6',
          400: '#6b7fa3',
          500: '#4a5f85',
          600: '#33466b',
          700: '#22325a',
          800: '#162344',
          900: '#0e1830',
          950: '#070d1c',
        },
        neutral: {
          50: '#f5f7fa',
          100: '#e8ecf2',
          200: '#d0d7e2',
          300: '#aab4c3',
          400: '#8390a3',
          500: '#616d80',
          600: '#4a5566',
          700: '#363f4d',
          800: '#232a35',
          900: '#141a23',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          900: '#164e63',
        },
        success: {
          100: '#d1fae1',
          300: '#6ee7a8',
          400: '#34d399',
          500: '#10b981',
          900: '#064e3b',
        },
        warning: {
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          900: '#78350f',
        },
        danger: {
          100: '#fee2e2',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          900: '#7f1d1d',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
