<template>
  <div class="section">
    <h1 class="title">Players</h1>
    <hr>
    <b-table :data="attempts">
      <template slot-scope="props">
        <b-table-column field="Username" label="User" centered sortable>{{ props.row.Username }}</b-table-column>
        <b-table-column field="Score" label="Score" centered sortable>{{ props.row.Score }}%</b-table-column>
        <b-table-column
          field="TimeTaken"
          label="Time Taken"
          centered
          sortable
        >{{ props.row.TimeTaken | formatTime }}</b-table-column>
        <b-table-column label centered>
          <k-link :link="`/quiz/results/${props.row.Id}`">View attempt</k-link>
        </b-table-column>
      </template>
    </b-table>
    <br>
    <k-link link="/">Back to home</k-link>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  async asyncData({ params, $axios }) {
    const id = params.id
    const { attempts } = await $axios.$get(`/api/result/players/${id}`)
    return {
      attempts,
      id
    }
  },
  components: { kLink }
}
</script>
