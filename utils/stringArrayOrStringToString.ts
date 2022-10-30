export const stringArrayOrStringToString = (
  input: string | string[] | undefined
): string =>
  typeof input === 'string' ? input : input === undefined ? '' : input.join(',')
