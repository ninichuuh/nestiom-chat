<script setup lang="ts">
import { useUsers, type ChatUser } from '@/composables/useUsers'
import { useUnreadCounts } from '@/composables/useUnreadCounts'
import { useAuthStore } from '@/stores/auth'
import { getConversationId } from '@/composables/useMessages'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import UserListItem from './UserListItem.vue'

defineProps<{
  selectedUid?: string | null
}>()

const emit = defineEmits<{
  select: [user: ChatUser]
}>()

const { users, loading } = useUsers()
const { getUnreadCount } = useUnreadCounts()
const auth = useAuthStore()

function unreadForUser(uid: string): number {
  if (!auth.currentUser) return 0
  const convId = getConversationId(auth.currentUser.uid, uid)
  return getUnreadCount(convId)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div v-if="loading" class="flex flex-col gap-2 p-2">
      <div v-for="i in 6" :key="i" class="flex items-center gap-3 rounded-lg px-3 py-2">
        <Skeleton class="h-10 w-10 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-3 w-32" />
        </div>
      </div>
    </div>
    <div v-else-if="users.length === 0" class="flex flex-1 items-center justify-center p-4">
      <p class="text-center text-sm text-muted-foreground">No other users yet. Share the app link!</p>
    </div>
    <ScrollArea v-else class="flex-1">
      <div class="space-y-1 p-2">
        <TransitionGroup name="user-list">
          <UserListItem
            v-for="user in users"
            :key="user.uid"
            :user="user"
            :active="user.uid === selectedUid"
            :unread-count="unreadForUser(user.uid)"
            @select="emit('select', user)"
          />
        </TransitionGroup>
      </div>
    </ScrollArea>
  </div>
</template>
