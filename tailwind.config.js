module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    'src/**/*.js',
    'src/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c1e5e3'
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
      }

    },
  },
  variants: {},
  plugins: [],
}
