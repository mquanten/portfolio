module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss/nesting'),
    /*require('nanocss')({
      preset: 'default'
    }),*/
    require('tailwindcss')
  ]
}
