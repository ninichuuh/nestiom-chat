import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')

function applyTheme(t: Theme) {
  const root = document.documentElement
  if (t === 'system') {
    root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
  } else {
    root.classList.toggle('dark', t === 'dark')
  }
}

// Apply immediately on module load
applyTheme(theme.value)

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (theme.value === 'system') applyTheme('system')
})

watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
})

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
  }

  function cycleTheme() {
    const order: Theme[] = ['light', 'dark', 'system']
    theme.value = order[(order.indexOf(theme.value) + 1) % order.length]!
  }

  return { theme, setTheme, cycleTheme }
}
