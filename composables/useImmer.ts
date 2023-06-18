import { produce, type Draft, type nothing } from 'immer'

export type Updater<S> = (
  draft: Draft<S>
) =>
  | Draft<S>
  | void
  | undefined
  | (Draft<S> extends undefined ? typeof nothing : never)

export const useImmer = <T>(baseState: T) => {
  const state = shallowRef(baseState)
  const update = (updater: Updater<T>) => {
    state.value = produce(state.value, updater)
  }
  return [state, update] as const
}
