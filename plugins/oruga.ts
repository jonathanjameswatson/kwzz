import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

const makeInvertPropsConfiguration = (
  baseClass: string,
  propertyToChange = 'rootClass'
) => {
  return {
    [propertyToChange](_: string, { props }: any) {
      const classes = [baseClass]
      if (!props.variant) {
        classes.push('is-primary')
      }
      if (!props.rounded) {
        classes.push('is-rounded')
      }
      if (!props.outlined) {
        classes.push('is-outlined')
      }
      return classes.join(' ')
    },
    variantClass(variant: string) {
      return variant === 'normal' ? '' : `is-${variant}`
    },
    roundedClass: '',
    outlinedClass: '',
  }
}

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Oruga, {
    ...bulmaConfig,
    includeCss: false,
    button: {
      ...bulmaConfig.button,
      ...makeInvertPropsConfiguration('button'),
    },
    input: {
      ...bulmaConfig.input,
      ...makeInvertPropsConfiguration('input', 'inputClass'),
    },
    inputitems: {
      ...bulmaConfig.inputitems,
      containerClass: (_: string, { props }: any) => {
        const classes = ['taginput-container', 'is-focusable']
        if (props.variant) classes.push(`is-${props.variant}`)
        return classes.join(' ')
      },
      itemClass: 'tag is-primary is-light',
    },
    notification: {
      ...bulmaConfig.notification,
      rootClass: (_: string, { props }: any) => {
        const classes = ['toast']
        if (props.variant) classes.push(`is-${props.variant}`)
        return classes.join(' ')
      },
    },
    iconPack: 'i-mdi',
    customIconPacks: {
      'i-mdi': {
        iconPrefix: 'i-mdi-',
        sizes: {
          default: 'i-mdi-24px',
          small: 'i-mdi-18px',
          medium: 'i-mdi-36px',
          large: 'i-mdi-48px',
        },
      },
    },
  })
})
