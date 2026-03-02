import { ref } from 'vue'
import {
  ref as dbRef,
  onValue,
  set,
  runTransaction,
  off,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const unreadCounts = ref<Record<string, number>>({})
let activeRef: ReturnType<typeof dbRef> | null = null
let initialized = false

export function useUnreadCounts() {
  const auth = useAuthStore()

  function listen() {
    if (initialized || !auth.currentUser) return
    initialized = true

    const countsRef = dbRef(db, `unreadCounts/${auth.currentUser.uid}`)
    activeRef = countsRef

    onValue(countsRef, (snapshot) => {
      unreadCounts.value = snapshot.val() ?? {}
    })
  }

  function cleanup() {
    if (activeRef) {
      off(activeRef)
      activeRef = null
    }
    initialized = false
    unreadCounts.value = {}
  }

  function getUnreadCount(conversationId: string): number {
    return unreadCounts.value[conversationId] ?? 0
  }

  async function resetUnreadCount(conversationId: string) {
    if (!auth.currentUser) return
    const countRef = dbRef(db, `unreadCounts/${auth.currentUser.uid}/${conversationId}`)
    await set(countRef, 0)
  }

  async function incrementUnreadCount(otherUid: string, conversationId: string) {
    const countRef = dbRef(db, `unreadCounts/${otherUid}/${conversationId}`)
    await runTransaction(countRef, (current) => (current || 0) + 1)
  }

  return { unreadCounts, listen, cleanup, getUnreadCount, resetUnreadCount, incrementUnreadCount }
}
