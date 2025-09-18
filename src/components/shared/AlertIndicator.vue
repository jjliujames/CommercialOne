<template>
  <button 
    v-if="totalAlerts > 0"
    @click="$emit('click')"
    class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
    :class="alertButtonClass"
  >
    <!-- Alert Icon -->
    <span class="text-lg">{{ alertIcon }}</span>
    
    <!-- Alert Text -->
    <span>
      {{ totalAlerts }} {{ getPluralizedAlertType }}
    </span>
    
    <!-- Critical Alert Pulse Indicator -->
    <div 
      v-if="hasCriticalAlerts" 
      class="w-2 h-2 rounded-full animate-pulse"
      :class="pulseColor"
    ></div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Alert counts by severity
  criticalCount: {
    type: Number,
    default: 0
  },
  highCount: {
    type: Number,
    default: 0
  },
  mediumCount: {
    type: Number,
    default: 0
  },
  lowCount: {
    type: Number,
    default: 0
  },
  
  // Alert configuration
  alertType: {
    type: String,
    default: 'Alert' // 'Alert', 'Risk', 'Flag', etc.
  },
  showIfEmpty: {
    type: Boolean,
    default: false
  },
  
  // Custom styling
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// Computed properties
const totalAlerts = computed(() => {
  return props.criticalCount + props.highCount + props.mediumCount + props.lowCount
})

const hasCriticalAlerts = computed(() => {
  return props.criticalCount > 0
})

const highestSeverity = computed(() => {
  if (props.criticalCount > 0) return 'critical'
  if (props.highCount > 0) return 'high'
  if (props.mediumCount > 0) return 'medium'
  if (props.lowCount > 0) return 'low'
  return 'none'
})

const alertButtonClass = computed(() => {
  const baseClasses = 'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  const severityClasses = getSeverityClasses(highestSeverity.value)
  return `${baseClasses} ${severityClasses} ${props.customClass}`
})

const alertIcon = computed(() => {
  const iconMap = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: 'ℹ️',
    none: 'ℹ️'
  }
  return iconMap[highestSeverity.value]
})

const pulseColor = computed(() => {
  const colorMap = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  }
  return colorMap[highestSeverity.value] || 'bg-red-500'
})

const getPluralizedAlertType = computed(() => {
  // If alertType already ends with 's' or is already plural, don't add another 's'
  if (totalAlerts.value === 1) {
    // For singular, remove 's' if it's already plural
    return props.alertType.endsWith('s') && props.alertType !== 'Status' 
      ? props.alertType.slice(0, -1) 
      : props.alertType
  } else {
    // For plural, add 's' only if it doesn't already end with 's'
    return props.alertType.endsWith('s') 
      ? props.alertType 
      : props.alertType + 's'
  }
})

// Helper functions
const getSeverityClasses = (severity) => {
  const classMap = {
    critical: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 border border-red-200',
    high: 'bg-orange-100 text-orange-700 hover:bg-orange-200 focus:ring-orange-500 border border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500 border border-yellow-200',
    low: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500 border border-blue-200',
    none: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200'
  }
  return classMap[severity] || classMap.none
}
</script>

<style scoped>
/* Pulse animation for critical alerts */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Button hover and focus states */
button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

button:hover {
  transform: translateY(-1px);
}

button:focus {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>