<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const { theme, cycleTheme } = useTheme()
</script>

<template>
  <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="cycleTheme">
    <Sun v-if="theme === 'light'" class="h-4 w-4" />
    <Moon v-else-if="theme === 'dark'" class="h-4 w-4" />
    <Monitor v-else class="h-4 w-4" />
  </Button>
</template>
