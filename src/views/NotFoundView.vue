<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-muted/40 px-4">
    <div class="text-center">
      <p class="text-7xl font-bold text-muted-foreground/30">404</p>
      <h1 class="mt-4 text-xl font-semibold">Page not found</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button class="mt-6" as-child>
        <RouterLink to="/">
          <ArrowLeft class="mr-1.5 h-4 w-4" />
          Back to home
        </RouterLink>
      </Button>
    </div>
  </main>
</template>
