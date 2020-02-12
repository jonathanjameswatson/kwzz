<template>
  <div class="hero centered-page is-fullheight">
    <div class="hero-body has-text-centered">
      <div class="container">
        <h1 class="title">Sign in</h1>
        <form v-on:submit.prevent="signIn">
          <b-field label="Username">
            <b-input
              rounded
              autofocus
              v-model="username"
              maxlength="50"
              required
              :has-counter="false"
            />
          </b-field>
          <b-field label="Password">
            <b-input
              rounded
              type="password"
              password-reveal
              v-model="password"
              maxlength="50"
              required
              :has-counter="false"
            />
          </b-field>
          <br>
          <b-button type="is-primary" rounded outlined native-type="submit">Sign in</b-button>
          <br>
          <br>
          <b-message :active="error !== ''" type="is-danger" has-icon>{{ error }}</b-message>
          <b-loading :active="loading"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  auth: 'guest',
  components: { kLink },
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async signIn() {
      this.loading = true

      try {
        return await this.$auth.loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
      } catch (e) {
        this.error = e.response.data.error.message
        this.loading = false
      }
    }
  }
}
</script>
