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
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    LineController
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarController,
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
            type: 'bar',
            data: props.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            generateLabels: function (chart) {
                                const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                                const labels = original.call(this, chart);

                                // Group labels by type
                                const inflowLabels = labels.filter(label =>
                                    ['Cash Deposits', 'Check Deposits', 'ACH In', 'Wire In'].includes(label.text)
                                );
                                const outflowLabels = labels.filter(label =>
                                    ['Cash Withdrawals', 'Check Payments', 'ACH Out', 'Wire Out'].includes(label.text)
                                );
                                const otherLabels = labels.filter(label =>
                                    !['Cash Deposits', 'Check Deposits', 'ACH In', 'Wire In',
                                        'Cash Withdrawals', 'Check Payments', 'ACH Out', 'Wire Out'].includes(label.text)
                                );

                                return [...inflowLabels, ...outflowLabels, ...otherLabels];
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.yAxisID === 'y1') {
                                    label += context.parsed.y + 'th percentile';
                                } else {
                                    label += '$' + Math.abs(context.parsed.y) + 'M';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        title: {
                            display: true,
                            text: 'Transaction Volume ($M)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value + 'M';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 70,
                        max: 100,
                        grid: {
                            drawOnChartArea: false,
                        },
                        title: {
                            display: true,
                            text: 'Risk Percentile'
                        },
                        ticks: {
                            callback: function (value) {
                                return value + 'th';
                            }
                        }
                    },
                    x: {
                        stacked: true,
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