<template>
  <div class="section">
    <h1 class="title">Results</h1>
    <hr>
    <div class="columns is-multiline">
      <div v-for="(result, i) in results" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <p class="title">Attempt {{ results.length - i }}</p>

            <div class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Score</p>
                  <p class="title">{{ result.Score }}%</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Time taken</p>
                  <p class="title">{{ result.TimeTaken | formatTime }}</p>
                </div>
              </div>
              <div class="level-item has-text-centered" v-if="i !== results.length - 1">
                <div>
                  <p class="heading">Improvement</p>
                  <p class="title">{{ result.Improvement | formatImprovement }}</p>
                </div>
              </div>
            </div>

            <b-table v-if="result.topics.length !== 0" :data="result.topics" :columns="columns"/>

            <br>
            <k-link :link="`/quiz/results/${result.Id}`">View answers</k-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  async asyncData({ params, $axios }) {
    const id = params.id
    const { results } = await $axios.$get(`/api/result/quiz/${id}`)
    return {
      results,
      id,
      columns: [
        {
          field: 'Topic',
          label: 'Topic',
          centered: true
        },
        {
          field: 'Score',
          label: 'Score',
          centered: true
        }
      ]
    }
  },
  components: { kLink }
}
</script>
