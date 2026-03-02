<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const AVATAR_COLORS = [
  'hsl(0 70% 60%)',    'hsl(30 70% 55%)',   'hsl(50 60% 45%)',
  'hsl(120 50% 45%)',  'hsl(160 55% 45%)',  'hsl(200 65% 50%)',
  'hsl(220 65% 55%)',  'hsl(260 55% 55%)',  'hsl(290 50% 55%)',
  'hsl(330 60% 55%)',  'hsl(180 50% 45%)',  'hsl(45 65% 50%)',
] as const

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

const bgColor = computed(() => {
  if (!props.name) return undefined
  let hash = 0
  for (const ch of props.name) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
})
</script>

<template>
  <div
    :class="cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium', sizeClass, props.class)"
    :style="bgColor ? { backgroundColor: bgColor, color: 'white' } : undefined"
  >
    <slot>{{ initials }}</slot>
  </div>
</template>
