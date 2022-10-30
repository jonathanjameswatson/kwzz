<template>
  <div>
    <KwzzSection class="has-shadow">
      <KwzzHeader>All Quizzes</KwzzHeader>
      <QuizSet fetch-key="homeAllQuizzes" />
      <KwzzLink link="/search">View more</KwzzLink>
    </KwzzSection>

    <KwzzSection>
      <KwzzHeader>My Quizzes</KwzzHeader>
      <QuizSet :is-user="true" fetch-key="homeMyQuizzes" />
      <KwzzLink link="/search?isUser=true">View more</KwzzLink>
    </KwzzSection>
  </div>
</template>
