import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { ref as dbRef, set, serverTimestamp } from 'firebase/database'
import { auth, db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

let authListenerInitialized = false

export function useAuth() {
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function register(email: string, displayName: string, password: string) {
    error.value = null
    loading.value = true
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await set(dbRef(db, `users/${user.uid}`), {
        displayName,
        email,
        createdAt: serverTimestamp(),
      })
    } catch (e: unknown) {
      const err = e as { code?: string }
      if (err.code === 'auth/email-already-in-use') {
        error.value = 'This email is already registered.'
      } else if (err.code === 'auth/weak-password') {
        error.value = 'Password must be at least 6 characters.'
      } else if (err.code === 'auth/invalid-email') {
        error.value = 'Please enter a valid email address.'
      } else {
        error.value = 'Registration failed. Please try again.'
      }
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    error.value = null
    loading.value = true
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      error.value = 'Invalid email or password.'
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    error.value = null
    await signOut(auth)
  }

  function initAuthListener() {
    if (authListenerInitialized) return
    authListenerInitialized = true

    const store = useAuthStore()
    onAuthStateChanged(auth, (user: User | null) => {
      store.setUser(user)
      store.setLoading(false)
    })
  }

  return { error, loading, register, login, logout, initAuthListener }
}
