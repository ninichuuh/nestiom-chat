<script setup lang="ts">
import { Check, CheckCheck } from 'lucide-vue-next'

defineProps<{
  status: 'sent' | 'read'
}>()
</script>

<template>
  <span class="inline-flex items-center">
    <Check v-if="status === 'sent'" class="h-3 w-3 opacity-60" />
    <CheckCheck v-else class="h-3 w-3 text-blue-400" />
  </span>
</template>
