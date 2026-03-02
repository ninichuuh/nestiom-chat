<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { SmilePlus } from 'lucide-vue-next'
import { REACTION_EMOJIS, type ReactionKey } from '@/composables/useReactions'
import { ref } from 'vue'

const emit = defineEmits<{
  select: [emoji: ReactionKey]
}>()

const open = ref(false)

function handleSelect(emoji: ReactionKey) {
  emit('select', emoji)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon" class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <SmilePlus class="h-3 w-3" />
      </Button>
    </PopoverTrigger>
    <PopoverContent side="top" class="flex gap-1 p-1.5">
      <button
        v-for="r in REACTION_EMOJIS"
        :key="r.key"
        class="rounded p-1 text-base transition-all hover:scale-125 hover:bg-accent active:scale-95"
        @click="handleSelect(r.key)"
      >
        {{ r.emoji }}
      </button>
    </PopoverContent>
  </Popover>
</template>
