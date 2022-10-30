import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  // Loading bar
  loading: { color: '#962865' },

  // CSS
  css: ['~/assets/scss/main.scss', '@mdi/font/css/materialdesignicons.css'],

  // Modules
  modules: ['@nuxtjs/supabase'],

  /*
  PWA settings
  pwa: {
    meta: {
      description:
        "kwzz is a new quiz website built to help people create, share and play. Quizzes can be made quickly and easily with kwzz and shared so that anyone play them. Once a user has played a quiz, they can easily review their results and receive feedback on the topics they did poorly on. Creators of quizzes can also review attempts to their quizzes to help them know other user's knowledge.",
      ogHost: 'https://kwzz.jonathanjameswatson.com',
      twitterCard: 'summary',
      twitterSite: 'https://kwzz.jonathanjameswatson.com',
      nativeUI: true
    },
    manifest: {
      display: 'fullscreen'
    }
  }
  */

  meta: {
    link: [{ rel: 'icon', href: 'data:;base64,iVBORw0KGgo=' }],
  },
})
