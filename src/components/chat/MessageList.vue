<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '@/composables/useMessages'
import type { MessageReactions, ReactionKey } from '@/composables/useReactions'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import MessageBubble from './MessageBubble.vue'

const props = defineProps<{
  messages: Message[]
  currentUid: string
  loading?: boolean
  getReactions?: (messageId: string) => MessageReactions
  getMessageStatus?: (message: Message) => 'sent' | 'read'
  highlightedMessageId?: string | null
  highlightQuery?: string
}>()

defineEmits<{
  edit: [messageId: string, newText: string]
  delete: [messageId: string]
  react: [messageId: string, emoji: ReactionKey]
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
    <div v-if="loading" class="flex flex-1 flex-col gap-3 p-4">
      <div v-for="i in 5" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
        <Skeleton :class="'h-12 rounded-2xl'" :style="{ width: `${30 + (i * 8) % 40}%` }" />
      </div>
    </div>
    <div v-else-if="messages.length === 0" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-muted-foreground">No messages yet. Say hello!</p>
    </div>
    <ScrollArea v-else ref="scrollContainer" class="flex-1">
      <div class="space-y-3 p-4">
        <TransitionGroup name="message">
          <MessageBubble
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
            :is-mine="msg.senderId === currentUid"
            :reactions="getReactions?.(msg.id)"
            :current-uid="currentUid"
            :message-status="getMessageStatus?.(msg)"
            :highlighted="msg.id === highlightedMessageId"
            :highlight-query="highlightQuery"
            @edit="(id, text) => $emit('edit', id, text)"
            @delete="(id) => $emit('delete', id)"
            @react="(id, emoji) => $emit('react', id, emoji)"
          />
        </TransitionGroup>
      </div>
    </ScrollArea>
  </div>
</template>
