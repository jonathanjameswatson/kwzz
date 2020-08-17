<template>
  <div class="section">
    <h1 class="title">Recent attempts</h1>
    <hr />
    <b-table :data="attempts">
      <b-table-column
        v-slot="props"
        field="score"
        label="Score"
        centered
        sortable
        width="40%"
      >
        {{ props.row.score }}%
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="timetaken"
        label="Time Taken"
        centered
        sortable
        width="40%"
      >
        {{ props.row.timetaken | formatTime }}
      </b-table-column>
      <b-table-column v-slot="props" label centered width="20%">
        <k-link :link="`/quiz/results/${props.row.id}`">
          View attempt
        </k-link>
      </b-table-column>
    </b-table>
    <br />
    <k-link link="/">Back to home</k-link>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: { kLink },
  async asyncData({ params, $axios }) {
    const id = params.id
    const { attempts } = await $axios.$get(`/api/result/players/${id}`)
    return {
      attempts,
      id
    }
  },
}
</script>
