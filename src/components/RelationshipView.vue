<template>
    <BaseDetailView>
        <!-- Header Section -->
        <template #header>
            <DetailViewHeader :title="relationshipData?.name || 'Relationship Profile'" :breadcrumb="breadcrumb"
                @generate-report="relationshipAction('generate-report')">
                <!-- Action Items Indicator -->
                <template #alerts>
                    <AlertIndicator v-if="totalActionItems > 0" :critical-count="criticalActionCount"
                        :high-count="highActionCount" :medium-count="mediumActionCount" :low-count="lowActionCount"
                        alert-type="Action Items" @click="showActionItemsModal" />
                </template>

                <!-- Additional Action Buttons -->
                <template #actions>
                    <button @click="relationshipAction('add-client')"
                        class="px-4 py-2 bg-td-green text-white rounded-lg hover:bg-green-600 transition-colors">
                        Add Client
                    </button>
                    <button @click="relationshipAction('generate-report')"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Generate Group Report
                    </button>
                </template>
            </DetailViewHeader>
        </template>

        <!-- Left Column - Enhanced Relationship Profile and Consolidated Parties -->
        <template #left-column>

            <!-- Enhanced Relationship Profile -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-4">
                    <div class="mb-4">
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900">{{ relationshipData?.name || 'N/A' }}</h2>
                            <p class="text-xs text-gray-500 mt-1">Relationship ID: {{ relationshipData?.id || 'N/A' }}
                            </p>
                            <div class="mt-2">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getRelationshipTypeClass(relationshipTier)">
                                    {{ relationshipTier }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div>
                            <p class="text-xs font-medium text-gray-500">Primary Industry</p>
                            <p class="text-sm text-gray-900">{{ relationshipData?.primaryIndustry || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500">HQ Location</p>
                            <p class="text-sm text-gray-900">{{ relationshipData?.hqLocation || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500">Client Entities</p>
                            <p class="text-sm text-gray-900">{{ totalClients || 0 }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500">Primary RM</p>
                            <p class="text-sm text-gray-900">{{ relationshipManager?.name || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Consolidated Parties Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-3 border-b border-gray-200">
                    <h3 class="text-base font-medium text-gray-900">👥 Consolidated Relationship Parties</h3>
                    <p class="text-xs text-gray-500 mt-1">Aggregated across {{ totalClients }} client entities</p>
                </div>
                <div class="p-4">
                    <!-- Ultimate Parent Entity -->
                    <div v-if="relationshipData?.ultimateParent" class="mb-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-2">🏢 Ultimate Parent Structure</h4>
                        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="text-sm font-medium text-blue-900">{{ relationshipData.ultimateParent.name }}
                            </div>
                            <div class="text-xs text-blue-600">{{ relationshipData.ultimateParent.ownership }}%
                                ownership</div>
                            <div class="text-xs text-blue-500 mt-1">Controls {{ totalClients }} entities</div>
                        </div>
                    </div>

                    <!-- Consolidated Beneficial Owners -->
                    <div v-if="consolidatedBeneficialOwners?.length" class="mb-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-2">💎 Beneficial Owners ({{
                            consolidatedBeneficialOwners.length }} unique)</h4>
                        <div class="space-y-2">
                            <div v-for="owner in consolidatedBeneficialOwners.slice(0, 3)" :key="owner.id"
                                class="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                <div>
                                    <div class="text-sm font-medium text-purple-900">{{ owner.name }}</div>
                                    <div class="text-xs text-purple-600">{{ owner.entityCount }} entities • {{
                                        owner.avgOwnership }}% avg ownership</div>
                                </div>
                            </div>
                            <div v-if="consolidatedBeneficialOwners.length > 3"
                                class="text-xs text-gray-500 text-center py-1">
                                +{{ consolidatedBeneficialOwners.length - 3 }} more beneficial owners
                            </div>
                        </div>
                    </div>

                    <!-- Consolidated Authorized Signers -->
                    <div v-if="consolidatedAuthorizedSigners?.length" class="mb-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-2">✍️ Authorized Signers ({{
                            consolidatedAuthorizedSigners.length }} unique)</h4>
                        <div class="space-y-2">
                            <div v-for="signer in consolidatedAuthorizedSigners.slice(0, 2)" :key="signer.id"
                                class="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                <div>
                                    <div class="text-sm font-medium text-green-900">{{ signer.name }}</div>
                                    <div class="text-xs text-green-600">Authority across {{ signer.entityCount }}
                                        entities</div>
                                </div>
                            </div>
                            <div v-if="consolidatedAuthorizedSigners.length > 2"
                                class="text-xs text-gray-500 text-center py-1">
                                +{{ consolidatedAuthorizedSigners.length - 2 }} more authorized signers
                            </div>
                        </div>
                    </div>

                    <!-- Business Conductors -->
                    <div v-if="consolidatedConductors?.length" class="mb-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-2">🎯 Business Conductors ({{
                            consolidatedConductors.length }})</h4>
                        <div class="space-y-2">
                            <div v-for="conductor in consolidatedConductors.slice(0, 2)" :key="conductor.id"
                                class="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                                <div>
                                    <div class="text-sm font-medium text-orange-900">{{ conductor.name }}</div>
                                    <div class="text-xs text-orange-600">{{ conductor.role }} • {{ conductor.entityCount
                                        }} entities</div>
                                </div>
                            </div>
                            <div v-if="consolidatedConductors.length > 2"
                                class="text-xs text-gray-500 text-center py-1">
                                +{{ consolidatedConductors.length - 2 }} more conductors
                            </div>
                        </div>
                    </div>

                    <!-- Geographic Footprint -->
                    <div class="pt-3 border-t border-gray-200">
                        <h4 class="text-sm font-medium text-gray-900 mb-2">🌍 Geographic Footprint</h4>
                        <div class="flex flex-wrap gap-1">
                            <RiskBadge v-for="location in geographicFootprint" :key="location" :value="location"
                                type="category" color="blue" size="xs" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Complexity Assessment -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-2">
                    <h3 class="text-sm font-medium text-gray-900 mb-3">🔗 Relationship Complexity Score</h3>



                    <!-- Hidden Relationships -->
                    <div class="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        @click="showHiddenRelationshipsModal = true">
                        <h4 class="text-xs font-medium text-gray-500 mb-2">Hidden Relationships</h4>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <RiskBadge value="High" type="status" color="red" size="sm" />
                                <span class="text-xs text-gray-500">Client contains hidden relationships</span>
                            </div>
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

        </template>

        <!-- Right Column - Enhanced Analytics -->
        <template #right-column>

            <!-- Section Title -->
            <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">📊 Relationship Portfolio Analysis</h2>
                <p class="text-sm text-gray-500 mt-2">Aggregated view across {{ totalClients }} client entities
                    with drill-down capability</p>
            </div>

            <!-- Enhanced Executive Summary KPIs -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="py-4 px-2">
                    <div class="text-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">📈 Relationship Performance Metrics</h3>
                        <p class="text-sm text-gray-500">Aggregated across {{ totalClients }} client entities with
                            percentile rankings</p>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <KPICard :value="totalClients" label="Total Clients" color="blue"
                            :percentile="clientsPercentile" format-type="number" />

                        <KPICard :value="aggregateDeposits" label="Total Deposits" color="green"
                            :percentile="depositsPercentile" format-type="currency" />

                        <KPICard :value="totalInflow" label="Total Inflow" color="emerald"
                            :percentile="inflowPercentile" format-type="currency" />

                        <KPICard :value="aggregateLoans" label="Loan Commitment" color="orange"
                            :percentile="loansPercentile" format-type="currency" />

                        <KPICard :value="loanUtilization" label="Loan Utilization %" color="purple"
                            :percentile="utilizationPercentile" format-type="percentage" />

                        <KPICard :value="annualRevenue" label="Total Revenue" color="cyan"
                            :percentile="revenuePercentile" format-type="currency" />

                        <KPICard :value="totalRiskFlags" label="Total Risk Flags" color="red"
                            :percentile="riskFlagsPercentile" format-type="number" />

                        <KPICard :value="totalPendingRiskReviews" label="Pending Risk Reviews" color="amber"
                            format-type="number">
                            <template #additional-info>
                                <div v-if="totalPendingRiskReviews > 0" class="text-xs text-amber-600 font-medium mt-1">
                                    Action Required</div>
                            </template>
                        </KPICard>

                    </div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button @click="activeTab = 'portfolio'"
                            :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'portfolio' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                            Portfolio & Opportunities ({{ totalOpportunities }})
                        </button>
                        <button @click="activeTab = 'risk'"
                            :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'risk' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                            Risk Assessment ({{ totalPendingRiskReviews }})
                        </button>
                        <button @click="activeTab = 'history'"
                            :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'history' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                            Activity History ({{ totalCompletedActions }})
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Portfolio & Opportunities Tab -->
                    <div v-if="activeTab === 'portfolio'">
                        <div class="space-y-6">
                            <!-- Client Table -->
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 mb-4">🏢 Client Entity Portfolio
                                </h3>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Client Name</th>
                                                <th
                                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deposits</th>
                                                <th
                                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Loans</th>
                                                <th
                                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Revenue</th>
                                                <th
                                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product Penetration</th>
                                                <th
                                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Risk Flags</th>
                                                <th
                                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            <tr v-for="client in relationshipClients" :key="client.id"
                                                class="hover:bg-gray-50 cursor-pointer"
                                                @click="drillDownToClient(client)">
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="flex-shrink-0 h-8 w-8">
                                                            <div
                                                                class="h-8 w-8 rounded-full bg-td-green flex items-center justify-center">
                                                                <span class="text-xs font-medium text-white">{{
                                                                    client.name.charAt(0) }}</span>
                                                            </div>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">{{
                                                                client.name }}</div>
                                                            <div class="text-xs text-gray-500">{{
                                                                client.industry }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {{ formatCurrency(client.deposits) }}
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {{ formatCurrency(client.loans) }}
                                                </td>
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {{ formatCurrency(client.revenue) }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                    <span class="font-medium"
                                                        :class="getCoverageColor(client.coverage)">
                                                        {{ client.coverage }}%
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                                    <span v-if="client.riskFlags > 0"
                                                        class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                        {{ client.riskFlags }}
                                                    </span>
                                                    <span v-else class="text-gray-400">-</span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                    <button @click.stop="drillDownToClient(client)"
                                                        class="text-td-green hover:text-green-600 font-medium">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Product Portfolio Breakdown -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div class="p-6">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">🏦 Product Portfolio Breakdown
                                    </h3>
                                    <!-- First Row: 3 columns -->
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                                        <!-- Business Deposit Product -->
                                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <h5 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                                                🟦 Business Deposit Product
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Checking</span>
                                                    <ProductDotIndicator :status="getProductStatus('checking')"
                                                        product-name="Checking"
                                                        :tooltip-data="getProductTooltipData('checking')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Debit Cards</span>
                                                    <ProductDotIndicator :status="getProductStatus('debit-cards')"
                                                        product-name="Debit Cards"
                                                        :tooltip-data="getProductTooltipData('debit-cards')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">CDs</span>
                                                    <ProductDotIndicator :status="getProductStatus('cds')"
                                                        product-name="CDs"
                                                        :tooltip-data="getProductTooltipData('cds')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Savings and Money Market</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('savings-money-market')"
                                                        product-name="Savings and Money Market"
                                                        :tooltip-data="getProductTooltipData('savings-money-market')" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Business Lending Product -->
                                        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <h5 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                                                🟦 Business Lending Product
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Credit Cards</span>
                                                    <ProductDotIndicator :status="getProductStatus('credit-cards')"
                                                        product-name="Credit Cards"
                                                        :tooltip-data="getProductTooltipData('credit-cards')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Loans and Lines of Credit</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('loans-lines-credit')"
                                                        product-name="Loans and Lines of Credit"
                                                        :tooltip-data="getProductTooltipData('loans-lines-credit')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Securities-Based Lending</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('securities-based-lending')"
                                                        product-name="Securities-Based Lending"
                                                        :tooltip-data="getProductTooltipData('securities-based-lending')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Real Estate Financing</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('real-estate-financing')"
                                                        product-name="Real Estate Financing"
                                                        :tooltip-data="getProductTooltipData('real-estate-financing')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Paycheck Protection Program
                                                        (PPP)</span>
                                                    <ProductDotIndicator :status="getProductStatus('ppp')"
                                                        product-name="PPP"
                                                        :tooltip-data="getProductTooltipData('ppp')" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Commercial Lending Solutions -->
                                        <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                            <h5 class="text-sm font-semibold text-orange-900 mb-3 flex items-center">
                                                🟦 Commercial Lending Solutions
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Asset Based Lending</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('asset-based-lending')"
                                                        product-name="Asset Based Lending"
                                                        :tooltip-data="getProductTooltipData('asset-based-lending')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Commercial Lending</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('commercial-lending')"
                                                        product-name="Commercial Lending"
                                                        :tooltip-data="getProductTooltipData('commercial-lending')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Commercial Real Estate</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('commercial-real-estate')"
                                                        product-name="Commercial Real Estate"
                                                        :tooltip-data="getProductTooltipData('commercial-real-estate')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Equipment Finance</span>
                                                    <ProductDotIndicator :status="getProductStatus('equipment-finance')"
                                                        product-name="Equipment Finance"
                                                        :tooltip-data="getProductTooltipData('equipment-finance')" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <!-- Second Row: 3 columns -->
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <!-- Treasury & Cash Management -->
                                        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                            <h5 class="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
                                                🟦 Treasury & Cash Management
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Liquidity Management</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('liquidity-management')"
                                                        product-name="Liquidity Management"
                                                        :tooltip-data="getProductTooltipData('liquidity-management')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Payables</span>
                                                    <ProductDotIndicator :status="getProductStatus('payables')"
                                                        product-name="Payables"
                                                        :tooltip-data="getProductTooltipData('payables')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Receivables</span>
                                                    <ProductDotIndicator :status="getProductStatus('receivables')"
                                                        product-name="Receivables"
                                                        :tooltip-data="getProductTooltipData('receivables')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Fraud Control</span>
                                                    <ProductDotIndicator :status="getProductStatus('fraud-control')"
                                                        product-name="Fraud Control"
                                                        :tooltip-data="getProductTooltipData('fraud-control')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Information Services</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('information-services')"
                                                        product-name="Information Services"
                                                        :tooltip-data="getProductTooltipData('information-services')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Treasury Overview &
                                                        Articles</span>
                                                    <ProductDotIndicator :status="getProductStatus('treasury-overview')"
                                                        product-name="Treasury Overview & Articles"
                                                        :tooltip-data="getProductTooltipData('treasury-overview')" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Business Services & Support -->
                                        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <h5 class="text-sm font-semibold text-green-900 mb-3 flex items-center">
                                                🟦 Business Services & Support
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Online Banking</span>
                                                    <ProductDotIndicator :status="getProductStatus('online-banking')"
                                                        product-name="Online Banking"
                                                        :tooltip-data="getProductTooltipData('online-banking')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Online Accounting</span>
                                                    <ProductDotIndicator :status="getProductStatus('online-accounting')"
                                                        product-name="Online Accounting"
                                                        :tooltip-data="getProductTooltipData('online-accounting')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Payroll</span>
                                                    <ProductDotIndicator :status="getProductStatus('payroll')"
                                                        product-name="Payroll"
                                                        :tooltip-data="getProductTooltipData('payroll')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Business Payment Suite</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('business-payment-suite')"
                                                        product-name="Business Payment Suite"
                                                        :tooltip-data="getProductTooltipData('business-payment-suite')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Overdraft Services</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('overdraft-services')"
                                                        product-name="Overdraft Services"
                                                        :tooltip-data="getProductTooltipData('overdraft-services')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Merchant Solutions</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('merchant-solutions')"
                                                        product-name="Merchant Solutions"
                                                        :tooltip-data="getProductTooltipData('merchant-solutions')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">New to Small Business
                                                        Checking</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('new-to-small-business')"
                                                        product-name="New to Small Business Checking"
                                                        :tooltip-data="getProductTooltipData('new-to-small-business')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Healthcare Professionals</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('healthcare-professionals')"
                                                        product-name="Healthcare Professionals"
                                                        :tooltip-data="getProductTooltipData('healthcare-professionals')" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Wealth & Investment Services -->
                                        <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <h5 class="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                                                🟦 Wealth & Investment Services
                                            </h5>
                                            <div class="space-y-2">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Investments</span>
                                                    <ProductDotIndicator :status="getProductStatus('investments')"
                                                        product-name="Investments"
                                                        :tooltip-data="getProductTooltipData('investments')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Wealth & Retirement
                                                        Planning</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('wealth-retirement-planning')"
                                                        product-name="Wealth & Retirement Planning"
                                                        :tooltip-data="getProductTooltipData('wealth-retirement-planning')" />
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm text-gray-700">Private Client Banking</span>
                                                    <ProductDotIndicator
                                                        :status="getProductStatus('private-client-banking')"
                                                        product-name="Private Client Banking"
                                                        :tooltip-data="getProductTooltipData('private-client-banking')" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <!-- Product Portfolio Legend -->
                                    <div class="mt-6 bg-gray-50 rounded-lg p-4">
                                        <div class="flex items-center justify-center space-x-8">
                                            <div class="flex items-center space-x-2">
                                                <ProductDotIndicator status="has" product-name="Sample Product" />
                                                <span class="text-sm text-gray-700">Client Has Product</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <ProductDotIndicator status="recommended"
                                                    product-name="Sample Product" />
                                                <span class="text-sm text-gray-700">AI Recommended</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <ProductDotIndicator status="none" product-name="Sample Product" />
                                                <span class="text-sm text-gray-700">Not Available/Recommended</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Opportunities Summary -->
                            <div class="mt-6">
                                <h3 class="text-lg font-medium text-gray-900 mb-4">🎯 Opportunities Summary</h3>
                                <div class="grid grid-cols-3 gap-4 mb-6">
                                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                                        <div class="text-2xl font-bold text-blue-600">{{ totalOpportunities }}</div>
                                        <div class="text-sm text-gray-600">Total Opportunities</div>
                                    </div>
                                    <div class="text-center p-4 bg-green-50 rounded-lg">
                                        <div class="text-2xl font-bold text-green-600">{{
                                            formatCurrency(totalOpportunityValue) }}
                                        </div>
                                        <div class="text-sm text-gray-600">Potential Revenue</div>
                                    </div>
                                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                                        <div class="text-2xl font-bold text-purple-600">{{ highPriorityOpportunities }}
                                        </div>
                                        <div class="text-sm text-gray-600">High Priority</div>
                                    </div>
                                </div>

                                <!-- Opportunities by Client Table -->
                                <div class="bg-white rounded-lg border border-gray-200">
                                    <div class="px-4 py-3 border-b border-gray-200">
                                        <h4 class="text-sm font-medium text-gray-900">Opportunities by Client</h4>
                                    </div>
                                    <div class="overflow-x-auto">
                                        <table class="min-w-full divide-y divide-gray-200">
                                            <thead class="bg-gray-50">
                                                <tr>
                                                    <th
                                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Client</th>
                                                    <th
                                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Opportunities</th>
                                                    <th
                                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Potential Value</th>
                                                    <th
                                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Priority</th>
                                                    <th
                                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody class="bg-white divide-y divide-gray-200">
                                                <template v-for="client in relationshipClients" :key="client.id">
                                                    <tr class="hover:bg-gray-50">
                                                        <td class="px-6 py-4 whitespace-nowrap">
                                                            <button @click="navigateToClient(client.id)"
                                                                class="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                                {{ client.name }}
                                                            </button>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                                            <span
                                                                class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                                {{ getClientOpportunityCount(client) }}
                                                            </span>
                                                        </td>
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                            {{ formatCurrency(getClientOpportunityValue(client)) }}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                                            <span class="px-2 py-1 text-xs font-medium rounded-full"
                                                                :class="getClientPriorityClass(client)">
                                                                {{ getClientPriority(client) }}
                                                            </span>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                                            <button @click="toggleClientRecommendations(client.id)"
                                                                class="text-sm text-td-green hover:text-green-600 font-medium">
                                                                {{ expandedClient === client.id ? 'Hide' : 'View' }}
                                                                Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <!-- Expanded Recommendations Row -->
                                                    <tr v-if="expandedClient === client.id"
                                                        :key="`${client.id}-expanded`">
                                                        <td colspan="5" class="px-6 py-4 bg-gray-50">
                                                            <div class="space-y-3">
                                                                <h5 class="text-sm font-semibold text-gray-900 mb-3">🤖
                                                                    AI Recommendations for {{ client.name }}</h5>
                                                                <div v-for="rec in getClientRecommendations(client.id)"
                                                                    :key="rec.id"
                                                                    class="bg-white rounded-lg border border-gray-200 p-4">
                                                                    <div class="flex items-start justify-between">
                                                                        <div class="flex-1">
                                                                            <div
                                                                                class="flex items-center space-x-2 mb-2">
                                                                                <span
                                                                                    class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                                                    {{ rec.confidence }}% confidence
                                                                                </span>
                                                                                <span
                                                                                    class="px-2 py-1 text-xs font-medium rounded-full"
                                                                                    :class="rec.priority === 'High' ? 'bg-red-100 text-red-800' : rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'">
                                                                                    {{ rec.priority }}
                                                                                </span>
                                                                                <span class="text-xs text-gray-500">{{
                                                                                    rec.product }}</span>
                                                                            </div>
                                                                            <p class="text-sm text-gray-900 mb-2">{{
                                                                                rec.recommendation }}</p>
                                                                            <p class="text-xs text-gray-600 mb-2">
                                                                                <span class="font-medium">Reason:</span>
                                                                                {{ rec.reason }}
                                                                            </p>
                                                                            <div class="text-xs text-gray-500">
                                                                                💰 {{ formatCurrency(rec.potential) }}
                                                                                potential revenue
                                                                            </div>
                                                                        </div>
                                                                        <div class="flex space-x-2 ml-4">
                                                                            <button @click="openMeetingModal(rec)"
                                                                                class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                                                                Schedule
                                                                            </button>
                                                                            <button @click="openDeclineModal(rec)"
                                                                                class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                                                                Decline
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div v-if="getClientRecommendations(client.id).length === 0"
                                                                    class="text-sm text-gray-500 italic">
                                                                    No recommendations available for this client.
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Trend Analysis Section - Only in Portfolio Tab -->
            <div v-if="activeTab === 'portfolio'" class="mt-8">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-6">📈 Portfolio Trends & Analysis</h3>

                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <!-- Left Side - Metric Selector -->
                            <div class="lg:col-span-1">
                                <div class="space-y-2">
                                    <!-- Time Period Selector -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-medium text-gray-700 mb-2">Time Period</h4>
                                        <div class="space-y-1">
                                            <button @click="selectedTimePeriod = 'ytd'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedTimePeriod === 'ytd' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                Year to Date
                                            </button>
                                            <button @click="selectedTimePeriod = '6m'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedTimePeriod === '6m' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                Last 6 Months
                                            </button>
                                            <button @click="selectedTimePeriod = '12m'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedTimePeriod === '12m' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                Last 12 Months
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Metric Selector -->
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-700 mb-2">Select Metric</h4>
                                        <div class="space-y-1">
                                            <button @click="selectedTrendMetric = 'deposits'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'deposits' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>💰 Total Deposits</span>
                                                <span v-if="selectedTrendMetric === 'deposits'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                            <button @click="selectedTrendMetric = 'loans'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'loans' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>📊 Loan Commitment</span>
                                                <span v-if="selectedTrendMetric === 'loans'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                            <button @click="selectedTrendMetric = 'utilization'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'utilization' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>📈 Loan Utilization %</span>
                                                <span v-if="selectedTrendMetric === 'utilization'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                            <button @click="selectedTrendMetric = 'revenue'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'revenue' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>💵 Revenue</span>
                                                <span v-if="selectedTrendMetric === 'revenue'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                            <button @click="selectedTrendMetric = 'clients'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'clients' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>👥 Number of Clients</span>
                                                <span v-if="selectedTrendMetric === 'clients'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                            <button @click="selectedTrendMetric = 'transactions'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedTrendMetric === 'transactions' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100']">
                                                <span>💳 Monthly Transactions</span>
                                                <span v-if="selectedTrendMetric === 'transactions'"
                                                    class="text-blue-500">→</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Additional Options -->
                                    <div class="mt-4 pt-4 border-t border-gray-200">
                                        <label class="flex items-center space-x-2 text-sm text-gray-700">
                                            <input type="checkbox" v-model="showNewOnly"
                                                class="rounded border-gray-300">
                                            <span>Show New Only</span>
                                        </label>
                                        <label class="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                                            <input type="checkbox" v-model="compareToTarget"
                                                class="rounded border-gray-300">
                                            <span>Compare to Target</span>
                                        </label>
                                    </div>

                                    <!-- Transaction Chart Options (when transactions selected) -->
                                    <div v-if="selectedTrendMetric === 'transactions'"
                                        class="mt-4 pt-4 border-t border-gray-200">
                                        <h4 class="text-sm font-medium text-gray-700 mb-2">Transaction View</h4>
                                        <div class="space-y-1">
                                            <button @click="transactionViewType = 'by-type'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', transactionViewType === 'by-type' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                By Transaction Type
                                            </button>
                                            <button @click="transactionViewType = 'by-client'"
                                                :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', transactionViewType === 'by-client' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                By Client
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Side - Chart Display -->
                            <div class="lg:col-span-3">
                                <div class="bg-gray-50 rounded-lg p-6 h-full">
                                    <!-- Chart Header -->
                                    <div class="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 class="text-lg font-semibold text-gray-900">
                                                {{ getTrendMetricTitle(selectedTrendMetric) }}
                                            </h4>
                                            <p class="text-sm text-gray-600 mt-1">
                                                {{ getTrendMetricSubtitle(selectedTrendMetric, selectedTimePeriod) }}
                                            </p>
                                        </div>
                                        <div class="flex items-center space-x-4">
                                            <div class="text-right">
                                                <div class="text-2xl font-bold text-gray-900">
                                                    {{ getCurrentMetricValue(selectedTrendMetric) }}
                                                </div>
                                                <div class="text-sm text-gray-600">Current</div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-lg font-semibold"
                                                    :class="getMetricChangeClass(selectedTrendMetric)">
                                                    {{ getMetricChange(selectedTrendMetric) }}
                                                </div>
                                                <div class="text-sm text-gray-600">vs Prior</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Chart Type Toggle (for deposits and loans) -->
                                    <div v-if="selectedTrendMetric === 'deposits' || selectedTrendMetric === 'loans'"
                                        class="mb-2 flex justify-end">
                                        <div class="inline-flex rounded-md shadow-sm" role="group">
                                            <button @click="chartViewType = 'client'"
                                                :class="['px-3 py-1 text-sm font-medium', chartViewType === 'client' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50', 'rounded-l-md border border-gray-200']">
                                                By Client
                                            </button>
                                            <button @click="chartViewType = 'product'"
                                                :class="['px-3 py-1 text-sm font-medium', chartViewType === 'product' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50', 'rounded-r-md border-l-0 border border-gray-200']">
                                                By Product
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Chart Area -->
                                    <div class="h-80">
                                        <!-- Deposits Chart -->
                                        <BarChart v-if="selectedTrendMetric === 'deposits'" :data="getDepositsChartData"
                                            :options="depositChartOptions" />

                                        <!-- Loans Chart -->
                                        <BarChart v-else-if="selectedTrendMetric === 'loans'" :data="getLoansChartData"
                                            :options="loanChartOptions" />

                                        <!-- Utilization Chart -->
                                        <LineChart v-else-if="selectedTrendMetric === 'utilization'"
                                            :data="getUtilizationChartData" :options="utilizationChartOptions" />

                                        <!-- Revenue Chart -->
                                        <BarChart v-else-if="selectedTrendMetric === 'revenue'"
                                            :data="getRevenueChartData" :options="revenueChartOptions" />

                                        <!-- Clients Chart -->
                                        <BarChart v-else-if="selectedTrendMetric === 'clients'"
                                            :data="getClientsChartData" :options="clientsChartOptions" />

                                        <!-- Transactions Chart -->
                                        <BarChart v-else-if="selectedTrendMetric === 'transactions'"
                                            :data="getTransactionsChartData" :options="transactionsChartOptions" />
                                    </div>

                                    <!-- View Details Button for Monthly Transactions -->
                                    <div v-if="selectedTrendMetric === 'transactions'" class="mt-4 text-center">
                                        <button @click="openTransactionDetailsModal('portfolio')" 
                                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-td-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-td-green transition-colors">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            View Transaction Details
                                        </button>
                                    </div>

                                    <!-- Chart Legend/Info -->
                                    <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span>Actual</span>
                                            </div>
                                            <div v-if="compareToTarget" class="flex items-center space-x-2">
                                                <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                <span>Target</span>
                                            </div>
                                            <div v-if="showNewOnly" class="flex items-center space-x-2">
                                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span>New</span>
                                            </div>
                                        </div>
                                        <button class="text-blue-600 hover:text-blue-700 font-medium">
                                            Export Data →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Risk Assessment Tab -->
            <div v-if="activeTab === 'risk'">
                <div class="space-y-6">
                    <!-- Risk Assessment Summary -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">🚨 Risk Assessment Summary
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-red-600">20</div>
                                    <div class="text-sm text-gray-600">Risk Review Assigned</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-orange-600">10</div>
                                    <div class="text-sm text-gray-600">Pending Risk Review </div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-yellow-600">7</div>
                                    <div class="text-sm text-gray-600">Closed with UTR</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-600">3</div>
                                    <div class="text-sm text-gray-600">Closed w/o UTR</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Risk Review Dashboard -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">🛡️ Enhanced Risk Review Dashboard
                                    </h3>
                                    <p class="text-sm text-gray-500 mt-1">Comprehensive risk management with interactive
                                        workflow
                                        and investigation tools</p>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <!-- Risk Review Controls -->
                                    <div class="flex items-center space-x-2">
                                        <button @click="reviewMode = 'standard'"
                                            :class="['px-3 py-1.5 text-xs font-medium rounded-md', reviewMode === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                                            Standard Review
                                        </button>
                                        <button @click="reviewMode = 'bulk'"
                                            :class="['px-3 py-1.5 text-xs font-medium rounded-md', reviewMode === 'bulk' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                                            Bulk Actions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-6">

                            <!-- Risk Table View -->
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th v-if="reviewMode === 'bulk'"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input type="checkbox" @change="toggleAllClientsForReview"
                                                    :checked="selectedClientsForReview.length === relationshipClients.length"
                                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client</th>
                                            <th
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Risk Flags</th>
                                            <th
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Risk Level</th>
                                            <th
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Review Status</th>
                                            <th
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Review</th>
                                            <th
                                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="client in relationshipClients" :key="client.id"
                                            class="hover:bg-gray-50"
                                            :class="{ 'bg-blue-50': selectedClientsForReview.includes(client.id) }">
                                            <td v-if="reviewMode === 'bulk'" class="px-6 py-4 whitespace-nowrap">
                                                <input type="checkbox" :value="client.id"
                                                    v-model="selectedClientsForReview"
                                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div
                                                            class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                                                            {{ client.name.charAt(0) }}
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <button @click="drillDownToClient(client)"
                                                            class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left">
                                                            {{ client.name }}
                                                        </button>
                                                        <div class="text-sm text-gray-500">{{ client.industry }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                    :class="client.riskFlags > 3 ? 'bg-red-100 text-red-800' : client.riskFlags > 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                                                    {{ client.riskFlags }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                                <span class="text-sm" :class="getRiskLevelClass(client.riskLevel)">{{
                                                    client.riskLevel }}</span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                                <span class="text-sm text-gray-900">{{ getReviewStatus(client) }}</span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                {{ client.lastReview || 'Never' }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <button @click="startRiskInvestigation(client)"
                                                    class="text-blue-600 hover:text-blue-900 mr-3">
                                                    Investigate
                                                </button>
                                                <button @click="markAsReviewed(client)"
                                                    class="text-green-600 hover:text-green-900">
                                                    Mark Reviewed
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Bulk Actions Bar (when bulk mode is active) -->
                            <div v-if="reviewMode === 'bulk' && selectedClientsForReview.length > 0"
                                class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-blue-700">
                                        {{ selectedClientsForReview.length }} client(s) selected
                                    </span>
                                    <div class="space-x-2">
                                        <button @click="bulkMarkAsReviewed"
                                            class="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700">
                                            Mark All as Reviewed
                                        </button>
                                        <button @click="bulkAssignForInvestigation"
                                            class="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Assign for Investigation
                                        </button>
                                        <button @click="selectedClientsForReview = []"
                                            class="px-3 py-1.5 text-xs font-medium bg-gray-600 text-white rounded hover:bg-gray-700">
                                            Clear Selection
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Risk Flag Categories -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">🚩 Risk Flag Categories</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Non-Transactional Flags -->
                                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <span class="mr-2">📄</span> Non-Transactional Flag
                                    </h4>
                                    <div class="space-y-3">
                                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                                            @click="openRiskFlagModal({ category: 'UTR Filed', type: 'reported', riskLevel: 'high', hasData: true })">
                                            <span class="text-sm text-gray-700">UTR Filed</span>
                                            <div class="flex items-center space-x-2">
                                                <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                                            @click="openRiskFlagModal({ category: 'High Risk Industry', type: 'reported', riskLevel: 'medium', hasData: true })">
                                            <span class="text-sm text-gray-700">High Risk Industry</span>
                                            <div class="flex items-center space-x-2">
                                                <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                                            @click="openRiskFlagModal({ category: 'CTR-exemption', type: 'reported', riskLevel: 'low', hasData: true })">
                                            <span class="text-sm text-gray-700">CTR-exemption</span>
                                            <div class="flex items-center space-x-2">
                                                <span class="w-4 h-4 bg-green-500 rounded-full"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- High Risk Transactions -->
                                <div class="bg-red-50 rounded-lg p-4 border border-red-200 md:col-span-2">
                                    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <span class="mr-2">🚨</span> High Risk Transactions
                                    </h4>
                                    <div class="grid grid-cols-2 gap-3">
                                        <div class="space-y-3">
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Cannabis-Related Trx', type: 'transaction', riskLevel: 'medium', hasData: true })">
                                                <span class="text-xs text-gray-700">Cannabis-Related Trx</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-gray-400 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Casino Trx', type: 'transaction', riskLevel: 'medium', hasData: true })">
                                                <span class="text-xs text-gray-700">Casino Trx</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-gray-400 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'High Cash Deposit', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">High Cash Deposit</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'HRJ Trx (ATM/Wire/Debit)', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">HRJ Trx (ATM/Wire/Debit)</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Third Party Check Deposit', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">Third Party Check Deposit</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="space-y-3">
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Cashier Check Purchase', type: 'transaction', riskLevel: 'medium', hasData: true })">
                                                <span class="text-xs text-gray-700">Cashier Check Purchase</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-gray-400 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Crypto Trx', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">Crypto Trx</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'High Cash Withdrawals', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">High Cash Withdrawals</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded transition-colors"
                                                @click="openRiskFlagModal({ category: 'Luxury Goods Trx', type: 'transaction', riskLevel: 'high', hasData: true })">
                                                <span class="text-xs text-gray-700">Luxury Goods Trx</span>
                                                <div class="flex items-center space-x-2">
                                                    <span class="w-4 h-4 bg-red-500 rounded-full"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pending Review Queue -->
                            <div class="mt-6">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">⏳ Pending Risk Reviews</h4>
                                <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="text-sm font-medium text-amber-900">{{ totalPendingRiskReviews }}
                                            reviews
                                            pending action</span>
                                        <button class="text-sm text-amber-700 hover:text-amber-900 font-medium">
                                            View All →
                                        </button>
                                    </div>
                                    <div class="space-y-2">
                                        <div v-for="n in 3" :key="n"
                                            class="flex items-center justify-between p-2 bg-white rounded border border-amber-200">
                                            <div class="flex items-center space-x-3">
                                                <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
                                                <span class="text-sm text-gray-700">Client {{ n }}</span>
                                                <span class="text-xs text-gray-500">High Risk Transaction</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-xs text-amber-600">{{ 5 - n }} days pending</span>
                                                <button
                                                    class="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700">
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Risk Trends & Analysis -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">📈 Risk Trends & Analysis</h3>
                            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <!-- Left Side - Controls -->
                                <div class="lg:col-span-1">
                                    <div class="space-y-4">
                                        <!-- Time Period Selection -->
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-700 mb-2">Time Period</h4>
                                            <div class="space-y-1">
                                                <button @click="selectedRiskTimePeriod = 'ytd'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedRiskTimePeriod === 'ytd' ? 'bg-red-100 text-red-700 border border-red-200 font-medium' : 'text-gray-700 hover:bg-gray-100']">
                                                    Year to Date
                                                </button>
                                                <button @click="selectedRiskTimePeriod = '6m'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedRiskTimePeriod === '6m' ? 'bg-red-100 text-red-700 border border-red-200 font-medium' : 'text-gray-700 hover:bg-gray-100']">
                                                    Last 6 Months
                                                </button>
                                                <button @click="selectedRiskTimePeriod = '12m'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedRiskTimePeriod === '12m' ? 'bg-red-100 text-red-700 border border-red-200 font-medium' : 'text-gray-700 hover:bg-gray-100']">
                                                    Last 12 Months
                                                </button>
                                                <button @click="selectedRiskTimePeriod = '24m'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', selectedRiskTimePeriod === '24m' ? 'bg-red-100 text-red-700 border border-red-200 font-medium' : 'text-gray-700 hover:bg-gray-100']">
                                                    Last 24 Months
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Risk Metric Selection -->
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-700 mb-2">Select Metric</h4>
                                            <div class="space-y-1">
                                                <button @click="selectedRiskMetric = 'high-risk-transactions'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedRiskMetric === 'high-risk-transactions' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 hover:bg-gray-100']">
                                                    <span>🚨 High Risk Transaction Volume</span>
                                                    <span v-if="selectedRiskMetric === 'high-risk-transactions'"
                                                        class="text-red-500">→</span>
                                                </button>
                                                <button @click="selectedRiskMetric = 'risk-flags-reviewed'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedRiskMetric === 'risk-flags-reviewed' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 hover:bg-gray-100']">
                                                    <span>✅ Risk Flags Reviewed</span>
                                                    <span v-if="selectedRiskMetric === 'risk-flags-reviewed'"
                                                        class="text-red-500">→</span>
                                                </button>
                                                <button @click="selectedRiskMetric = 'utr-filed'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedRiskMetric === 'utr-filed' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 hover:bg-gray-100']">
                                                    <span>📄 UTR Filed</span>
                                                    <span v-if="selectedRiskMetric === 'utr-filed'"
                                                        class="text-red-500">→</span>
                                                </button>
                                                <button @click="selectedRiskMetric = 'monthly-transactions'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between', selectedRiskMetric === 'monthly-transactions' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-gray-700 hover:bg-gray-100']">
                                                    <span>💳 Monthly Transactions</span>
                                                    <span v-if="selectedRiskMetric === 'monthly-transactions'"
                                                        class="text-red-500">→</span>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Additional Options -->
                                        <div class="pt-4 border-t border-gray-200">
                                            <label class="flex items-center space-x-2 text-sm text-gray-700">
                                                <input type="checkbox" v-model="showNewRiskFlagsOnly"
                                                    class="rounded border-gray-300">
                                                <span>Show New Flags Only</span>
                                            </label>
                                            <label class="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                                                <input type="checkbox" v-model="compareToIndustryAverage"
                                                    class="rounded border-gray-300">
                                                <span>Compare to Industry Average</span>
                                            </label>
                                        </div>

                                        <!-- High Risk Transaction Options (when high-risk-transactions selected) -->
                                        <div v-if="selectedRiskMetric === 'high-risk-transactions'"
                                            class="pt-4 border-t border-gray-200">
                                            <h4 class="text-sm font-medium text-gray-700 mb-2">Transaction View</h4>
                                            <div class="space-y-1">
                                                <button @click="riskTransactionViewType = 'by-type'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', riskTransactionViewType === 'by-type' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                    By Transaction Type
                                                </button>
                                                <button @click="riskTransactionViewType = 'by-client'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', riskTransactionViewType === 'by-client' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                    By Client
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Monthly Transactions Options (when monthly-transactions selected) -->
                                        <div v-if="selectedRiskMetric === 'monthly-transactions'"
                                            class="pt-4 border-t border-gray-200">
                                            <h4 class="text-sm font-medium text-gray-700 mb-2">Transaction View</h4>
                                            <div class="space-y-1">
                                                <button @click="riskTransactionViewType = 'by-type'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', riskTransactionViewType === 'by-type' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                    By Transaction Type
                                                </button>
                                                <button @click="riskTransactionViewType = 'by-client'"
                                                    :class="['w-full text-left px-3 py-2 text-sm rounded-md transition-colors', riskTransactionViewType === 'by-client' ? 'bg-td-green text-white' : 'text-gray-700 hover:bg-gray-100']">
                                                    By Client
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Side - Chart Display -->
                                <div class="lg:col-span-3">
                                    <div class="bg-gray-50 rounded-lg p-6 h-full">
                                        <!-- Chart Header -->
                                        <div class="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 class="text-lg font-semibold text-gray-900">
                                                    {{ getRiskMetricTitle(selectedRiskMetric) }}
                                                </h4>
                                                <p class="text-sm text-gray-600 mt-1">
                                                    {{ getRiskMetricSubtitle(selectedRiskMetric, selectedRiskTimePeriod) }}
                                                </p>
                                            </div>
                                            <div class="flex items-center space-x-4">
                                                <div class="text-right">
                                                    <div class="text-2xl font-bold text-gray-900">
                                                        {{ getCurrentRiskMetricValue(selectedRiskMetric) }}
                                                    </div>
                                                    <div class="text-sm text-gray-600">Current</div>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-lg font-semibold"
                                                        :class="getRiskMetricChangeClass(selectedRiskMetric)">
                                                        {{ getRiskMetricChange(selectedRiskMetric) }}
                                                    </div>
                                                    <div class="text-sm text-gray-600">vs Prior</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Chart Type Toggle (for High Risk Transactions) -->
                                        <div v-if="selectedRiskMetric === 'high-risk-transactions'"
                                            class="mb-2 flex justify-end">
                                            <div class="inline-flex rounded-md shadow-sm" role="group">
                                                <button @click="riskTransactionViewType = 'by-type'"
                                                    :class="['px-3 py-1 text-sm font-medium', riskTransactionViewType === 'by-type' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50', 'rounded-l-md border border-gray-200']">
                                                    By Transaction Type
                                                </button>
                                                <button @click="riskTransactionViewType = 'by-client'"
                                                    :class="['px-3 py-1 text-sm font-medium', riskTransactionViewType === 'by-client' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50', 'rounded-r-md border-l-0 border border-gray-200']">
                                                    By Client
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Chart Area -->
                                        <div class="h-80">
                                            <!-- High Risk Transactions Chart -->
                                            <BarChart v-if="selectedRiskMetric === 'high-risk-transactions'" :data="getHighRiskTransactionsChartData"
                                                :options="highRiskTransactionsChartOptions" />

                                            <!-- Risk Flags Reviewed Chart -->
                                            <LineChart v-else-if="selectedRiskMetric === 'risk-flags-reviewed'"
                                                :data="getRiskFlagsReviewedChartData" :options="riskFlagsReviewedChartOptions" />

                                            <!-- UTR Filed Chart -->
                                            <BarChart v-else-if="selectedRiskMetric === 'utr-filed'"
                                                :data="getUTRFiledChartData" :options="utrFiledChartOptions" />
                                            
                                            <!-- Monthly Transactions Chart -->
                                            <BarChart v-else-if="selectedRiskMetric === 'monthly-transactions'"
                                                :data="getRiskTransactionsChartData" :options="riskTransactionsChartOptions" />
                                        </div>

                                        <!-- View Details Buttons -->
                                        <div v-if="selectedRiskMetric === 'high-risk-transactions'" class="mt-4 text-center">
                                            <button @click="openTransactionDetailsModal('high-risk')" 
                                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                View High Risk Transaction Details
                                            </button>
                                        </div>

                                        <div v-if="selectedRiskMetric === 'monthly-transactions'" class="mt-4 text-center">
                                            <button @click="openTransactionDetailsModal('risk-monthly')" 
                                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                View Monthly Transaction Details
                                            </button>
                                        </div>

                                        <!-- Chart Legend/Info -->
                                        <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                                            <div class="flex items-center space-x-4">
                                                <div class="flex items-center space-x-2">
                                                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <span>High Risk</span>
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                    <span>Medium Risk</span>
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span>Low Risk</span>
                                                </div>
                                                <div v-if="compareToIndustryAverage" class="flex items-center space-x-2">
                                                    <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                    <span>Industry Average</span>
                                                </div>
                                            </div>
                                            <button class="text-red-600 hover:text-red-700 font-medium">
                                                Export Data →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Risk Portfolio Summary -->
                </div>
            </div>

            <!-- Activity History Tab -->
            <div v-if="activeTab === 'history'">
                <div class="space-y-6">
                    <!-- Filter Controls -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">🕐 Activity History Filters</h3>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                    <select v-model="selectedDateRange"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                        <option value="7d">Last 7 days</option>
                                        <option value="30d">Last 30 days</option>
                                        <option value="90d">Last 90 days</option>
                                        <option value="ytd">Year to date</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                                    <select v-model="selectedActionType"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                        <option value="all">All Actions</option>
                                        <option value="scheduled">Scheduled Meetings</option>
                                        <option value="declined">Declined Recommendations</option>
                                        <option value="risk-reviewed">Risk Reviews</option>
                                        <option value="resolved">Resolved Items</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                    <select v-model="selectedClientFilter"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                                        <option value="all">All Clients</option>
                                        <option v-for="client in relationshipClients" :key="client.id"
                                            :value="client.id">
                                            {{ client.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="flex items-end">
                                    <button @click="exportActivityHistory"
                                        class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                                        Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Summary Stats -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">📊 Activity Summary</h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-green-600">{{ completedMeetingsCount }}</div>
                                    <div class="text-sm text-gray-600">Meetings Completed</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-blue-600">{{ scheduledMeetingsCount }}</div>
                                    <div class="text-sm text-gray-600">Meetings Scheduled</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-orange-600">{{ declinedRecommendationsCount }}
                                    </div>
                                    <div class="text-sm text-gray-600">Recommendations Declined</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-purple-600">{{ resolvedRiskItemsCount }}</div>
                                    <div class="text-sm text-gray-600">Risk Items Resolved</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Completed Recommendations Section -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">✅ Completed Recommendations</h3>
                            <div class="space-y-4">
                                <div v-for="item in filteredCompletedRecommendations" :key="item.id"
                                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-3 mb-2">
                                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                                    :class="getActionStatusClass(item.status)">
                                                    {{ item.status }}
                                                </span>
                                                <span class="text-sm font-medium text-gray-900">{{ item.clientName
                                                }}</span>
                                                <span class="text-xs text-gray-500">{{ formatDate(item.completedDate)
                                                }}</span>
                                            </div>
                                            <p class="text-sm text-gray-700 mb-2">{{ item.recommendation }}</p>
                                            <div class="text-xs text-gray-500">
                                                <span class="font-medium">Product:</span> {{ item.product }} |
                                                <span class="font-medium">Potential:</span> {{
                                                    formatCurrency(item.potential) }}
                                                <span v-if="item.outcome" class="ml-2">| <span
                                                        class="font-medium">Outcome:</span>
                                                    {{ item.outcome }}</span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <button @click="viewItemDetails(item)"
                                                class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="filteredCompletedRecommendations.length === 0"
                                    class="text-center py-8 text-gray-500">
                                    No completed recommendations found for the selected filters.
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reviewed Risk Items Section -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="p-4">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">🛡️ Reviewed Risk Items</h3>
                            <div class="space-y-4">
                                <div v-for="item in filteredReviewedRiskItems" :key="item.id"
                                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center space-x-3 mb-2">
                                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                                    :class="getRiskStatusClass(item.resolution)">
                                                    {{ item.resolution }}
                                                </span>
                                                <span class="text-sm font-medium text-gray-900">{{ item.clientName
                                                }}</span>
                                                <span class="text-xs text-gray-500">{{ formatDate(item.reviewedDate)
                                                }}</span>
                                            </div>
                                            <p class="text-sm text-gray-700 mb-2">{{ item.riskDescription }}</p>
                                            <div class="text-xs text-gray-500">
                                                <span class="font-medium">Type:</span> {{ item.riskType }} |
                                                <span class="font-medium">Severity:</span> {{ item.severity }}
                                                <span v-if="item.notes" class="ml-2">| <span
                                                        class="font-medium">Notes:</span> {{
                                                            item.notes }}</span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <button @click="viewRiskDetails(item)"
                                                class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="filteredReviewedRiskItems.length === 0"
                                    class="text-center py-8 text-gray-500">
                                    No reviewed risk items found for the selected filters.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Modals Section -->
        <template #modals>
            <!-- Alerts Modal -->
            <div v-if="showAlertsModal"
                class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <!-- Modal Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                                    <span class="text-2xl mr-2">⚠️</span>
                                    Client Alerts - {{ relationshipData?.name }}
                                </h3>
                                <p class="text-sm text-gray-600 mt-1">{{ totalActiveAlerts }} active alerts requiring
                                    attention</p>
                            </div>
                            <button @click="closeAlertsModal" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Alert Tabs -->
                        <div class="border-b border-gray-200 mb-4">
                            <nav class="flex space-x-8" aria-label="Alert Tabs">
                                <button @click="activeAlertTab = 'delinquency'"
                                    :class="['flex items-center whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium', activeAlertTab === 'delinquency' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                                    <span class="text-lg mr-2">📋</span>
                                    Loan Delinquency
                                    <span
                                        class="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{
                                            loanDelinquencyAlerts.length }}</span>
                                </button>
                                <button @click="activeAlertTab = 'overdraft'"
                                    :class="['flex items-center whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium', activeAlertTab === 'overdraft' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                                    <span class="text-lg mr-2">💰</span>
                                    Overdraft
                                    <span
                                        class="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{
                                            overdraftAlerts.length }}</span>
                                </button>
                                <button @click="activeAlertTab = 'other'"
                                    :class="['flex items-center whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium', activeAlertTab === 'other' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                                    <span class="text-lg mr-2">⚠️</span>
                                    Other Alerts
                                    <span
                                        class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{
                                            otherAlerts.length }}</span>
                                </button>
                            </nav>
                        </div>

                        <!-- Alert Content -->
                        <div class="max-h-96 overflow-y-auto">
                            <!-- Loan Delinquency Tab -->
                            <div v-if="activeAlertTab === 'delinquency'" class="space-y-4">
                                <div v-for="alert in loanDelinquencyAlerts" :key="alert.id"
                                    class="border border-red-200 rounded-lg p-4 bg-red-50">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <h4 class="font-medium text-red-900">{{ alert.loanType }}</h4>
                                            <span class="text-sm text-red-600">{{ alert.daysPastDue }} days past
                                                due</span>
                                            <span
                                                class="px-2 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full">{{
                                                    alert.severity }}</span>
                                        </div>
                                        <div class="flex space-x-2">
                                            <button @click="reviewAlert(alert)"
                                                class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                                                Review Now
                                            </button>
                                            <button @click="scheduleCall(alert)"
                                                class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                                                Schedule Call
                                            </button>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span class="font-medium text-gray-700">Account:</span>
                                            <p class="text-gray-600">{{ alert.accountNumber }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Amount Due:</span>
                                            <p class="text-red-600 font-semibold">{{ formatCurrency(alert.amountDue) }}
                                            </p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Last Payment:</span>
                                            <p class="text-gray-600">{{ alert.lastPayment }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Client:</span>
                                            <p class="text-gray-600">{{ alert.clientName }}</p>
                                        </div>
                                    </div>
                                    <div class="mt-3 pt-3 border-t border-red-200">
                                        <div class="flex justify-between text-sm">
                                            <span><strong>Total Outstanding:</strong> <span class="text-red-600">{{
                                                formatCurrency(alert.totalOutstanding) }}</span></span>
                                            <span><strong>Original Amount:</strong> {{
                                                formatCurrency(alert.originalAmount)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Overdraft Tab -->
                            <div v-if="activeAlertTab === 'overdraft'" class="space-y-4">
                                <div v-for="alert in overdraftAlerts" :key="alert.id"
                                    class="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <h4 class="font-medium text-yellow-900">{{ alert.accountType }}</h4>
                                            <span class="text-sm text-yellow-600">{{ alert.daysOverdrawn }} days
                                                overdrawn</span>
                                            <span
                                                class="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">{{
                                                    alert.severity }}</span>
                                        </div>
                                        <div class="flex space-x-2">
                                            <button @click="reviewAlert(alert)"
                                                class="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700">
                                                Review Now
                                            </button>
                                            <button @click="scheduleCall(alert)"
                                                class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                                                Schedule Call
                                            </button>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span class="font-medium text-gray-700">Account:</span>
                                            <p class="text-gray-600">{{ alert.accountNumber }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Overdraft Amount:</span>
                                            <p class="text-yellow-600 font-semibold">{{
                                                formatCurrency(alert.overdraftAmount) }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Available Balance:</span>
                                            <p class="text-gray-600">{{ formatCurrency(alert.availableBalance) }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Client:</span>
                                            <p class="text-gray-600">{{ alert.clientName }}</p>
                                        </div>
                                    </div>
                                    <div class="mt-3 pt-3 border-t border-yellow-200">
                                        <div class="flex justify-between text-sm">
                                            <span><strong>Overdraft Limit:</strong> {{
                                                formatCurrency(alert.overdraftLimit)
                                                }}</span>
                                            <span><strong>Fees Accumulated:</strong> <span class="text-yellow-600">{{
                                                formatCurrency(alert.feesAccumulated) }}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Other Alerts Tab -->
                            <div v-if="activeAlertTab === 'other'" class="space-y-4">
                                <div v-for="alert in otherAlerts" :key="alert.id"
                                    class="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <h4 class="font-medium text-blue-900">{{ alert.title }}</h4>
                                            <span class="text-sm text-blue-600">{{ alert.category }}</span>
                                            <span
                                                class="px-2 py-1 text-xs font-medium bg-blue-200 text-blue-800 rounded-full">{{
                                                    alert.severity }}</span>
                                        </div>
                                        <div class="flex space-x-2">
                                            <button @click="reviewAlert(alert)"
                                                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                                                Review Now
                                            </button>
                                            <button @click="scheduleCall(alert)"
                                                class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                                                Contact Client
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-sm text-blue-800 mb-3">
                                        <p>{{ alert.description }}</p>
                                    </div>
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span class="font-medium text-gray-700">Client:</span>
                                            <p class="text-gray-600">{{ alert.clientName }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Due Date:</span>
                                            <p class="text-gray-600">{{ alert.dueDate }}</p>
                                        </div>
                                        <div>
                                            <span class="font-medium text-gray-700">Priority:</span>
                                            <p class="text-gray-600">{{ alert.priority }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <div class="flex space-x-3">
                                <button @click="markAllAsReviewed"
                                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Mark All as Reviewed
                                </button>
                                <button @click="exportAlertReport"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Export Report
                                </button>
                            </div>
                            <button @click="closeAlertsModal"
                                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Risk Investigation Modal -->
            <div v-if="showRiskInvestigationModal"
                class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <!-- Modal Header -->
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                                    <span class="text-2xl mr-2">🔍</span>
                                    Risk Investigation - {{ selectedRiskForInvestigation?.name }}
                                </h3>
                                <p class="text-sm text-gray-600 mt-1">Comprehensive risk analysis and investigation
                                    tools</p>
                            </div>
                            <button @click="showRiskInvestigationModal = false"
                                class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Investigation Content -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <!-- Risk Profile Summary -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-lg font-medium text-gray-900 mb-4">🛡️ Risk Profile Summary</h4>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-700">Risk Level:</span>
                                        <RiskBadge :value="selectedRiskForInvestigation?.riskLevel || 'Medium'"
                                            type="risk" size="sm" />
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-700">Active Risk Flags:</span>
                                        <span
                                            class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                            {{ selectedRiskForInvestigation?.riskFlags || 2 }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-700">Last Risk Review:</span>
                                        <span class="text-sm text-gray-900">{{
                                            getClientLastReview(selectedRiskForInvestigation?.id) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-700">Industry:</span>
                                        <span class="text-sm text-gray-900">{{ selectedRiskForInvestigation?.industry
                                        }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Investigation Actions -->
                            <div class="bg-blue-50 rounded-lg p-4">
                                <h4 class="text-lg font-medium text-gray-900 mb-4">🔧 Investigation Actions</h4>
                                <div class="space-y-2">
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50">
                                        📊 Generate Risk Assessment Report
                                    </button>
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50">
                                        📋 Review Transaction Patterns
                                    </button>
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50">
                                        🔍 Deep Dive Analysis
                                    </button>
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50">
                                        📝 Schedule Risk Review Meeting
                                    </button>
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50">
                                        ⚠️ Escalate to Risk Management
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Risk Flags Detail -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                            <h4 class="text-lg font-medium text-gray-900 mb-4">🚩 Active Risk Flags</h4>
                            <div class="space-y-3">
                                <div
                                    class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                                    <div>
                                        <span class="text-sm font-medium text-red-900">High Risk Transaction
                                            Pattern</span>
                                        <p class="text-xs text-red-700 mt-1">Multiple large cash deposits detected in
                                            the last 30 days</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs text-red-600">High Priority</span>
                                        <button
                                            class="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                            Investigate
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <div>
                                        <span class="text-sm font-medium text-yellow-900">KYC Documentation</span>
                                        <p class="text-xs text-yellow-700 mt-1">Beneficial ownership documentation
                                            requires update</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs text-yellow-600">Medium Priority</span>
                                        <button
                                            class="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                                            Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Actions -->
                        <div class="flex justify-between">
                            <div class="flex space-x-3">
                                <button @click="markClientAsReviewed"
                                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Mark as Reviewed
                                </button>
                                <button @click="assignRiskReviewer"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Assign Reviewer
                                </button>
                                <button @click="generateRiskReport"
                                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                    Generate Report
                                </button>
                            </div>
                            <button @click="showRiskInvestigationModal = false"
                                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BaseDetailView>

    <!-- Hidden Relationships Modal -->
    <div v-if="showHiddenRelationshipsModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showHiddenRelationshipsModal = false">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">🔍 Hidden Relationship Analysis</h2>
                        <p class="text-sm text-gray-500 mt-1">Detecting undisclosed relationships across entities</p>
                    </div>
                    <button @click="showHiddenRelationshipsModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <!-- Warning Banner -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                            <svg class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-red-800">High Risk: Hidden Relationships Detected</h3>
                            <p class="text-sm text-red-700 mt-1">Our AI system has identified potential undisclosed
                                relationships that require immediate attention.</p>
                        </div>
                    </div>
                </div>

                <!-- Hidden Relationships Analysis -->
                <div class="space-y-6">
                    <!-- Relationship 1 -->
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">Suspicious Connection #1</h4>
                            <span class="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Critical
                                Risk</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Within Relationship -->
                            <div class="bg-white rounded-lg p-4 border border-green-200">
                                <h5 class="text-sm font-medium text-green-800 mb-3 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    Within Current Relationship
                                </h5>
                                <div class="space-y-2">
                                    <div class="text-sm">
                                        <span class="font-medium">Client:</span> Johnson Holdings Group
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Account:</span> *****4891 (Operating)
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Authorized Signer:</span> Michael R. Johnson
                                    </div>
                                </div>
                            </div>

                            <!-- Hidden External -->
                            <div class="bg-white rounded-lg p-4 border border-red-200">
                                <h5 class="text-sm font-medium text-red-800 mb-3 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    Hidden External Relationship
                                </h5>
                                <div class="space-y-2">
                                    <div class="text-sm">
                                        <span class="font-medium">Client:</span> MRJ Consulting LLC <span
                                            class="text-red-600">(Not in relationship)</span>
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Account:</span> *****7832 (Business Checking)
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Owner:</span> Michael R. Johnson <span
                                            class="text-red-600">(Same individual)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <h6 class="text-sm font-medium text-yellow-800 mb-2">Risk Indicators</h6>
                            <ul class="text-sm text-yellow-700 space-y-1">
                                <li>• Same individual controlling entities outside declared relationship</li>
                                <li>• Frequent transfers between accounts ($2.3M in last 6 months)</li>
                                <li>• Undisclosed cross-guarantees detected in loan documentation</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Relationship 2 -->
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">Suspicious Connection #2</h4>
                            <span
                                class="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Medium
                                Risk</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Within Relationship -->
                            <div class="bg-white rounded-lg p-4 border border-green-200">
                                <h5 class="text-sm font-medium text-green-800 mb-3 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    Within Current Relationship
                                </h5>
                                <div class="space-y-2">
                                    <div class="text-sm">
                                        <span class="font-medium">Client:</span> Johnson Manufacturing LLC
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Account:</span> *****2156 (Treasury Mgmt)
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Beneficial Owner:</span> Sarah L. Johnson (25%)
                                    </div>
                                </div>
                            </div>

                            <!-- Hidden External -->
                            <div class="bg-white rounded-lg p-4 border border-orange-200">
                                <h5 class="text-sm font-medium text-orange-800 mb-3 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    Potential Hidden Relationship
                                </h5>
                                <div class="space-y-2">
                                    <div class="text-sm">
                                        <span class="font-medium">Client:</span> SLJ Properties Group <span
                                            class="text-orange-600">(External)</span>
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Account:</span> *****9445 (Commercial Loan)
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-medium">Guarantor:</span> Sarah L. Johnson <span
                                            class="text-orange-600">(Potential match)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 p-3 bg-orange-50 rounded-lg">
                            <h6 class="text-sm font-medium text-orange-800 mb-2">Risk Indicators</h6>
                            <ul class="text-sm text-orange-700 space-y-1">
                                <li>• Similar name patterns suggest family relationship</li>
                                <li>• Shared collateral across separate credit facilities</li>
                                <li>• Requires enhanced due diligence to confirm connection</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Action Required -->
                <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-800 mb-2">Recommended Actions</h4>
                    <ul class="text-sm text-blue-700 space-y-1">
                        <li>• Schedule immediate client meeting to discuss relationship structure</li>
                        <li>• Update Know Your Customer (KYC) documentation</li>
                        <li>• Review and adjust credit limits for relationship aggregation</li>
                        <li>• Document findings in client risk profile</li>
                    </ul>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500">
                        Analysis generated using AI-powered relationship mapping • Last updated: {{ new
                            Date().toLocaleDateString() }}
                    </div>
                    <div class="flex space-x-3">
                        <button @click="showHiddenRelationshipsModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Close
                        </button>
                        <button
                            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                            Flag for Investigation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Risk Flag Details Modal -->
    <div v-if="showRiskFlagModal && selectedRiskFlag"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeRiskFlagModal">
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4">
            <!-- Modal Header -->
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="selectedRiskFlag.riskLevel === 'high' ? 'bg-red-500' :
                            selectedRiskFlag.riskLevel === 'medium' ? 'bg-yellow-500' :
                                selectedRiskFlag.riskLevel === 'low' ? 'bg-green-500' : 'bg-gray-400'">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    v-if="selectedRiskFlag.riskLevel === 'high' || selectedRiskFlag.riskLevel === 'medium'"
                                    fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                                <path v-else-if="selectedRiskFlag.riskLevel === 'low'" fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                                <path v-else fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">{{ selectedRiskFlag.category }} -
                                Investigation
                                Details
                            </h3>
                            <p class="text-sm text-gray-600 mt-1">{{ selectedRiskFlag.type || 'Risk flag analysis' }} |
                                Risk
                                Level: {{
                                    selectedRiskFlag.riskLevel || 'Medium' }}</p>
                        </div>
                        <span class="px-3 py-1 text-sm font-medium rounded-full" :class="selectedRiskFlag.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                            selectedRiskFlag.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                selectedRiskFlag.riskLevel === 'low' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                            {{ selectedRiskFlag.riskLevel || 'Medium' }} Risk
                        </span>
                    </div>
                    <button @click="closeRiskFlagModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div v-if="generateRiskFlagData(selectedRiskFlag.category)" class="space-y-6">

                    <!-- Summary Section -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 class="text-lg font-medium text-blue-900 mb-2">📋 Risk Assessment Summary</h4>
                        <p class="text-sm text-blue-800">{{ generateRiskFlagData(selectedRiskFlag.category).summary }}
                        </p>
                    </div>

                    <!-- UTR Volume Data Section -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).volumeData"
                        class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">📊 UTR Filing Volume</h4>
                        <div class="grid grid-cols-4 gap-4 mb-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-red-600">{{
                                    generateRiskFlagData(selectedRiskFlag.category).volumeData.totalCount }}</div>
                                <div class="text-xs text-gray-500">Total UTRs Filed</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600">{{
                                    generateRiskFlagData(selectedRiskFlag.category).volumeData.currentMonth }}</div>
                                <div class="text-xs text-gray-500">Current Month</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-600">{{
                                    generateRiskFlagData(selectedRiskFlag.category).volumeData.previousMonth }}</div>
                                <div class="text-xs text-gray-500">Previous Month</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold"
                                    :class="generateRiskFlagData(selectedRiskFlag.category).volumeData.trend === 'increasing' ? 'text-red-600' : 'text-green-600'">
                                    {{ generateRiskFlagData(selectedRiskFlag.category).volumeData.trend === 'increasing'
                                    ?
                                    '↗️' : '↘️'
                                    }}
                                </div>
                                <div class="text-xs text-gray-500">Trend</div>
                            </div>
                        </div>
                        <div class="h-48">
                            <LineChart :data="generateRiskFlagData(selectedRiskFlag.category).chartData"
                                :options="modalChartOptions" />
                        </div>
                    </div>

                    <!-- Industry Details Section -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).industryDetails"
                        class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">🏭 Industry Risk Assessment</h4>
                        <div class="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <h5 class="font-medium text-gray-900 mb-2">Business Information</h5>
                                <div class="space-y-2 text-sm">
                                    <div><span class="font-medium">Industry:</span> {{
                                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.primaryIndustry
                                        }}
                                    </div>
                                    <div><span class="font-medium">NAICS Code:</span> {{
                                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.naicsCode }}
                                    </div>
                                    <div><span class="font-medium">Risk Rating:</span>
                                        <span class="px-2 py-1 rounded text-xs bg-red-100 text-red-800">{{
                                            generateRiskFlagData(selectedRiskFlag.category).industryDetails.riskRating
                                            }}</span>
                                    </div>
                                    <div><span class="font-medium">CTR Exempt:</span>
                                        <span
                                            :class="generateRiskFlagData(selectedRiskFlag.category).industryDetails.ctrExempt ? 'text-green-600' : 'text-red-600'">
                                            {{ generateRiskFlagData(selectedRiskFlag.category).industryDetails.ctrExempt
                                            ?
                                            'Yes' : 'No' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 class="font-medium text-gray-900 mb-2">Flag Status</h5>
                                <div class="space-y-3">
                                    <div class="border border-gray-200 rounded p-3">
                                        <div class="flex items-center mb-1">
                                            <div class="w-3 h-3 bg-white border-2 border-gray-400 rounded-full mr-2">
                                            </div>
                                            <span class="font-medium text-sm">White Flag</span>
                                            <span class="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">{{
                                                generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.status
                                                }}</span>
                                        </div>
                                        <div class="text-xs text-gray-600 ml-5">{{
                                            generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.reason
                                            }}</div>
                                        <div class="text-xs text-gray-500 ml-5 mt-1">Next Review: {{
                                            generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.nextReview
                                            }}</div>
                                    </div>
                                    <div class="border border-gray-200 rounded p-3">
                                        <div class="flex items-center mb-1">
                                            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                            <span class="font-medium text-sm">Red Flag</span>
                                            <span class="ml-2 px-2 py-1 rounded text-xs bg-red-100 text-red-800">{{
                                                generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.status
                                                }}</span>
                                        </div>
                                        <div class="text-xs text-gray-600 ml-5">{{
                                            generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.reason
                                            }}</div>
                                        <div class="text-xs text-gray-500 ml-5 mt-1">
                                            <div v-for="trigger in generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.triggers"
                                                :key="trigger" class="mb-1">• {{ trigger }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Monthly Volume Data Section -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).monthlyVolume"
                        class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">📈 Monthly Transaction Volume</h4>
                        <div class="grid grid-cols-4 gap-4 mb-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600">{{
                                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.totalAmount)
                                    }}</div>
                                <div class="text-xs text-gray-500">Total (8 Months)</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600">{{
                                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.currentMonth)
                                    }}</div>
                                <div class="text-xs text-gray-500">Current Month</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-600">{{
                                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.previousMonth)
                                    }}</div>
                                <div class="text-xs text-gray-500">Previous Month</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold"
                                    :class="generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.trend === 'increasing' ? 'text-red-600' : 'text-green-600'">
                                    {{ generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.trend ===
                                        'increasing'
                                    ? '↗️' :
                                    '↘️'
                                    }}
                                </div>
                                <div class="text-xs text-gray-500">Trend</div>
                            </div>
                        </div>
                        <div class="h-48">
                            <LineChart :data="generateRiskFlagData(selectedRiskFlag.category).chartData"
                                :options="modalChartOptions" />
                        </div>
                    </div>

                    <!-- Flag Details Section (for non-transaction flags) -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).flagDetails">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">🚩 Flag Details & Notes</h4>
                        <div class="space-y-4">
                            <div v-for="detail in generateRiskFlagData(selectedRiskFlag.category).flagDetails"
                                :key="detail.date || detail.category"
                                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div v-if="detail.officer" class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">{{ formatDate(detail.date) }}
                                        </div>
                                        <div class="text-sm text-gray-700 mt-1">{{ detail.note }}</div>
                                        <div class="text-xs text-gray-500 mt-1">Officer: {{ detail.officer }}</div>
                                    </div>
                                    <div class="flex flex-col items-end">
                                        <span class="text-xs px-2 py-1 rounded" :class="detail.status === 'Filed' ? 'bg-green-100 text-green-800' :
                                            detail.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'">
                                            {{ detail.status }}
                                        </span>
                                        <span class="text-xs text-gray-500 mt-1">{{ detail.referenceNo }}</span>
                                    </div>
                                </div>
                                <div v-else class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">{{ detail.category }}</div>
                                        <div class="text-sm text-gray-700 mt-1">{{ detail.detail }}</div>
                                        <div class="text-xs text-gray-500 mt-1">Last Review: {{
                                            formatDate(detail.lastReview) }}</div>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded" :class="detail.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                        detail.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            detail.riskLevel === 'Compliant' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'">
                                        {{ detail.riskLevel }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Transaction Details Section -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).transactions">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">💳 Transaction Details</h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th
                                            class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="transaction in generateRiskFlagData(selectedRiskFlag.category).transactions"
                                        :key="transaction.date + transaction.amount" class="hover:bg-gray-50">
                                        <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(transaction.date) }}
                                        </td>
                                        <td class="px-4 py-4 text-sm font-medium text-right"
                                            :class="transaction.amount >= 10000 ? 'text-red-600' : 'text-gray-900'">
                                            {{ formatCurrency(transaction.amount) }}
                                        </td>
                                        <td class="px-4 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                                        <td class="px-4 py-4 text-sm text-gray-500">
                                            <!-- UTR Filed Details -->
                                            <div v-if="selectedRiskFlag.category === 'UTR Filed'">
                                                <div class="font-medium">{{ transaction.referenceNo }}</div>
                                                <div class="text-xs text-gray-400">Officer: {{ transaction.officer }}
                                                </div>
                                                <div class="text-xs"
                                                    :class="transaction.status === 'Filed' ? 'text-green-600' : 'text-yellow-600'">
                                                    {{
                                                    transaction.status }}</div>
                                            </div>

                                            <!-- Cash Transaction Details -->
                                            <div v-else-if="selectedRiskFlag.category.includes('Cash')">
                                                <div class="font-medium">{{ transaction.branch }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.teller ||
                                                    transaction.manager }}</div>
                                                <div v-if="transaction.purpose" class="text-xs text-gray-500">{{
                                                    transaction.purpose }}</div>
                                            </div>

                                            <!-- Third Party Cheque Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Third Party Check Deposit'">
                                                <div class="font-medium">{{ transaction.drawer }}</div>
                                                <div class="text-xs text-gray-400">Bank: {{ transaction.bank }}</div>
                                                <div class="text-xs text-gray-500">Payee: {{ transaction.payee }}</div>
                                            </div>

                                            <!-- Crypto Transaction Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Crypto Trx'">
                                                <div class="font-medium">{{ transaction.exchange }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.crypto }} ({{
                                                    transaction.type }})</div>
                                                <div class="text-xs text-gray-500">{{ transaction.wallet }}</div>
                                            </div>

                                            <!-- Luxury Goods Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Luxury Goods Trx'">
                                                <div class="font-medium">{{ transaction.merchant }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.category }}</div>
                                                <div class="text-xs text-gray-500">{{ transaction.location }}</div>
                                            </div>

                                            <!-- Casino Transaction Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Casino Trx'">
                                                <div class="font-medium">{{ transaction.casino }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.type }}</div>
                                                <div class="text-xs text-gray-500">{{ transaction.location }}</div>
                                            </div>

                                            <!-- HRJ Transaction Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'HRJ Trx (ATM/Wire/Debit)'">
                                                <div class="font-medium">{{ transaction.type }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.country }}{{
                                                    transaction.city ? ', ' +
                                                    transaction.city : '' }}</div>
                                                <div v-if="transaction.bank" class="text-xs text-gray-500">{{
                                                    transaction.bank }}</div>
                                                <div v-if="transaction.terminal" class="text-xs text-gray-500">{{
                                                    transaction.terminal }}
                                                </div>
                                                <div v-if="transaction.status" class="text-xs text-red-600 font-medium">
                                                    {{
                                                    transaction.status
                                                    }}
                                                </div>
                                            </div>

                                            <!-- Cashier Check Purchase Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Cashier Check Purchase'">
                                                <div class="font-medium">{{ transaction.payee }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.purpose }}</div>
                                                <div class="text-xs text-gray-500">{{ transaction.branch }}</div>
                                            </div>

                                            <!-- Cannabis Transaction Details -->
                                            <div v-else-if="selectedRiskFlag.category === 'Cannabis-Related Trx'">
                                                <div class="font-medium">{{ transaction.merchant }}</div>
                                                <div class="text-xs text-gray-400">{{ transaction.category ||
                                                    transaction.license }}</div>
                                                <div class="text-xs text-gray-500">{{ transaction.location }}</div>
                                            </div>

                                            <!-- Default Details -->
                                            <div v-else>
                                                <div class="text-xs text-gray-500">{{ transaction.purpose ||
                                                    transaction.note || 'N/A' }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 text-sm text-gray-500">{{ transaction.time || 'N/A' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Investigations Section -->
                    <div v-if="generateRiskFlagData(selectedRiskFlag.category).investigations">
                        <h4 class="text-lg font-medium text-gray-900 mb-4">🔍 Active Investigations</h4>
                        <div class="space-y-3">
                            <div v-for="investigation in generateRiskFlagData(selectedRiskFlag.category).investigations"
                                :key="investigation.id" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">{{ investigation.id }}</div>
                                        <div class="text-sm text-gray-700 mt-1">{{ investigation.description }}</div>
                                        <div class="text-xs text-gray-500 mt-1">Assigned to: {{ investigation.assignedTo
                                            }}
                                        </div>
                                    </div>
                                    <span class="text-xs px-2 py-1 rounded" :class="investigation.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                        investigation.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                            investigation.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                investigation.priority === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'">
                                        {{ investigation.priority }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button @click="closeRiskFlagModal"
                            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                            Close
                        </button>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Generate Report
                        </button>
                        <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Flag for Investigation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="showTransactionDetailsModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeTransactionDetailsModal">
        <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden mx-4">
            <!-- Modal Header -->
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6 rounded-full bg-td-green flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">📄 Transaction Details</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-medium"
                            :class="transactionModalType === 'high-risk' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'">
                            {{ getTransactionModalTitle() }}
                        </span>
                    </div>
                    <button @click="closeTransactionDetailsModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div class="flex items-center justify-between mb-6">
                    <h4 class="text-lg font-medium text-gray-900">Johnson Manufacturing LLC - Individual Transaction History</h4>
                </div>

                <!-- Filters -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">From:</label>
                            <input type="date" v-model="transactionFilters.dateFrom" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-td-green focus:border-td-green">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">To:</label>
                            <input type="date" v-model="transactionFilters.dateTo" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-td-green focus:border-td-green">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Type:</label>
                            <select v-model="transactionFilters.type" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-td-green focus:border-td-green">
                                <option value="">All Types</option>
                                <option value="Wire">Wire</option>
                                <option value="Transfer">Transfer</option>
                                <option value="ACH">ACH</option>
                                <option value="Check">Check</option>
                            </select>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="applyTransactionFilters" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Apply Filters
                            </button>
                            <button @click="resetTransactionFilters" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="text-xs text-green-600 font-medium mb-1">Total Inflows</div>
                        <div class="text-2xl font-bold text-green-700">$1.5M</div>
                        <div class="text-xs text-green-600">51 transactions</div>
                    </div>
                    <div class="bg-red-50 rounded-lg p-4">
                        <div class="text-xs text-red-600 font-medium mb-1">Total Outflows</div>
                        <div class="text-2xl font-bold text-red-700">$838.1K</div>
                        <div class="text-xs text-red-600">49 transactions</div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="text-xs text-blue-600 font-medium mb-1">Net Amount</div>
                        <div class="text-2xl font-bold text-blue-700">$645.0K</div>
                        <div class="text-xs text-blue-600">100 total transactions</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="text-xs text-gray-600 font-medium mb-1">Average Amount</div>
                        <div class="text-2xl font-bold text-gray-700">$23.2K</div>
                        <div class="text-xs text-gray-600">Per transaction</div>
                    </div>
                </div>

                <!-- Transaction Table -->
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="transaction in getFilteredTransactions()" :key="transaction.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ transaction.date }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                                            :class="getTransactionTypeClass(transaction.type)">
                                            {{ transaction.type }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.account }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                        :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'">
                                        {{ formatCurrency(Math.abs(transaction.amount)) }}
                                        <span class="ml-1">{{ transaction.amount > 0 ? '↗' : '↘' }}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                                            :class="getStatusClass(transaction.status)">
                                            {{ transaction.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span v-if="transaction.risk" class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                            {{ transaction.risk }}
                                        </span>
                                        <span v-else class="text-gray-400">-</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div class="flex justify-end space-x-3">
                    <button @click="closeTransactionDetailsModal"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        Close
                    </button>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Export to CSV
                    </button>
                    <button v-if="transactionModalType === 'high-risk'" 
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Flag for Review
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clients, relationships, relationshipManagers } from '../data/mockData.js'
// Import chart components
import BarChart from './charts/BarChart.vue'
import LineChart from './charts/LineChart.vue'
// Import new shared components
import BaseDetailView from './shared/BaseDetailView.vue'
import DetailViewHeader from './shared/DetailViewHeader.vue'
import KPICard from './shared/KPICard.vue'
import AlertIndicator from './shared/AlertIndicator.vue'
import RiskBadge from './shared/RiskBadge.vue'
import ProductDotIndicator from './shared/ProductDotIndicator.vue'

const props = defineProps({
    regionId: String,
    rmId: String,
    relationshipId: String
})

const router = useRouter()

// Get RM data from mockData
const rmData = computed(() => {
    return relationshipManagers.find(rm => rm.id === props.rmId) || {
        id: props.rmId,
        name: 'Relationship Manager'
    }
})

// Reactive state
const activeTab = ref('portfolio')
const showAlertsModal = ref(false)
const showHiddenRelationshipsModal = ref(false)
const showRiskFlagModal = ref(false)
const selectedRiskFlag = ref(null)
const showTransactionDetailsModal = ref(false)
const transactionModalType = ref('')
const activeAlertTab = ref('delinquency')
const selectedTimePeriod = ref('12m') // Default to 12 months
const selectedTrendMetric = ref('deposits') // Default trend metric
const showNewOnly = ref(false) // Show new data only filter
const compareToTarget = ref(false) // Compare to target filter
const currentRecommendationPage = ref(1) // Current page for recommendations
const expandedClient = ref(null) // Track expanded client for AI recommendations
const chartViewType = ref('client') // 'client' or 'product' for stacked bar charts
const transactionViewType = ref('by-type') // 'by-type' or 'by-client' for transaction charts
const recommendationsPerPage = 5 // Number of recommendations per page

// Risk Trends & Analysis reactive variables
const selectedRiskTimePeriod = ref('12m') // Default to 12 months for risk trends
const selectedRiskMetric = ref('high-risk-transactions') // Default risk metric
const showNewRiskFlagsOnly = ref(false) // Show new risk flags only filter
const compareToIndustryAverage = ref(false) // Compare to industry average filter
const riskTransactionViewType = ref('by-type') // 'by-type' or 'by-client' for risk transaction charts

// Transaction Details Modal state
const transactionFilters = ref({
    dateFrom: '2025-06-28',
    dateTo: '2025-07-28',
    type: ''
})

// Enhanced Risk Review Dashboard state
const reviewMode = ref('standard') // 'standard' or 'bulk'
const selectedClientsForReview = ref([]) // Array of selected client IDs for bulk actions
const showRiskInvestigationModal = ref(false)
const selectedRiskForInvestigation = ref(null)

// Activity History filters
const selectedDateRange = ref('30d')
const selectedActionType = ref('all')
const selectedClientFilter = ref('all')

// Johnson Holdings Group relationship data
const relationshipData = ref({
    id: 'rel-001',
    name: 'Johnson Holdings Group',
    primaryIndustry: 'Manufacturing',
    hqLocation: 'Chicago, IL',
    ultimateParent: {
        name: 'Johnson Holdings Group',
        ownership: 100
    }
})

const relationshipManager = ref({
    name: 'Sarah Johnson',
    id: 'rm-001'
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

// Computed properties
const breadcrumb = computed(() => {
    const regionName = props.regionId ? props.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Region'
    const rmName = rmData.value?.name || 'RM'
    return `Regional VPs › ${regionName} › ${rmName} › ${relationshipData.value?.name}`
})

const relationshipTier = computed(() => {
    // Determine relationship type based on client portfolio composition
    const totalDeposits = aggregateDeposits.value
    const totalLoans = aggregateLoans.value

    const hasDeposits = totalDeposits > 0
    const hasLoans = totalLoans > 0

    if (hasDeposits && hasLoans) {
        return 'Credit and Deposit'
    } else if (hasLoans) {
        return 'Credit Only'
    } else if (hasDeposits) {
        return 'Deposit Only'
    } else {
        return 'Credit and Deposit' // Default fallback
    }
})

const totalClients = computed(() => relationshipClients.value.length)
const aggregateDeposits = computed(() => relationshipClients.value.reduce((sum, client) => sum + client.deposits, 0))
const aggregateLoans = computed(() => relationshipClients.value.reduce((sum, client) => sum + client.loans, 0))
const loanUtilization = computed(() => {
    const totalCommitments = aggregateLoans.value * 1.3 // Assuming 30% headroom
    return totalCommitments > 0 ? ((aggregateLoans.value / totalCommitments) * 100).toFixed(1) : 0
})
const annualRevenue = computed(() => relationshipClients.value.reduce((sum, client) => sum + client.revenue, 0))

// New computed properties
const totalInflow = computed(() => {
    // Calculate total inflow as sum of deposits plus estimated transaction flow
    const deposits = aggregateDeposits.value
    const estimatedTransactionFlow = deposits * 0.15 // Assume 15% transaction flow relative to deposits
    return deposits + estimatedTransactionFlow
})


const inflowPercentile = computed(() => Math.floor(Math.random() * 40) + 60) // 60-99th percentile

const crossSellIndex = computed(() => {
    const totalProducts = relationshipClients.value.reduce((sum, client) => {
        return sum + Object.values(client.products).filter(Boolean).length
    }, 0)
    return (totalProducts / (relationshipClients.value.length * 7)).toFixed(1) // 7 possible products
})

const totalRiskFlags = computed(() => 8)
const coveragePercentage = computed(() => {
    const avgCoverage = relationshipClients.value.reduce((sum, client) => sum + client.coverage, 0) / relationshipClients.value.length
    return Math.round(avgCoverage)
})
const lastEddDate = computed(() => '2024-11-15')
const nextReviewDate = computed(() => '2025-02-15')

// Percentiles (mock data)
const clientsPercentile = computed(() => 85)
const depositsPercentile = computed(() => 92)
const loansPercentile = computed(() => 88)
const utilizationPercentile = computed(() => 76)
const revenuePercentile = computed(() => 89)
const riskFlagsPercentile = computed(() => 12) // Lower percentile for risk flags (bad metric)
const unreviewedPercentile = computed(() => 8) // Lower percentile for unreviewed (bad metric)

const totalUnreviewed = computed(() => {
    // Calculate unreviewed clients based on last review dates
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

    return relationshipClients.value.filter(client => {
        const lastReview = clients[client.id]?.lastReview
        if (!lastReview) return true
        return new Date(lastReview) < thirtyDaysAgo
    }).length
})

const relationshipClients = computed(() => {
    // Get Johnson Holdings Group clients (rel-001)
    const johnsonClients = Object.values(clients).filter(client => client.relationshipId === 'rel-001')

    return johnsonClients.map(client => {
        const riskFlagCount = client.riskFlags?.length || 0

        // Determine risk level based on risk flags (replacing RCI)
        let riskLevel = 'Low'
        if (riskFlagCount > 3) riskLevel = 'High'
        else if (riskFlagCount > 1) riskLevel = 'Medium'

        // Determine review status for enhanced tracking
        let reviewStatus = 'Current'
        if (riskFlagCount > 2) reviewStatus = 'Urgent Review Required'
        else if (riskFlagCount > 0) reviewStatus = 'Review Pending'

        return {
            id: client.id,
            name: client.name,
            industry: client.industry,
            deposits: client.productSummary?.deposit?.balance || client.portfolioValue * 0.6,
            loans: client.productSummary?.lending?.balance || client.portfolioValue * 0.3,
            revenue: client.annualRevenue,
            coverage: client.productPenetration,
            riskLevel: riskLevel, // New enhanced risk level
            riskFlags: riskFlagCount,
            reviewStatus: reviewStatus,
            lastReviewDate: client.lastReview || '2024-11-15',
            assignedReviewer: riskFlagCount > 2 ? 'Unassigned' : 'John Smith',
            products: {
                deposits: client.productSummary?.deposit?.accounts > 0,
                loans: client.productSummary?.lending?.accounts > 0,
                treasury: client.productSummary?.treasury?.accounts > 0,
                fx: Math.random() > 0.5, // Mock FX data
                trade: Math.random() > 0.7, // Mock trade data
                investment: client.productSummary?.wealth?.accounts > 0,
                insurance: Math.random() > 0.6 // Mock insurance data
            }
        }
    })
})

const keyContacts = computed(() => {
    // Get contacts from Johnson Manufacturing LLC (main client)
    const mainClient = clients['client-001']
    if (!mainClient?.beneficialOwners) return []

    return mainClient.beneficialOwners.map((owner, index) => ({
        id: index + 1,
        name: owner.name,
        role: owner.role,
        coverage: owner.ownership ? parseInt(owner.ownership.replace('%', '')) : 0
    }))
})


const crossSellGaps = computed(() => {
    const gaps = []
    const products = ['treasury', 'fx', 'trade', 'investment', 'insurance']

    products.forEach(product => {
        const clientsWithoutProduct = relationshipClients.value.filter(client => !client.products[product])
        if (clientsWithoutProduct.length > 0) {
            gaps.push({
                product: product.charAt(0).toUpperCase() + product.slice(1) + ' Services',
                missingCount: clientsWithoutProduct.length,
                potentialRevenue: `$${(clientsWithoutProduct.length * 150000).toLocaleString()} annually`,
                clients: clientsWithoutProduct.map(c => c.name)
            })
        }
    })

    return gaps.slice(0, 3) // Show top 3 gaps
})

const allRecommendations = computed(() => [
    {
        id: 1,
        client: 'Johnson Manufacturing LLC',
        recommendation: 'Expand lending facilities to support increased production capacity and working capital needs',
        reason: 'Recent $15M equipment purchase and 35% YoY revenue growth indicates need for additional working capital',
        confidence: 94,
        potential: 450000,
        priority: 'High',
        product: 'Commercial Lending'
    },
    {
        id: 2,
        client: 'Johnson Holdings Group - Subsidiary A',
        recommendation: 'Treasury Management solutions to optimize cash flow across multiple manufacturing locations',
        reason: 'High transaction volume across 3 locations with manual reconciliation processes',
        confidence: 89,
        potential: 320000,
        priority: 'Medium',
        product: 'Treasury Management'
    },
    {
        id: 3,
        client: 'Johnson Holdings Group - Subsidiary B',
        recommendation: 'Supply chain financing to support rapid expansion and Detroit operations',
        reason: 'New Detroit facility requires vendor financing solutions for 15+ suppliers',
        confidence: 86,
        potential: 280000,
        priority: 'Medium',
        product: 'Trade Finance'
    },
    {
        id: 4,
        client: 'Johnson Manufacturing LLC',
        recommendation: 'FX hedging solutions for international supplier payments',
        reason: '40% of suppliers are international with $8M monthly FX exposure',
        confidence: 91,
        potential: 180000,
        priority: 'High',
        product: 'FX Services'
    },
    {
        id: 5,
        client: 'Johnson Holdings Group - Subsidiary A',
        recommendation: 'Equipment financing for technology upgrade initiative',
        reason: 'Planned $10M technology upgrade in Q2 2025',
        confidence: 82,
        potential: 150000,
        priority: 'Low',
        product: 'Equipment Finance'
    },
    {
        id: 6,
        client: 'Johnson Holdings Group - Subsidiary B',
        recommendation: 'Payroll services integration with existing treasury platform',
        reason: '500+ employees across locations with complex payroll requirements',
        confidence: 78,
        potential: 120000,
        priority: 'Low',
        product: 'Payroll Services'
    },
    {
        id: 7,
        client: 'Johnson Manufacturing LLC',
        recommendation: 'Directors & Officers liability insurance for board expansion',
        reason: 'Adding 3 independent board members in 2025',
        confidence: 85,
        potential: 95000,
        priority: 'Medium',
        product: 'Insurance Services'
    }
])

// Old aiRecommendations for backward compatibility
const aiRecommendations = computed(() => allRecommendations.value.slice(0, 3))

// Paginated recommendations
const paginatedRecommendations = computed(() => {
    const start = (currentRecommendationPage.value - 1) * recommendationsPerPage
    const end = start + recommendationsPerPage
    return allRecommendations.value.slice(start, end)
})

const totalRecommendationPages = computed(() =>
    Math.ceil(allRecommendations.value.length / recommendationsPerPage)
)


// Activity History Data
const completedActions = computed(() => [
    {
        id: 1,
        type: 'recommendation',
        status: 'Meeting Completed',
        clientName: 'Johnson Manufacturing LLC',
        clientId: 'client-001',
        recommendation: 'Expand lending facilities to support increased production capacity',
        product: 'Commercial Lending',
        potential: 450000,
        completedDate: '2024-12-15',
        outcome: 'Meeting held - client interested, proposal sent'
    },
    {
        id: 2,
        type: 'recommendation',
        status: 'Scheduled',
        clientName: 'Johnson Holdings Group - Subsidiary A',
        clientId: 'client-002',
        recommendation: 'Treasury Management solutions to optimize cash flow',
        product: 'Treasury Management',
        potential: 320000,
        completedDate: '2024-12-10',
        outcome: 'Meeting scheduled for next week'
    },
    {
        id: 3,
        type: 'recommendation',
        status: 'Declined',
        clientName: 'Johnson Holdings Group - Subsidiary B',
        clientId: 'client-003',
        recommendation: 'Supply chain financing for rapid expansion',
        product: 'Trade Finance',
        potential: 280000,
        completedDate: '2024-12-08',
        outcome: 'Client not interested at this time'
    },
    {
        id: 4,
        type: 'risk',
        resolution: 'Resolved',
        clientName: 'Johnson Manufacturing LLC',
        clientId: 'client-001',
        riskDescription: 'High transaction volume flagged for review',
        riskType: 'Transaction Pattern',
        severity: 'Medium',
        reviewedDate: '2024-12-12',
        notes: 'Verified legitimate business activity'
    },
    {
        id: 5,
        type: 'risk',
        resolution: 'UTR Filed',
        clientName: 'Johnson Holdings Group - Subsidiary A',
        clientId: 'client-002',
        riskDescription: 'Suspicious wire transfer pattern detected',
        riskType: 'AML Alert',
        severity: 'High',
        reviewedDate: '2024-12-05',
        notes: 'Filed UTR with FinCEN'
    }
])

// Activity History Computed Properties
const totalCompletedActions = computed(() => completedActions.value.length)

const filteredCompletedRecommendations = computed(() => {
    return completedActions.value
        .filter(action => action.type === 'recommendation')
        .filter(action => selectedClientFilter.value === 'all' || action.clientId === selectedClientFilter.value)
        .filter(action => selectedActionType.value === 'all' ||
            (selectedActionType.value === 'scheduled' && action.status === 'Scheduled') ||
            (selectedActionType.value === 'declined' && action.status === 'Declined') ||
            (selectedActionType.value === 'resolved' && action.status === 'Meeting Completed'))
        .filter(action => isWithinDateRange(action.completedDate, selectedDateRange.value))
})

const filteredReviewedRiskItems = computed(() => {
    return completedActions.value
        .filter(action => action.type === 'risk')
        .filter(action => selectedClientFilter.value === 'all' || action.clientId === selectedClientFilter.value)
        .filter(action => selectedActionType.value === 'all' || selectedActionType.value === 'risk-reviewed')
        .filter(action => isWithinDateRange(action.reviewedDate, selectedDateRange.value))
})

const completedMeetingsCount = computed(() =>
    completedActions.value.filter(action => action.status === 'Meeting Completed').length
)

const scheduledMeetingsCount = computed(() =>
    completedActions.value.filter(action => action.status === 'Scheduled').length
)

const declinedRecommendationsCount = computed(() =>
    completedActions.value.filter(action => action.status === 'Declined').length
)

const resolvedRiskItemsCount = computed(() =>
    completedActions.value.filter(action => action.type === 'risk').length
)


// Chart data




// Risk Assessment computed properties
const totalPendingRiskReviews = computed(() => {
    // Calculate pending risk reviews based on clients that have risk flags and haven't been reviewed recently
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

    return relationshipClients.value.filter(client => {
        const hasRiskFlags = client.riskFlags > 0
        const lastReview = clients[client.id]?.lastReview
        const needsReview = !lastReview || new Date(lastReview) < thirtyDaysAgo
        return hasRiskFlags && needsReview
    }).length || 10 // Default to 10 if no data
})

// Risk Flag Categories - Non-Transactional
const utrFiledCount = computed(() => Math.floor(totalRiskFlags.value * 0.15))
const highRiskIndustryCount = computed(() => Math.floor(totalRiskFlags.value * 0.2))
const ctrExemptionCount = computed(() => Math.floor(totalRiskFlags.value * 0.1))

// Risk Flag Categories - High Risk Transactions
const cannabisRelatedTrxCount = computed(() => Math.floor(totalRiskFlags.value * 0.05))
const casinoTrxCount = computed(() => Math.floor(totalRiskFlags.value * 0.03))
const highCashDepositCount = computed(() => Math.floor(totalRiskFlags.value * 0.18))
const hrjTrxCount = computed(() => Math.floor(totalRiskFlags.value * 0.12))
const cashierCheckPurchaseCount = computed(() => Math.floor(totalRiskFlags.value * 0.08))
const cryptoTrxCount = computed(() => Math.floor(totalRiskFlags.value * 0.15))
const highCashWithdrawalsCount = computed(() => Math.floor(totalRiskFlags.value * 0.1))
const luxuryGoodsTrxCount = computed(() => Math.floor(totalRiskFlags.value * 0.07))
const thirdPartyCheckDepositCount = computed(() => Math.floor(totalRiskFlags.value * 0.09))

// Opportunities computed properties
const totalOpportunities = computed(() => relationshipClients.value.reduce((sum, client) => sum + getClientOpportunityCount(client), 0))
const totalOpportunityValue = computed(() => relationshipClients.value.reduce((sum, client) => sum + getClientOpportunityValue(client), 0))
const highPriorityOpportunities = computed(() => relationshipClients.value.filter(client => getClientPriority(client) === 'High').length)
const avgConfidenceScore = computed(() => {
    const total = aiRecommendations.value.reduce((sum, rec) => sum + rec.confidence, 0)
    return Math.round(total / aiRecommendations.value.length)
})

// Action Items computed properties
const totalActionItems = computed(() => {
    return totalPendingRiskReviews.value + allRecommendations.value.filter(r => r.priority === 'High').length + 3 // +3 for scheduled meetings
})

const criticalActionCount = computed(() => totalPendingRiskReviews.value)
const highActionCount = computed(() => allRecommendations.value.filter(r => r.priority === 'High').length)
const mediumActionCount = computed(() => allRecommendations.value.filter(r => r.priority === 'Medium').length)
const lowActionCount = computed(() => allRecommendations.value.filter(r => r.priority === 'Low').length)

// Product Portfolio Aggregation Functions
const aggregateProductData = computed(() => {
    const productList = [
        // Business Deposit Products
        'checking', 'debit-cards', 'cds', 'savings-money-market',
        // Business Lending Products
        'credit-cards', 'loans-lines-credit', 'securities-based-lending', 'real-estate-financing', 'ppp',
        // Commercial Lending Solutions
        'asset-based-lending', 'commercial-lending', 'commercial-real-estate', 'equipment-finance',
        // Treasury & Cash Management
        'liquidity-management', 'payables', 'receivables', 'fraud-control', 'information-services', 'treasury-overview',
        // Business Services & Support
        'online-banking', 'online-accounting', 'payroll', 'business-payment-suite', 'overdraft-services', 'merchant-solutions', 'new-to-small-business', 'healthcare-professionals',
        // Wealth & Investment Services
        'investments', 'wealth-retirement-planning', 'private-client-banking'
    ]

    const relationshipClients = Object.values(clients).filter(client => client.relationshipId === props.relationshipId)
    const aggregatedData = {}

    productList.forEach(productKey => {
        const clientsWithProduct = relationshipClients.filter(client =>
            client.productHoldings && client.productHoldings[productKey]?.hasProduct
        )

        const clientsWithRecommendation = relationshipClients.filter(client =>
            client.productHoldings && client.productHoldings[productKey]?.isRecommended
        )

        const totalBalance = clientsWithProduct.reduce((sum, client) =>
            sum + (client.productHoldings[productKey]?.balance || 0), 0
        )

        const totalRevenue = clientsWithProduct.reduce((sum, client) =>
            sum + (client.productHoldings[productKey]?.revenue || 0), 0
        )

        aggregatedData[productKey] = {
            hasProduct: clientsWithProduct.length > 0,
            isRecommended: clientsWithRecommendation.length > 0,
            clientCount: clientsWithProduct.length,
            recommendedCount: clientsWithRecommendation.length,
            totalClients: relationshipClients.length,
            penetration: ((clientsWithProduct.length / relationshipClients.length) * 100).toFixed(1),
            totalBalance,
            totalRevenue,
            clients: clientsWithProduct.map(client => ({
                id: client.id,
                name: client.name,
                balance: client.productHoldings[productKey]?.balance || 0,
                revenue: client.productHoldings[productKey]?.revenue || 0
            })),
            recommendedClients: clientsWithRecommendation.map(client => ({
                id: client.id,
                name: client.name
            }))
        }
    })

    return aggregatedData
})

const getProductStatus = (productKey) => {
    const productData = aggregateProductData.value[productKey]
    if (!productData) return 'none'

    // Mixed scenario: some clients have product AND some are recommended
    if (productData.hasProduct && productData.isRecommended) {
        return 'has-recommended'
    }

    // Some clients have the product
    if (productData.hasProduct) {
        return 'has'
    }

    // Some clients are recommended to get the product
    if (productData.isRecommended) {
        return 'recommended'
    }

    // No clients have or are recommended for this product
    return 'none'
}

const getProductTooltipData = (productKey) => {
    const productData = aggregateProductData.value[productKey]
    if (!productData) return null

    return {
        productKey,
        hasProduct: productData.hasProduct,
        isRecommended: productData.isRecommended,
        clientCount: productData.clientCount,
        recommendedCount: productData.recommendedCount,
        totalClients: productData.totalClients,
        penetration: productData.penetration,
        totalBalance: productData.totalBalance,
        totalRevenue: productData.totalRevenue,
        clients: productData.clients,
        recommendedClients: productData.recommendedClients
    }
}

// Alerts computed properties
const loanDelinquencyAlerts = computed(() => [
    {
        id: 1,
        clientName: 'Johnson Manufacturing LLC',
        loanType: 'Commercial Term Loan',
        daysPastDue: 62,
        severity: 'Critical',
        accountNumber: 'TL-2024-0892',
        amountDue: 125000,
        lastPayment: 'Oct 14, 2024',
        totalOutstanding: 2200000,
        originalAmount: 2800000
    },
    {
        id: 2,
        clientName: 'Johnson Holdings Group - Subsidiary A',
        loanType: 'Equipment Financing',
        daysPastDue: 45,
        severity: 'High',
        accountNumber: 'EF-2024-0445',
        amountDue: 85000,
        lastPayment: 'Oct 28, 2024',
        totalOutstanding: 1800000,
        originalAmount: 2100000
    }
])

const overdraftAlerts = computed(() => [
    {
        id: 1,
        clientName: 'Johnson Holdings Group - Subsidiary B',
        accountType: 'Business Checking',
        daysOverdrawn: 15,
        severity: 'Medium',
        accountNumber: 'BC-2024-1234',
        overdraftAmount: 45000,
        availableBalance: -45000,
        overdraftLimit: 100000,
        feesAccumulated: 1250
    },
    {
        id: 2,
        clientName: 'Johnson Holdings Group - Subsidiary C',
        accountType: 'Operating Account',
        daysOverdrawn: 8,
        severity: 'Low',
        accountNumber: 'OA-2024-5678',
        overdraftAmount: 18000,
        availableBalance: -18000,
        overdraftLimit: 75000,
        feesAccumulated: 450
    }
])

const otherAlerts = computed(() => [
    {
        id: 1,
        clientName: 'Johnson Manufacturing LLC',
        title: 'Conductor Policy Changes',
        category: 'Policy Update',
        severity: 'High',
        description: 'New regulatory requirements for Conductor transactions require client acknowledgment and updated documentation by January 31, 2025.',
        dueDate: 'Jan 31, 2025',
        priority: 'High'
    },
    {
        id: 2,
        clientName: 'Johnson Holdings Group - Subsidiary A',
        title: 'KYC Documentation Renewal',
        category: 'Compliance',
        severity: 'Medium',
        description: 'Annual KYC documentation renewal required for beneficial ownership verification.',
        dueDate: 'Dec 15, 2024',
        priority: 'Medium'
    },
    {
        id: 3,
        clientName: 'Johnson Holdings Group - Subsidiary B',
        title: 'Credit Review Required',
        category: 'Credit',
        severity: 'Medium',
        description: 'Annual credit review required due to changes in financial position and industry outlook.',
        dueDate: 'Jan 15, 2025',
        priority: 'Medium'
    }
])

const totalActiveAlerts = computed(() =>
    loanDelinquencyAlerts.value.length + overdraftAlerts.value.length + otherAlerts.value.length
)

// Time series data generators
const getTimeLabels = computed(() => {
    const now = new Date()
    const labels = []
    let periods = 12

    if (selectedTimePeriod.value === 'ytd') {
        periods = now.getMonth() + 1
    } else if (selectedTimePeriod.value === '6m') {
        periods = 6
    }

    for (let i = periods - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
    }
    return labels
})

const accountPortfolioTimeSeriesData = computed(() => ({
    labels: getTimeLabels.value,
    datasets: relationshipClients.value.map((client, index) => ({
        label: client.name,
        data: Array.from({ length: getTimeLabels.value.length }, () =>
            client.deposits * (0.8 + Math.random() * 0.4)
        ),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
        borderColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
        borderWidth: 1
    }))
}))

const transactionVolumeTimeSeriesData = computed(() => ({
    labels: getTimeLabels.value,
    datasets: relationshipClients.value.map((client, index) => ({
        label: client.name,
        data: Array.from({ length: getTimeLabels.value.length }, () =>
            Math.floor(Math.random() * 2000000) + 500000
        ),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
        borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
        borderWidth: 1
    }))
}))

const revenueTimeSeriesData = computed(() => ({
    labels: getTimeLabels.value,
    datasets: relationshipClients.value.map((client, index) => ({
        label: client.name,
        data: Array.from({ length: getTimeLabels.value.length }, () =>
            client.revenue * (0.8 + Math.random() * 0.4) / 12
        ),
        backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'][index % 5],
        borderColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'][index % 5],
        borderWidth: 1
    }))
}))

const riskTrendByCompanyTimeSeriesData = computed(() => ({
    labels: getTimeLabels.value,
    datasets: relationshipClients.value.map((client, index) => ({
        label: client.name,
        data: Array.from({ length: getTimeLabels.value.length }, () =>
            Math.floor(Math.random() * 5) + client.riskFlags
        ),
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'][index % 5],
        borderColor: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'][index % 5],
        borderWidth: 1
    }))
}))

// Chart Data Computed Properties
const getDepositsChartData = computed(() => {
    const labels = getTimeLabels.value

    if (chartViewType.value === 'product') {
        // Product breakdown view
        return {
            labels,
            datasets: [
                {
                    label: 'Checking',
                    data: labels.map(() => Math.floor(Math.random() * 5000000) + 10000000),
                    backgroundColor: '#3B82F6',
                    stack: 'deposits'
                },
                {
                    label: 'Savings',
                    data: labels.map(() => Math.floor(Math.random() * 3000000) + 5000000),
                    backgroundColor: '#10B981',
                    stack: 'deposits'
                },
                {
                    label: 'Money Market',
                    data: labels.map(() => Math.floor(Math.random() * 2000000) + 3000000),
                    backgroundColor: '#F59E0B',
                    stack: 'deposits'
                },
                {
                    label: 'CDs',
                    data: labels.map(() => Math.floor(Math.random() * 1000000) + 2000000),
                    backgroundColor: '#8B5CF6',
                    stack: 'deposits'
                }
            ]
        }
    } else {
        // Client breakdown view
        return {
            labels,
            datasets: relationshipClients.value.slice(0, 5).map((client, index) => ({
                label: client.name,
                data: labels.map(() => client.deposits * (0.9 + Math.random() * 0.2)),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index],
                stack: 'deposits'
            }))
        }
    }
})

const getLoansChartData = computed(() => {
    const labels = getTimeLabels.value

    if (chartViewType.value === 'product') {
        // Product breakdown view
        return {
            labels,
            datasets: [
                {
                    label: 'Term Loans',
                    data: labels.map(() => Math.floor(Math.random() * 8000000) + 15000000),
                    backgroundColor: '#3B82F6',
                    stack: 'loans'
                },
                {
                    label: 'Lines of Credit',
                    data: labels.map(() => Math.floor(Math.random() * 5000000) + 10000000),
                    backgroundColor: '#10B981',
                    stack: 'loans'
                },
                {
                    label: 'Real Estate',
                    data: labels.map(() => Math.floor(Math.random() * 10000000) + 20000000),
                    backgroundColor: '#F59E0B',
                    stack: 'loans'
                },
                {
                    label: 'Equipment Finance',
                    data: labels.map(() => Math.floor(Math.random() * 3000000) + 5000000),
                    backgroundColor: '#8B5CF6',
                    stack: 'loans'
                }
            ]
        }
    } else {
        // Client breakdown view
        return {
            labels,
            datasets: relationshipClients.value.slice(0, 5).map((client, index) => ({
                label: client.name,
                data: labels.map(() => client.loans * (0.9 + Math.random() * 0.2)),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index],
                stack: 'loans'
            }))
        }
    }
})

const getUtilizationChartData = computed(() => {
    const labels = getTimeLabels.value

    return {
        labels,
        datasets: relationshipClients.value.slice(0, 5).map((client, index) => ({
            label: client.name,
            data: labels.map(() => 50 + Math.random() * 40), // Utilization % between 50-90%
            borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] + '20',
            tension: 0.4,
            fill: false
        }))
    }
})

const getRevenueChartData = computed(() => {
    const labels = getTimeLabels.value

    return {
        labels,
        datasets: relationshipClients.value.slice(0, 5).map((client, index) => ({
            label: client.name,
            data: labels.map(() => client.revenue * (0.8 + Math.random() * 0.4) / 12),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index],
            stack: 'revenue'
        }))
    }
})

const getClientsChartData = computed(() => {
    const labels = getTimeLabels.value
    const baseCount = relationshipClients.value.length

    return {
        labels,
        datasets: [{
            label: 'Total Clients',
            data: labels.map((_, index) => baseCount + Math.floor(Math.random() * 3) - 1),
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            borderWidth: 2
        }]
    }
})

// Chart Options
const depositChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { stacked: true },
        y: {
            stacked: true,
            ticks: {
                callback: function (value) {
                    return '$' + (value / 1000000).toFixed(1) + 'M'
                }
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.dataset.label + ': $' + (context.parsed.y / 1000000).toFixed(2) + 'M'
                }
            }
        }
    }
}

const loanChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { stacked: true },
        y: {
            stacked: true,
            ticks: {
                callback: function (value) {
                    return '$' + (value / 1000000).toFixed(1) + 'M'
                }
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.dataset.label + ': $' + (context.parsed.y / 1000000).toFixed(2) + 'M'
                }
            }
        }
    }
}

const utilizationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
                callback: function (value) {
                    return value + '%'
                }
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%'
                }
            }
        }
    }
}

const revenueChartOptions = depositChartOptions
const clientsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
        }
    }
}

// Transaction Chart Data
const getTransactionsChartData = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (transactionViewType.value === 'by-type') {
        // Inflow transaction types (positive values)
        const cashDeposits = [45, 42, 48, 52, 38, 65, 58, 72, 45, 52, 48, 68]
        const checkDeposits = [125, 138, 142, 165, 125, 175, 168, 182, 155, 162, 158, 188]
        const achIn = [85, 92, 88, 95, 78, 108, 98, 112, 88, 95, 92, 118]
        const wireIn = [320, 285, 340, 380, 295, 420, 385, 445, 325, 365, 358, 425]
        
        // Outflow transaction types (negative values)
        const cashWithdrawals = [-25, -28, -32, -35, -22, -38, -32, -42, -28, -32, -28, -38]
        const checkPayments = [-185, -195, -212, -225, -178, -245, -228, -265, -198, -215, -205, -248]
        const achOut = [-145, -152, -168, -175, -138, -188, -172, -195, -155, -168, -162, -188]
        const wireOut = [-280, -295, -315, -335, -265, -365, -342, -385, -305, -325, -315, -368]

        return {
            labels,
            datasets: [
                // Inflows (positive)
                {
                    label: 'Cash Deposits',
                    data: cashDeposits,
                    backgroundColor: '#10b981', // Green
                    borderColor: '#059669',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'Check Deposits',
                    data: checkDeposits,
                    backgroundColor: '#3b82f6', // Blue
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'ACH In',
                    data: achIn,
                    backgroundColor: '#8b5cf6', // Purple
                    borderColor: '#7c3aed',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'Wire In',
                    data: wireIn,
                    backgroundColor: '#06b6d4', // Cyan
                    borderColor: '#0891b2',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                // Outflows (negative)
                {
                    label: 'Cash Withdrawals',
                    data: cashWithdrawals,
                    backgroundColor: '#ef4444', // Red
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'Check Payments',
                    data: checkPayments,
                    backgroundColor: '#f97316', // Orange
                    borderColor: '#ea580c',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'ACH Out',
                    data: achOut,
                    backgroundColor: '#ec4899', // Pink
                    borderColor: '#db2777',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'Wire Out',
                    data: wireOut,
                    backgroundColor: '#6b7280', // Gray
                    borderColor: '#4b5563',
                    borderWidth: 1,
                    stack: 'outflow'
                }
            ]
        }
    } else {
        // By Client view
        const johnsonManufacturing = [450, 485, 520, 565, 425, 625, 580, 685, 495, 545, 525, 658]
        const johnsonHoldingsA = [285, 315, 340, 375, 265, 415, 385, 445, 325, 365, 348, 425]
        const johnsonHoldingsB = [185, 205, 225, 245, 175, 275, 255, 295, 215, 235, 228, 278]

        return {
            labels,
            datasets: [
                {
                    label: 'Johnson Manufacturing LLC',
                    data: johnsonManufacturing,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'Johnson Holdings Group - Subsidiary A',
                    data: johnsonHoldingsA,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                },
                {
                    label: 'Johnson Holdings Group - Subsidiary B',
                    data: johnsonHoldingsB,
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    borderWidth: 1
                }
            ]
        }
    }
})

const transactionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: false,
            ticks: {
                callback: function(value) {
                    return (value >= 0 ? '$' : '-$') + Math.abs(value) + 'M'
                }
            },
            grid: {
                color: function(context) {
                    if (context.tick.value === 0) {
                        return '#374151' // Darker line at zero
                    }
                    return '#e5e7eb' // Light gray for other lines
                }
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 15,
                generateLabels: function(chart) {
                    const datasets = chart.data.datasets
                    return datasets.map((dataset, i) => ({
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle: dataset.borderColor,
                        pointStyle: 'circle'
                    }))
                }
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const value = context.parsed.y
                    const prefix = value >= 0 ? '+$' : '-$'
                    return context.dataset.label + ': ' + prefix + Math.abs(value) + 'M'
                }
            }
        }
    }
}

// Risk Chart Data and Options
const getHighRiskTransactionsChartData = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (riskTransactionViewType.value === 'by-type') {
        return {
            labels,
            datasets: [
                {
                    label: 'Cannabis-Related Trx',
                    data: [2, 1, 3, 0, 1, 2, 4, 2, 1, 3, 2, 1],
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    stack: 'stack0'
                },
                {
                    label: 'High Cash Deposits',
                    data: [8, 12, 10, 15, 9, 18, 14, 20, 11, 16, 13, 17],
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    borderWidth: 1,
                    stack: 'stack0'
                },
                {
                    label: 'Crypto Transactions',
                    data: [5, 3, 7, 4, 8, 6, 9, 5, 7, 8, 6, 10],
                    backgroundColor: '#8b5cf6',
                    borderColor: '#7c3aed',
                    borderWidth: 1,
                    stack: 'stack0'
                },
                {
                    label: 'HRJ Transactions',
                    data: [3, 5, 2, 6, 4, 8, 5, 7, 4, 6, 5, 8],
                    backgroundColor: '#06b6d4',
                    borderColor: '#0891b2',
                    borderWidth: 1,
                    stack: 'stack0'
                },
                {
                    label: 'Third Party Checks',
                    data: [1, 2, 1, 3, 2, 4, 2, 3, 2, 4, 3, 5],
                    backgroundColor: '#84cc16',
                    borderColor: '#65a30d',
                    borderWidth: 1,
                    stack: 'stack0'
                }
            ]
        }
    } else {
        // By Client view
        return {
            labels,
            datasets: [
                {
                    label: 'Johnson Manufacturing LLC',
                    data: [12, 15, 18, 22, 16, 25, 20, 28, 19, 24, 21, 26],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'Johnson Holdings Group - Sub A',
                    data: [8, 10, 12, 14, 9, 16, 13, 18, 11, 15, 12, 17],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                },
                {
                    label: 'Johnson Holdings Group - Sub B',
                    data: [3, 4, 5, 6, 4, 7, 5, 8, 6, 7, 6, 9],
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    borderWidth: 1
                }
            ]
        }
    }
})

