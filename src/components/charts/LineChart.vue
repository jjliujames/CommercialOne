<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" v-if="hasData"></canvas>
    <div v-else class="flex items-center justify-center h-full text-gray-500">
      <span>No data available</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const chartCanvas = ref(null)
let chart = null

// Computed
const hasData = computed(() => {
  return props.data && props.data.labels && props.data.labels.length > 0
})

// Methods
const createChart = () => {
  try {
    const ctx = chartCanvas.value?.getContext('2d')
    if (!ctx) return

    chart = new ChartJS(ctx, {
      type: 'line',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              color: '#f3f4f6'
            }
          }
        },
        ...props.options
      }
    })
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

// Watchers
watch(() => props.data, () => {
  if (chart) {
    chart.destroy()
  }
  if (hasData.value) {
    nextTick(() => {
      createChart()
    })
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  if (hasData.value) {
    createChart()
  }
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>