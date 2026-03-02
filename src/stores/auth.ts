import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(true)

  const isAuthenticated = computed(() => currentUser.value !== null)

  function setUser(user: User | null) {
    currentUser.value = user
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return { currentUser, isLoading, isAuthenticated, setUser, setLoading }
})
