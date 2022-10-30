<template>
  <div class="section">
    <h1 class="title">Recent attempts</h1>
    <hr />
    <OTable :data="attempts">
      <OTableColumn
        v-slot="props"
        field="score"
        label="Score"
        centered
        sortable
        width="40%"
      >
        {{ props.row.score }}%
      </OTableColumn>
      <OTableColumn
        v-slot="props"
        field="timetaken"
        label="Time Taken"
        centered
        sortable
        width="40%"
      >
        {{ props.row.timetaken | formatTime }}
      </OTableColumn>
      <OTableColumn v-slot="props" label centered width="20%">
        <KwzzLink :link="`/quiz/results/${props.row.id}`">
          View attempt
        </KwzzLink>
      </OTableColumn>
    </OTable>
    <br />
    <KwzzLink link="/">Back to home</KwzzLink>
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
      id,
    }
  },
}
</script>
