<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2 } from 'lucide-vue-next'

defineProps<{
  deleted?: boolean
}>()

defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="h-6 w-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-accent/80">
        <MoreVertical class="h-3 w-3" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem v-if="!deleted" @click="$emit('edit')">
        <Pencil class="h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem v-if="!deleted" class="text-destructive" @click="$emit('delete')">
        <Trash2 class="h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
