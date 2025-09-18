<template>
  <div class="text-center" :class="containerClass">
    <!-- Main Value Display -->
    <div 
      class="text-xl font-bold transition-all duration-300" 
      :class="[valueColorClass, { 'hover:scale-105 cursor-pointer': clickable }]"
      @click="handleClick"
    >
      <slot name="value">
        {{ formattedValue }}
      </slot>
    </div>

    <!-- Label -->
    <div class="text-xs text-gray-600 mt-1">
      {{ label }}
    </div>

    <!-- Percentile Information -->
    <div 
      v-if="percentile" 
      class="text-xs font-medium mt-1"
      :class="percentileColorClass"
    >
      {{ percentile }}{{ getOrdinalSuffix(extractPercentile(percentile)) }} percentile
    </div>

    <!-- Delta/Change Information -->
    <div v-if="delta !== null" class="text-xs font-medium mt-1" :class="deltaColorClass">
      {{ deltaPrefix }}{{ Math.abs(delta) }}{{ deltaSuffix }}
    </div>

    <!-- Additional Info Slot -->
    <slot name="additional-info" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Core properties
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  
  // Formatting options
  formatType: {
    type: String,
    default: 'text', // 'currency', 'number', 'percentage', 'text'
    validator: (value) => ['currency', 'number', 'percentage', 'text'].includes(value)
  },
  
  // Color options
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'orange', 'purple', 'cyan', 'indigo', 'red', 'yellow', 'pink'].includes(value)
  },
  
  // Percentile information
  percentile: {
    type: [String, Number],
    default: null
  },
  
  // Delta/change information
  delta: {
    type: Number,
    default: null
  },
  deltaType: {
    type: String,
    default: 'percentage', // 'percentage', 'absolute', 'points'
    validator: (value) => ['percentage', 'absolute', 'points'].includes(value)
  },
  
  // Interactivity
  clickable: {
    type: Boolean,
    default: false
  },
  
  // Styling
  containerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// Value formatting
const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  const numValue = Number(props.value)
  
  switch (props.formatType) {
    case 'currency':
      return formatCurrency(numValue)
    case 'number':
      return numValue.toLocaleString()
    case 'percentage':
      return `${numValue}%`
    default:
      return props.value
  }
})

// Color classes
const valueColorClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    cyan: 'text-cyan-600',
    indigo: 'text-indigo-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600'
  }
  return colorMap[props.color] || 'text-gray-900'
})

const percentileColorClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    cyan: 'text-cyan-500',
    indigo: 'text-indigo-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    pink: 'text-pink-500'
  }
  return colorMap[props.color] || 'text-gray-500'
})

// Delta formatting
const deltaColorClass = computed(() => {
  if (props.delta === null) return ''
  return props.delta >= 0 ? 'text-green-500' : 'text-red-500'
})

const deltaPrefix = computed(() => {
  if (props.delta === null) return ''
  return props.delta >= 0 ? '+' : ''
})

const deltaSuffix = computed(() => {
  switch (props.deltaType) {
    case 'percentage':
      return '% YoY'
    case 'points':
      return ' pts'
    case 'absolute':
      return ''
    default:
      return ''
  }
})

// Utility functions
const formatCurrency = (value) => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(0)}K`
  } else {
    return `$${value.toLocaleString()}`
  }
}

const getOrdinalSuffix = (num) => {
  const lastDigit = num % 10
  const lastTwoDigits = num % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th'
  }
  
  switch (lastDigit) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

const extractPercentile = (percentileStr) => {
  if (typeof percentileStr === 'number') return percentileStr
  return parseInt(percentileStr) || 0
}

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
/* Smooth transitions for interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects for clickable cards */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.cursor-pointer {
  cursor: pointer;
}
</style>