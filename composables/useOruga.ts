import { useProgrammatic } from '@oruga-ui/oruga-next'

export const useOruga = () => {
  const { oruga } = useProgrammatic()
  return oruga
}
