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
import type { Database } from '~/types/database.generated'

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const signOut = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

const searchString = ref('')
const search = async () => {
  await navigateTo({
    path: '/search',
    query: { q: searchString.value },
  })
  searchString.value = ''
}

const createQuiz = async () => {
  if (user.value === null) {
    return
  }

  const { data, error } = await supabase
    .from('quizzes')
    .insert({ title: 'Untitled Quiz', creator_id: user.value.id })
    .select()
    .single()

  if (error !== null) {
    return
  }

  await navigateTo({
    path: `/quiz/${data.id}/edit`,
  })
}
</script>
