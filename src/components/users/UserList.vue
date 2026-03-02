<script setup lang="ts">
import { useUsers, type ChatUser } from '@/composables/useUsers'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserListItem from './UserListItem.vue'

defineProps<{
  selectedUid?: string | null
}>()

const emit = defineEmits<{
  select: [user: ChatUser]
}>()

const { users, loading } = useUsers()
</script>

<template>
  <div class="flex h-full flex-col">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-muted-foreground">Loading users...</p>
    </div>
    <div v-else-if="users.length === 0" class="flex flex-1 items-center justify-center p-4">
      <p class="text-center text-sm text-muted-foreground">No other users yet. Share the app link!</p>
    </div>
    <ScrollArea v-else class="flex-1">
      <div class="space-y-1 p-2">
        <UserListItem
          v-for="user in users"
          :key="user.uid"
          :user="user"
          :active="user.uid === selectedUid"
          @select="emit('select', user)"
        />
      </div>
    </ScrollArea>
  </div>
</template>
