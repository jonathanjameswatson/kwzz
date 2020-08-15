<template>
  <div class="section">
    <h1 class="title">Players</h1>
    <hr />
    <b-table :data="attempts">
      <template slot-scope="props">
        <b-table-column field="username" label="User" centered sortable>
          {{ props.row.username }}
        </b-table-column>
        <b-table-column field="score" label="Score" centered sortable>
          {{ props.row.score }}%
        </b-table-column>
        <b-table-column field="timetaken" label="Time Taken" centered sortable>
          {{ props.row.timetaken | formatTime }}
        </b-table-column>
        <b-table-column label centered>
          <k-link :link="`/quiz/results/${props.row.id}`">
            View attempt
          </k-link>
        </b-table-column>
      </template>
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
  }
}
</script>
