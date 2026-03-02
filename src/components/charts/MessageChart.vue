<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import type { HourlyStat } from '@/composables/useMessageStats'

const props = defineProps<{
  stats: HourlyStat[]
  totalMessages: number
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)

const margin = { top: 8, right: 8, bottom: 20, left: 28 }
const height = 100

onMounted(() => {
  renderChart()
  resizeObserver = new ResizeObserver(() => renderChart())
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

let resizeObserver: ResizeObserver | null = null
onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(() => props.stats, () => {
  if (svgRef.value && props.stats.length > 0) {
    renderChart()
  }
}, { deep: true })

function renderChart() {
  if (!svgRef.value || !containerRef.value) return

  const width = containerRef.value.clientWidth
  if (width === 0) return

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const g = svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand()
    .domain(props.stats.map(d => d.hour))
    .range([0, innerWidth])
    .padding(0.2)

  const maxCount = d3.max(props.stats, d => d.count) ?? 1
  const y = d3.scaleLinear()
    .domain([0, Math.max(maxCount, 1)])
    .range([innerHeight, 0])

  // X axis - show every 6th label
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(
      d3.axisBottom(x)
        .tickValues(props.stats.filter((_, i) => i % 6 === 0).map(d => d.hour))
        .tickSize(0)
    )
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', 'var(--color-muted-foreground)')
    .style('font-size', '9px')

  // Y axis
  g.append('g')
    .call(d3.axisLeft(y).ticks(3).tickSize(0).tickFormat(d3.format('d')))
    .call(g => g.select('.domain').remove())
    .selectAll('text')
    .style('fill', 'var(--color-muted-foreground)')
    .style('font-size', '9px')

  // Bars
  g.selectAll('.bar')
    .data(props.stats)
    .join('rect')
    .style('fill', 'var(--color-primary)')
    .style('opacity', 0.6)
    .attr('x', d => x(d.hour)!)
    .attr('y', d => y(d.count))
    .attr('width', x.bandwidth())
    .attr('height', d => innerHeight - y(d.count))
    .attr('rx', 2)
}
</script>

<template>
  <div ref="containerRef" class="border-b bg-muted/30 px-4 py-2">
    <div class="mb-1 flex items-center justify-between">
      <p class="text-xs text-muted-foreground">Messages (last 24h)</p>
      <p class="text-xs font-medium">{{ totalMessages }} total</p>
    </div>
    <svg ref="svgRef" class="w-full" :style="{ height: `${height}px` }" />
  </div>
</template>
