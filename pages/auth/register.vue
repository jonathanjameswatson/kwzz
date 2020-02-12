<template>
  <div class="hero centered-page is-fullheight">
    <div class="hero-body has-text-centered">
      <div class="container">
        <h1 class="title">Register</h1>
        <form v-on:submit.prevent="register">
          <b-field label="Username">
            <b-input
              rounded
              autofocus
              v-model="username"
              required
              maxlength="50"
              :has-counter="false"
            />
          </b-field>
          <b-field label="Password">
            <b-input
              rounded
              type="password"
              password-reveal
              v-model="password"
              required
              maxlength="50"
              :has-counter="false"
            />
          </b-field>
          <b-field label="Verify password">
            <b-input
              rounded
              type="password"
              password-reveal
              v-model="verifyPassword"
              required
              maxlength="50"
              :has-counter="false"
            />
          </b-field>
          <br>
          <b-button type="is-primary" rounded outlined native-type="submit">Register</b-button>
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
      verifyPassword: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async register() {
      if (this.password !== this.verifyPassword) {
        this.error = 'The inputted passwords are not the same.'
        return false
      }

      this.loading = true

      try {
        await this.$axios.post('api/user/register', {
          username: this.username,
          password: this.password
        })

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
