<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendHorizonal, Paperclip, X, Loader2 } from 'lucide-vue-next'

const emit = defineEmits<{
  send: [text: string]
  typing: []
  file: [file: File]
}>()

defineProps<{
  uploading?: boolean
  uploadProgress?: number
}>()

const text = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const pendingFile = ref<File | null>(null)

let typingDebounce: ReturnType<typeof setTimeout> | null = null

function handleSend() {
  if (pendingFile.value) {
    emit('file', pendingFile.value)
    pendingFile.value = null
    text.value = ''
    if (typingDebounce) {
      clearTimeout(typingDebounce)
      typingDebounce = null
    }
    return
  }

  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('send', trimmed)
  text.value = ''
  if (typingDebounce) {
    clearTimeout(typingDebounce)
    typingDebounce = null
  }
}

function handleInput() {
  if (typingDebounce) return
  emit('typing')
  typingDebounce = setTimeout(() => {
    typingDebounce = null
  }, 300)
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    pendingFile.value = file
  }
  input.value = ''
}

function cancelFile() {
  pendingFile.value = null
}
</script>

<template>
  <div class="border-t">
    <!-- Upload progress -->
    <div v-if="uploading" class="px-4 pt-2">
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 class="h-3 w-3 animate-spin" />
        <span>Uploading... {{ Math.round(uploadProgress ?? 0) }}%</span>
      </div>
      <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
          :style="{ width: `${uploadProgress ?? 0}%` }"
        />
      </div>
    </div>

    <!-- Pending file preview -->
    <div v-if="pendingFile" class="flex items-center gap-2 px-4 pt-2">
      <Paperclip class="h-3 w-3 text-muted-foreground" />
      <span class="flex-1 truncate text-xs text-muted-foreground">{{ pendingFile.name }}</span>
      <button class="text-muted-foreground hover:text-foreground" @click="cancelFile">
        <X class="h-3 w-3" />
      </button>
    </div>

    <div class="flex items-center gap-2 p-4">
      <input
        ref="fileInput"
        type="file"
        accept="image/*,application/pdf,text/*"
        class="hidden"
        @change="handleFileSelect"
      />
      <Button variant="ghost" size="icon" class="min-h-11 min-w-11 md:min-h-0 md:min-w-0" aria-label="Attach file" :disabled="uploading" @click="fileInput?.click()">
        <Paperclip class="h-4 w-4" />
      </Button>
      <Input
        v-model="text"
        :placeholder="pendingFile ? 'Add a caption...' : 'Type a message...'"
        class="glow-ring flex-1"
        maxlength="2000"
        :disabled="uploading"
        @keydown.enter.prevent="handleSend"
        @input="handleInput"
      />
      <Button
        size="icon"
        class="min-h-11 min-w-11 transition-transform hover:scale-105 md:min-h-0 md:min-w-0"
        aria-label="Send message"
        :disabled="(!text.trim() && !pendingFile) || uploading"
        @click="handleSend"
      >
        <SendHorizonal class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
