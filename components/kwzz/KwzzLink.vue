<template>
  <OButton
    :tag="NuxtLink"
    :disabled="linkType === 'none'"
    :to="linkType !== 'nuxtLink' ? '/' : link"
    :event="linkType === 'nuxtLink' ? 'click' : ''"
    @click.native="handleClick"
  >
    <slot />
  </OButton>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    link?: string
    linkType?: 'nuxtLink' | 'back' | 'none'
  }>(),
  {
    link: '/',
    linkType: 'nuxtLink',
  }
)

const router = useRouter()
const handleClick = () => {
  if (props.linkType === 'back') {
    router.back()
  }
}

const NuxtLink = resolveComponent('NuxtLink')
</script>
