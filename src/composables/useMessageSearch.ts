import { ref, computed, type Ref } from 'vue'
import type { Message } from './useMessages'

export function useMessageSearch(messages: Ref<Message[]>) {
  const searchQuery = ref('')
  const isSearchOpen = ref(false)
  const currentResultIndex = ref(0)

  const searchResults = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return []
    return messages.value.filter(m => !m.deleted && m.text.toLowerCase().includes(q))
  })

  const currentResult = computed(() => {
    if (searchResults.value.length === 0) return null
    return searchResults.value[currentResultIndex.value] ?? null
  })

  function nextResult() {
    if (searchResults.value.length === 0) return
    currentResultIndex.value = (currentResultIndex.value + 1) % searchResults.value.length
  }

  function prevResult() {
    if (searchResults.value.length === 0) return
    currentResultIndex.value = (currentResultIndex.value - 1 + searchResults.value.length) % searchResults.value.length
  }

  function openSearch() {
    isSearchOpen.value = true
    searchQuery.value = ''
    currentResultIndex.value = 0
  }

  function closeSearch() {
    isSearchOpen.value = false
    searchQuery.value = ''
    currentResultIndex.value = 0
  }

  return {
    searchQuery,
    isSearchOpen,
    searchResults,
    currentResult,
    currentResultIndex,
    nextResult,
    prevResult,
    openSearch,
    closeSearch,
  }
}
