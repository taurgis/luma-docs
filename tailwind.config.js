/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  "./content/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./content/versions/**/*.{js,ts,jsx,tsx,mdx}",
    "./main.tsx",
    "./App.tsx"
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#334155',
            h1: {
              color: '#0f172a',
            },
            h2: {
              color: '#0f172a',
            },
            h3: {
              color: '#0f172a',
            },
            h4: {
              color: '#0f172a',
            },
            code: {
              color: '#1e293b',
              backgroundColor: '#f1f5f9',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            blockquote: {
              borderLeftColor: '#3b82f6',
              color: '#475569',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}