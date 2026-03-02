<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '@/composables/useMessages'
import { ScrollArea } from '@/components/ui/scroll-area'
import MessageBubble from './MessageBubble.vue'

const props = defineProps<{
  messages: Message[]
  currentUid: string
  loading?: boolean
}>()

const scrollContainer = ref<InstanceType<typeof ScrollArea> | null>(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  const el = scrollContainer.value?.$el?.querySelector('[data-radix-scroll-area-viewport]')
  if (el) {
    el.scrollTop = el.scrollHeight
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-muted-foreground">Loading messages...</p>
    </div>
    <div v-else-if="messages.length === 0" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-muted-foreground">No messages yet. Say hello!</p>
    </div>
    <ScrollArea v-else ref="scrollContainer" class="flex-1">
      <div class="space-y-3 p-4">
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :is-mine="msg.senderId === currentUid"
        />
      </div>
    </ScrollArea>
  </div>
</template>
