<template>
  <nav class="navbar has-shadow is-transparent" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <NuxtLink to="/" class="navbar-item">
          <figure class="image is-64x64">
            <img src="~/assets/logo.png" />
          </figure>
        </NuxtLink>

        <a role="button" aria-label="menu" class="navbar-burger burger"
          ><span aria-hidden="true"></span><span aria-hidden="true"></span
          ><span aria-hidden="true"></span
        ></a>
      </div>

      <div class="navbar-menu">
        <div v-if="user" class="navbar-start">
          <div class="navbar-item">
            <OField>
              <OInput
                v-model="searchString"
                icon="magnify"
                icon-clickable
                maxlength="50"
                :has-counter="false"
                placeholder="Search"
                @keyup.enter="search"
                @icon-click="search"
              />
            </OField>
          </div>
          <div class="navbar-item">
            <OButton @click="createQuiz">Create a quiz</OButton>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div v-if="user" class="buttons">
              <OButton @click="signOut">Sign out</OButton>
            </div>
            <GoogleButton v-else />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Quizzes } from '~/types/database.generated'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const signOut = () => supabase.auth.signOut()

const searchString = ref('')
const search = () => {
  navigateTo({
    path: '/search',
    query: { searchString: searchString.value },
  })
}

const createQuiz = async () => {
  const { data } = await supabase
    .from<Quizzes>('quizzes')
    .insert([{ title: 'Untitled Quiz', creator_id: user.value.id }])
    .single()
  navigateTo({
    path: `/quiz/${data.id}/edit`,
  })
}
</script>
