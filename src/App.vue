<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import OfflineBanner from '@/components/OfflineBanner.vue'
import { Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const { initAuthListener } = useAuth()

initAuthListener()
</script>

<template>
  <OfflineBanner />
  <div v-if="auth.isLoading" class="flex min-h-screen items-center justify-center">
    <div class="flex items-center gap-2 text-muted-foreground">
      <Loader2 class="h-5 w-5 animate-spin" />
      <span class="text-sm">Loading...</span>
    </div>
  </div>
  <RouterView v-else />
</template>
