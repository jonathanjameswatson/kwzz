<template>
  <ODropdown
    :model-value="modelValue"
    aria-role="list"
    @update:model-value="updateModelValue"
  >
    <template #trigger>
      <slot name="trigger">
        <OButton rounded icon-right="menu-down">
          {{ modelValueLabel }}
        </OButton>
      </slot>
    </template>

    <ODropdownItem
      v-for="[optionValue, optionLabel] in options.entries()"
      :key="optionValue"
      aria-role="listitem"
      :value="optionValue"
    >
      {{ optionLabel }}
    </ODropdownItem>
  </ODropdown>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  modelValue: T
  options: Map<T, string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const updateModelValue = (value: T) => {
  emit('update:modelValue', value)
}

const modelValueLabel = computed(() => {
  return props.options.get(props.modelValue)
})
</script>
