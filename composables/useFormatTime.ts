export const useFormatTime = (milliseconds: number) => {
  if (milliseconds >= 8.64e7) {
    return 'Over a day'
  }
  return new Date(milliseconds).toISOString().slice(11, 19)
}
