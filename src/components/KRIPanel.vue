<template>
    <div class="kri-panel">
        <!-- Header -->
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Key Risk Indicators</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Real-time monitoring of granular risk metrics</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button @click="toggleExpanded"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <span v-if="isExpanded">Hide Details</span>
                        <span v-else>Show Details</span>
                        <svg :class="['ml-2 h-4 w-4 transform transition-transform', { 'rotate-180': isExpanded }]"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- KRI Summary Cards -->
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- High Risk Industry -->
                <div class="kri-card border-l-4 border-red-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">High Risk Industry (Accts)

                            </p>
                            <p class="text-2xl font-bold text-gray-900">{{ kri.highRiskIndustry.clientCount }}</p>
                            <p class="text-sm text-gray-500">{{ formatCurrency(kri.highRiskIndustry.totalVolume) }}</p>
                        </div>
                        <div class="p-2 bg-red-100 rounded-lg">
                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Money Service Business -->
                <div class="kri-card border-l-4 border-yellow-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">MSB Clients</p>
                            <p class="text-2xl font-bold text-gray-900">{{ kri.moneyServiceBusiness.clientCount }}</p>
                            <p class="text-sm text-gray-500">{{ formatCurrency(kri.moneyServiceBusiness.totalVolume) }}
                            </p>
                        </div>
                        <div class="p-2 bg-yellow-100 rounded-lg">
                            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- High Cash Transactions -->
                <div class="kri-card border-l-4 border-yellow-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">High Cash Clients</p>
                            <p class="text-2xl font-bold text-gray-900">{{ kri.highCashTransactions.clientCount }}</p>
                            <p class="text-sm text-gray-500">{{ formatCurrency(kri.highCashTransactions.totalVolume) }}
                            </p>
                        </div>
                        <div class="p-2 bg-yellow-100 rounded-lg">
                            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- UTR Filings -->
                <div class="kri-card border-l-4 border-red-600">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">UTR Filings</p>
                            <p class="text-2xl font-bold text-gray-900">{{ kri.utrFilings.totalFilings }}</p>
                            <p class="text-sm text-gray-500">{{ formatCurrency(kri.utrFilings.totalVolume) }}</p>
                        </div>
                        <div class="p-2 bg-red-100 rounded-lg">
                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Breakdown (Expandable) -->
            <div v-if="isExpanded" class="space-y-6">

                <!-- High Risk Countries -->
                <div class="detail-section">
                    <h4 class="text-lg font-medium text-gray-900 mb-3">High Risk Countries Exposure</h4>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm text-red-800">{{ kri.highRiskCountries.clientCount }} clients
                                    transacting</p>
                                <p class="text-lg font-semibold text-red-900">{{
                                    formatCurrency(kri.highRiskCountries.totalVolume) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-red-600">{{
                                    kri.highRiskCountries.transactionCount.toLocaleString() }} transactions</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div v-for="country in kri.highRiskCountries.countries" :key="country.name"
                                class="bg-white rounded p-3 border">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-gray-900">{{ country.name }}</p>
                                        <p class="text-sm text-gray-600">{{ country.clients }} clients</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-medium">{{ formatCurrency(country.volume) }}</p>
                                        <span
                                            :class="['px-2 py-1 text-xs rounded-full', getRiskLevelColor(country.riskLevel)]">
                                            {{ country.riskLevel }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Personal Spending -->
                <div class="detail-section">
                    <h4 class="text-lg font-medium text-gray-900 mb-3">Non-Business Personal Spending</h4>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm text-yellow-800">{{ kri.personalSpending.clientCount }} clients
                                    flagged</p>
                                <p class="text-lg font-semibold text-yellow-900">{{
                                    formatCurrency(kri.personalSpending.totalVolume) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-yellow-600">{{
                                    kri.personalSpending.transactionCount.toLocaleString() }} transactions</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div v-for="category in kri.personalSpending.categories" :key="category.name"
                                class="bg-white rounded p-3 border">
                                <div>
                                    <p class="font-medium text-gray-900">{{ category.name }}</p>
                                    <p class="text-sm text-gray-600">{{ category.clients }} clients</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatCurrency(category.volume) }}
                                    </p>
                                    <p class="text-xs text-gray-500">{{ category.transactions }} transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Correspondent Banking -->
                <div class="detail-section">
                    <h4 class="text-lg font-medium text-gray-900 mb-3">Correspondent Banking Activity</h4>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <p class="text-sm text-blue-800">{{ kri.correspondentBanking.clientCount }}
                                    correspondent banks</p>
                                <p class="text-lg font-semibold text-blue-900">{{
                                    formatCurrency(kri.correspondentBanking.totalVolume) }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-blue-600">{{
                                    kri.correspondentBanking.transactionCount.toLocaleString() }} transactions</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div v-for="country in kri.correspondentBanking.countries" :key="country.name"
                                class="bg-white rounded p-3 border">
                                <div>
                                    <p class="font-medium text-gray-900">{{ country.name }}</p>
                                    <p class="text-sm text-gray-600">{{ country.clients }} banks</p>
                                    <p class="text-sm font-medium text-gray-900">{{ formatCurrency(country.volume) }}
                                    </p>
                                    <p class="text-xs text-gray-500">{{ country.transactions }} transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatCurrency } from '../data/mockData.js'

const props = defineProps({
    kri: {
        type: Object,
        required: true
    }
})

// Reactive data
const isExpanded = ref(false)

// Methods
const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
}

const getRiskLevelColor = (level) => {
    const colors = {
        'Extreme': 'bg-red-600 text-white',
        'High': 'bg-red-100 text-red-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'Low': 'bg-green-100 text-green-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.kri-card {
    @apply bg-white rounded-lg p-4 shadow-sm border border-gray-200;
}

.detail-section {
    @apply border-t border-gray-200 pt-6;
}

.detail-section:first-child {
    @apply border-t-0 pt-0;
}
</style>