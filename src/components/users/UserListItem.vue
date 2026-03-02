<script setup lang="ts">
import { computed } from 'vue'
import type { ChatUser } from '@/composables/useUsers'
import { usePresence } from '@/composables/usePresence'
import { Avatar } from '@/components/ui/avatar'

const props = defineProps<{
  user: ChatUser
  active?: boolean
}>()

defineEmits<{
  select: [user: ChatUser]
}>()

const { isOnline, getLastSeen } = usePresence()

const online = computed(() => isOnline(props.user.uid))

const lastSeenText = computed(() => {
  if (online.value) return 'Online'
  const ts = getLastSeen(props.user.uid)
  if (!ts) return ''
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Last seen just now'
  if (minutes < 60) return `Last seen ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Last seen ${hours}h ago`
  return `Last seen ${Math.floor(hours / 24)}d ago`
})
</script>

<template>
  <button
    class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
    :class="{ 'bg-accent': active }"
    :title="lastSeenText"
    @click="$emit('select', user)"
  >
    <div class="relative">
      <Avatar :name="user.displayName" size="default" />
      <span
        :aria-label="online ? 'Online' : 'Offline'"
        class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background"
        :class="online ? 'bg-green-500' : 'bg-muted-foreground/40'"
      />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium">{{ user.displayName }}</p>
      <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
    </div>
  </button>
</template>