const getUTRFiledChartData = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Cumulative UTR Filed data - high volume example
    const monthlyUTR = [3, 2, 4, 1, 2, 3, 5, 4, 3, 2, 1, 4]
    const cumulativeUTR = monthlyUTR.reduce((acc, current, index) => {
        const cumSum = index === 0 ? current : acc[index - 1] + current
        acc.push(cumSum)
        return acc
    }, [])
    
    // Regional average flat line at 1.2
    const regionalMonthlyCumulative = [1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2]
    
    const datasets = [
        {
            label: 'Our Relationship - Cumulative UTR Filed',
            data: cumulativeUTR,
            backgroundColor: '#ef4444',
            borderColor: '#dc2626',
            borderWidth: 1,
            type: 'bar',
            order: 2
        },
        {
            label: 'Regional Average',
            data: regionalMonthlyCumulative,
            backgroundColor: 'transparent',
            borderColor: '#3b82f6',
            borderWidth: 3,
            borderDash: [8, 4],
            type: 'line',
            fill: false,
            tension: 0,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            order: 1
        }
    ]
    
    return {
        labels,
        datasets
    }
})

const getRiskTransactionsChartData = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (riskTransactionViewType.value === 'by-type') {
        // Inflow transaction types (positive values)
        const cashDeposits = [45, 42, 48, 52, 38, 65, 58, 72, 45, 52, 48, 68]
        const checkDeposits = [125, 138, 142, 165, 125, 175, 168, 182, 155, 162, 158, 188]
        const achIn = [85, 92, 88, 95, 78, 108, 98, 112, 88, 95, 92, 118]
        const wireIn = [320, 285, 340, 380, 295, 420, 385, 445, 325, 365, 358, 425]
        
        // Outflow transaction types (negative values)
        const cashWithdrawals = [-25, -28, -32, -35, -22, -38, -32, -42, -28, -32, -28, -38]
        const checkPayments = [-185, -195, -212, -225, -178, -245, -228, -265, -198, -215, -205, -248]
        const achOut = [-145, -152, -168, -175, -138, -188, -172, -195, -155, -168, -162, -188]
        const wireOut = [-280, -295, -315, -335, -265, -365, -342, -385, -305, -325, -315, -368]
        
        return {
            labels,
            datasets: [
                // Inflows (positive)
                {
                    label: 'Cash Deposits',
                    data: cashDeposits,
                    backgroundColor: '#10b981', // Green
                    borderColor: '#059669',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'Check Deposits',
                    data: checkDeposits,
                    backgroundColor: '#3b82f6', // Blue
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'ACH In',
                    data: achIn,
                    backgroundColor: '#8b5cf6', // Purple
                    borderColor: '#7c3aed',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                {
                    label: 'Wire In',
                    data: wireIn,
                    backgroundColor: '#06b6d4', // Cyan
                    borderColor: '#0891b2',
                    borderWidth: 1,
                    stack: 'inflow'
                },
                // Outflows (negative)
                {
                    label: 'Cash Withdrawals',
                    data: cashWithdrawals,
                    backgroundColor: '#ef4444', // Red
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'Check Payments',
                    data: checkPayments,
                    backgroundColor: '#f59e0b', // Amber
                    borderColor: '#d97706',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'ACH Out',
                    data: achOut,
                    backgroundColor: '#ec4899', // Pink
                    borderColor: '#db2777',
                    borderWidth: 1,
                    stack: 'outflow'
                },
                {
                    label: 'Wire Out',
                    data: wireOut,
                    backgroundColor: '#6b7280', // Gray
                    borderColor: '#4b5563',
                    borderWidth: 1,
                    stack: 'outflow'
                }
            ]
        }
    } else {
        // By client view - showing transaction volumes for different clients
        return {
            labels,
            datasets: [
                {
                    label: 'Smith Manufacturing',
                    data: [450, 480, 520, 580, 420, 650, 590, 720, 480, 550, 520, 680],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                },
                {
                    label: 'Johnson Enterprises',
                    data: [320, 340, 380, 420, 295, 465, 425, 495, 345, 395, 375, 465],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                },
                {
                    label: 'Williams Corp',
                    data: [280, 295, 315, 345, 265, 385, 352, 425, 295, 335, 325, 398],
                    backgroundColor: '#f59e0b',
                    borderColor: '#d97706',
                    borderWidth: 1
                }
            ]
        }
    }
})

