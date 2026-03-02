<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { extractDomain } from '@/lib/linkify'

const props = defineProps<{
  url: string
}>()

const domain = computed(() => extractDomain(props.url))

const truncatedUrl = computed(() => {
  if (props.url.length <= 60) return props.url
  return props.url.slice(0, 57) + '...'
})
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="mt-1 flex items-center gap-2 rounded-lg border bg-card p-2 text-xs transition-colors hover:bg-accent"
  >
    <ExternalLink class="h-4 w-4 shrink-0 text-muted-foreground" />
    <div class="min-w-0 flex-1">
      <p class="font-medium">{{ domain }}</p>
      <p class="truncate text-muted-foreground">{{ truncatedUrl }}</p>
    </div>
  </a>
</template>
