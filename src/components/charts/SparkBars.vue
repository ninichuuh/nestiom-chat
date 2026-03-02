<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  counts: number[]
}>()

const maxCount = computed(() => Math.max(...props.counts, 1))

const bars = computed(() =>
  props.counts.map((count) => ({
    height: (count / maxCount.value) * 100,
    active: count > 0,
  }))
)

const hasData = computed(() => props.counts.some(c => c > 0))
</script>

<template>
  <svg
    v-if="hasData"
    class="absolute inset-0 h-full w-full"
    preserveAspectRatio="none"
    viewBox="0 0 24 10"
  >
    <rect
      v-for="(bar, i) in bars"
      :key="i"
      :x="i"
      :y="10 - (bar.height / 10)"
      width="0.8"
      :height="bar.height / 10"
      rx="0.2"
      class="fill-primary/10"
    />
  </svg>
</template>
