<script setup lang="ts">
import { computed, toRef, watch } from 'vue'
import type { ChatUser } from '@/composables/useUsers'
import { useMessages, getConversationId } from '@/composables/useMessages'
import { useMessageStats } from '@/composables/useMessageStats'
import { useTyping } from '@/composables/useTyping'
import { useAuthStore } from '@/stores/auth'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'
import { usePresence } from '@/composables/usePresence'
import { useReactions } from '@/composables/useReactions'
import { useReadReceipts } from '@/composables/useReadReceipts'
import { useUnreadCounts } from '@/composables/useUnreadCounts'
import { useFileUpload } from '@/composables/useFileUpload'
import { useNotifications } from '@/composables/useNotifications'
import { useMessageSearch } from '@/composables/useMessageSearch'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import MessageSearch from './MessageSearch.vue'
import MessageChart from '@/components/charts/MessageChart.vue'

const props = defineProps<{
  selectedUser: ChatUser | null
}>()

const auth = useAuthStore()
const { isOnline } = usePresence()

const otherUid = computed(() => props.selectedUser?.uid ?? null)
const { messages, loading, sendMessage, sendFileMessage, editMessage, deleteMessage } = useMessages(toRef(otherUid))
const { uploading, progress: uploadProgress, uploadFile } = useFileUpload()
const { hourlyStats, totalMessages } = useMessageStats(messages)

const currentConversationId = computed(() => {
  if (!otherUid.value || !auth.currentUser) return null
  return getConversationId(auth.currentUser.uid, otherUid.value)
})

const { isOtherUserTyping, setTyping } = useTyping(currentConversationId)
const { toggleReaction, getReactions } = useReactions(currentConversationId)
const { markAsRead, getMessageStatus } = useReadReceipts(currentConversationId)
const { resetUnreadCount } = useUnreadCounts()
const { notifyNewMessage, requestPermission } = useNotifications()
requestPermission()

const {
  searchQuery,
  isSearchOpen,
  searchResults,
  currentResult,
  currentResultIndex,
  nextResult,
  prevResult,
  openSearch,
  closeSearch,
} = useMessageSearch(messages)

// Mark messages as read and notify when they arrive
watch(() => messages.value.length, (newLen, oldLen) => {
  const lastMsg = messages.value[messages.value.length - 1]
  if (lastMsg && lastMsg.senderId !== auth.currentUser?.uid) {
    markAsRead(lastMsg.id, lastMsg.timestamp)
    if (currentConversationId.value) {
      resetUnreadCount(currentConversationId.value)
    }
    // Notify only for truly new messages (not initial load)
    if (oldLen !== undefined && oldLen > 0 && props.selectedUser) {
      notifyNewMessage(props.selectedUser.displayName, lastMsg.text)
    }
  }
})

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

async function handleFile(file: File) {
  if (!currentConversationId.value) return
  const result = await uploadFile(file, currentConversationId.value)
  await sendFileMessage(result)
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
      <div class="flex items-center gap-3 border-b px-4 py-3 shadow-[0_1px_4px_rgb(0_0_0/0.04)] dark:shadow-[0_1px_4px_rgb(0_0_0/0.15)]">
        <div class="relative">
          <Avatar :name="selectedUser.displayName" size="sm" />
          <span
            class="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background"
            :class="otherOnline ? 'bg-green-500 animate-pulse-dot' : 'bg-muted-foreground/40'"
          />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ selectedUser.displayName }}</p>
          <p v-if="otherOnline" class="text-xs text-green-500">Online</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Search messages" @click="openSearch">
          <Search class="h-4 w-4" />
        </Button>
      </div>

      <!-- Search panel -->
      <Transition name="search">
        <MessageSearch
          v-if="isSearchOpen"
          :result-count="searchResults.length"
          :current-index="currentResultIndex"
          @search="(q) => searchQuery = q"
          @next="nextResult"
          @prev="prevResult"
          @close="closeSearch"
        />
      </Transition>

      <!-- Message chart -->
      <MessageChart :stats="hourlyStats" :total-messages="totalMessages" />

      <!-- Messages -->
      <MessageList
        :messages="messages"
        :current-uid="auth.currentUser?.uid ?? ''"
        :loading="loading"
        :get-reactions="getReactions"
        :get-message-status="getMessageStatus"
        :highlighted-message-id="currentResult?.id"
        :highlight-query="searchQuery.trim() || undefined"
        @edit="editMessage"
        @delete="deleteMessage"
        @react="toggleReaction"
      />

      <!-- Typing indicator -->
      <Transition name="fade">
        <div v-if="isOtherUserTyping" class="px-4 py-1">
          <p class="text-xs text-muted-foreground animate-pulse">
            {{ selectedUser.displayName }} is typing...
          </p>
        </div>
      </Transition>

      <!-- Input -->
      <MessageInput
        :uploading="uploading"
        :upload-progress="uploadProgress"
        @send="handleSend"
        @typing="handleTyping"
        @file="handleFile"
      />
    </template>
  </div>
</template>
