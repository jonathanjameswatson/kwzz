<template>
  <div class="section">
    <h1 class="title">Results</h1>
    <hr />
    <div class="columns is-multiline">
      <div v-for="(result, i) in results" :key="i" class="column is-full">
        <div class="card">
          <div class="card-content">
            <p class="title">Attempt {{ results.length - i }}</p>

            <div class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Score</p>
                  <p class="title">{{ result.score }}%</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Time taken</p>
                  <p class="title">{{ result.timetaken | formatTime }}</p>
                </div>
              </div>
              <div
                v-if="i !== results.length - 1"
                class="level-item has-text-centered"
              >
                <div>
                  <p class="heading">Improvement</p>
                  <p class="title">
                    {{ result.improvement | formatImprovement }}
                  </p>
                </div>
              </div>
            </div>

            <OTable
              v-if="result.topics.length !== 0"
              :data="result.topics"
              :columns="columns"
            />

            <br />
            <KwzzLink :link="`/quiz/results/${result.id}`"
              >View answers</KwzzLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import kLink from '~/components/kLink'

export default {
  components: { kLink },
  async asyncData({ params, $axios }) {
    const id = params.id
    const { results } = await $axios.$get(`/api/result/quiz/${id}`)
    return {
      results,
      id,
      columns: [
        {
          field: 'topic',
          label: 'Topic',
          centered: true,
        },
        {
          field: 'score',
          label: 'Score',
          centered: true,
        },
      ],
    }
  },
}
</script>
