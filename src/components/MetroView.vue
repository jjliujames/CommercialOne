<template>
    <div class="metro-view">
        <!-- Breadcrumb Navigation -->
        <nav class="flex mb-6" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
                <li>
                    <router-link to="/" class="text-gray-500 hover:text-td-green">Regional VPs</router-link>
                </li>
                <li class="flex items-center">
                    <svg class="h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-900 font-medium">{{ metro?.name }}</span>
                </li>
            </ol>
        </nav>

        <!-- Header with Role Context -->
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ metro?.name }} Metro Dashboard</h1>
                    <p class="text-gray-600">Regional VP Performance Overview</p>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p class="text-sm font-medium text-blue-800">Role: Regional Vice President</p>
                    <p class="text-xs text-blue-600">Metro-level portfolio management</p>
                </div>
            </div>
        </div>

        <!-- Enhanced Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div class="metric-card">
                <div class="flex items-center">
                    <div class="p-2 bg-td-green rounded-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Portfolio</p>
                        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metro?.portfolioValue) }}</p>
                        <p class="text-xs text-green-600">+{{ metro?.clientGrowthRate }}% YoY</p>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="flex items-center">
                    <div class="p-2 bg-green-600 rounded-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Clients</p>
                        <p class="text-2xl font-bold text-gray-900">{{ metro?.clientCount?.toLocaleString() }}</p>
                        <p class="text-xs text-blue-600">{{ metro?.marketCount }} Markets</p>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="flex items-center">
                    <div class="p-2 bg-green-500 rounded-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Annual Revenue</p>
                        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metro?.revenue) }}</p>
                        <p class="text-xs text-gray-500">{{ formatCurrency(metro?.revenuePerRM) }} per RM</p>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-500 rounded-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Avg Risk Score</p>
                        <p class="text-2xl font-bold text-gray-900">{{ metro?.avgClientRiskScore }}</p>
                        <p class="text-xs" :class="getRiskScoreColor(metro?.avgClientRiskScore)">{{ metro?.riskScore }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <div class="flex items-center">
                    <div class="p-2 bg-purple-500 rounded-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Opportunities</p>
                        <p class="text-2xl font-bold text-gray-900">{{ metro?.opportunityMetrics?.clientsNeedingUpsell
                            }}</p>
                        <p class="text-xs text-purple-600">{{
                            formatCurrency(metro?.opportunityMetrics?.totalOpportunityValue) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Portfolio Breakdown by Market -->
            <div class="card">
                <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Portfolio Breakdown</h3>
                    <p class="text-sm text-gray-500">AUM by Market (Stacked Bar)</p>
                </div>
                <div class="p-4">
                    <div class="h-48">
                        <BarChart v-if="portfolioBreakdownData" :data="portfolioBreakdownData" />
                        <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Loading chart...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Risk Score Trend -->
            <div class="card">
                <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Risk Score Trend</h3>
                    <p class="text-sm text-gray-500">6-month risk evolution</p>
                </div>
                <div class="p-4">
                    <div class="h-48">
                        <LineChart v-if="riskTrendData" :data="riskTrendData" />
                        <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Loading chart...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Client Tier Mix -->
            <div class="card">
                <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Client Tier Mix</h3>
                    <p class="text-sm text-gray-500">Distribution by tier</p>
                </div>
                <div class="p-4">
                    <div class="h-48">
                        <DoughnutChart v-if="clientTierData" :data="clientTierData" />
                        <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Loading chart...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Opportunity by Market Table -->
        <div class="card mb-8">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Market Opportunity Analysis</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Product gaps and estimated revenue by market</p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Market</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Top Product Gap</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gap %</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estimated Revenue</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="opportunity in marketOpportunities" :key="opportunity.marketId"
                            class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ opportunity.marketName }}</div>
                                <div class="text-sm text-gray-500">{{ opportunity.clientCount }} clients</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ opportunity.topGap.product
                                }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ opportunity.topGap.gapPercentage }}%</div>
                                <div class="w-16 bg-gray-200 rounded-full h-2">
                                    <div class="bg-red-400 h-2 rounded-full"
                                        :style="{ width: opportunity.topGap.gapPercentage + '%' }"></div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{{
                                formatCurrency(opportunity.topGap.potential) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getPriorityBadgeClass(opportunity.topGap.priority)">
                                    {{ opportunity.topGap.priority }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <button class="text-td-green hover:text-td-green-dark font-medium">View Details</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- RM Performance Comparison -->
        <div class="card mb-8">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">RM Performance Comparison</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Relationship Manager performance across metro</p>
            </div>
            <div class="p-6">
                <div class="h-64">
                    <BarChart v-if="rmPerformanceData" :data="rmPerformanceData" />
                    <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <span class="text-gray-500">Loading RM performance chart...</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- High-Risk Client Flags -->
        <div class="card mb-8">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">High-Risk Client Flags</h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">Clients requiring immediate attention</p>
                    </div>
                    <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {{ metro?.highRiskClients?.length || 0 }} High-Risk
                    </span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Risk Score</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Volume</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Risk Flags</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Review</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="client in metro?.highRiskClients" :key="client.name" class="hover:bg-gray-50"
                            :class="getAlertRowClass(client.riskScore)">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <span class="text-xs font-medium text-red-800">!</span>
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <span class="text-sm font-bold" :class="getRiskScoreColor(client.riskScore)">{{
                                        client.riskScore }}</span>
                                    <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                        <div class="bg-red-500 h-2 rounded-full"
                                            :style="{ width: (client.riskScore / 10 * 100) + '%' }"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                formatCurrency(client.volume) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="flag in client.flags" :key="flag"
                                        class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                        {{ flag }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getRandomReviewDate() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex space-x-2">
                                    <button class="text-red-600 hover:text-red-800 font-medium">Escalate</button>
                                    <button class="text-blue-600 hover:text-blue-800 font-medium">Review</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Markets Table -->
        <div class="card">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Markets in {{ metro?.name }}</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Click on any row to drill down into market regions</p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Market</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Portfolio Value</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clients</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Regions</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Risk Score</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="market in metroMarkets" :key="market.id" @click="drillDownToMarket(market)"
                            class="hover:bg-gray-50 cursor-pointer transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <div
                                            class="h-10 w-10 rounded-full bg-td-green flex items-center justify-center">
                                            <span class="text-sm font-medium text-white"></span>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ market.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                formatCurrency(market.portfolioValue) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                market.clientCount.toLocaleString() }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                formatCurrency(market.revenue) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ market.regionCount }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="['risk-flag', getRiskColor(market.riskScore)]">{{ market.riskScore
                                    }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMetroById, getMarketsByMetro, formatCurrency, getRiskColor } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'
import LineChart from './charts/LineChart.vue'
import DoughnutChart from './charts/DoughnutChart.vue'

const props = defineProps({
    metroId: {
        type: String,
        required: true
    }
})

const router = useRouter()

const metro = computed(() => {
    return getMetroById(props.metroId)
})

const metroMarkets = computed(() => {
    return getMarketsByMetro(props.metroId)
})

const portfolioBreakdownData = computed(() => {
    if (!metroMarkets.value) return null
    return {
        labels: metroMarkets.value.map(market => market.name),
        datasets: [{
            label: 'Portfolio Value ($M)',
            data: metroMarkets.value.map(market => market.portfolioValue / 1e6),
            backgroundColor: [
                'rgba(107, 142, 35, 0.8)',
                'rgba(34, 139, 34, 0.8)',
                'rgba(50, 205, 50, 0.8)',
                'rgba(0, 128, 0, 0.8)'
            ],
            borderColor: [
                '#6B8E23',
                '#228B22',
                '#32CD32',
                '#008000'
            ],
            borderWidth: 1
        }]
    }
})

const riskTrendData = computed(() => {
    const months = ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024']
    const riskScores = [6.2, 6.5, 6.8, 6.4, 6.9, metro.value?.avgClientRiskScore || 7.0]

    return {
        labels: months,
        datasets: [{
            label: 'Average Risk Score',
            data: riskScores,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
        }]
    }
})

const clientTierData = computed(() => {
    return {
        labels: ['Tier 1 (Premium)', 'Tier 2 (Core)', 'Tier 3 (Growth)', 'Tier 4 (Basic)'],
        datasets: [{
            data: [25, 35, 28, 12],
            backgroundColor: [
                '#10B981',
                '#3B82F6',
                '#F59E0B',
                '#6B7280'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    }
})

const rmPerformanceData = computed(() => {
    // Generate mock RM data for the metro
    const rmNames = ['Sarah J.', 'Michael C.', 'David T.', 'Lisa W.', 'Oliver S.']
    const revenues = [8.9, 7.2, 6.8, 5.4, 4.1]

    return {
        labels: rmNames,
        datasets: [{
            label: 'Revenue ($M)',
            data: revenues,
            backgroundColor: 'rgba(107, 142, 35, 0.8)',
            borderColor: '#6B8E23',
            borderWidth: 1
        }]
    }
})

const marketOpportunities = computed(() => {
    return metroMarkets.value?.map(market => ({
        marketId: market.id,
        marketName: market.name,
        clientCount: market.clientCount,
        topGap: {
            product: getRandomProduct(),
            gapPercentage: Math.floor(Math.random() * 60) + 20,
            potential: Math.floor(Math.random() * 5000000) + 1000000,
            priority: getRandomPriority()
        }
    })) || []
})

const drillDownToMarket = (market) => {
    console.log('Navigating to Market:', market.id)
    router.push({
        name: 'Market',
        params: {
            metroId: props.metroId,
            marketId: market.id
        }
    })
}

const getRiskScoreColor = (score) => {
    if (score >= 8) return 'text-red-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-green-600'
}

const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getAlertRowClass = (riskScore) => {
    if (riskScore >= 9) return 'bg-red-50 border-l-4 border-red-500'
    if (riskScore >= 8) return 'bg-yellow-50 border-l-4 border-yellow-500'
    return ''
}

const getRandomProduct = () => {
    const products = ['Treasury Management', 'FX Services', 'Commercial Lending', 'Trade Finance', 'Investment Services']
    return products[Math.floor(Math.random() * products.length)]
}

const getRandomPriority = () => {
    const priorities = ['High', 'Medium', 'Low']
    return priorities[Math.floor(Math.random() * priorities.length)]
}

const getRandomReviewDate = () => {
    const dates = ['2 days ago', '1 week ago', '2 weeks ago', '1 month ago', '6 weeks ago']
    return dates[Math.floor(Math.random() * dates.length)]
}

onMounted(() => {
    console.log('MetroView mounted for metro:', props.metroId)
    console.log('Metro data:', metro.value)
    console.log('Metro markets:', metroMarkets.value)
})
</script>

<style scoped>
.metric-card {
    @apply bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow;
}

.card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.risk-flag {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}
</style>