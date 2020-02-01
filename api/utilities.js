export const shuffle = (list) => {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
}

export const getPercentage = (a, b) => Math.round((a / b) * 100)
