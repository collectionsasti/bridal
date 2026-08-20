/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light, airy luxury palette
        ink: {
          900: '#1a1714',
          800: '#2a2420',
          700: '#3d352f',
          600: '#524a42',
          500: '#6b6258',
        },
        wine: {
          900: '#3b0a12',
          800: '#52101c',
          700: '#6e1626',
          600: '#8c1f33',
        },
        champagne: {
          50: '#fbf6ec',
          100: '#f4e9d2',
          200: '#e8d3a8',
          300: '#dcbd84',
          400: '#cda861',
          500: '#bd8f44',
          600: '#9c7635',
          700: '#7a5b29',
        },
        ivory: {
          50: '#ffffff',
          100: '#fdfbf7',
          200: '#f8f3e9',
          300: '#f1ebdd',
        },
        stone: {
          50: '#faf9f6',
          100: '#f3f1ec',
          200: '#e7e3da',
          300: '#d8d2c6',
          400: '#b8b1a3',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
        accent: ['"Italiana"', 'serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
        '2xl': '0.2em',
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 1.1s ease both',
        'ken-burns': 'kenBurns 18s ease-out both',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(37,211,102,0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(37,211,102,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37,211,102,0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.1) translate(-1.5%, -1.5%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'lux': '0 24px 60px -28px rgba(26,23,20,0.35)',
        'gold': '0 0 0 1px rgba(205,168,97,0.3), 0 18px 40px -18px rgba(26,23,20,0.3)',
        'soft': '0 10px 30px -14px rgba(26,23,20,0.25)',
      },
    },
  },
  plugins: [],
};
