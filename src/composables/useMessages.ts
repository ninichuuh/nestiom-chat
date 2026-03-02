import { ref, watch, onUnmounted, type Ref } from 'vue'
import {
  ref as dbRef,
  push,
  update,
  onValue,
  onChildAdded,
  onChildChanged,
  off,
  query,
  orderByChild,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'
import { useUnreadCounts } from './useUnreadCounts'

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: number
  edited?: boolean
  editedAt?: number
  deleted?: boolean
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

export function getConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_')
}

function snapshotToMessage(id: string, val: Record<string, unknown>): Message {
  return {
    id,
    senderId: val.senderId as string,
    text: val.text as string,
    timestamp: val.timestamp as number,
    edited: val.edited as boolean | undefined,
    editedAt: val.editedAt as number | undefined,
    deleted: val.deleted as boolean | undefined,
    fileUrl: val.fileUrl as string | undefined,
    fileName: val.fileName as string | undefined,
    fileType: val.fileType as string | undefined,
    fileSize: val.fileSize as number | undefined,
  }
}

export function useMessages(otherUid: Ref<string | null>) {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const auth = useAuthStore()
  const { incrementUnreadCount } = useUnreadCounts()

  let activeQueryRef: ReturnType<typeof query> | null = null
  let childUnsubscribes: Unsubscribe[] = []

  function cleanup() {
    // Clean up child listeners first
    for (const unsub of childUnsubscribes) {
      unsub()
    }
    childUnsubscribes = []

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
          .map(([id, val]) => snapshotToMessage(id, val as Record<string, unknown>))
          .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
      }
      loading.value = false

      // Register child listeners and track their unsubscribe functions
      childUnsubscribes.push(
        onChildAdded(messagesRef, (childSnapshot) => {
          if (!childSnapshot.key) return
          const msg = snapshotToMessage(childSnapshot.key, childSnapshot.val())
          if (!messages.value.some(m => m.id === msg.id)) {
            messages.value = [...messages.value, msg]
          }
        }),
        onChildChanged(messagesRef, (childSnapshot) => {
          if (!childSnapshot.key) return
          const updated = snapshotToMessage(childSnapshot.key, childSnapshot.val())
          messages.value = messages.value.map(m => m.id === updated.id ? updated : m)
        }),
      )
    }, { onlyOnce: true })
  }, { immediate: true })

  onUnmounted(() => cleanup())

  async function sendMessage(text: string) {
    if (!otherUid.value || !auth.currentUser) return
    error.value = null

    try {
      const conversationId = getConversationId(auth.currentUser.uid, otherUid.value)
      const messagesRef = dbRef(db, `messages/${conversationId}`)
      await push(messagesRef, {
        senderId: auth.currentUser.uid,
        text,
        timestamp: serverTimestamp(),
      })
      await incrementUnreadCount(otherUid.value, conversationId)
    } catch {
      error.value = 'Failed to send message.'
    }
  }

  async function sendFileMessage(file: { url: string; name: string; type: string; size: number }, caption?: string) {
    if (!otherUid.value || !auth.currentUser) return
    error.value = null

    try {
      const conversationId = getConversationId(auth.currentUser.uid, otherUid.value)
      const messagesRef = dbRef(db, `messages/${conversationId}`)
      await push(messagesRef, {
        senderId: auth.currentUser.uid,
        text: caption || file.name,
        timestamp: serverTimestamp(),
        fileUrl: file.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
      await incrementUnreadCount(otherUid.value, conversationId)
    } catch {
      error.value = 'Failed to send file.'
    }
  }

  async function editMessage(messageId: string, newText: string) {
    if (!otherUid.value || !auth.currentUser) return
    error.value = null

    try {
      const conversationId = getConversationId(auth.currentUser.uid, otherUid.value)
      const msgRef = dbRef(db, `messages/${conversationId}/${messageId}`)
      await update(msgRef, {
        text: newText,
        edited: true,
        editedAt: serverTimestamp(),
      })
    } catch {
      error.value = 'Failed to edit message.'
    }
  }

  async function deleteMessage(messageId: string) {
    if (!otherUid.value || !auth.currentUser) return
    error.value = null

    try {
      const conversationId = getConversationId(auth.currentUser.uid, otherUid.value)
      const msgRef = dbRef(db, `messages/${conversationId}/${messageId}`)
      await update(msgRef, {
        text: '',
        deleted: true,
      })
    } catch {
      error.value = 'Failed to delete message.'
    }
  }

  return { messages, loading, error, sendMessage, sendFileMessage, editMessage, deleteMessage, cleanup }
}
