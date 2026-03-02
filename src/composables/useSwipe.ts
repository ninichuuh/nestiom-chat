import { onMounted, onUnmounted, type Ref } from 'vue'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipe(el: Ref<HTMLElement | null>, options: SwipeOptions) {
  const threshold = options.threshold ?? 50
  let startX = 0
  let startY = 0

  function handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    if (!touch) return
    startX = touch.clientX
    startY = touch.clientY
  }

  function handleTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0]
    if (!touch) return
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY

    // Only trigger horizontal swipe if horizontal movement > vertical
    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) < Math.abs(deltaY)) return

    if (deltaX > 0) {
      options.onSwipeRight?.()
    } else {
      options.onSwipeLeft?.()
    }
  }

  onMounted(() => {
    el.value?.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.value?.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    el.value?.removeEventListener('touchstart', handleTouchStart)
    el.value?.removeEventListener('touchend', handleTouchEnd)
  })
}
