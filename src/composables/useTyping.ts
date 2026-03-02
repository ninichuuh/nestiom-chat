import { ref, watch, onUnmounted, type Ref } from 'vue'
import {
  ref as dbRef,
  set,
  remove,
  onValue,
  off,
  onDisconnect,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const TYPING_TIMEOUT = 3000

export function useTyping(conversationId: Ref<string | null>) {
  const auth = useAuthStore()
  const isOtherUserTyping = ref(false)

  let typingTimeout: ReturnType<typeof setTimeout> | null = null
  let currentTypingRef: ReturnType<typeof dbRef> | null = null
  let currentListenerRef: ReturnType<typeof dbRef> | null = null

  function cleanupTyping() {
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      typingTimeout = null
    }
    if (currentTypingRef) {
      remove(currentTypingRef)
      currentTypingRef = null
    }
    if (currentListenerRef) {
      off(currentListenerRef)
      currentListenerRef = null
    }
    isOtherUserTyping.value = false
  }

  function setTyping(isTyping: boolean) {
    if (!conversationId.value || !auth.currentUser) return

    const uid = auth.currentUser.uid
    const typingRef = dbRef(db, `typing/${conversationId.value}/${uid}`)
    currentTypingRef = typingRef

    if (isTyping) {
      set(typingRef, true)
      onDisconnect(typingRef).remove()

      // Auto-clear after timeout
      if (typingTimeout) clearTimeout(typingTimeout)
      typingTimeout = setTimeout(() => {
        remove(typingRef)
      }, TYPING_TIMEOUT)
    } else {
      remove(typingRef)
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        typingTimeout = null
      }
    }
  }

  // Watch for conversation changes to listen to other user's typing
  watch(conversationId, (newId) => {
    cleanupTyping()

    if (!newId || !auth.currentUser) return

    const uid = auth.currentUser.uid
    // Find the other user's UID from the conversation ID
    const uids = newId.split('_')
    const otherUid = uids.find(id => id !== uid)
    if (!otherUid) return

    const otherTypingRef = dbRef(db, `typing/${newId}/${otherUid}`)
    currentListenerRef = otherTypingRef

    onValue(otherTypingRef, (snapshot) => {
      isOtherUserTyping.value = snapshot.val() === true
    })
  }, { immediate: true })

  onUnmounted(() => {
    cleanupTyping()
  })

  return { isOtherUserTyping, setTyping }
}
