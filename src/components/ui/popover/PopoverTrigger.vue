<script setup lang="ts">
import { PopoverTrigger } from 'radix-vue'

defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <PopoverTrigger v-bind="$props">
    <slot />
  </PopoverTrigger>
</template>
