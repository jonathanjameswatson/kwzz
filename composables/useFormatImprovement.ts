export const useFormatImprovement = (improvement: number) => {
  if (improvement === null) {
    return 'N/A'
  }
  if (improvement > 0) {
    return `+${improvement}%`
  }
  return `${improvement}%`
}
