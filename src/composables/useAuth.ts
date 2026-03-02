import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { ref as dbRef, get, set, serverTimestamp } from 'firebase/database'
import { auth, db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

let authListenerInitialized = false

export function useAuth() {
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function register(email: string, displayName: string, password: string) {
    error.value = null
    loading.value = true
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName })
      await set(dbRef(db, `users/${user.uid}`), {
        displayName,
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
    try {
      await signOut(auth)
    } catch {
      error.value = 'Sign out failed. Please try again.'
    }
  }

  function initAuthListener() {
    if (authListenerInitialized) return
    authListenerInitialized = true

    const store = useAuthStore()
    let initialLoad = true
    onAuthStateChanged(auth, async (user: User | null) => {
      store.setUser(user)
      store.setLoading(false)

      // Ensure user profile exists in the DB (self-healing for failed registrations)
      if (user) {
        const profileRef = dbRef(db, `users/${user.uid}`)
        const snapshot = await get(profileRef)
        if (!snapshot.exists()) {
          await set(profileRef, {
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            createdAt: serverTimestamp(),
          })
        }
      }

      // Redirect to login if session expires after initial load
      if (!initialLoad && !user) {
        router.push({ name: 'login' })
      }
      initialLoad = false
    })
  }

  return { error, loading, register, login, logout, initAuthListener }
}
