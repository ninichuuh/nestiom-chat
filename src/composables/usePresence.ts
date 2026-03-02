import { ref } from 'vue'
import {
  ref as dbRef,
  set,
  off,
  onValue,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

export interface PresenceInfo {
  online: boolean
  lastSeen: number | null
}

const presenceMap = ref<Record<string, PresenceInfo>>({})
let presenceInitialized = false

export function usePresence() {
  const auth = useAuthStore()

  function setupPresence() {
    if (!auth.currentUser || presenceInitialized) return
    presenceInitialized = true

    const uid = auth.currentUser.uid
    const userPresenceRef = dbRef(db, `presence/${uid}`)
    const connectedRef = dbRef(db, '.info/connected')

    // Register onDisconnect once, outside the listener
    onDisconnect(userPresenceRef).set({
      online: false,
      lastSeen: serverTimestamp(),
    })

    // Listen for connection state and set online when connected
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        set(userPresenceRef, { online: true, lastSeen: serverTimestamp() })
      }
    })

    // Listen to all users' presence
    const allPresenceRef = dbRef(db, 'presence')
    onValue(allPresenceRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        presenceMap.value = {}
        return
      }
      const map: Record<string, PresenceInfo> = {}
      for (const [id, val] of Object.entries(data)) {
        const v = val as { online?: boolean; lastSeen?: number }
        map[id] = {
          online: v.online ?? false,
          lastSeen: v.lastSeen ?? null,
        }
      }
      presenceMap.value = map
    })
  }

  function cleanupPresence() {
    if (!presenceInitialized) return
    const connectedRef = dbRef(db, '.info/connected')
    const allPresenceRef = dbRef(db, 'presence')
    off(connectedRef)
    off(allPresenceRef)
    presenceInitialized = false
    presenceMap.value = {}
  }

  function isOnline(uid: string): boolean {
    return presenceMap.value[uid]?.online ?? false
  }

  function getLastSeen(uid: string): number | null {
    return presenceMap.value[uid]?.lastSeen ?? null
  }

  return { presenceMap, setupPresence, cleanupPresence, isOnline, getLastSeen }
}
