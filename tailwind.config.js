/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Black & gold luxury palette
        ink: {
          900: '#f5f0e6',
          800: '#ede5d5',
          700: '#d4c9b5',
          600: '#a89e8a',
          500: '#7a7165',
        },
        wine: {
          900: '#3b0a12',
          800: '#52101c',
          700: '#c44569',
          600: '#d96b8a',
        },
        champagne: {
          50: '#1a1610',
          100: '#241e15',
          200: '#2e2519',
          300: '#dcbd84',
          400: '#cda861',
          500: '#bd8f44',
          600: '#cda861',
          700: '#e8c987',
        },
        ivory: {
          50: '#0a0a0a',
          100: '#0d0d0d',
          200: '#131313',
          300: '#1a1a1a',
        },
        stone: {
          50: '#161616',
          100: '#1c1c1c',
          200: '#262626',
          300: '#333333',
          400: '#4a4a4a',
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
        'lux': '0 24px 60px -28px rgba(0,0,0,0.7)',
        'gold': '0 0 0 1px rgba(205,168,97,0.3), 0 18px 40px -18px rgba(0,0,0,0.6)',
        'soft': '0 10px 30px -14px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
