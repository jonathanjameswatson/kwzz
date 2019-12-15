<template>
  <div class="section">
    <h1 class="title">Public Quizzes</h1>
    <set-of-quizzes/>
    <k-link link="/search" broken>View more</k-link>
    <hr class="hr">
    <h1 class="title">My Quizzes</h1>
    <set-of-quizzes/>
    <k-link link="/search?isuser=true" broken>View more</k-link>
  </div>
</template>

<script>
import SetOfQuizzes from "~/components/setOfQuizzes";
import kLink from "~/components/kLink";

export default {
  components: {
    SetOfQuizzes,
    kLink
  }
};
</script>
