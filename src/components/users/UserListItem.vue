<script setup lang="ts">
import { computed } from 'vue'
import type { ChatUser } from '@/composables/useUsers'
import { usePresence } from '@/composables/usePresence'
import { useConversationStats } from '@/composables/useConversationStats'
import { Avatar } from '@/components/ui/avatar'
import SparkBars from '@/components/charts/SparkBars.vue'

const props = defineProps<{
  user: ChatUser
  active?: boolean
  unreadCount?: number
}>()

defineEmits<{
  select: [user: ChatUser]
}>()

const { isOnline, getLastSeen } = usePresence()
const { getStats } = useConversationStats()

const online = computed(() => isOnline(props.user.uid))

const stats = computed(() => getStats(props.user.uid))

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

const hasUnread = computed(() => (props.unreadCount ?? 0) > 0)
</script>

<template>
  <button
    class="hover-lift relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
    :class="[
      active && 'bg-accent border-l-2 border-l-primary',
      hasUnread && 'unread-glow',
    ]"
    :title="lastSeenText"
    @click="$emit('select', user)"
  >
    <!-- Spark bars background -->
    <SparkBars :counts="stats.counts" />

    <div class="relative z-10 flex w-full items-center gap-3">
      <div class="relative">
        <Avatar :name="user.displayName" size="default" />
        <span
          :aria-label="online ? 'Online' : 'Offline'"
          class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background"
          :class="[
            online ? 'bg-green-500 animate-pulse-dot' : 'bg-muted-foreground/40',
          ]"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm" :class="hasUnread ? 'font-semibold' : 'font-medium'">
          {{ user.displayName }}
        </p>
        <p class="truncate text-xs text-muted-foreground">{{ lastSeenText }}</p>
      </div>
      <span
        v-if="hasUnread"
        class="z-10 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold leading-none text-primary-foreground"
      >
        {{ unreadCount! > 99 ? '99+' : unreadCount }}
      </span>
    </div>
  </button>
</template>
