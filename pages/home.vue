<template>
  <div class="section">
    <h1 class="title">All Quizzes</h1>
    <set-of-quizzes/>
    <k-link link="/search">View more</k-link>

    <hr class="hr">

    <h1 class="title">My Quizzes</h1>
    <set-of-quizzes :is-user="true"/>
    <k-link link="/search?isUser=true">View more</k-link>
  </div>
</template>

<script>
import SetOfQuizzes from '~/components/setOfQuizzes'
import kLink from '~/components/kLink'

export default {
  components: {
    SetOfQuizzes,
    kLink
  }
}
</script>
