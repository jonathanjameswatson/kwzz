import Vue from 'vue'

Vue.filter('formatImprovement', (improvement) => {
  if (improvement === null) {
    return 'N/A'
  }
  if (improvement > 0) {
    return `+${improvement}%`
  }
  return `${improvement}%`
})

Vue.filter('formatTime', (milliseconds) => {
  if (milliseconds >= 8.64e7) {
    return 'Over a day'
  }
  return new Date(milliseconds).toISOString().slice(11, 19)
})
