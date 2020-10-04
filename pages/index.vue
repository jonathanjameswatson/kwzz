<template>
  <div class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <div class="tile is-child columns is-vcentered is-centered">
          <div class="column is-11 has-text-centered">
            <h1 class="title is-1">Welcome to kwzz.</h1>
            <h2 class="subtitle is-3">A new quiz website</h2>
          </div>
        </div>
      </div>
      <div class="tile is-parent is-5">
        <div class="tile is-child">
          <figure class="image is-3by2">
            <img
              src="~/assets/kwzz.png"
              alt="Preview Image"
              draggable="false"
            />
          </figure>
        </div>
      </div>
    </div>
    <hr />
    <div class="columns">
      <div class="column has-text-centered is-2 is-offset-1">
        <div>
          <b-icon icon="pencil" size="is-large" type="is-primary" />
          <p class="title">Create</p>
          <p class="subtitle">Design quizzes to test students or friends.</p>
        </div>
      </div>
      <div class="column has-text-centered is-2 is-offset-1">
        <div>
          <b-icon icon="share" size="is-large" type="is-primary" />
          <p class="title">Share</p>
          <p class="subtitle">Easily share your quizzes with a simple URL.</p>
        </div>
      </div>
      <div class="column has-text-centered is-2 is-offset-1">
        <div>
          <b-icon
            icon="checkbox-multiple-marked"
            size="is-large"
            type="is-primary"
          />
          <p class="title">Play</p>
          <p class="subtitle">
            Test yourself with quizzes from a variety of topics.
          </p>
        </div>
      </div>
      <div class="column has-text-centered is-2 is-offset-1">
        <div>
          <b-icon icon="account-check" size="is-large" type="is-primary" />
          <p class="title">Test</p>
          <p class="subtitle">See how individual players do on your quizzes.</p>
        </div>
      </div>
    </div>
    <hr />
    <br />
    <div class="has-text-centered">
      <h2 class="title">Get started!</h2>
      <div class="buttons is-block">
        <sign-in />
      </div>
    </div>
  </div>
</template>

<script>
import signIn from '~/components/signIn'

export default {
  components: {
    signIn
  },
  auth: 'guest'
}
</script>
