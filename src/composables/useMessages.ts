import { ref, watch, onUnmounted, type Ref } from 'vue'
import {
  ref as dbRef,
  push,
  onValue,
  onChildAdded,
  off,
  query,
  orderByChild,
  serverTimestamp,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: number
}

export function getConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_')
}

export function useMessages(otherUid: Ref<string | null>) {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const auth = useAuthStore()

  let activeQueryRef: ReturnType<typeof query> | null = null

  function cleanup() {
    if (activeQueryRef) {
      off(activeQueryRef)
      activeQueryRef = null
    }
    messages.value = []
  }

  watch(otherUid, (newUid) => {
    cleanup()

    if (!newUid || !auth.currentUser) {
      loading.value = false
      return
    }

    loading.value = true
    const conversationId = getConversationId(auth.currentUser.uid, newUid)

    const messagesRef = query(
      dbRef(db, `messages/${conversationId}`),
      orderByChild('timestamp')
    )
    activeQueryRef = messagesRef

    let initialLoadDone = false

    onValue(messagesRef, (snapshot) => {
      if (initialLoadDone) return
      initialLoadDone = true

      const data = snapshot.val()
      if (data) {
        messages.value = Object.entries(data)
          .map(([id, val]) => {
            const v = val as { senderId: string; text: string; timestamp: number }
            return { id, senderId: v.senderId, text: v.text, timestamp: v.timestamp }
          })
          .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
      }
      loading.value = false

      onChildAdded(messagesRef, (childSnapshot) => {
        const childData = childSnapshot.val()
        const msg: Message = {
          id: childSnapshot.key!,
          senderId: childData.senderId,
          text: childData.text,
          timestamp: childData.timestamp,
        }
        if (!messages.value.some(m => m.id === msg.id)) {
          messages.value = [...messages.value, msg]
        }
      })
    }, { onlyOnce: true })
  }, { immediate: true })

  onUnmounted(() => cleanup())

  async function sendMessage(text: string) {
    if (!otherUid.value || !auth.currentUser) return

    const conversationId = getConversationId(auth.currentUser.uid, otherUid.value)
    const messagesRef = dbRef(db, `messages/${conversationId}`)
    await push(messagesRef, {
      senderId: auth.currentUser.uid,
      text,
      timestamp: serverTimestamp(),
    })
  }

  return { messages, loading, sendMessage, cleanup }
}
