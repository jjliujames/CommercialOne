<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <slot name="header" />

    <!-- Main Content Area -->
    <div class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Left Column - Profile, Contacts, Risk Summary -->
        <div class="lg:col-span-1 space-y-4">
          <slot name="left-column" />
        </div>

        <!-- Right Column - Analytics and Content -->
        <div class="lg:col-span-3 space-y-6">
          <slot name="right-column" />
        </div>
      </div>
    </div>

    <!-- Modal/Overlay Section -->
    <slot name="modals" />
  </div>
</template>

<script setup>
// Base detail view component that provides consistent layout structure
// Used by RelationshipView, ClientDetailView, and other detail components

defineProps({
  // Optional props for layout customization
  leftColumnClass: {
    type: String,
    default: 'lg:col-span-1 space-y-4'
  },
  rightColumnClass: {
    type: String,
    default: 'lg:col-span-3 space-y-6'
  },
  contentPadding: {
    type: String,
    default: 'p-8'
  },
  gridGap: {
    type: String,
    default: 'gap-8'
  }
})
</script>

<style scoped>
/* Consistent responsive breakpoints and spacing */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Ensure consistent scrolling behavior */
.min-h-screen {
  min-height: 100vh;
}
</style>