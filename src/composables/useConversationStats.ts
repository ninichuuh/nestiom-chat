import { ref, onUnmounted } from 'vue'
import {
  ref as dbRef,
  query,
  orderByChild,
  startAt,
  onValue,
  off,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import { getConversationId } from './useMessages'

export interface MiniStats {
  counts: number[] // 24 hourly buckets
}

const statsCache = ref<Record<string, MiniStats>>({})
const listeners: Record<string, ReturnType<typeof query>> = {}

export function useConversationStats() {
  const auth = useAuthStore()

  function getStats(otherUid: string): MiniStats {
    if (!auth.currentUser) return { counts: [] }
    const convId = getConversationId(auth.currentUser.uid, otherUid)

    // Already listening
    if (statsCache.value[convId]) return statsCache.value[convId]!

    // Start listening
    const now = Date.now()
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000

    const messagesRef = query(
      dbRef(db, `messages/${convId}`),
      orderByChild('timestamp'),
      startAt(twentyFourHoursAgo),
    )

    listeners[convId] = messagesRef
    statsCache.value[convId] = { counts: Array.from({ length: 24 }, (): number => 0) }

    onValue(messagesRef, (snapshot) => {
      const buckets: number[] = Array.from({ length: 24 }, (): number => 0)
      const currentNow = Date.now()

      snapshot.forEach((child) => {
        const ts = child.val()?.timestamp
        if (typeof ts === 'number') {
          const hoursAgo = Math.floor((currentNow - ts) / (60 * 60 * 1000))
          const idx = 23 - hoursAgo
          if (idx >= 0 && idx < 24) buckets[idx]!++
        }
      })

      statsCache.value[convId] = { counts: buckets }
    })

    return statsCache.value[convId]!
  }

  function cleanup() {
    for (const [convId, queryRef] of Object.entries(listeners)) {
      off(queryRef)
      delete listeners[convId]
    }
    statsCache.value = {}
  }

  onUnmounted(cleanup)

  return { getStats, cleanup }
}
