import { ref, computed, onUnmounted } from 'vue'
import { ref as dbRef, onValue, off } from 'firebase/database'
import { db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

export interface ChatUser {
  uid: string
  displayName: string
  email: string
  createdAt: number
}

export function useUsers() {
  const users = ref<ChatUser[]>([])
  const loading = ref(true)

  const auth = useAuthStore()

  const otherUsers = computed(() =>
    users.value
      .filter(u => u.uid !== auth.currentUser?.uid)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  )

  const usersRef = dbRef(db, 'users')
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      users.value = Object.entries(data).map(([uid, val]) => ({
        uid,
        ...(val as Omit<ChatUser, 'uid'>),
      }))
    } else {
      users.value = []
    }
    loading.value = false
  })

  onUnmounted(() => {
    off(usersRef)
  })

  return { users: otherUsers, loading }
}
