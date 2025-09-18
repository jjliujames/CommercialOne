<template>
  <div class="relative inline-block">
    <div 
      class="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
      :class="dotClasses"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <div class="w-3 h-3 rounded-full" :class="innerDotClasses"></div>
    </div>
    
    <!-- Tooltip -->
    <div 
      v-if="showTooltip && tooltipData"
      class="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 bottom-full mb-2 left-1/2 transform -translate-x-1/2"
    >
      <div class="text-sm font-semibold text-gray-900 mb-2">{{ productName }}</div>
      
      <div v-if="tooltipData.hasProduct || tooltipData.isRecommended" class="space-y-2">
        <!-- Summary Stats -->
        <div class="text-xs text-gray-600">
          <span class="font-medium">{{ tooltipData.clientCount }}</span> of 
          <span class="font-medium">{{ tooltipData.totalClients }}</span> clients have this product
          <span v-if="tooltipData.isRecommended" class="ml-1">
            ({{ tooltipData.recommendedCount }} recommended)
          </span>
        </div>
        
        <div v-if="tooltipData.hasProduct" class="text-xs text-gray-600">
          Total Balance: <span class="font-medium text-green-600">{{ formatCurrency(tooltipData.totalBalance) }}</span>
        </div>
        
        <div v-if="tooltipData.hasProduct" class="text-xs text-gray-600">
          Total Revenue: <span class="font-medium text-blue-600">{{ formatCurrency(tooltipData.totalRevenue) }}</span>
        </div>
        
        <!-- Clients with Product -->
        <div v-if="tooltipData.hasProduct && tooltipData.clients.length > 0" class="border-t border-gray-200 pt-2 mt-2">
          <div class="text-xs font-medium text-gray-700 mb-1">
            <span class="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
            Clients with this product:
          </div>
          <div class="space-y-1 max-h-24 overflow-y-auto">
            <div 
              v-for="client in tooltipData.clients" 
              :key="client.id"
              class="flex justify-between items-center text-xs"
            >
              <span class="text-gray-700">{{ client.name }}</span>
              <div class="flex space-x-2">
                <span class="text-green-600">{{ formatCurrency(client.balance) }}</span>
                <span class="text-blue-600">{{ formatCurrency(client.revenue) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Clients -->
        <div v-if="tooltipData.isRecommended && tooltipData.recommendedClients.length > 0" class="border-t border-gray-200 pt-2 mt-2">
          <div class="text-xs font-medium text-gray-700 mb-1">
            <span class="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
            Recommended clients:
          </div>
          <div class="space-y-1 max-h-24 overflow-y-auto">
            <div 
              v-for="client in tooltipData.recommendedClients" 
              :key="client.id"
              class="text-xs text-gray-700"
            >
              {{ client.name }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-xs text-gray-500">
        No clients in this relationship have or are recommended for this product
      </div>
      
      <!-- Tooltip arrow -->
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['has', 'has-recommended', 'recommended', 'none'].includes(value)
  },
  productName: {
    type: String,
    required: true
  },
  tooltipData: {
    type: Object,
    default: null
  }
})

const showTooltip = ref(false)

const dotClasses = computed(() => {
  const baseClasses = 'border-2 hover:scale-110'
  
  switch (props.status) {
    case 'has':
      return `${baseClasses} bg-green-100 border-green-500`
    case 'has-recommended':
      return `${baseClasses} bg-gradient-to-r from-green-100 to-blue-100 border-green-500`
    case 'recommended':
      return `${baseClasses} bg-blue-100 border-blue-500`
    case 'none':
    default:
      return `${baseClasses} bg-gray-100 border-gray-400`
  }
})

const innerDotClasses = computed(() => {
  switch (props.status) {
    case 'has':
      return 'bg-green-500'
    case 'has-recommended':
      return 'bg-gradient-to-r from-green-500 to-blue-500'
    case 'recommended':
      return 'bg-blue-500'
    case 'none':
    default:
      return 'bg-gray-400'
  }
})

// Utility function for currency formatting
const formatCurrency = (value) => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(0)}K`
  } else {
    return `$${value?.toLocaleString() || 0}`
  }
}
</script>

<style scoped>
/* Additional hover animations */
.cursor-pointer:hover {
  transform: scale(1.1);
}
</style>