<template>
    <div class="sparkline-container">
        <canvas ref="sparklineCanvas" v-if="hasData"></canvas>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController
)

const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    color: {
        type: String,
        default: '#10B981'
    },
    fillColor: {
        type: String,
        default: 'rgba(16, 185, 129, 0.1)'
    }
})

const sparklineCanvas = ref(null)
const chart = ref(null)

const hasData = computed(() => {
    return props.data && props.data.length > 0
})

const createSparkline = () => {
    try {
        const ctx = sparklineCanvas.value?.getContext('2d')
        if (!ctx) return

        chart.value = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: props.data.map((_, index) => index),
                datasets: [{
                    data: props.data,
                    borderColor: props.color,
                    backgroundColor: props.fillColor,
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        })
    } catch (error) {
        console.error('Error creating sparkline:', error)
    }
}

onMounted(() => {
    if (hasData.value) {
        createSparkline()
    }
})

onBeforeUnmount(() => {
    if (chart.value) {
        chart.value.destroy()
    }
})

watch(() => props.data, () => {
    if (chart.value) {
        chart.value.destroy()
    }
    if (hasData.value) {
        nextTick(() => {
            createSparkline()
        })
    }
}, { deep: true })
</script>

<style scoped>
.sparkline-container {
    width: 60px;
    height: 20px;
}
</style>