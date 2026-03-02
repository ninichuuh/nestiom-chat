<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { ChatUser } from '@/composables/useUsers'
import { useMessages, getConversationId } from '@/composables/useMessages'
import { useMessageStats } from '@/composables/useMessageStats'
import { useTyping } from '@/composables/useTyping'
import { useAuthStore } from '@/stores/auth'
import { Avatar } from '@/components/ui/avatar'
import { usePresence } from '@/composables/usePresence'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import MessageChart from '@/components/charts/MessageChart.vue'

const props = defineProps<{
  selectedUser: ChatUser | null
}>()

const auth = useAuthStore()
const { isOnline } = usePresence()

const otherUid = computed(() => props.selectedUser?.uid ?? null)
const { messages, loading, sendMessage } = useMessages(toRef(otherUid))
const { hourlyStats, totalMessages } = useMessageStats(messages)

const currentConversationId = computed(() => {
  if (!otherUid.value || !auth.currentUser) return null
  return getConversationId(auth.currentUser.uid, otherUid.value)
})

const { isOtherUserTyping, setTyping } = useTyping(currentConversationId)

const otherOnline = computed(() => {
  if (!props.selectedUser) return false
  return isOnline(props.selectedUser.uid)
})

function handleTyping() {
  setTyping(true)
}

function handleSend(text: string) {
  setTyping(false)
  sendMessage(text)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- No conversation selected -->
    <div v-if="!selectedUser" class="flex flex-1 items-center justify-center">
      <div class="text-center text-muted-foreground">
        <p class="text-lg font-medium">Select a conversation</p>
        <p class="text-sm">Choose a user from the sidebar to start chatting</p>
      </div>
    </div>

    <!-- Active conversation -->
    <template v-else>
      <!-- Chat header -->
      <div class="flex items-center gap-3 border-b px-4 py-3">
        <div class="relative">
          <Avatar :name="selectedUser.displayName" size="sm" />
          <span
            class="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background"
            :class="otherOnline ? 'bg-green-500' : 'bg-muted-foreground/40'"
          />
        </div>
        <div>
          <p class="text-sm font-medium">{{ selectedUser.displayName }}</p>
          <p v-if="otherOnline" class="text-xs text-green-500">Online</p>
        </div>
      </div>

      <!-- Message chart -->
      <MessageChart :stats="hourlyStats" :total-messages="totalMessages" />

      <!-- Messages -->
      <MessageList
        :messages="messages"
        :current-uid="auth.currentUser!.uid"
        :loading="loading"
      />

      <!-- Typing indicator -->
      <div v-if="isOtherUserTyping" class="px-4 py-1">
        <p class="text-xs text-muted-foreground animate-pulse">
          {{ selectedUser.displayName }} is typing...
        </p>
      </div>

      <!-- Input -->
      <MessageInput @send="handleSend" @typing="handleTyping" />
    </template>
  </div>
</template>
