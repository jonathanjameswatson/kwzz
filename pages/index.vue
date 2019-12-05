<template>
  <div>
    <div class="section">
      <h1 class="title">
        Welcome to kwzz.
      </h1>
      <code>{{ testText.message }}</code>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const testText = await $axios.$get("/api/test");
    return { testText };
  }
};
</script>
