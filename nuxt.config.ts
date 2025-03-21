export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/ui'],
  css: ['~/assets/scss/main.scss'],

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          "~/*": ["./*"]
        }
      }
    }
  },

  nitro: {
    preset: 'node-server'
  },

  devtools: {
    enabled: false
  },

  compatibilityDate: '2025-03-20'
});