import api from './api'

export default {
  /*
   ** Rendering mode
   ** Doc: https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',

  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    title: 'kwzz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'A quiz website'
      }
    ]
  },

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
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    // TODO: Remove it if you want to eject from codeSandbox
    './codesandbox',
    '@nuxtjs/pwa',
    ['nuxt-buefy', { css: false }],
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  axios: {
    proxy: true,
    debug: true
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
    }
  },

  router: {
    middleware: ['auth']
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: api
    }
  ]
}
