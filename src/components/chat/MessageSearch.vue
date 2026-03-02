<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, ChevronUp, ChevronDown } from 'lucide-vue-next'

defineProps<{
  resultCount: number
  currentIndex: number
}>()

const emit = defineEmits<{
  search: [query: string]
  next: []
  prev: []
  close: []
}>()

const query = ref('')
const inputEl = ref<InstanceType<typeof Input> | null>(null)

watch(query, (val) => emit('search', val))

// Focus input on mount
nextTick(() => {
  const el = inputEl.value?.$el as HTMLInputElement | undefined
  el?.focus()
})
</script>

<template>
  <div class="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
    <Input
      ref="inputEl"
      v-model="query"
      placeholder="Search messages..."
      class="glow-ring h-8 flex-1 text-sm"
      @keydown.enter.prevent="emit('next')"
      @keydown.escape.prevent="emit('close')"
    />
    <span v-if="query.trim()" class="whitespace-nowrap text-xs text-muted-foreground">
      {{ resultCount > 0 ? `${currentIndex + 1}/${resultCount}` : '0 results' }}
    </span>
    <Button variant="ghost" size="icon" class="h-7 w-7" :disabled="resultCount === 0" @click="emit('prev')">
      <ChevronUp class="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" class="h-7 w-7" :disabled="resultCount === 0" @click="emit('next')">
      <ChevronDown class="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('close')">
      <X class="h-4 w-4" />
    </Button>
  </div>
</template>
