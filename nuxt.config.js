import api from './api'

export default {
  /*
   ** Rendering mode
   ** Doc: https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',

  /*
   ** Global CSS
   ** Doc: https://nuxtjs.org/api/configuration-css
   */
  css: ['~/assets/scss/main.scss'],

  /*
   ** Nuxt.js modules
   ** Doc: https://nuxtjs.org/guide/modules
   */
  modules: [
    // TODO: Remove it if you want to eject from codeSandbox
    './codesandbox',
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
    redirect: {
      login: '/auth/signin',
      logout: '/',
      callback: '/loading',
      home: '/home'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/user/signin',
            method: 'post',
            propertyName: 'token.accessToken'
          },
          logout: false,
          user: {
            url: '/api/user',
            method: 'get',
            propertyName: 'user'
          }
        }
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
      ogHost: 'https://kwzz.xyz',
      twitterCard: 'summary',
      twitterSite: 'https://kwzz.xyz',
      nativeUI: true
    },
    manifest: {
      display: 'fullscreen'
    }
  }
}
