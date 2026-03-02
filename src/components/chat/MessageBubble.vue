<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '@/composables/useMessages'

const props = defineProps<{
  message: Message
  isMine: boolean
}>()

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="flex" :class="isMine ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
      :class="isMine
        ? 'bg-primary text-primary-foreground rounded-br-md'
        : 'bg-muted rounded-bl-md'"
    >
      <p class="break-words">{{ message.text }}</p>
      <p
        class="mt-1 text-[10px] opacity-70"
        :class="isMine ? 'text-right' : 'text-left'"
      >
        {{ formattedTime }}
      </p>
    </div>
  </div>
</template>
