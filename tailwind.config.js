/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'instrument': ['Instrument Serif', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1a1a1a',
            a: {
              color: '#000000',
              textDecoration: 'underline',
              textDecorationColor: '#d1d5db',
              textUnderlineOffset: '0.2em',
              '&:hover': {
                color: '#374151',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};