<template>
  <div>
    <KwzzSection class="has-shadow">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-6">
          <div class="tile is-child columns is-vcentered is-centered">
            <header class="column is-11 has-text-centered">
              <h1 class="title is-1">Welcome to kwzz.</h1>
              <h2 class="subtitle is-3">A new quiz website</h2>
            </header>
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
    </KwzzSection>

    <KwzzSection class="has-shadow">
      <div class="columns is-space-around">
        <article
          v-for="(description, i) in descriptions"
          :key="i"
          class="column has-text-centered is-2"
        >
          <span class="icon is-large has-text-primary">
            <i class="i-mdi i-mdi-48px" :class="`i-mdi-${description.icon}`" />
          </span>
          <h3 class="title">
            {{ description.heading }}
          </h3>
          <p class="subtitle">
            {{ description.text }}
          </p>
        </article>
      </div>
    </KwzzSection>

    <KwzzSection>
      <div class="has-text-centered">
        <h2 class="title">Get started!</h2>
        <div class="buttons is-block">
          <GoogleButton />
        </div>
      </div>
    </KwzzSection>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  isVisibleTo: 'signedOut',
})

const descriptions = [
  {
    heading: 'Create',
    text: 'Design quizzes to test students or friends.',
    icon: 'pencil',
  },
  {
    heading: 'Share',
    text: 'Easily share your quizzes with a simple URL.',
    icon: 'export-variant',
  },
  {
    heading: 'Play',
    text: 'Test yourself with quizzes from a variety of topics.',
    icon: 'checkbox-multiple-marked',
  },
  {
    heading: 'Test',
    text: 'See how individual players do on your quizzes.',
    icon: 'account-check',
  },
]
</script>
