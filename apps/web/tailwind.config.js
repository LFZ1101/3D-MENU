/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'surface-dark': 'var(--surface-dark)',
        paper: 'var(--paper)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        jade: 'var(--jade)',
        'jade-dark': 'var(--jade-dark)',
        'jade-soft': 'var(--jade-soft)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        brand: 'var(--brand)',
        'brand-fg': 'var(--brand-fg)',
      },
      fontFamily: {
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Syne"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(7, 16, 20, 0.1)',
        lift: '0 10px 30px rgba(7, 16, 20, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'rise-in': 'rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
