import api from './api'

export default {
  mode: 'universal',

  css: ['~/assets/scss/main.scss'],

  modules: [
    '@nuxtjs/pwa',
    ['nuxt-buefy', { css: false }],
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  plugins: ['~plugins/filters.js'],

  axios: {
    proxy: true
  },

  proxy: ['http://localhost:3000/api'],

  auth: {
    proxy: {
      '/basesite': 'https://jonathanjameswatson.com/kwzzredirect'
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: '/basesite',
      home: '/home'
    },
    // fullPathRedirect: true,
    strategies: {
      google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        response_type: 'token id_token',
        token_key: 'id_token',
        userinfo_endpoint: undefined
      }
    },
    localStorage: false
  },

  router: {
    middleware: ['auth']
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: api
    }
  ],

  loading: { color: '#962865' },

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
}
