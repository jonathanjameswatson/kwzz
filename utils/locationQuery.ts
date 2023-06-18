import type { LocationQueryValue } from 'vue-router'

export const locationQueryToString = (input: LocationQueryValue): string =>
  input === null ? '' : input

export const locationQueriesToString = (
  input: LocationQueryValue | LocationQueryValue[] | undefined
): string =>
  typeof input === 'string'
    ? input
    : input === null || input === undefined
    ? ''
    : input.map(locationQueryToString).join(',')
