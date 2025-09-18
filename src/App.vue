<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-td-green">TD Bank</h1>
            </div>
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link to="/" class="px-3 py-2 rounded-md text-sm font-medium hover:text-td-green"
                :class="{ 'text-td-green border-b-2 border-td-green': $route.name === 'Landing' }">
                Regional VP Dashboard
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Search Component -->
            <div class="relative">
              <!-- Search Icon Button (collapsed state) -->
              <button 
                v-if="!searchExpanded" 
                @click="expandSearch"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Search clients"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>

              <!-- Expanded Search Bar -->
              <div v-if="searchExpanded" class="flex items-center">
                <div class="relative">
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    @input="handleSearch"
                    @keydown.escape="collapseSearch"
                    @keydown.enter="selectFirstResult"
                    @blur="handleBlur"
                    type="text"
                    placeholder="Search clients..."
                    class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-td-green focus:border-transparent text-sm"
                  />
                  <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
                <!-- Close Button -->
                <button 
                  @click="collapseSearch"
                  class="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Close search"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Search Results Dropdown -->
              <div 
                v-if="searchExpanded && searchResults.length > 0" 
                class="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                <div class="py-2">
                  <div
                    v-for="(result, index) in searchResults"
                    :key="result.id"
                    @click="selectClient(result)"
                    class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    :class="{ 'bg-gray-50': index === selectedIndex }"
                  >
                    <div>
                      <div class="font-medium text-gray-900">{{ result.name }}</div>
                      <div class="text-sm text-gray-500">{{ result.industry }} • {{ result.relationship }}</div>
                    </div>
                    <div class="text-right text-sm">
                      <div class="font-medium text-gray-900">{{ result.totalValue }}</div>
                      <div class="text-xs text-gray-500">{{ result.accounts }} accounts</div>
                    </div>
                  </div>
                </div>
                
                <!-- No Results -->
                <div v-if="searchQuery && searchResults.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                  No clients found for "{{ searchQuery }}"
                </div>
              </div>
            </div>

            <span class="text-sm text-emerald-600 font-bold">Commercial One</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- AI Chat Assistant - Available across all views -->
    <AIChat />
  </div>
</template>

<script>
import AIChat from './components/AIChat.vue'

export default {
  name: 'App',
  components: {
    AIChat
  },
  data() {
    return {
      searchExpanded: false,
      searchQuery: '',
      selectedIndex: -1,
      searchResults: [],
      // Mock client data for search
      allClients: [
        {
          id: 1,
          name: 'Johnson Manufacturing Group',
          industry: 'Manufacturing',
          relationship: 'Sarah Johnson',
          totalValue: '$8.2M',
          accounts: 5,
          route: '/relationship/1/client/1'
        },
        {
          id: 2,
          name: 'TechCorp Solutions',
          industry: 'Technology',
          relationship: 'Sarah Johnson',
          totalValue: '$6.8M',
          accounts: 3,
          route: '/relationship/2/client/2'
        },
        {
          id: 3,
          name: 'Metro Construction LLC',
          industry: 'Construction',
          relationship: 'Sarah Johnson',
          totalValue: '$5.1M',
          accounts: 4,
          route: '/relationship/3/client/3'
        },
        {
          id: 4,
          name: 'Global Retail Enterprises',
          industry: 'Retail',
          relationship: 'Sarah Johnson',
          totalValue: '$4.2M',
          accounts: 6,
          route: '/relationship/4/client/4'
        },
        {
          id: 5,
          name: 'Pacific Energy Holdings',
          industry: 'Energy',
          relationship: 'Sarah Johnson',
          totalValue: '$3.8M',
          accounts: 3,
          route: '/relationship/5/client/5'
        },
        {
          id: 6,
          name: 'Urban Development Corp',
          industry: 'Real Estate',
          relationship: 'Sarah Johnson',
          totalValue: '$7.3M',
          accounts: 4,
          route: '/relationship/6/client/6'
        }
      ]
    }
  },
  methods: {
    expandSearch() {
      this.searchExpanded = true
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    collapseSearch() {
      this.searchExpanded = false
      this.searchQuery = ''
      this.searchResults = []
      this.selectedIndex = -1
    },
    handleSearch() {
      if (this.searchQuery.trim() === '') {
        this.searchResults = []
        return
      }

      // Filter clients based on search query
      const query = this.searchQuery.toLowerCase()
      this.searchResults = this.allClients.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.industry.toLowerCase().includes(query)
      ).slice(0, 6) // Limit to 6 results

      this.selectedIndex = -1
    },
    selectClient(client) {
      // Navigate to client detail view
      this.$router.push(client.route)
      this.collapseSearch()
    },
    selectFirstResult() {
      if (this.searchResults.length > 0) {
        this.selectClient(this.searchResults[0])
      }
    },
    handleBlur() {
      // Delay collapse to allow click on results
      setTimeout(() => {
        this.collapseSearch()
      }, 150)
    }
  }
}
</script>