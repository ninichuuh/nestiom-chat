<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue'

defineProps<{
  asChild?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <DropdownMenuTrigger v-bind="$props" class="outline-none">
    <slot />
  </DropdownMenuTrigger>
</template>
