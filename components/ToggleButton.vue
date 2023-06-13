<template>
  <OButton
    :outlined="!modelValue"
    v-bind="$attrs"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <slot />
  </OButton>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {
    modelValue: true,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
