import { computed, type Ref } from 'vue'
import type { Message } from '@/composables/useMessages'

export interface HourlyStat {
  hour: string
  count: number
  timestamp: number
}

export function useMessageStats(messages: Ref<Message[]>) {
  const hourlyStats = computed<HourlyStat[]>(() => {
    const now = Date.now()
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000

    // Create 24 hourly buckets
    const buckets: HourlyStat[] = []
    for (let i = 23; i >= 0; i--) {
      const bucketTime = now - i * 60 * 60 * 1000
      const date = new Date(bucketTime)
      buckets.push({
        hour: date.toLocaleTimeString([], { hour: '2-digit', hour12: false }),
        count: 0,
        timestamp: bucketTime,
      })
    }

    // Count messages per bucket
    for (const msg of messages.value) {
      if (!msg.timestamp || msg.timestamp < twentyFourHoursAgo) continue

      const hoursAgo = Math.floor((now - msg.timestamp) / (60 * 60 * 1000))
      const bucketIndex = 23 - hoursAgo
      if (bucketIndex >= 0 && bucketIndex < 24) {
        buckets[bucketIndex]!.count++
      }
    }

    return buckets
  })

  const totalMessages = computed(() =>
    hourlyStats.value.reduce((sum, s) => sum + s.count, 0)
  )

  return { hourlyStats, totalMessages }
}
