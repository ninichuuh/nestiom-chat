<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Message } from '@/composables/useMessages'
import type { MessageReactions, ReactionKey } from '@/composables/useReactions'
import { linkify } from '@/lib/linkify'
import { Input } from '@/components/ui/input'
import LinkCard from './LinkCard.vue'
import FilePreview from './FilePreview.vue'
import MessageActions from './MessageActions.vue'
import ReactionPicker from './ReactionPicker.vue'
import ReactionBar from './ReactionBar.vue'
import MessageStatus from './MessageStatus.vue'

const props = defineProps<{
  message: Message
  isMine: boolean
  reactions?: MessageReactions
  currentUid?: string
  messageStatus?: 'sent' | 'read'
  highlighted?: boolean
  highlightQuery?: string
}>()

const emit = defineEmits<{
  edit: [messageId: string, newText: string]
  delete: [messageId: string]
  react: [messageId: string, emoji: ReactionKey]
}>()

const editing = ref(false)
const editText = ref('')
const editInput = ref<InstanceType<typeof Input> | null>(null)

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const segments = computed(() => {
  if (props.message.deleted) return []
  return linkify(props.message.text)
})

const hasStandaloneUrl = computed(() =>
  segments.value.length === 1 && segments.value[0]!.type === 'url'
)

function highlightText(text: string): string {
  if (!props.highlightQuery) return text
  const q = props.highlightQuery
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="rounded bg-yellow-300/60 dark:bg-yellow-500/40">$1</mark>')
}

async function startEdit() {
  editText.value = props.message.text
  editing.value = true
  await nextTick()
  const el = editInput.value?.$el as HTMLInputElement | undefined
  el?.focus()
}

function submitEdit() {
  const trimmed = editText.value.trim()
  if (trimmed && trimmed !== props.message.text) {
    emit('edit', props.message.id, trimmed)
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <div class="group flex items-center gap-1" :class="isMine ? 'justify-end' : 'justify-start'">
    <!-- Actions (before bubble for own messages) -->
    <template v-if="isMine && !editing">
      <ReactionPicker @select="(emoji) => emit('react', message.id, emoji)" />
      <MessageActions :deleted="message.deleted" @edit="startEdit" @delete="emit('delete', message.id)" />
    </template>

    <div class="max-w-[70%]">
      <div
        class="rounded-2xl px-4 py-2 text-sm shadow-sm transition-all hover:shadow-md hover:scale-[1.01] dark:shadow-black/10"
        :class="[
          isMine
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md',
          message.deleted && 'opacity-60',
          highlighted && 'ring-2 ring-yellow-400',
        ]">
        <!-- Deleted message -->
        <p v-if="message.deleted" class="italic">
          This message was deleted
        </p>

        <!-- Editing mode -->
        <template v-else-if="editing">
          <Input ref="editInput" v-model="editText" class="mb-1 h-8 bg-background text-foreground" maxlength="2000"
            @keydown.enter.prevent="submitEdit" @keydown.escape.prevent="cancelEdit" />
          <p class="text-[10px] opacity-70">
            Enter to save, Escape to cancel
          </p>
        </template>

        <!-- Normal message -->
        <template v-else>
          <p class="wrap-break-word">
            <template v-for="(seg, i) in segments" :key="i">
              <span v-if="seg.type === 'text' && highlightQuery" v-html="highlightText(seg.value)" />
              <span v-else-if="seg.type === 'text'">{{ seg.value }}</span>
              <a v-else :href="seg.value" target="_blank" rel="noopener noreferrer"
                class="underline underline-offset-2 hover:opacity-80">{{ seg.value }}</a>
            </template>
          </p>
          <LinkCard v-if="hasStandaloneUrl" :url="segments[0]!.value" />
          <FilePreview v-if="message.fileUrl" :file-url="message.fileUrl" :file-name="message.fileName ?? 'File'"
            :file-type="message.fileType ?? ''" :file-size="message.fileSize ?? 0" />
          <p class="mt-1 text-[10px] opacity-60" :class="isMine ? 'text-right' : 'text-left'">
            {{ formattedTime }}
            <span v-if="message.edited" class="ml-1 italic">(edited)</span>
            <MessageStatus v-if="isMine && messageStatus" :status="messageStatus" />
          </p>
        </template>
      </div>

      <!-- Reactions -->
      <ReactionBar v-if="reactions && currentUid" :reactions="reactions" :current-uid="currentUid"
        @toggle="(emoji) => emit('react', message.id, emoji)" />
    </div>

    <!-- Actions (after bubble for other's messages) -->
    <template v-if="!isMine && !editing">
      <ReactionPicker @select="(emoji) => emit('react', message.id, emoji)" />
    </template>
  </div>
</template>
