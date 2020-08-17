<template>
  <div>
    <b-navbar
      wrapper-class="container"
      transparent
      :close-on-click="false"
      shadow
    >
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" to="/">
          <figure class="image is-64x64">
            <img src="~/assets/logo.png" />
          </figure>
        </b-navbar-item>
      </template>

      <template v-if="this.$auth.loggedIn" slot="start">
        <b-navbar-item tag="div">
          <b-field type="is-primary">
            <b-input
              v-model="searchString"
              type="search"
              icon="magnify"
              icon-clickable
              maxlength="50"
              :has-counter="false"
              placeholder="Search"
              rounded
              @keyup.enter.native="search"
              @icon-click="search"
            />
          </b-field>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <k-link link="/quiz/0/edit">Create a quiz</k-link>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div v-if="this.$auth.loggedIn" class="buttons">
            <b-button
              key="signout"
              type="is-primary"
              rounded
              outlined
              @click="signOut"
              >Sign out</b-button
            >
          </div>
          <div v-else class="buttons">
            <b-button
              key="signin"
              type="is-primary"
              rounded
              outlined
              icon-right="google"
              @click="$auth.loginWith('google')"
              >Sign in</b-button
            >
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <div class="container">
      <nuxt />
    </div>

    <footer class="footer">
      <div class="columns is-centered has-text-centered">
        <div class="column content is-3">
          <p><nuxt-link to="/">Home</nuxt-link></p>
          <p>About</p>
        </div>
        <div class="column content is-3">
          <p><nuxt-link to="/privacypolicy">Privacy policy</nuxt-link></p>
          <p><nuxt-link to="/termsofservice">Terms of service</nuxt-link></p>
        </div>
        <div class="column content is-3">
          <p><a href="https://jonathanjameswatson.com">More websites</a></p>
          <p>
            <a href="https://github.com/jonathanjameswatson/kwzz">GitHub</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: {
    kLink
  },
  data() {
    return {
      searchString: ''
    }
  },
  methods: {
    search() {
      this.$router.push({
        path: '/search',
        query: { searchString: this.searchString }
      })
    },
    signOut() {
      this.$auth.logout()
    }
  }
}
</script>
