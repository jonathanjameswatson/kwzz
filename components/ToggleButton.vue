<template>
  <OButton
    :outlined="modelValue"
    v-bind="$attrs"
    :icon-right="modelValue ? 'check' : 'close'"
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
