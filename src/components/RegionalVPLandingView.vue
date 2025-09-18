<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Commercial Banking Portfolio</h1>
            <p class="text-gray-600 mt-2">Select a Regional Vice President to view their portfolio</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Summary -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-8 py-4">
        <div class="grid grid-cols-5 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalPortfolioValue) }}</div>
            <div class="text-sm text-gray-600">Total Portfolio Value</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ totalClients.toLocaleString() }}</div>
            <div class="text-sm text-gray-600">Total Clients</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</div>
            <div class="text-sm text-gray-600">Total Revenue FYTD</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ totalRMs }}</div>
            <div class="text-sm text-gray-600">Relationship Managers</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ regionsWithVPs.length }}</div>
            <div class="text-sm text-gray-600">Regional VPs</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Metro-Grouped Regional VPs -->
    <div class="px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Regional Vice Presidents by Metro</h2>
        <div class="flex items-center space-x-4">
          <select v-model="selectedMetro" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Metros</option>
            <option v-for="metro in metros" :key="metro.id" :value="metro.id">{{ metro.name }}</option>
          </select>
          <select v-model="sortBy" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="name">Sort by Name</option>
            <option value="portfolio">Sort by Portfolio Value</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="clients">Sort by Client Count</option>
          </select>
        </div>
      </div>

      <!-- Metro Groups -->
      <div v-for="metroGroup in metroGroups" :key="metroGroup.metro.id" class="mb-12">
        <!-- Metro Header -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="text-2xl mr-3">🏙️</span>
                {{ metroGroup.metro.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ metroGroup.markets.length }} Markets • {{ metroGroup.regions.length }} Regional VPs •
                {{ formatCompactCurrency(metroGroup.totalPortfolio) }} Portfolio Value
              </p>
            </div>
            <button @click="navigateToMetro(metroGroup.metro)"
              class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
              View Metro Dashboard
            </button>
          </div>
        </div>

        <!-- Regional VP Cards for this Metro -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="region in metroGroup.regions" :key="region.id"
            @click="navigateToRegion(region)"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-td-green transition-all cursor-pointer group">

            <!-- VP Header -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-td-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                    <span class="text-xl">👤</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 group-hover:text-td-green transition-colors">
                      {{ region.vpName || `VP - ${region.name}` }}
                    </h4>
                    <p class="text-xs text-gray-600">Regional VP</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-td-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <!-- Full Hierarchy Display -->
              <div class="text-xs text-gray-500 space-y-1">
                <div><span class="font-medium">Region:</span> {{ region.name }}</div>
                <div><span class="font-medium">Market:</span> {{ region.marketName }}</div>
                <div><span class="font-medium">Metro:</span> {{ metroGroup.metro.name }}</div>
              </div>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-xs text-gray-500 mb-1">Portfolio Value</div>
                <div class="font-semibold text-gray-900">{{ formatCompactCurrency(region.portfolioValue) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Revenue FYTD</div>
                <div class="font-semibold text-gray-900">{{ formatCompactCurrency(region.revenue) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Clients</div>
                <div class="font-semibold text-gray-900">{{ region.clientCount }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">RMs</div>
                <div class="font-semibold text-gray-900">{{ region.rmCount }}</div>
              </div>
            </div>

            <!-- Risk Indicator -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center">
                <span class="text-xs text-gray-500 mr-2">Risk Score:</span>
                <span :class="getRiskBadgeClass(region.riskScore)" class="px-2 py-1 text-xs font-medium rounded">
                  {{ region.riskScore }}
                </span>
              </div>
              <div class="flex items-center text-xs text-gray-500">
                <span v-if="region.alertCount" class="flex items-center">
                  <span class="text-yellow-500 mr-1">⚠️</span>
                  {{ region.alertCount }} alerts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { regions, relationshipManagers, getRMsByRegion, metros, markets, getMetroById, getMarketsByMetro, getRegionsByMarket } from '../data/mockData'

const router = useRouter()
const sortBy = ref('name')
const selectedMetro = ref('')

// Add VP names and market info to regions
const regionsWithVPs = computed(() => {
  return regions.map(region => {
    const rms = getRMsByRegion(region.id)
    const alertCount = Math.floor(Math.random() * 5) // Mock alert count
    const market = markets.find(m => m.id === region.marketId)

    return {
      ...region,
      alertCount,
      rmDetails: rms,
      marketName: market?.name || 'Unknown Market'
    }
  })
})

// Group regions by metro
const metroGroups = computed(() => {
  const groups = []

  metros.forEach(metro => {
    const metroMarkets = markets.filter(m => m.metroId === metro.id)
    const metroRegions = regionsWithVPs.value.filter(r =>
      metroMarkets.some(market => market.id === r.marketId)
    )

    if (metroRegions.length > 0) {
      // Apply metro filter if selected
      if (!selectedMetro.value || metro.id === selectedMetro.value) {
        // Sort regions within each metro
        const sortedRegions = [...metroRegions]
        switch(sortBy.value) {
          case 'portfolio':
            sortedRegions.sort((a, b) => b.portfolioValue - a.portfolioValue)
            break
          case 'revenue':
            sortedRegions.sort((a, b) => b.revenue - a.revenue)
            break
          case 'clients':
            sortedRegions.sort((a, b) => b.clientCount - a.clientCount)
            break
          case 'name':
          default:
            sortedRegions.sort((a, b) => (a.vpName || a.name).localeCompare(b.vpName || b.name))
            break
        }

        groups.push({
          metro,
          markets: metroMarkets,
          regions: sortedRegions,
          totalPortfolio: metroRegions.reduce((sum, r) => sum + r.portfolioValue, 0)
        })
      }
    }
  })

  return groups
})

// Calculate totals
const totalPortfolioValue = computed(() =>
  regionsWithVPs.value.reduce((sum, r) => sum + r.portfolioValue, 0)
)

const totalRevenue = computed(() =>
  regionsWithVPs.value.reduce((sum, r) => sum + r.revenue, 0)
)

const totalClients = computed(() =>
  regionsWithVPs.value.reduce((sum, r) => sum + r.clientCount, 0)
)

const totalRMs = computed(() =>
  relationshipManagers.length
)

// Sort regions based on selected criteria
const sortedRegions = computed(() => {
  const sorted = [...regionsWithVPs.value]
  switch(sortBy.value) {
    case 'portfolio':
      return sorted.sort((a, b) => b.portfolioValue - a.portfolioValue)
    case 'revenue':
      return sorted.sort((a, b) => b.revenue - a.revenue)
    case 'clients':
      return sorted.sort((a, b) => b.clientCount - a.clientCount)
    case 'name':
    default:
      return sorted.sort((a, b) => (a.vpName || a.name).localeCompare(b.vpName || b.name))
  }
})

const navigateToRegion = (region) => {
  router.push({
    name: 'Region',
    params: { regionId: region.id }
  })
}

const navigateToMetro = (metro) => {
  router.push({
    name: 'Metro',
    params: { metroId: metro.id }
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatCompactCurrency = (value) => {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value}`
}

const getRiskBadgeClass = (riskScore) => {
  switch(riskScore?.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.bg-td-green {
  background-color: #00A651;
}

.text-td-green {
  color: #00A651;
}

.border-td-green {
  border-color: #00A651;
}

.hover\:bg-td-green:hover {
  background-color: #00A651;
}

.group:hover .group-hover\:text-td-green {
  color: #00A651;
}
</style>