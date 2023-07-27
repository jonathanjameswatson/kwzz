import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
  markRaw,
} from '#imports'

const shallowCopy = (x) => {
  if (Array.isArray(x)) {
    return x.slice()
  }
  if (x instanceof Object) {
    return Object.assign({}, x)
  }
  return x
}

export default definePayloadPlugin(() => {
  definePayloadReducer('Raw', (data) => {
    if (
      data instanceof Object &&
      Object.hasOwn(data, '__v_skip') &&
      data.__v_skip === true
    ) {
      return shallowCopy(data)
    }
    return false
  })

  definePayloadReviver('Raw', (data) => {
    markRaw(data)
    return data
  })
})
