<template>
  <div class="columns is-multiline">
    <div class="column is-4" v-for="i in limit" :key="i">
      <div class="card">
        <div class="card-content">
          <p class="title">Quiz Title</p>
          <k-link broken link="/">Play</k-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from "~/components/kLink";

export default {
  components: {
    kLink
  },
  props: {
    limit: {
      type: Number,
      default: 3
    },
    offset: {
      type: Number,
      default: 0
    },
    isUser: {
      type: Boolean,
      default: false
    },
    searchString: {
      type: String,
      default: ""
    }
  }
};
</script>
