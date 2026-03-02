<script setup lang="ts">
import { computed } from 'vue'
import { FileIcon, Download } from 'lucide-vue-next'

const props = defineProps<{
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}>()

const isImage = computed(() => props.fileType?.startsWith('image/'))

const formattedSize = computed(() => {
  if (props.fileSize < 1024) return `${props.fileSize} B`
  if (props.fileSize < 1024 * 1024) return `${(props.fileSize / 1024).toFixed(1)} KB`
  return `${(props.fileSize / (1024 * 1024)).toFixed(1)} MB`
})
</script>

<template>
  <div class="mt-1">
    <!-- Image preview -->
    <a v-if="isImage" :href="fileUrl" target="_blank" rel="noopener noreferrer" class="block">
      <img :src="fileUrl" :alt="fileName" class="max-w-70 rounded-lg object-cover transition-opacity hover:opacity-90"
        loading="lazy" />
    </a>

    <!-- File download card -->
    <a v-else :href="fileUrl" target="_blank" rel="noopener noreferrer"
      class="flex items-center gap-2 rounded-lg border bg-card/50 p-2 transition-colors hover:bg-accent">
      <FileIcon class="h-8 w-8 shrink-0 text-muted-foreground" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-xs font-medium">{{ fileName }}</p>
        <p class="text-[10px] text-muted-foreground">{{ formattedSize }}</p>
      </div>
      <Download class="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  </div>
</template>
