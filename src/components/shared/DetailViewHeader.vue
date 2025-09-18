<template>
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Back Navigation Button -->
          <button 
            @click="goBack" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
            :disabled="!showBackButton"
            v-if="showBackButton"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Title and Breadcrumb Section -->
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ title || 'Detail View' }}
            </h1>
            <p v-if="breadcrumb" class="text-gray-600 mt-1">
              {{ breadcrumb }}
            </p>
          </div>
        </div>

        <!-- Right Action Section -->
        <div class="flex items-center space-x-2">
          <!-- Alert/Risk Indicators Slot -->
          <slot name="alerts" />

          <!-- Action Buttons Slot -->
          <slot name="actions">
            <!-- Default Generate Report Button -->
            <button 
              @click="$emit('generate-report')"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Generate Report
            </button>
          </slot>
        </div>
      </div>

      <!-- Additional Header Content Slot -->
      <slot name="additional-content" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  breadcrumb: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: true
  },
  customBackAction: {
    type: Function,
    default: null
  }
})

const emit = defineEmits([
  'generate-report',
  'back-clicked'
])

const router = useRouter()

const goBack = () => {
  emit('back-clicked')
  
  if (props.customBackAction) {
    props.customBackAction()
  } else {
    router.go(-1)
  }
}
</script>

<style scoped>
/* Consistent header styling */
.bg-white {
  background-color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: transparent;
  color: inherit;
}

/* Ensure consistent button transitions */
button {
  transition: all 0.2s ease-in-out;
}
</style>