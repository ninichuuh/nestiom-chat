<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-vue-next'

const emit = defineEmits<{
  send: [text: string]
  typing: []
}>()

const text = ref('')

let typingDebounce: ReturnType<typeof setTimeout> | null = null

function handleSend() {
  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('send', trimmed)
  text.value = ''
  // Clear typing debounce on send
  if (typingDebounce) {
    clearTimeout(typingDebounce)
    typingDebounce = null
  }
}

function handleInput() {
  // Debounce typing events — only emit once per 300ms
  if (typingDebounce) return
  emit('typing')
  typingDebounce = setTimeout(() => {
    typingDebounce = null
  }, 300)
}
</script>

<template>
  <div class="flex items-center gap-2 border-t p-4">
    <Input
      v-model="text"
      placeholder="Type a message..."
      class="flex-1"
      @keydown.enter.prevent="handleSend"
      @input="handleInput"
    />
    <Button size="icon" @click="handleSend" :disabled="!text.trim()">
      <SendHorizonal class="h-4 w-4" />
    </Button>
  </div>
</template>
