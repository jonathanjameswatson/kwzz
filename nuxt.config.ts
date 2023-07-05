import { pwa, description } from './config/pwa'
import { icons } from './icons'

export default defineNuxtConfig({
  // CSS
  css: ['~/assets/scss/main.scss', '@fontsource/literata'],

  // Modules
  modules: [
    '@nuxtjs/eslint-module',
    '@vite-pwa/nuxt',
    '@nuxtjs/supabase',
    [
      '@unocss/nuxt',
      {
        uno: false,
        icons: true,
        safelist: icons.map((icon) => `i-mdi-${icon}`),
      },
    ],
  ],

  /*
  PWA settings
  pwa: {
    meta: {
      description:
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

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      ],
    },
  },

  pwa,

  typescript: {
    shim: false,
  },

  devtools: {
    enabled: true,
  },
})
