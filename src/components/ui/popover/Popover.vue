<script setup lang="ts">
import { PopoverRoot } from 'radix-vue'

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  open?: boolean
  modal?: boolean
}>(), {
  modal: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <PopoverRoot v-bind="props" @update:open="emit('update:open', $event)">
    <slot />
  </PopoverRoot>
</template>
