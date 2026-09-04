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
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(9, 16, 20, 0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
