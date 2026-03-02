import { ref } from 'vue'

const enabled = ref(localStorage.getItem('notifications') !== 'false')

// Generate a short notification chime using Web Audio API
function playChime() {
  try {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(830, ctx.currentTime)
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)

    oscillator.onended = () => ctx.close()
  } catch {
    // Audio not available
  }
}

export function useNotifications() {
  function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  function notifyNewMessage(senderName: string, text: string) {
    if (!enabled.value) return

    // Play sound
    playChime()

    // Browser notification only when tab is not visible
    if (document.visibilityState !== 'visible') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(senderName, {
          body: text.length > 100 ? text.slice(0, 97) + '...' : text,
          tag: 'nestiom-chat',
        })
      }
    }
  }

  function toggle() {
    enabled.value = !enabled.value
    localStorage.setItem('notifications', String(enabled.value))
  }

  return { enabled, toggle, requestPermission, notifyNewMessage }
}
