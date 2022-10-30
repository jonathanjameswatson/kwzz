<template>
  <OButton
    :outlined="!modelValue"
    @click="$emit('update:modelValue', !modelValue)"
    v-bind="$attrs"
  >
    <slot />
  </OButton>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {
    modelValue: true,
  }
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
