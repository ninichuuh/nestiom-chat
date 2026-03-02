<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal',
})

const classes = computed(() =>
  props.orientation === 'horizontal'
    ? 'h-px w-full'
    : 'h-full w-px'
)
</script>

<template>
  <div role="separator" :class="cn('shrink-0 bg-border', classes, props.class)" />
</template>
