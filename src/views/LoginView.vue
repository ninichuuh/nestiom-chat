<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const { login, error, loading } = useAuth()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  await login(email.value, password.value)
  if (!error.value) {
    router.push('/chat')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/40 px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="email">Email</label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">Password</label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>
          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Don't have an account?
            <RouterLink :to="{ name: 'register' }" class="text-primary underline-offset-4 hover:underline">
              Register
            </RouterLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
