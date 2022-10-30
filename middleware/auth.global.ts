export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser()
  const visibility = to.meta.isVisibleTo || 'signedIn'
  if (!user.value && visibility === 'signedIn') {
    return navigateTo('/')
  } else if (user.value && visibility === 'signedOut') {
    return navigateTo('/home')
  }
})
