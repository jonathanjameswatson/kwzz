<template>
  <div class="card">
    <div class="card-content">
      <p class="title">{{ title }}</p>
      <div class="buttons">
        <template v-if="showOptions">
          <k-link v-if="isPublished" :link="`/quiz/${id}/players`">
            Recent attempts
          </k-link>
          <k-link v-else :link="`/quiz/${id}/edit`">Edit</k-link>
        </template>
        <k-link v-if="isPublished" :link="`/quiz/${id}/play`">Play</k-link>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: {
    kLink
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    isPublished: {
      type: Boolean,
      required: true
    },
    showOptions: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
