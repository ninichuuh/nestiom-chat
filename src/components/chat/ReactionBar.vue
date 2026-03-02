<script setup lang="ts">
import { computed } from 'vue'
import { REACTION_EMOJIS, type MessageReactions, type ReactionKey } from '@/composables/useReactions'

const props = defineProps<{
  reactions: MessageReactions
  currentUid: string
}>()

const emit = defineEmits<{
  toggle: [emoji: ReactionKey]
}>()

const emojiMap = Object.fromEntries(REACTION_EMOJIS.map(r => [r.key, r.emoji]))

const activeReactions = computed(() =>
  Object.entries(props.reactions)
    .filter(([, uids]) => uids.length > 0)
    .map(([key, uids]) => ({
      key: key as ReactionKey,
      emoji: emojiMap[key] ?? key,
      count: uids.length,
      mine: uids.includes(props.currentUid),
    }))
)
</script>

<template>
  <div v-if="activeReactions.length > 0" class="mt-1 flex flex-wrap gap-1">
    <button
      v-for="r in activeReactions"
      :key="r.key"
      class="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs transition-colors hover:bg-accent"
      :class="r.mine ? 'border-primary/40 bg-primary/10' : 'border-border'"
      @click="emit('toggle', r.key)"
    >
      <span>{{ r.emoji }}</span>
      <span class="text-muted-foreground">{{ r.count }}</span>
    </button>
  </div>
</template>
