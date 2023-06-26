import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
  markRaw,
} from '#imports'

export default definePayloadPlugin(() => {
  definePayloadReducer('Raw', (data) => {
    if (
      data instanceof Object &&
      Object.hasOwn(data, '__v_skip') &&
      data.__v_skip === true
    ) {
      try {
        return structuredClone(data)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'DataCloneError') {
          return false
        }
        throw error
      }
    }
    return false
  })

  definePayloadReviver('Raw', (data) => {
    markRaw(data)
    return data
  })
})
