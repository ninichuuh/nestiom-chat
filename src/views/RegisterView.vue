<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const { register, error, loading } = useAuth()

const email = ref('')
const displayName = ref('')
const password = ref('')

async function handleSubmit() {
  if (!displayName.value.trim()) return
  await register(email.value, displayName.value.trim(), password.value)
  if (!error.value) {
    router.push('/chat')
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-muted/40 px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="displayName">Display Name</label>
            <Input
              id="displayName"
              v-model="displayName"
              placeholder="Your name"
              required
              maxlength="50"
              autocomplete="name"
            />
          </div>
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
              placeholder="At least 6 characters"
              required
              minlength="6"
              autocomplete="new-password"
            />
          </div>
          <p v-if="error" role="alert" class="text-sm text-destructive">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </Button>
          <p class="text-center text-sm text-muted-foreground">
            Already have an account?
            <RouterLink :to="{ name: 'login' }" class="text-primary underline-offset-4 hover:underline">
              Sign in
            </RouterLink>
          </p>
        </form>
      </CardContent>
    </Card>
  </main>
</template>
