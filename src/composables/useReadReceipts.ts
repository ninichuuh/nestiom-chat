import { ref, watch, onUnmounted, type Ref } from 'vue'
import {
  ref as dbRef,
  onValue,
  set,
  off,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

export function useReadReceipts(conversationId: Ref<string | null>) {
  const auth = useAuthStore()
  const otherUserLastReadTimestamp = ref<number | null>(null)
  let activeRef: ReturnType<typeof dbRef> | null = null

  function cleanup() {
    if (activeRef) {
      off(activeRef)
      activeRef = null
    }
    otherUserLastReadTimestamp.value = null
  }

  watch(conversationId, (newId) => {
    cleanup()
    if (!newId || !auth.currentUser) return

    // Extract the other user's UID from the conversation ID
    const parts = newId.split('_')
    const otherUid = parts.find(p => p !== auth.currentUser!.uid)
    if (!otherUid) return

    const receiptRef = dbRef(db, `readReceipts/${newId}/${otherUid}`)
    activeRef = receiptRef

    onValue(receiptRef, (snapshot) => {
      const data = snapshot.val()
      otherUserLastReadTimestamp.value = data?.lastReadTimestamp ?? null
    })
  }, { immediate: true })

  onUnmounted(cleanup)

  async function markAsRead(messageId: string, timestamp: number) {
    if (!conversationId.value || !auth.currentUser) return
    const receiptRef = dbRef(db, `readReceipts/${conversationId.value}/${auth.currentUser.uid}`)
    await set(receiptRef, {
      lastReadMessageId: messageId,
      lastReadTimestamp: timestamp,
    })
  }

  function getMessageStatus(message: { senderId: string; timestamp: number }): 'sent' | 'read' {
    if (!auth.currentUser || message.senderId !== auth.currentUser.uid) return 'sent'
    if (otherUserLastReadTimestamp.value && message.timestamp <= otherUserLastReadTimestamp.value) {
      return 'read'
    }
    return 'sent'
  }

  return { otherUserLastReadTimestamp, markAsRead, getMessageStatus }
}
