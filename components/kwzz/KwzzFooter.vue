<template>
  <footer class="footer">
    <div class="columns is-centered has-text-centered">
      <div v-for="(column, i) in links" :key="i" class="column content is-3">
        <p v-for="(link, j) in column" :key="j">
          <NuxtLink
            :to="link.to"
            :target="link.external ? '_blank' : undefined"
          >
            {{ link.text }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links: { text: string; to: string; external?: boolean }[][] = [
  [
    {
      text: 'Home',
      to: '/',
    },
    {
      text: 'Author',
      to: 'https://github.com/jonathanjameswatson',
      external: true,
    },
  ],
  [
    {
      text: 'Privacy policy',
      to: '/privacy',
    },
    {
      text: 'Terms of service',
      to: '/terms',
    },
  ],
  [
    {
      text: 'More websites',
      to: 'https://jonathanjameswatson.com',
      external: true,
    },
    {
      text: 'Source code',
      to: 'https://github.com/jonathanjameswatson/kwzz',
      external: true,
    },
  ],
]
</script>
