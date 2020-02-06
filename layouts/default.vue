<template>
  <div>
    <b-navbar wrapper-class="container" transparent :close-on-click="false" shadow>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" to="/">
          <figure class="image is-64x64">
            <img src="~/assets/logo.png">
          </figure>
        </b-navbar-item>
      </template>

      <template slot="start" v-if="this.$auth.loggedIn">
        <b-navbar-item tag="div">
          <b-field>
            <b-input
              type="search"
              icon="magnify"
              icon-clickable
              v-model="searchString"
              @keyup.enter.native="search"
              @icon-click="search"
              maxlength="50"
              :has-counter="false"
              placeholder="Search"
              rounded
            />
          </b-field>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <k-link link="/quiz/0/edit">Create a quiz</k-link>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons" v-if="this.$auth.loggedIn">
            <b-button type="is-primary" rounded outlined @click="signOut" key="signout">Sign out</b-button>
          </div>
          <div class="buttons" v-else>
            <k-link link="/auth/register" key="register">Register</k-link>
            <k-link link="/auth/signin" key="signin">Sign in</k-link>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <div class="container">
      <nuxt/>
    </div>
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
