module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: [
      "./src/**/*.svelte",
    ],
    //enabled: production // disable purge in dev
  },
  theme: {
    extend: {
      colors:{
        'kumquats': '#ff3e00'
      },
    },
  },
  variants: {},
  plugins: [],
}