const getRiskFlagsReviewedChartData = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return {
        labels,
        datasets: [
            {
                label: 'Flags Generated',
                data: [25, 28, 32, 29, 35, 31, 38, 33, 30, 34, 36, 32],
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: 'Flags Reviewed',
                data: [22, 26, 30, 27, 32, 29, 35, 31, 28, 32, 34, 30],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: 'Review Completion Rate',
                data: [88, 93, 94, 93, 91, 94, 92, 94, 93, 94, 94, 94],
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y1',
                type: 'line'
            }
        ]
    }
})


// Risk Chart Options
const highRiskTransactionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            stacked: true
        },
        x: {
            stacked: true
        }
    },
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}

const utrFiledChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Cumulative UTRs Filed'
            }
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        }
    }
}

const riskTransactionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: false,
            ticks: {
                callback: function(value) {
                    return (value >= 0 ? '$' : '-$') + Math.abs(value) + 'M'
                }
            },
            grid: {
                color: function(context) {
                    if (context.tick.value === 0) {
                        return '#374151' // Darker line at zero
                    }
                    return '#e5e7eb' // Light gray for other lines
                }
            },
            title: {
                display: true,
                text: 'Transaction Volume ($M)'
            }
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const value = context.parsed.y
                    const label = context.dataset.label
                    return label + ': ' + (value >= 0 ? '$' : '-$') + Math.abs(value) + 'M'
                }
            }
        }
    }
}

const riskFlagsReviewedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
                display: true,
                text: 'Number of Flags'
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            min: 80,
            max: 100,
            title: {
                display: true,
                text: 'Completion Rate (%)'
            },
            grid: {
                drawOnChartArea: false,
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}


const modalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
}

// Methods
const getTierBadgeClass = (tier) => {
    switch (tier?.toLowerCase()) {
        case 'tier 1': return 'bg-purple-100 text-purple-800'
        case 'tier 2': return 'bg-blue-100 text-blue-800'
        case 'tier 3': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getRiskLevelClass = (level) => {
    switch (level?.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}


const getCoverageColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
}

const getOrdinalSuffix = (num) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
}

const drillDownToClient = (client) => {
    router.push({
        name: 'ClientDetail',
        params: {
            regionId: props.regionId,
            rmId: props.rmId,
            relationshipId: props.relationshipId,
            clientId: client.id
        }
    })
}

const navigateToClient = (clientId) => {
    router.push({
        name: 'ClientDetail',
        params: {
            regionId: props.regionId,
            rmId: props.rmId,
            relationshipId: props.relationshipId,
            clientId: clientId
        }
    })
}

const drillDownToClientRisk = (client) => {
    router.push({
        name: 'ClientDetail',
        params: {
            regionId: props.regionId,
            rmId: props.rmId,
            relationshipId: props.relationshipId,
            clientId: client.id
        },
        query: { tab: 'risk' }
    })
}

const drillDownToClientOpportunities = (client) => {
    router.push({
        name: 'ClientDetail',
        params: {
            regionId: props.regionId,
            rmId: props.rmId,
            relationshipId: props.relationshipId,
            clientId: client.id
        },
        query: { tab: 'portfolio' }
    })
}

const getClientLastReview = (clientId) => {
    const client = clients[clientId]
    return client?.lastReview || 'N/A'
}

const getClientNextReview = (clientId) => {
    const client = clients[clientId]
    return client?.nextReview || 'N/A'
}

const getClientOpportunityCount = (client) => {
    const productGaps = Object.values(client.products).filter(hasProduct => !hasProduct).length
    return Math.max(2, productGaps + Math.floor(Math.random() * 2))
}

const getClientProductGaps = (client) => {
    return Object.values(client.products).filter(hasProduct => !hasProduct).length
}

const getClientOpportunityValue = (client) => {
    const baseValue = client.deposits * 0.1 + client.loans * 0.05
    return Math.floor(baseValue + (Math.random() * 200000))
}

const getClientNextAction = (client) => {
    const actions = ['Contact', 'Proposal', 'Follow-up', 'Meeting']
    return actions[Math.floor(Math.random() * actions.length)]
}

const getClientPriority = (client) => {
    if (client.deposits > 50000000) return 'High'
    if (client.deposits > 20000000) return 'Medium'
    return 'Low'
}

const getClientPriorityClass = (client) => {
    const priority = getClientPriority(client)
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-800'
        case 'Medium': return 'bg-yellow-100 text-yellow-800'
        case 'Low': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const relationshipAction = (action) => {
    console.log('Relationship action:', action)
    // Handle various relationship actions
}

const showRiskDetails = () => {
    // Show alerts modal instead of switching to risk tab
    showAlertsModal.value = true
    activeAlertTab.value = 'delinquency'
}

// Trend Analysis Helper Methods
const getTrendMetricTitle = (metric) => {
    const titles = {
        deposits: 'Total Deposits',
        loans: 'Loan Commitment',
        utilization: 'Loan Utilization %',
        revenue: 'Total Revenue',
        clients: 'Number of Clients',
        transactions: 'Monthly Transactions'
    }
    return titles[metric] || metric
}

const getTrendMetricSubtitle = (metric, period) => {
    const periodText = period === 'ytd' ? 'Year to Date' : period === '6m' ? 'Last 6 Months' : 'Last 12 Months'
    const subtitles = {
        deposits: `Deposit balance trend - ${periodText}`,
        loans: `Total loan commitments - ${periodText}`,
        utilization: `Loan utilization percentage - ${periodText}`,
        revenue: `Revenue performance - ${periodText}`,
        clients: `Client count changes - ${periodText}`,
        transactions: `Transaction volume inflow/outflow - ${periodText}`
    }
    return subtitles[metric] || `${metric} - ${periodText}`
}

const getCurrentMetricValue = (metric) => {
    const values = {
        deposits: formatCurrency(aggregateDeposits.value),
        loans: formatCurrency(aggregateLoans.value),
        utilization: `${loanUtilization.value}%`,
        revenue: formatCurrency(annualRevenue.value),
        clients: totalClients.value.toString(),
        transactions: '$920M'
    }
    return values[metric] || '0'
}

const getMetricChange = (metric) => {
    // Mock change values - replace with actual calculations
    const changes = {
        deposits: '+12.5%',
        loans: '+8.3%',
        utilization: '+2.1%',
        revenue: '+15.2%',
        clients: '+5',
        transactions: '+8.7%'
    }
    return changes[metric] || '+0%'
}

const getMetricChangeClass = (metric) => {
    // Determine if change is positive or negative
    const change = getMetricChange(metric)
    if (change.startsWith('+')) return 'text-green-600'
    if (change.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
}

// Risk Trends Analysis Helper Methods
const getRiskMetricTitle = (metric) => {
    const titles = {
        'high-risk-transactions': 'High Risk Transaction Volume',
        'risk-flags-reviewed': 'Risk Flags Reviewed',
        'utr-filed': 'Cumulative UTR Filed',
        'monthly-transactions': 'Monthly Transactions'
    }
    return titles[metric] || metric
}

const getRiskMetricSubtitle = (metric, period) => {
    const periodText = period === 'ytd' ? 'Year to Date' : period === '6m' ? 'Last 6 Months' : period === '12m' ? 'Last 12 Months' : 'Last 24 Months'
    const subtitles = {
        'high-risk-transactions': `High risk transaction trends by category - ${periodText}`,
        'risk-flags-reviewed': `Review completion rate and efficiency - ${periodText}`,
        'utr-filed': `Cumulative Unusual Transaction Reports filed vs regional average - ${periodText}`,
        'monthly-transactions': `Transaction volume analysis by type and client - ${periodText}`
    }
    return subtitles[metric] || `${metric} - ${periodText}`
}

const getCurrentRiskMetricValue = (metric) => {
    const values = {
        'high-risk-transactions': '156',
        'risk-flags-reviewed': '76',
        'utr-filed': '34', // Cumulative total through December
        'monthly-transactions': '$685M'
    }
    return values[metric] || '0'
}

const getRiskMetricChange = (metric) => {
    // Mock risk trend change values
    const changes = {
        'high-risk-transactions': '+23.4%',
        'risk-flags-reviewed': '+18.2%',
        'utr-filed': '+33.3%',
        'monthly-transactions': '+12.5%'
    }
    return changes[metric] || '+0%'
}

const getRiskMetricChangeClass = (metric) => {
    // Determine if risk change is good or bad (different from regular metrics)
    const change = getRiskMetricChange(metric)
    switch(metric) {
        case 'risk-flags-reviewed':
            // For reviewed flags, increase is good
            return change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        case 'monthly-transactions':
            // For transaction volume, increase is generally good (business growth)
            return change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        case 'high-risk-transactions':
        case 'utr-filed':
        default:
            // For risk transactions and UTR filings, increase is generally bad (red)
            return change.startsWith('+') ? 'text-red-600' : 'text-green-600'
    }
}

const closeAlertsModal = () => {
    showAlertsModal.value = false
}

// New methods for recommendations
const openMeetingModal = (recommendation) => {
    console.log('Opening meeting modal for:', recommendation)
    // TODO: Implement meeting scheduling modal
    alert(`Schedule meeting with ${recommendation.client}\nRecommendation: ${recommendation.recommendation}`)
}

const openDeclineModal = (recommendation) => {
    console.log('Opening decline modal for:', recommendation)
    // TODO: Implement decline reason modal
    const reason = prompt(`Please provide a reason for declining this recommendation:\n${recommendation.recommendation}`)
    if (reason) {
        console.log('Declined with reason:', reason)
    }
}

const showActionItemsModal = () => {
    // Show action items modal
    showAlertsModal.value = true
    activeAlertTab.value = 'actions'
}


// Toggle client recommendations expansion
const toggleClientRecommendations = (clientId) => {
    expandedClient.value = expandedClient.value === clientId ? null : clientId
}

// Get recommendations for a specific client
const getClientRecommendations = (clientId) => {
    if (!clientId || !relationshipClients.value || !allRecommendations.value) {
        return []
    }

    const client = relationshipClients.value.find(c => c.id === clientId)
    if (!client || !client.name) {
        return []
    }

    return allRecommendations.value.filter(rec => rec.client === client.name) || []
}

// Activity History Methods
const isWithinDateRange = (date, range) => {
    const targetDate = new Date(date)
    const now = new Date()

    switch (range) {
        case '7d':
            return (now - targetDate) <= (7 * 24 * 60 * 60 * 1000)
        case '30d':
            return (now - targetDate) <= (30 * 24 * 60 * 60 * 1000)
        case '90d':
            return (now - targetDate) <= (90 * 24 * 60 * 60 * 1000)
        case 'ytd':
            return targetDate.getFullYear() === now.getFullYear()
        default:
            return true
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getActionStatusClass = (status) => {
    switch (status) {
        case 'Meeting Completed':
            return 'bg-green-100 text-green-800'
        case 'Scheduled':
            return 'bg-blue-100 text-blue-800'
        case 'Declined':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getRiskStatusClass = (resolution) => {
    switch (resolution) {
        case 'Resolved':
            return 'bg-green-100 text-green-800'
        case 'UTR Filed':
            return 'bg-yellow-100 text-yellow-800'
        case 'Under Review':
            return 'bg-orange-100 text-orange-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const viewItemDetails = (item) => {
    console.log('Viewing recommendation details:', item)
    // Implementation for viewing item details
}

const viewRiskDetails = (item) => {
    console.log('Viewing risk details:', item)
    // Implementation for viewing risk details
}

const exportActivityHistory = () => {
    console.log('Exporting activity history report')
    // Implementation for exporting activity history
}

const reviewAlert = (alert) => {
    console.log('Reviewing alert:', alert)
    // Handle alert review logic
}

const scheduleCall = (alert) => {
    console.log('Scheduling call for alert:', alert)
    // Handle call scheduling logic
}

const markAllAsReviewed = () => {
    console.log('Marking all alerts as reviewed')
    // Handle marking all alerts as reviewed
    showAlertsModal.value = false
}

const exportAlertReport = () => {
    console.log('Exporting alert report')
    // Handle export report logic
}

onMounted(() => {
    console.log('RelationshipView mounted for relationship:', props.relationshipId)
})

const relationshipType = computed(() => {
    const hasDeposits = relationshipData.value?.deposits > 0
    const hasLoans = relationshipData.value?.loans > 0
    if (hasDeposits && hasLoans) return 'Deposit and Loan Relationship'
    if (hasDeposits) return 'Deposit Only'
    if (hasLoans) return 'Loan Only'
    return 'Deposit and Loan Relationship'
})

// Enhanced computed properties for consolidated parties
const consolidatedBeneficialOwners = computed(() => {
    const ownersMap = new Map()

    relationshipClients.value.forEach(client => {
        const clientData = clients[client.id]
        if (clientData?.beneficialOwners) {
            clientData.beneficialOwners.forEach(owner => {
                const key = owner.name
                if (ownersMap.has(key)) {
                    const existing = ownersMap.get(key)
                    existing.entityCount += 1
                    existing.totalOwnership += parseFloat(owner.ownership?.replace('%', '') || 0)
                } else {
                    ownersMap.set(key, {
                        id: owner.name.replace(/\s+/g, '-').toLowerCase(),
                        name: owner.name,
                        entityCount: 1,
                        totalOwnership: parseFloat(owner.ownership?.replace('%', '') || 0),
                        role: owner.role
                    })
                }
            })
        }
    })

    return Array.from(ownersMap.values()).map(owner => ({
        ...owner,
        avgOwnership: (owner.totalOwnership / owner.entityCount).toFixed(1)
    }))
})

const consolidatedAuthorizedSigners = computed(() => {
    const signersMap = new Map()

    relationshipClients.value.forEach(client => {
        const clientData = clients[client.id]
        if (clientData?.authorizedSigners) {
            clientData.authorizedSigners.forEach(signer => {
                const key = signer.name
                if (signersMap.has(key)) {
                    signersMap.get(key).entityCount += 1
                } else {
                    signersMap.set(key, {
                        id: signer.name.replace(/\s+/g, '-').toLowerCase(),
                        name: signer.name,
                        entityCount: 1,
                        role: signer.role || 'Authorized Signer'
                    })
                }
            })
        }
    })

    return Array.from(signersMap.values())
})

const consolidatedConductors = computed(() => {
    const conductorsMap = new Map()

    relationshipClients.value.forEach(client => {
        const clientData = clients[client.id]
        if (clientData?.conductors) {
            clientData.conductors.forEach(conductor => {
                const key = conductor.name
                if (conductorsMap.has(key)) {
                    conductorsMap.get(key).entityCount += 1
                } else {
                    conductorsMap.set(key, {
                        id: conductor.name.replace(/\s+/g, '-').toLowerCase(),
                        name: conductor.name,
                        entityCount: 1,
                        role: conductor.role || 'Business Conductor'
                    })
                }
            })
        }
    })

    return Array.from(conductorsMap.values())
})

const geographicFootprint = computed(() => {
    const locations = new Set()

    relationshipClients.value.forEach(client => {
        const clientData = clients[client.id]
        if (clientData?.location) {
            locations.add(clientData.location)
        }
    })

    // Add headquarters location
    if (relationshipData.value?.hqLocation) {
        locations.add(relationshipData.value.hqLocation)
    }

    return Array.from(locations)
})

// Enhanced risk and intelligence metrics


const complianceBurdenScore = computed(() => {
    const factorCount = (
        (consolidatedBeneficialOwners.value.length > 5 ? 1 : 0) +
        (geographicFootprint.value.length > 3 ? 1 : 0) +
        (totalClients.value > 5 ? 1 : 0) +
        (totalRiskFlags.value > 3 ? 1 : 0)
    )

    if (factorCount >= 3) return 'High'
    if (factorCount >= 2) return 'Medium'
    return 'Low'
})

const complianceBurdenDescription = computed(() => {
    const descriptions = {
        'High': 'Complex structure requiring enhanced due diligence',
        'Medium': 'Moderate oversight and periodic review needed',
        'Low': 'Standard compliance monitoring sufficient'
    }
    return descriptions[complianceBurdenScore.value]
})

const relationshipProfitabilityRank = computed(() => {
    // Mock profitability ranking based on revenue percentile
    if (revenuePercentile.value >= 95) return 'Top 5%'
    if (revenuePercentile.value >= 90) return 'Top 10%'
    if (revenuePercentile.value >= 75) return 'Top 25%'
    return `${revenuePercentile.value}th percentile`
})

// Helper functions
const getComplianceBurdenColor = (score) => {
    const colorMap = {
        'High': 'red',
        'Medium': 'yellow',
        'Low': 'green'
    }
    return colorMap[score] || 'gray'
}

const getRelationshipTypeClass = (type) => {
    switch (type) {
        case 'Credit and Deposit': return 'bg-green-100 text-green-800'
        case 'Deposit Only': return 'bg-blue-100 text-blue-800'
        case 'Credit Only': return 'bg-orange-100 text-orange-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Enhanced Risk Review Dashboard Functions
const getReviewStatus = (client) => {
    if (client.riskFlags > 3) return 'Urgent Review Required'
    if (client.riskFlags > 1) return 'Review Pending'
    return 'Up to Date'
}

const getReviewStatusClass = (client) => {
    if (client.riskFlags > 3) return 'bg-red-100 text-red-800'
    if (client.riskFlags > 1) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
}

const toggleAllClientsForReview = () => {
    if (selectedClientsForReview.value.length === relationshipClients.value.length) {
        selectedClientsForReview.value = []
    } else {
        selectedClientsForReview.value = relationshipClients.value.map(client => client.id)
    }
}

const openRiskInvestigationModal = (client) => {
    selectedRiskForInvestigation.value = client
    showRiskInvestigationModal.value = true
}

// Bulk Action Functions
const bulkAssignReviewer = () => {
    console.log('Assigning reviewer to clients:', selectedClientsForReview.value)
    // Implementation would open reviewer assignment modal
}

const bulkMarkAsReviewed = () => {
    console.log('Marking clients as reviewed:', selectedClientsForReview.value)
    // Implementation would update client review status
    selectedClientsForReview.value = []
}

const bulkScheduleReview = () => {
    console.log('Scheduling review for clients:', selectedClientsForReview.value)
    // Implementation would open scheduling modal
}

const bulkExportReport = () => {
    console.log('Exporting report for clients:', selectedClientsForReview.value)
    // Implementation would generate and download report
}

// Risk Investigation Modal Functions
const markClientAsReviewed = () => {
    console.log('Marking client as reviewed:', selectedRiskForInvestigation.value?.id)
    // Implementation would update client review status
    showRiskInvestigationModal.value = false
}

const assignRiskReviewer = () => {
    console.log('Assigning reviewer for client:', selectedRiskForInvestigation.value?.id)
    // Implementation would open reviewer assignment interface
}

const generateRiskReport = () => {
    console.log('Generating risk report for client:', selectedRiskForInvestigation.value?.id)
    // Implementation would generate comprehensive risk report
}

// Risk Flag Modal Functions
const openRiskFlagModal = (riskFlag) => {
    selectedRiskFlag.value = riskFlag
    showRiskFlagModal.value = true
}

const closeRiskFlagModal = () => {
    showRiskFlagModal.value = false
    selectedRiskFlag.value = null
}

// Transaction Details Modal Functions
const openTransactionDetailsModal = (type) => {
    transactionModalType.value = type
    showTransactionDetailsModal.value = true
}

const closeTransactionDetailsModal = () => {
    showTransactionDetailsModal.value = false
    transactionModalType.value = ''
}

const getTransactionModalTitle = () => {
    switch (transactionModalType.value) {
        case 'portfolio':
            return 'Portfolio Transactions'
        case 'high-risk':
            return 'High Risk Transactions'
        case 'risk-monthly':
            return 'Risk Monthly Transactions'
        default:
            return 'Transaction Details'
    }
}

const applyTransactionFilters = () => {
    // Apply filters (functionality to be implemented)
    console.log('Applying filters:', transactionFilters.value)
}

const resetTransactionFilters = () => {
    transactionFilters.value = {
        dateFrom: '2025-06-28',
        dateTo: '2025-07-28',
        type: ''
    }
}

const getFilteredTransactions = () => {
    // Mock transaction data based on the attached image
    const mockTransactions = [
        {
            id: 1,
            date: 'Jul 27, 2025',
            type: 'Wire',
            description: 'International Wire',
            account: 'Money Market - ****9012',
            amount: 39900,
            status: 'Cleared',
            risk: null
        },
        {
            id: 2,
            date: 'Jul 26, 2025',
            type: 'Transfer',
            description: 'Internal Transfer',
            account: 'Checking - ****1234',
            amount: -5300,
            status: 'Pending',
            risk: 'Crypto Activity'
        },
        {
            id: 3,
            date: 'Jul 26, 2025',
            type: 'Ach',
            description: 'ACH Credit',
            account: 'Money Market - ****9012',
            amount: 18000,
            status: 'Completed',
            risk: null
        },
        {
            id: 4,
            date: 'Jul 25, 2025',
            type: 'Check',
            description: 'Cashier Check',
            account: 'Checking - ****1234',
            amount: -29600,
            status: 'Pending',
            risk: 'Crypto Activity'
        },
        {
            id: 5,
            date: 'Jul 24, 2025',
            type: 'Ach',
            description: 'ACH Credit',
            account: 'Savings - ****5678',
            amount: 25300,
            status: 'Cleared',
            risk: null
        },
        {
            id: 6,
            date: 'Jul 24, 2025',
            type: 'Wire',
            description: 'Incoming Wire',
            account: 'Checking - ****1234',
            amount: -2300,
            status: 'Cleared',
            risk: null
        }
    ]

    // Apply filters
    let filtered = mockTransactions
    
    if (transactionFilters.value.type) {
        filtered = filtered.filter(t => t.type === transactionFilters.value.type)
    }

    // Apply date filtering logic here if needed
    
    return filtered
}

const getTransactionTypeClass = (type) => {
    const classes = {
        'Wire': 'bg-purple-100 text-purple-800',
        'Transfer': 'bg-blue-100 text-blue-800',
        'Ach': 'bg-blue-100 text-blue-800',
        'Check': 'bg-orange-100 text-orange-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
    const classes = {
        'Cleared': 'bg-green-100 text-green-800',
        'Completed': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Failed': 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

// Generate Risk Flag Data Function (borrowed from ClientDetailView)
const generateRiskFlagData = (category) => {
    const riskFlagDatabase = {
        'UTR Filed': {
            summary: 'UTR (Unusual Transaction Report) has been filed for transactions that appear suspicious or unusual based on the client\'s typical banking patterns. This requires immediate review and potential follow-up with regulatory authorities.',
            volumeData: {
                totalCount: 23,
                currentMonth: 8,
                previousMonth: 5,
                trend: 'increasing'
            },
            flagDetails: [
                {
                    date: '2024-01-15',
                    note: 'Large cash deposit inconsistent with client business profile',
                    officer: 'Sarah Martinez',
                    status: 'Filed',
                    referenceNo: 'UTR-2024-001523'
                },
                {
                    date: '2024-01-10',
                    note: 'Multiple structured transactions below CTR threshold',
                    officer: 'Michael Chen',
                    status: 'Under Review',
                    referenceNo: 'UTR-2024-001498'
                },
                {
                    date: '2024-01-08',
                    note: 'Wire transfer to high-risk jurisdiction without clear business purpose',
                    officer: 'Jennifer Williams',
                    status: 'Filed',
                    referenceNo: 'UTR-2024-001467'
                }
            ],
            investigations: [
                {
                    id: 'INV-2024-UTR-001',
                    description: 'Investigation into potential structuring activity across multiple accounts',
                    assignedTo: 'BSA Compliance Team',
                    priority: 'High'
                },
                {
                    id: 'INV-2024-UTR-002',
                    description: 'Review of international wire transfer patterns for AML compliance',
                    assignedTo: 'Risk Management',
                    priority: 'Critical'
                }
            ],
            chartData: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'UTRs Filed',
                    data: [2, 4, 3, 6, 8, 5, 8],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3
                }]
            }
        },
        'High Risk Industry': {
            summary: 'Client operates in an industry classified as high-risk for money laundering and financial crimes. Enhanced due diligence and monitoring procedures are required.',
            industryDetails: {
                primaryIndustry: 'Money Services Business',
                naicsCode: '522320',
                riskRating: 'High',
                ctrExempt: false,
                whiteFlag: {
                    status: 'Active',
                    reason: 'Compliant with enhanced monitoring requirements',
                    nextReview: '2024-03-15'
                },
                redFlag: {
                    status: 'Under Review',
                    reason: 'Recent changes in transaction patterns require investigation',
                    triggers: [
                        'Volume increase >300% from previous quarter',
                        'New geographical transaction patterns',
                        'Beneficial ownership changes not properly documented'
                    ]
                }
            },
            flagDetails: [
                {
                    category: 'Industry Risk Assessment',
                    detail: 'Money Services Business requires enhanced due diligence per BSA requirements',
                    lastReview: '2024-01-01',
                    riskLevel: 'High'
                },
                {
                    category: 'Regulatory Compliance',
                    detail: 'Regular SAR filings required due to industry classification',
                    lastReview: '2023-12-15',
                    riskLevel: 'Medium'
                }
            ]
        },
        'CTR-exemption': {
            summary: 'Client has been granted exemption from Currency Transaction Report (CTR) filing requirements. Regular review required to ensure continued eligibility.',
            flagDetails: [
                {
                    category: 'Exemption Status',
                    detail: 'Approved for CTR exemption based on established business relationship and compliance history',
                    lastReview: '2023-11-01',
                    riskLevel: 'Compliant'
                },
                {
                    category: 'Review Schedule',
                    detail: 'Annual review required to maintain exemption status',
                    lastReview: '2023-11-01',
                    riskLevel: 'Compliant'
                }
            ]
        },
        'High Cash Deposit': {
            summary: 'Client has made cash deposits exceeding $10,000 threshold, triggering CTR filing requirements and enhanced monitoring.',
            monthlyVolume: {
                totalAmount: 485000,
                currentMonth: 125000,
                previousMonth: 89000,
                trend: 'increasing'
            },
            transactions: [
                {
                    date: '2024-01-15',
                    amount: 45000,
                    description: 'Cash Deposit - Business Operations',
                    branch: 'Downtown Branch',
                    manager: 'Lisa Thompson',
                    purpose: 'Weekly business deposit'
                },
                {
                    date: '2024-01-12',
                    amount: 32000,
                    description: 'Cash Deposit - Revenue Collection',
                    branch: 'Downtown Branch',
                    teller: 'Mark Johnson',
                    purpose: 'Customer payments'
                },
                {
                    date: '2024-01-10',
                    amount: 28000,
                    description: 'Cash Deposit - Sales Revenue',
                    branch: 'Westside Branch',
                    manager: 'Patricia Davis',
                    purpose: 'Retail sales deposit'
                },
                {
                    date: '2024-01-08',
                    amount: 20000,
                    description: 'Cash Deposit - Daily Operations',
                    branch: 'Downtown Branch',
                    teller: 'Steven Wilson',
                    purpose: 'Business operations'
                }
            ],
            chartData: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Cash Deposits ($)',
                    data: [65000, 72000, 58000, 89000, 95000, 89000, 125000],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3
                }]
            }
        },
        'Crypto Trx': {
            summary: 'Client has engaged in cryptocurrency-related transactions which require enhanced monitoring due to increased AML risks.',
            transactions: [
                {
                    date: '2024-01-14',
                    amount: 89500,
                    description: 'Wire Transfer - Crypto Exchange',
                    exchange: 'Coinbase Pro',
                    crypto: 'Bitcoin',
                    type: 'Purchase',
                    wallet: '1A1zP1eP5Q...GeysAr'
                },
                {
                    date: '2024-01-10',
                    amount: 45000,
                    description: 'ACH Transfer - Crypto Platform',
                    exchange: 'Binance US',
                    crypto: 'Ethereum',
                    type: 'Sale',
                    wallet: '0x742d35...8af3'
                },
                {
                    date: '2024-01-08',
                    amount: 28000,
                    description: 'Wire Transfer - Digital Asset Exchange',
                    exchange: 'Kraken',
                    crypto: 'Bitcoin',
                    type: 'Purchase',
                    wallet: '3FKjNA2...9mPv'
                }
            ]
        },
        'Casino Trx': {
            summary: 'Client has conducted transactions with casino establishments, requiring enhanced monitoring for potential money laundering activities.',
            transactions: [
                {
                    date: '2024-01-12',
                    amount: 15000,
                    description: 'Card Transaction - Gaming',
                    casino: 'MGM Grand Casino',
                    type: 'Chip Purchase',
                    location: 'Las Vegas, NV'
                },
                {
                    date: '2024-01-08',
                    amount: 8500,
                    description: 'ATM Withdrawal - Casino Floor',
                    casino: 'Bellagio Casino',
                    type: 'Cash Advance',
                    location: 'Las Vegas, NV'
                }
            ]
        },
        'HRJ Trx (ATM/Wire/Debit)': {
            summary: 'High-risk jurisdiction transactions detected. Enhanced due diligence required for international transfers and operations.',
            transactions: [
                {
                    date: '2024-01-15',
                    amount: 125000,
                    description: 'International Wire Transfer',
                    type: 'Outgoing Wire',
                    country: 'Panama',
                    city: 'Panama City',
                    bank: 'Banco General',
                    status: 'Under Review'
                },
                {
                    date: '2024-01-10',
                    amount: 75000,
                    description: 'ATM Withdrawal',
                    type: 'ATM Transaction',
                    country: 'Cayman Islands',
                    terminal: 'ATM-CAY-001',
                    status: 'Flagged'
                }
            ]
        },
        'Cashier Check Purchase': {
            summary: 'Large cashier check purchases may indicate structuring or other suspicious activity requiring enhanced monitoring.',
            transactions: [
                {
                    date: '2024-01-12',
                    amount: 45000,
                    description: 'Cashier Check Purchase',
                    payee: 'ABC Construction LLC',
                    purpose: 'Equipment Purchase',
                    branch: 'Main Street Branch'
                },
                {
                    date: '2024-01-08',
                    amount: 32000,
                    description: 'Cashier Check Purchase',
                    payee: 'XYZ Investments',
                    purpose: 'Property Deposit',
                    branch: 'Downtown Branch'
                }
            ]
        },
        'Cannabis-Related Trx': {
            summary: 'Client operates in state-legal cannabis industry. Federal regulations require enhanced monitoring and reporting.',
            transactions: [
                {
                    date: '2024-01-14',
                    amount: 285000,
                    description: 'Business Deposit - Cannabis Revenue',
                    merchant: 'Green Valley Dispensary',
                    license: 'CAN-LIC-2023-001',
                    location: 'Denver, CO'
                },
                {
                    date: '2024-01-10',
                    amount: 95000,
                    description: 'Cash Deposit - Retail Sales',
                    merchant: 'Mile High Cannabis',
                    category: 'Retail Sales',
                    location: 'Boulder, CO'
                }
            ]
        },
        'Luxury Goods Trx': {
            summary: 'Transactions involving luxury goods may indicate potential money laundering through high-value purchases.',
            transactions: [
                {
                    date: '2024-01-12',
                    amount: 125000,
                    description: 'Wire Transfer - Luxury Purchase',
                    merchant: 'Prestige Jewelers',
                    category: 'Fine Jewelry',
                    location: 'Beverly Hills, CA'
                },
                {
                    date: '2024-01-08',
                    amount: 89000,
                    description: 'Card Payment - Luxury Goods',
                    merchant: 'Elite Motors',
                    category: 'Luxury Vehicle',
                    location: 'Manhattan, NY'
                }
            ]
        },
        'Third Party Check Deposit': {
            summary: 'Client has deposited checks drawn by third parties, requiring verification of legitimacy and source of funds.',
            transactions: [
                {
                    date: '2024-01-14',
                    amount: 75000,
                    description: 'Third Party Check Deposit',
                    drawer: 'Construction Partners LLC',
                    bank: 'Wells Fargo Bank',
                    payee: 'Current Client Business'
                },
                {
                    date: '2024-01-10',
                    amount: 45000,
                    description: 'Third Party Check Deposit',
                    drawer: 'Real Estate Holdings Inc',
                    bank: 'Bank of America',
                    payee: 'Client Investment Group'
                }
            ]
        },
        'High Cash Withdrawals': {
            summary: 'Large cash withdrawals may indicate unusual business activity or potential structuring to avoid reporting requirements.',
            transactions: [
                {
                    date: '2024-01-15',
                    amount: 45000,
                    description: 'Cash Withdrawal - Business Operations',
                    branch: 'Main Street Branch',
                    manager: 'David Rodriguez',
                    purpose: 'Operational expenses'
                },
                {
                    date: '2024-01-10',
                    amount: 32000,
                    description: 'Cash Withdrawal - Payroll',
                    branch: 'Downtown Branch',
                    teller: 'Maria Garcia',
                    purpose: 'Employee payments'
                }
            ]
        }
    }

    return riskFlagDatabase[category] || null
}
</script>

<style scoped>
.card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgb(229, 231, 235);
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>