<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  name?: string
  size?: 'sm' | 'default' | 'lg'
}>()

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-8 w-8 text-xs'
    case 'lg': return 'h-12 w-12 text-lg'
    default: return 'h-10 w-10 text-sm'
  }
})
</script>

<template>
  <div :class="cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground', sizeClass, props.class)">
    <slot>{{ initials }}</slot>
  </div>
</template>
