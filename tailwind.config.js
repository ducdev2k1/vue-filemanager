/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,scss}'],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        neutral: colors.neutral,
        drive: {
          primary: {
            DEFAULT: '#0A6CCB',
          },
          dark: {
            50: '#f6f6f6',
            100: '#e8e8e8',
            200: '#d1d1d1',
            300: '#b0b0b0',
            400: '#888888',
            500: '#6d6d6d',
            600: '#5d5d5d',
            700: '#4f4f4f',
            800: '#424242',
            900: '#212121',
          }
        }
      },
      borderRadius: {
        'def': '24px'
      },
      boxShadow: {
        'drive-i-hover': 'inset 0 0 0 4px rgba(10, 108, 203, 0.45)'
      }
    },
  },
  plugins: [],
};
