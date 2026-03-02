<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { usePresence } from '@/composables/usePresence'
import type { ChatUser } from '@/composables/useUsers'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LogOut, MessageCircle, ArrowLeft } from 'lucide-vue-next'
import UserList from '@/components/users/UserList.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'

const router = useRouter()
const auth = useAuthStore()
const { logout } = useAuth()
const { setupPresence, cleanupPresence } = usePresence()

// Initialize presence tracking when chat view mounts
setupPresence()

const selectedUser = ref<ChatUser | null>(null)
const sidebarOpen = ref(false)

// On mobile, show sidebar when no user selected, show chat when user selected
const showSidebar = computed(() => !selectedUser.value || sidebarOpen.value)

function handleSelectUser(user: ChatUser) {
  selectedUser.value = user
  sidebarOpen.value = false
}

function handleBack() {
  selectedUser.value = null
  sidebarOpen.value = false
}

async function handleLogout() {
  cleanupPresence()
  selectedUser.value = null
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
      class="flex w-full flex-col border-r bg-sidebar-background md:w-80"
      :class="{ 'hidden md:flex': !showSidebar }"
    >
      <!-- Sidebar header -->
      <div class="flex items-center gap-2 px-4 py-3">
        <MessageCircle class="h-5 w-5 text-sidebar-primary" />
        <h1 class="text-lg font-semibold text-sidebar-foreground">Nestiom Chat</h1>
      </div>
      <Separator />

      <!-- User list -->
      <div class="flex-1 overflow-hidden">
        <UserList :selected-uid="selectedUser?.uid" @select="handleSelectUser" />
      </div>

      <Separator />

      <!-- Sidebar footer -->
      <div class="flex items-center justify-between px-4 py-3">
        <p class="truncate text-sm text-sidebar-foreground">
          {{ auth.currentUser?.email }}
        </p>
        <Button variant="ghost" size="icon" @click="handleLogout" title="Sign out">
          <LogOut class="h-4 w-4" />
        </Button>
      </div>
    </aside>

    <!-- Chat panel -->
    <main
      class="hidden flex-1 flex-col md:flex"
      :class="{ 'flex !flex': selectedUser && !sidebarOpen }"
    >
      <!-- Mobile back button -->
      <div v-if="selectedUser" class="flex items-center gap-2 border-b px-2 py-2 md:hidden">
        <Button variant="ghost" size="icon" @click="handleBack">
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <span class="text-sm font-medium">Back</span>
      </div>
      <div class="flex-1 overflow-hidden">
        <ChatPanel :selected-user="selectedUser" />
      </div>
    </main>
  </div>
</template>
