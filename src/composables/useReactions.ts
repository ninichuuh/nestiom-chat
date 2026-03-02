import { ref, watch, onUnmounted, type Ref } from 'vue'
import {
  ref as dbRef,
  onValue,
  set,
  remove,
  off,
} from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

export const REACTION_EMOJIS = [
  { key: 'thumbsup', emoji: '👍' },
  { key: 'heart', emoji: '❤️' },
  { key: 'laugh', emoji: '😂' },
  { key: 'surprised', emoji: '😮' },
  { key: 'sad', emoji: '😢' },
  { key: 'fire', emoji: '🔥' },
] as const

export type ReactionKey = (typeof REACTION_EMOJIS)[number]['key']

export interface MessageReactions {
  [emoji: string]: string[] // emoji key -> array of uids
}

export function useReactions(conversationId: Ref<string | null>) {
  const auth = useAuthStore()
  // reactions[messageId] = { emoji: [uid1, uid2] }
  const reactionsMap = ref<Record<string, MessageReactions>>({})
  let activeRef: ReturnType<typeof dbRef> | null = null

  function cleanup() {
    if (activeRef) {
      off(activeRef)
      activeRef = null
    }
    reactionsMap.value = {}
  }

  watch(conversationId, (newId) => {
    cleanup()
    if (!newId) return

    const reactionsRef = dbRef(db, `reactions/${newId}`)
    activeRef = reactionsRef

    onValue(reactionsRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        reactionsMap.value = {}
        return
      }

      const map: Record<string, MessageReactions> = {}
      for (const [messageId, emojis] of Object.entries(data)) {
        map[messageId] = {}
        for (const [emoji, uids] of Object.entries(emojis as Record<string, Record<string, boolean>>)) {
          map[messageId]![emoji] = Object.keys(uids)
        }
      }
      reactionsMap.value = map
    })
  }, { immediate: true })

  onUnmounted(cleanup)

  async function toggleReaction(messageId: string, emoji: ReactionKey) {
    if (!conversationId.value || !auth.currentUser) return
    const uid = auth.currentUser.uid
    const path = `reactions/${conversationId.value}/${messageId}/${emoji}/${uid}`
    const reactionRef = dbRef(db, path)

    const currentReactions = reactionsMap.value[messageId]?.[emoji] ?? []
    if (currentReactions.includes(uid)) {
      await remove(reactionRef)
    } else {
      await set(reactionRef, true)
    }
  }

  function getReactions(messageId: string): MessageReactions {
    return reactionsMap.value[messageId] ?? {}
  }

  return { reactionsMap, toggleReaction, getReactions }
}
