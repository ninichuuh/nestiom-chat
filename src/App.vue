<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { initAuthListener } = useAuth()

initAuthListener()
</script>

<template>
  <div v-if="auth.isLoading" class="flex min-h-screen items-center justify-center">
    <div class="text-muted-foreground">Loading...</div>
  </div>
  <RouterView v-else />
</template>
