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

      <template slot="start">
        <b-navbar-item tag="div">
          <b-field label="Search" horizontal>
            <b-input type="search" icon="magnify"/>
          </b-field>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div" v-if="this.$auth.loggedIn">
          <div class="buttons">
            <b-button type="is-primary" rounded outlined @click="signOut">Sign out</b-button>
          </div>
        </b-navbar-item>
        <b-navbar-item tag="div" v-else>
          <div class="buttons">
            <k-link broken link="/auth/register">Register</k-link>
            <b-button type="is-primary" rounded outlined @click="signIn">Sign in</b-button>
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
import kLink from "~/components/kLink"

export default {
  components: {
    kLink
  },
  methods: {
    signIn() {
      return this.$auth.loginWith('local', {
        data: {
          username: '',
          password: ''
        }
      });
    },
    signOut() {
      this.$auth.logout();
    }
  }
};
</script>
