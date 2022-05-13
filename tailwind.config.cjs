module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        'large': '3200px',
      },
      colors: {
        primary: {
          100: '#ccebf5',
          200: '#99d6eb',
          300: '#66c2e0',
          400: '#33add6',
          500: '#0099cc',
          600: '#007aa3',
          700: '#005c7a',
          800: '#003d52',
          900: '#001f29'
        },
        secondary: {
          100: '#edfce7',
          200: '#dcf9cf',
          300: '#caf6b6',
          400: '#b9f39e',
          500: '#a7f086',
          600: '#86c06b',
          700: '#649050',
          800: '#436036',
          900: '#21301b'
        },
        accent: {
          100: '#d9d7f4',
          200: '#b4afea',
          300: '#8e88df',
          400: '#6960d5',
          500: '#4338ca',
          600: '#362da2',
          700: '#282279',
          800: '#1b1651',
          900: '#0d0b28'
        }
      },
      FontFamily: {
        sans: ['Inter']
      },

    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio')
  ]
}
