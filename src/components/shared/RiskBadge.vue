<template>
  <span 
    class="px-2 py-1 text-xs font-medium rounded-full transition-all duration-200"
    :class="[badgeClass, { 'cursor-pointer hover:shadow-md': clickable }]"
    @click="handleClick"
  >
    <!-- Optional Icon -->
    <span v-if="icon" class="mr-1">{{ icon }}</span>
    
    <!-- Badge Content -->
    <slot>
      {{ displayValue }}
    </slot>
    
    <!-- Optional Score/Value -->
    <span v-if="showScore && score" class="ml-1 opacity-75">
      ({{ score }})
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Risk/Badge value
  value: {
    type: [String, Number],
    required: true
  },
  
  // Badge type determines styling
  type: {
    type: String,
    default: 'risk',
    validator: (value) => ['risk', 'tier', 'status', 'category', 'score'].includes(value)
  },
  
  // Risk level for automatic color mapping
  level: {
    type: String,
    default: null,
    validator: (value) => !value || ['low', 'medium', 'high', 'critical'].includes(value.toLowerCase())
  },
  
  // Manual color override
  color: {
    type: String,
    default: null,
    validator: (value) => !value || ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'].includes(value)
  },
  
  // Additional score display
  score: {
    type: [String, Number],
    default: null
  },
  showScore: {
    type: Boolean,
    default: false
  },
  
  // Icon
  icon: {
    type: String,
    default: null
  },
  
  // Interactivity
  clickable: {
    type: Boolean,
    default: false
  },
  
  // Size variant
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['click'])

// Computed properties
const displayValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value
  }
  
  // Handle numeric risk scores
  if (props.type === 'score' && typeof props.value === 'number') {
    return props.value.toFixed(1)
  }
  
  return String(props.value)
})

const determinedLevel = computed(() => {
  if (props.level) {
    return props.level.toLowerCase()
  }
  
  // Auto-determine level based on value for risk scores
  if (props.type === 'score' && typeof props.value === 'number') {
    if (props.value >= 8) return 'critical'
    if (props.value >= 6) return 'high'
    if (props.value >= 4) return 'medium'
    return 'low'
  }
  
  // Auto-determine based on common risk keywords
  const valueStr = String(props.value).toLowerCase()
  if (valueStr.includes('critical') || valueStr.includes('severe')) return 'critical'
  if (valueStr.includes('high') || valueStr.includes('major')) return 'high'
  if (valueStr.includes('medium') || valueStr.includes('moderate')) return 'medium'
  if (valueStr.includes('low') || valueStr.includes('minor')) return 'low'
  
  return 'medium' // default
})

const badgeClass = computed(() => {
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }
  
  const baseClass = sizeClasses[props.size] || sizeClasses.sm
  const colorClass = getColorClass()
  
  return `${baseClass} ${colorClass}`
})

// Helper functions
const getColorClass = () => {
  // Manual color override
  if (props.color) {
    return getColorClassByName(props.color)
  }
  
  // Type-specific coloring
  switch (props.type) {
    case 'risk':
      return getRiskColorClass(determinedLevel.value)
    case 'tier':
      return getTierColorClass(props.value)
    case 'status':
      return getStatusColorClass(props.value)
    case 'score':
      return getRiskColorClass(determinedLevel.value)
    default:
      return getRiskColorClass(determinedLevel.value)
  }
}

const getRiskColorClass = (level) => {
  const classMap = {
    critical: 'bg-red-100 text-red-800 border border-red-200',
    high: 'bg-orange-100 text-orange-800 border border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    low: 'bg-green-100 text-green-800 border border-green-200'
  }
  return classMap[level] || classMap.medium
}

const getTierColorClass = (tier) => {
  const tierStr = String(tier).toLowerCase()
  if (tierStr.includes('premium') || tierStr.includes('platinum')) {
    return 'bg-purple-100 text-purple-800 border border-purple-200'
  }
  if (tierStr.includes('gold') || tierStr.includes('preferred')) {
    return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  }
  if (tierStr.includes('silver') || tierStr.includes('standard')) {
    return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return 'bg-blue-100 text-blue-800 border border-blue-200'
}

const getStatusColorClass = (status) => {
  const statusStr = String(status).toLowerCase()
  if (statusStr.includes('active') || statusStr.includes('approved')) {
    return 'bg-green-100 text-green-800 border border-green-200'
  }
  if (statusStr.includes('pending') || statusStr.includes('review')) {
    return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  }
  if (statusStr.includes('inactive') || statusStr.includes('rejected')) {
    return 'bg-red-100 text-red-800 border border-red-200'
  }
  return 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getColorClassByName = (colorName) => {
  const classMap = {
    red: 'bg-red-100 text-red-800 border border-red-200',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    gray: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return classMap[colorName] || classMap.gray
}

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.value)
  }
}
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
span {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects for clickable badges */
.cursor-pointer:hover {
  transform: translateY(-1px);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>