<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading client data...</p>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
          </path>
        </svg>
      </div>
      <p class="text-gray-900 font-semibold mb-2">Failed to load client data</p>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchClientData"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Retry
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="$router.go(-1)" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ clientData?.name || 'Client Profile' }}</h1>
              <p class="text-gray-600 mt-1">{{ breadcrumb }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <!-- Alert Indicator -->
            <button v-if="totalAlertCount > 0" @click="showAlertModal = true"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              :class="alertIndicatorClass">
              <span class="text-lg">{{ alertIndicatorIcon }}</span>
              <span>{{ totalAlertCount }} Alert{{ totalAlertCount > 1 ? 's' : '' }}</span>
              <div v-if="hasCriticalAlerts" class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            <button @click="clientAction('generate-report')"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- Left Column - Client Profile, Product Summary, Risk Assessment -->
        <div class="lg:col-span-1 space-y-4">

          <!-- Client Profile -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4">
              <div class="mb-4">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">{{ clientData?.name || 'N/A' }}</h2>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTierBadgeClass(clientTier)">
                    {{ clientTier }}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <p class="text-xs font-medium text-gray-500">Industry</p>
                  <p class="text-sm text-gray-900">{{ clientData?.industry || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500">Location</p>
                  <p class="text-sm text-gray-900">{{ clientData?.location || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500">RM No</p>
                  <p class="text-sm text-gray-900">{{ relationshipManager?.id || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500">Relationship Manager</p>
                  <p class="text-sm text-gray-900">{{ relationshipManager?.name || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Related party -->
          <div
            v-if="clientData?.beneficialOwners || clientData?.authorizedSigners || clientData?.conductors || clientData?.relatedEntities"
            class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-3 border-b border-gray-200">
              <h3 class="text-base font-medium text-gray-900">Related party</h3>
              <p class="text-xs text-gray-500 mt-1">Beneficial ownership, authorized signers, and business conductors
              </p>
            </div>
            <div class="p-4">
              <!-- Beneficial Owners -->
              <div v-if="clientData?.beneficialOwners" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">💎 Beneficial Owners</h4>
                <div class="space-y-2">
                  <div v-for="owner in clientData.beneficialOwners" :key="owner.name"
                    class="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium text-blue-900">{{ owner.name }}</div>
                      <div class="text-xs text-blue-500">ID: {{ generateNineDigitId(owner.id || owner.name, 'BO') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Authorized Signers -->
              <div v-if="clientData?.authorizedSigners" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">✍️ Authorized Signers</h4>
                <div class="space-y-2">
                  <div v-for="signer in clientData.authorizedSigners" :key="signer.name"
                    class="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium text-green-900">{{ signer.name }}</div>
                      <div class="text-xs text-green-500">ID: {{ generateNineDigitId(signer.id || signer.name, 'SIG') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Business Conductors -->
              <div v-if="clientData?.conductors" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">🎯 Business Conductors</h4>
                <div class="space-y-2">
                  <div v-for="conductor in clientData.conductors" :key="conductor.name"
                    class="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium text-purple-900">{{ conductor.name }}</div>
                      <div class="text-xs text-purple-500">ID: {{ generateNineDigitId(conductor.id || conductor.name,
                        'CON') }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Related Entities -->
              <div v-if="clientData?.relatedEntities">
                <h4 class="text-sm font-medium text-gray-900 mb-2">🏢 Related Entities</h4>
                <div class="space-y-2">
                  <div v-for="entity in clientData.relatedEntities" :key="entity.name"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ entity.name }}</div>
                      <div class="text-xs text-gray-500">ID: {{ generateNineDigitId(entity.id || entity.name, 'ENT') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>

        <!-- Right Column - Charts and Analysis -->
        <div class="lg:col-span-3 space-y-6">

          <!-- Section Title -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">📊 Portfolio Analysis & Risk Management</h2>
            <p class="text-sm text-gray-500 mt-2">Comprehensive portfolio review with opportunities and risk assessment
            </p>
          </div>

          <!-- Summary KPIs Row -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <div class="text-center">
                  <div class="text-xl font-bold text-blue-600">{{ totalAccounts }}</div>
                  <div class="text-xs text-gray-600">Total Accounts</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-green-600">{{ formatCurrency(totalDeposits) }}</div>
                  <div class="text-xs text-gray-600">Total Deposit Balance</div>
                  <div class="text-xs text-green-500 font-medium">{{ depositsPercentile }}{{
                    getOrdinalSuffix(depositsPercentile) }} percentile</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-emerald-600">{{ formatCurrency(transactionSummary.totalInflows) }}
                  </div>
                  <div class="text-xs text-gray-600">Total Inflows</div>
                  <div class="text-xs text-emerald-500 font-medium">{{ inflowsPercentile }}{{
                    getOrdinalSuffix(inflowsPercentile) }} percentile</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-orange-600">{{ formatCurrency(totalLoanAmount) }}</div>
                  <div class="text-xs text-gray-600">Total Loans</div>
                  <div class="text-xs text-orange-500 font-medium">{{ loansPercentile }}{{
                    getOrdinalSuffix(loansPercentile) }} percentile</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-purple-600">{{ loanUtilityRate }}%</div>
                  <div class="text-xs text-gray-600">Loan Utility %</div>
                  <div class="text-xs text-purple-500 font-medium">{{ loanUtilityPercentile }}{{
                    getOrdinalSuffix(loanUtilityPercentile) }} percentile</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-cyan-600">{{ formatCurrency(clientData?.annualRevenue || 0) }}
                  </div>
                  <div class="text-xs text-gray-600">Revenue</div>
                  <div class="text-xs text-cyan-500 font-medium">{{ revenuePercentile }}{{
                    getOrdinalSuffix(revenuePercentile) }} percentile</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-indigo-600">{{ numberOfOpportunities }}</div>
                  <div class="text-xs text-gray-600">Opportunities</div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-bold text-red-600">{{ totalRiskFlags }}</div>
                  <div class="text-xs text-gray-600">Risk Flags</div>
                  <div class="text-xs text-red-500 font-medium">{{ riskFlagsPercentile }}{{
                    getOrdinalSuffix(riskFlagsPercentile) }} percentile</div>
                </div>
              </div>
            </div>
          </div>





          <!-- Tab Navigation -->
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button @click="activeTab = 'portfolio'" :class="[
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]">
                  💼 Portfolio & Opportunities
                </button>
                <button @click="activeTab = 'risk'" :class="[
                  activeTab === 'risk'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]">
                  🚨 Risk Assessment
                </button>
              </nav>
            </div>
          </div>

          <!-- Portfolio & Opportunities Tab Content -->
          <div v-show="activeTab === 'portfolio'">
            <!-- Product Analysis & Opportunities Section -->
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">💼 Product Analysis & Growth Opportunities</h2>
              <p class="text-sm text-gray-500 mt-2">Comprehensive product portfolio review and AI-driven growth
                recommendations</p>
            </div>

            <!-- Product Penetration & AI Recommendations -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">📈 Product Penetration & AI-Powered Recommendations
                    </h3>
                    <p class="text-sm text-gray-500 mt-2">Cross-sell opportunities and growth potential analysis powered
                      by machine learning insights
                    </p>
                  </div>
                  <span class="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">🤖 ML
                    Powered</span>
                </div>
              </div>
              <div class="p-6">
                <!-- Product Portfolio Breakdown -->
                <div class="mb-8">
                  <h4 class="text-lg font-medium text-gray-900 mb-4">🏦 Product Portfolio Breakdown</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <!-- Business Deposit Product -->
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                        🟦 Business Deposit Product
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Checking</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Debit Cards</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">CDs</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Savings and Money Market</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Business Lending Product -->
                    <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <h5 class="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                        🟦 Business Lending Product
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Credit Cards</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Loans and Lines of Credit</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Securities-Based Lending</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Real Estate Financing</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Paycheck Protection Program (PPP)</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Commercial Lending Solutions -->
                    <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h5 class="text-sm font-semibold text-orange-900 mb-3 flex items-center">
                        🟧 Commercial Lending Solutions
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Asset Based Lending</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Commercial Lending</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Commercial Real Estate</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Equipment Finance</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Treasury & Cash Management -->
                    <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h5 class="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
                        🟨 Treasury & Cash Management
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Liquidity Management</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Payables</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Receivables</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Fraud Control</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Information Services</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Treasury Overview & Articles</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Business Services & Support -->
                    <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 class="text-sm font-semibold text-green-900 mb-3 flex items-center">
                        🟩 Business Services & Support
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Online Banking</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Online Accounting</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Payroll</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Business Payment Suite</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Overdraft Services</span>
                          <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Merchant Solutions</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">New to Small Business Checking</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Healthcare Professionals</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Wealth & Investment Services -->
                    <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h5 class="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                        🟪 Wealth & Investment Services
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Investments</span>
                          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Wealth & Retirement Planning</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-700">Private Client Banking</span>
                          <div class="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>

                  <!-- Legend -->
                  <div class="mt-6 flex justify-center items-center space-x-6 text-sm">
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="text-gray-700">Client Has Product</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="text-gray-700">AI Recommended</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                        <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="text-gray-700">Not Available/Recommended</span>
                    </div>
                  </div>
                </div>

                <!-- Product Penetration Overview -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div class="lg:col-span-1">
                    <div class="text-center">
                      <div class="text-4xl font-bold text-blue-600 mb-2">{{ clientData?.productPenetration || 0 }}%
                      </div>
                      <div class="text-sm text-gray-600 mb-4">Current Product Penetration</div>
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div
                          class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                          :style="{ width: (clientData?.productPenetration || 0) + '%' }"></div>
                      </div>
                      <div class="mt-3 text-xs text-gray-500">
                        {{ 100 - (clientData?.productPenetration || 0) }}% growth opportunity remaining
                      </div>
                    </div>
                  </div>

                  <div class="lg:col-span-2">
                    <h4 class="text-lg font-medium text-gray-900 mb-4">🤖 AI-Powered Product Recommendations</h4>
                    <div class="space-y-3">
                      <div v-for="recommendation in aiRecommendations" :key="recommendation.product"
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                              <h5 class="text-sm font-semibold text-blue-900">{{ recommendation.product }}</h5>
                              <span class="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                {{ recommendation.confidence }}% confidence
                              </span>
                            </div>
                            <p class="text-sm text-blue-700 mb-2">{{ recommendation.reason }}</p>
                            <div class="flex items-center space-x-4 text-xs text-gray-600">
                              <span>💰 {{ formatCurrency(recommendation.potentialRevenue) }} potential</span>
                              <span>🎯 {{ recommendation.priority }} priority</span>
                            </div>
                          </div>
                          <div class="ml-4 flex flex-col space-y-2">
                            <button @click="acceptRecommendation(recommendation)"
                              class="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                              Accept
                            </button>
                            <button
                              class="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>

            <!-- Account and Loan Portfolio Summary -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">💼 Account and Loan Portfolio Summary</h3>
                    <p class="text-sm text-gray-500 mt-1">Client account breakdown with drill-down capability</p>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="accountViewType = 'cards'"
                      :class="['px-3 py-1 text-xs rounded-full', accountViewType === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']">
                      Card View
                    </button>
                    <button @click="accountViewType = 'table'"
                      :class="['px-3 py-1 text-xs rounded-full', accountViewType === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']">
                      Table View
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-6">




                <!-- Account Cards View -->
                <div v-if="accountViewType === 'cards'"
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div v-for="account in accountDetails" :key="account.id"
                    class="account-card bg-gradient-to-br border rounded-lg p-4 hover:shadow-md transition-all relative group"
                    :class="getAccountCardClass(account.type)">
                    <!-- Account Header -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <div class="flex items-center space-x-2">
                          <h4 class="text-sm font-medium text-gray-900">{{ account.name }}</h4>
                          <span v-if="account.riskLevel === 'High'"
                            class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </div>
                        <p class="text-xs text-gray-500">{{ account.type }} • ****{{ account.number.slice(-4) }}</p>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-bold" :class="getAccountBalanceColor(account.balance)">
                          {{ formatCurrency(account.balance) }}
                        </span>
                        <!-- Contextual Menu -->
                        <div class="relative">
                          <button @click="toggleAccountMenu(account.id)"
                            class="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                          <!-- Dropdown Menu -->
                          <div v-if="openMenus[account.id]" @click.stop
                            class="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div class="py-1">
                              <button @click="quickAction('view-transactions', account)"
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                📊 View Transactions
                              </button>
                              <button @click="quickAction('generate-statement', account)"
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                📄 Generate Statement
                              </button>
                              <button @click="quickAction('flag-review', account)"
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                🚩 Flag for Review
                              </button>
                              <button @click="quickAction('create-task', account)"
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                ✅ Create Task
                              </button>
                              <button @click="quickAction('freeze-account', account)"
                                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                ❄️ Freeze Account
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Account Metrics -->
                    <div class="space-y-2 mb-3">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Monthly Volume:</span>
                        <span class="font-medium">{{ formatCurrency(account.monthlyVolume) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Last Activity:</span>
                        <span class="text-gray-500">{{ formatDate(account.lastTransaction) }}</span>
                      </div>
                    </div>

                    <!-- Quick Action Buttons -->
                    <div class="grid grid-cols-2 gap-2">
                      <button @click="quickAction('view-transactions', account)"
                        class="text-xs py-1.5 px-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                        Trx
                      </button>
                      <button @click="quickAction('view-trends', account)"
                        title="Explore monthly trends in deposits, loans, and flagged activity over time"
                        class="text-xs py-1.5 px-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
                        📊 View Trends
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Account Table View -->
                <div v-if="accountViewType === 'table'" class="overflow-x-auto mb-6">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Volume</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last
                          Activity</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="account in accountDetails" :key="account.id" class="hover:bg-gray-50 cursor-pointer"
                        @click="drillDownToAccount(account)">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ account.name }}</div>
                            <div class="text-sm text-gray-500">****{{ account.number.slice(-4) }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getAccountTypeClass(account.type)">
                            {{ account.type }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                          :class="getAccountBalanceColor(account.balance)">
                          {{ formatCurrency(account.balance) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {{ formatCurrency(account.monthlyVolume) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(account.lastTransaction) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button class="text-blue-600 hover:text-blue-800">View</button>
                          <span class="mx-2 text-gray-300">|</span>
                          <button class="text-gray-600 hover:text-gray-800">History</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Account & Loan Portfolio Chart -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900">📊 Account & Loan Portfolio Balance</h4>
                      <p class="text-sm text-gray-500">Account balances (positive) vs loan utilization (negative) with
                        available credit line</p>
                    </div>
                    <div class="flex space-x-2">
                      <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Deposits</span>
                      <span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Loans</span>
                    </div>
                  </div>
                  <div class="h-80 bg-gray-50 rounded-lg p-4">
                    <BarChart v-if="accountLoanPortfolioData" :data="accountLoanPortfolioData" />
                  </div>

                </div>
              </div>
            </div>

            <!-- Transaction Volume Analysis -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">💸 Transaction Volume</h3>
                    <p class="text-sm text-gray-500 mt-1">Monthly transaction flows by category (inflows positive,
                      outflows negative)</p>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="showTransactionModal = true"
                      class="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">View
                      Trx</button>
                    <button class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Pattern Review</button>
                    <button class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">Normal Range</button>
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div class="h-80">
                  <BarChart v-if="transactionVolumeData" :data="transactionVolumeData" />
                </div>
                <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  <div class="text-center p-3 bg-green-50 rounded-lg">
                    <p class="text-green-600 font-medium">Total Inflows</p>
                    <p class="text-xl font-bold text-green-900">{{ formatCurrency(transactionSummary.totalInflows) }}
                    </p>
                    <p class="text-xs text-green-500 font-medium">{{ inflowsPercentile }}{{
                      getOrdinalSuffix(inflowsPercentile) }} percentile</p>
                  </div>
                  <div class="text-center p-3 bg-red-50 rounded-lg">
                    <p class="text-red-600 font-medium">Total Outflows</p>
                    <p class="text-xl font-bold text-red-900">{{ formatCurrency(transactionSummary.totalOutflows) }}</p>
                    <p class="text-xs text-red-500 font-medium">{{ outflowsPercentile }}{{
                      getOrdinalSuffix(outflowsPercentile) }} percentile</p>
                  </div>
                  <div class="text-center p-3 bg-blue-50 rounded-lg">
                    <p class="text-blue-600 font-medium">Net Flow</p>
                    <p class="text-xl font-bold text-blue-900">{{ formatCurrency(transactionSummary.netAmount) }}</p>
                    <p class="text-xs text-blue-600">{{ transactionSummary.netAmount > 0 ? 'Positive trend' : `Negative
                      trend` }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Assessment Tab Content -->
          <div v-show="activeTab === 'risk'">
            <!-- Risk Assessment Section -->
            <div class="text-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">🚨 Risk Assessment</h2>
            </div>

            <!-- Risk Assessment Content -->
            <!-- Risk Flag Distribution -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 mt-1">Risk categories with detailed analysis - click for
                      investigation details</p>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <!-- Summary Section -->
                <div class="mb-6 flex justify-center">
                  <div class="bg-red-50 rounded-lg p-4 border border-red-200 w-64">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600">8</div>
                      <div class="text-sm text-gray-600">Total Risk Flags</div>
                    </div>
                  </div>
                </div>

                <!-- Risk Flag Breakdown -->
                <div class="mb-6">
                  <h4 class="text-base font-medium text-gray-900 mb-3">🚨 Risk Flag Categories</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <!-- Non-Transactional Flag -->
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                        📋 Non-Transactional Flag
                      </h5>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded"
                          @click="openRiskFlagModal({ category: 'UTR Filed', type: 'reported', riskLevel: 'high', hasData: true })">
                          <span class="text-sm text-gray-700">UTR Filed</span>
                          <div class="w-4 h-4 rounded-full bg-red-500"></div>
                        </div>
                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded"
                          @click="openRiskFlagModal({ category: 'High Risk Industry', type: 'reported', riskLevel: 'medium', hasData: true })">
                          <span class="text-sm text-gray-700">High Risk Industry</span>
                          <div class="w-4 h-4 rounded-full bg-red-500"></div>
                        </div>
                        <div class="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-2 rounded">
                          <span class="text-sm text-gray-700">CTR-exemption</span>
                          <div class="w-4 h-4 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>

                    <!-- High Risk Trx -->
                    <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 class="text-sm font-semibold text-red-900 mb-3 flex items-center">
                        🚨 High Risk Transactions
                      </h5>
                      <div class="grid grid-cols-1 gap-2">
                        <!-- Row 1 -->
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Cannabis-Related Trx', type: 'high-risk-trx', riskLevel: 'high', hasData: false })">
                            <span class="text-xs text-gray-700">Cannabis-Related Trx</span>
                            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                          </div>
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Cashier Check Purchase', type: 'high-risk-trx', riskLevel: 'medium', hasData: false })">
                            <span class="text-xs text-gray-700">Cashier Check Purchase</span>
                            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                          </div>
                        </div>
                        <!-- Row 2 -->
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Casino Trx', type: 'high-risk-trx', riskLevel: 'high', hasData: false })">
                            <span class="text-xs text-gray-700">Casino Trx</span>
                            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                          </div>
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Crypto Trx', type: 'high-risk-trx', riskLevel: 'high', hasData: true })">
                            <span class="text-xs text-gray-700">Crypto Trx</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                        <!-- Row 3 -->
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'High Cash Deposit', type: 'high-risk-trx', riskLevel: 'high', hasData: true })">
                            <span class="text-xs text-gray-700">High Cash Deposit</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'High Cash Withdrawals', type: 'high-risk-trx', riskLevel: 'medium', hasData: true })">
                            <span class="text-xs text-gray-700">High Cash Withdrawals</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                        <!-- Row 4 -->
                        <div class="grid grid-cols-2 gap-2">
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'HRJ Trx (ATM/Wire/Debit)', type: 'high-risk-trx', riskLevel: 'high', hasData: true })">
                            <span class="text-xs text-gray-700">HRJ Trx (ATM/Wire/Debit)</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Luxury Goods Trx', type: 'high-risk-trx', riskLevel: 'medium', hasData: true })">
                            <span class="text-xs text-gray-700">Luxury Goods Trx</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                        <!-- Row 5 -->
                        <div class="grid grid-cols-1 gap-2">
                          <div class="flex items-center justify-between cursor-pointer hover:bg-red-100 p-2 rounded"
                            @click="openRiskFlagModal({ category: 'Third Party Check Deposit', type: 'high-risk-trx', riskLevel: 'medium', hasData: true })">
                            <span class="text-xs text-gray-700">Third Party Check Deposit</span>
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>


                </div>


              </div>
            </div>

            <!-- Risk Analytics & Time Series -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">📊 Risk Analytics & Time Series</h3>
                    <p class="text-sm text-gray-500 mt-1">Historical risk pattern analysis with drill-down capabilities
                    </p>
                  </div>
                  <div class="flex items-center space-x-3">
                    <select v-model="riskTimeframe" class="text-sm border border-gray-300 rounded-lg px-3 py-1">
                      <option value="3M">Last 3 Months</option>
                      <option value="6M">Last 6 Months</option>
                      <option value="1Y">Last 12 Months</option>
                      <option value="2Y">Last 24 Months</option>
                    </select>
                    <button @click="exportRiskData"
                      class="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <!-- Summary Section -->
                <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600">{{ formatCurrency(totalRiskTransactionAmount) }}
                      </div>
                      <div class="text-sm text-gray-600">High Risk Transaction Amount</div>
                      <div class="text-xs text-red-500 font-medium">{{ riskAmountPercentile }}{{
                        getOrdinalSuffix(riskAmountPercentile) }} percentile</div>
                    </div>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-orange-600">{{ totalRiskTransactionCount }}</div>
                      <div class="text-sm text-gray-600">High Risk Transactions</div>
                      <div class="text-xs text-orange-500 font-medium">{{ riskCountPercentile }}{{
                        getOrdinalSuffix(riskCountPercentile) }} percentile</div>
                    </div>
                  </div>
                  <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-yellow-600">{{ totalUTRFiled }}</div>
                      <div class="text-sm text-gray-600">UTR Filed</div>
                      <div class="text-xs text-yellow-500 font-medium">{{ utrPercentile }}{{
                        getOrdinalSuffix(utrPercentile) }} percentile</div>
                    </div>
                  </div>
                </div>

                <!-- Risk Transaction Types Filter -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between mb-3">
                    <label class="text-sm font-medium text-gray-700">Risk Transaction Types:</label>
                    <button @click="resetRiskTransactionFilters" class="text-xs text-blue-600 hover:text-blue-800">Reset
                      All</button>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <label v-for="txnType in riskTransactionTypes" :key="txnType" class="flex items-center space-x-2">
                      <input type="checkbox" v-model="selectedRiskTxnTypes" :value="txnType" class="rounded">
                      <span class="text-xs text-gray-600">{{ txnType }}</span>
                    </label>
                  </div>
                </div>

                <!-- Charts Section -->
                <div class="space-y-4">
                  <!-- Stacked Bar Chart - Risk Transactions -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-md font-medium text-gray-900">🚨 High Risk Transactions by Type (Monthly)</h4>
                      <button @click="drillDownRiskTxn"
                        class="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                          </path>
                        </svg>
                        View Details
                      </button>
                    </div>
                    <div class="h-80" ref="riskTransactionChart">
                      <BarChart :data="filteredRiskTransactionData" :options="riskTransactionChartOptions" />
                    </div>
                    <div class="mt-3 flex justify-between text-xs text-gray-600">
                      <span>Total Selected Types: {{ formatCurrency(selectedTypesTotalAmount) }}</span>
                      <span>{{ selectedRiskTxnTypes.length }} of {{ riskTransactionTypes.length }} types selected</span>
                    </div>
                  </div>

                  <!-- UTR Filed Scatter Chart -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-md font-medium text-gray-900">📋 Store UTR Filed</h4>
                      <span class="text-xs text-gray-500">{{ totalUTRFiled }} events in selected period</span>
                    </div>
                    <div class="h-20" ref="utrScatterChart">
                      <div class="relative h-full">
                        <!-- UTR Events as dots -->
                        <div class="absolute inset-0 flex items-center">
                          <div class="w-full relative h-2 bg-gray-200 rounded">
                            <div v-for="utrEvent in utrEvents" :key="utrEvent.id"
                              class="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform group"
                              :style="{ left: utrEvent.position + '%', top: '-2px' }" @click="viewUTRDetails(utrEvent)">
                              <!-- Tooltip -->
                              <div
                                class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg w-96">
                                <div class="font-semibold">{{ utrEvent.date }}</div>
                                <div class="text-gray-300">{{ utrEvent.description }}</div>
                                <div class="text-yellow-300">Amount: {{ formatCurrency(utrEvent.amount) }}</div>
                                <div class="text-blue-300">Officer: {{ utrEvent.officer }}</div>
                                <div class="mt-1 text-gray-400 whitespace-normal">{{ utrEvent.notes }}</div>
                                <!-- Tooltip arrow -->
                                <div
                                  class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-3 flex justify-between text-xs text-gray-600">
                      <span>Click dots for UTR details</span>
                      <span> </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="showTransactionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showTransactionModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">💳 Transaction Details</h3>
              <p class="text-sm text-gray-600 mt-1">{{ clientData?.name || 'Client' }} - Individual Transaction
                History
              </p>
            </div>
            <button @click="showTransactionModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Date Range Filters -->
          <div class="mt-4 flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">From:</label>
              <input v-model="transactionFilters.startDate" type="date"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">To:</label>
              <input v-model="transactionFilters.endDate" type="date"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Type:</label>
              <select v-model="transactionFilters.type"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer">Transfers</option>
                <option value="wire">Wires</option>
                <option value="ach">ACH</option>
                <option value="check">Checks</option>
              </select>
            </div>
            <button @click="loadTransactions"
              class="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
            <button @click="resetFilters"
              class="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors">
              Reset
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <!-- Transaction Summary -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-green-600 font-medium">Total Inflows</p>
              <p class="text-xl font-bold text-green-900">{{ formatCurrency(transactionSummary.totalInflows) }}</p>
              <p class="text-xs text-green-600">{{ transactionSummary.inflowCount }} transactions</p>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <p class="text-sm text-red-600 font-medium">Total Outflows</p>
              <p class="text-xl font-bold text-red-900">{{ formatCurrency(transactionSummary.totalOutflows) }}</p>
              <p class="text-xs text-red-600">{{ transactionSummary.outflowCount }} transactions</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">Net Amount</p>
              <p class="text-xl font-bold text-blue-900">{{ formatCurrency(transactionSummary.netAmount) }}</p>
              <p class="text-xs text-blue-600">{{ transactionSummary.totalCount }} total transactions</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 font-medium">Average Amount</p>
              <p class="text-xl font-bold text-gray-900">{{ formatCurrency(transactionSummary.averageAmount) }}</p>
              <p class="text-xs text-gray-600">Per transaction</p>
            </div>
          </div>

          <!-- Transaction Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(transaction.date) }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTransactionTypeClass(transaction.type)">
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ transaction.description }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ transaction.account }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium"
                    :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(Math.abs(transaction.amount)) }}
                    <span class="text-xs ml-1">{{ transaction.amount >= 0 ? '↗' : '↙' }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(transaction.status)">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span v-if="transaction.riskFlag"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getRiskFlagClass(transaction.riskFlag)">
                      {{ transaction.riskFlag }}
                    </span>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize,
                filteredTransactions.length) }} of {{ filteredTransactions.length }} transactions
            </div>
            <div class="flex items-center space-x-2">
              <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span class="px-3 py-1 text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Creation Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div class="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Create New Task</h2>
          <button @click="showTaskModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="createTask" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select v-model="newTask.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="review">Account Review</option>
                <option value="follow-up">Client Follow-up</option>
                <option value="compliance">Compliance Check</option>
                <option value="meeting">Schedule Meeting</option>
                <option value="documentation">Update Documentation</option>
                <option value="investigation">Risk Investigation</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select v-model="newTask.priority"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input v-model="newTask.title" type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title" required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea v-model="newTask.description" rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input v-model="newTask.dueDate" type="date"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Related Account (optional)</label>
              <select v-model="newTask.accountId"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select account...</option>
                <option v-for="account in accountDetails" :key="account.id" :value="account.id">
                  {{ account.name }} ({{ account.type }})
                </option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showTaskModal = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create
                Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="showNotification"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <span>{{ notificationMessage }}</span>
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
                  <path v-if="selectedRiskFlag.riskLevel === 'high' || selectedRiskFlag.riskLevel === 'medium'"
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
                <h3 class="text-xl font-semibold text-gray-900">{{ selectedRiskFlag.category }} - Investigation
                  Details
                </h3>
                <p class="text-sm text-gray-600 mt-1">{{ selectedRiskFlag.type || 'Risk flag analysis' }} | Risk
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
              <p class="text-sm text-blue-800">{{ generateRiskFlagData(selectedRiskFlag.category).summary }}</p>
            </div>

            <!-- UTR Volume Data Section -->
            <div v-if="generateRiskFlagData(selectedRiskFlag.category).volumeData" class="bg-gray-50 rounded-lg p-4">
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
                    {{ generateRiskFlagData(selectedRiskFlag.category).volumeData.trend === 'increasing' ? '↗️' : '↘️'
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
                      generateRiskFlagData(selectedRiskFlag.category).industryDetails.primaryIndustry }}</div>
                    <div><span class="font-medium">NAICS Code:</span> {{
                      generateRiskFlagData(selectedRiskFlag.category).industryDetails.naicsCode }}</div>
                    <div><span class="font-medium">Risk Rating:</span>
                      <span class="px-2 py-1 rounded text-xs bg-red-100 text-red-800">{{
                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.riskRating }}</span>
                    </div>
                    <div><span class="font-medium">CTR Exempt:</span>
                      <span
                        :class="generateRiskFlagData(selectedRiskFlag.category).industryDetails.ctrExempt ? 'text-green-600' : 'text-red-600'">
                        {{ generateRiskFlagData(selectedRiskFlag.category).industryDetails.ctrExempt ? 'Yes' : 'No' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 class="font-medium text-gray-900 mb-2">Flag Status</h5>
                  <div class="space-y-3">
                    <div class="border border-gray-200 rounded p-3">
                      <div class="flex items-center mb-1">
                        <div class="w-3 h-3 bg-white border-2 border-gray-400 rounded-full mr-2"></div>
                        <span class="font-medium text-sm">White Flag</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs bg-green-100 text-green-800">{{
                          generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.status }}</span>
                      </div>
                      <div class="text-xs text-gray-600 ml-5">{{
                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.reason }}</div>
                      <div class="text-xs text-gray-500 ml-5 mt-1">Next Review: {{
                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.whiteFlag.nextReview }}</div>
                    </div>
                    <div class="border border-gray-200 rounded p-3">
                      <div class="flex items-center mb-1">
                        <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span class="font-medium text-sm">Red Flag</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs bg-red-100 text-red-800">{{
                          generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.status }}</span>
                      </div>
                      <div class="text-xs text-gray-600 ml-5">{{
                        generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.reason }}</div>
                      <div class="text-xs text-gray-500 ml-5 mt-1">
                        <div
                          v-for="trigger in generateRiskFlagData(selectedRiskFlag.category).industryDetails.redFlag.triggers"
                          :key="trigger" class="mb-1">• {{ trigger }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Volume Data Section -->
            <div v-if="generateRiskFlagData(selectedRiskFlag.category).monthlyVolume" class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-lg font-medium text-gray-900 mb-4">📈 Monthly Transaction Volume</h4>
              <div class="grid grid-cols-4 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{
                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.totalAmount) }}</div>
                  <div class="text-xs text-gray-500">Total (8 Months)</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{
                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.currentMonth) }}</div>
                  <div class="text-xs text-gray-500">Current Month</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-600">{{
                    formatCurrency(generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.previousMonth) }}</div>
                  <div class="text-xs text-gray-500">Previous Month</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold"
                    :class="generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.trend === 'increasing' ? 'text-red-600' : 'text-green-600'">
                    {{ generateRiskFlagData(selectedRiskFlag.category).monthlyVolume.trend === 'increasing' ? '↗️' :
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
                  :key="detail.date || detail.category" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div v-if="detail.officer" class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">{{ formatDate(detail.date) }}</div>
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
                      <div class="text-xs text-gray-500 mt-1">Last Review: {{ formatDate(detail.lastReview) }}</div>
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
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
                      </th>
                      <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="transaction in generateRiskFlagData(selectedRiskFlag.category).transactions"
                      :key="transaction.date + transaction.amount" class="hover:bg-gray-50">
                      <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(transaction.date) }}</td>
                      <td class="px-4 py-4 text-sm font-medium text-right"
                        :class="transaction.amount >= 10000 ? 'text-red-600' : 'text-gray-900'">
                        {{ formatCurrency(transaction.amount) }}
                      </td>
                      <td class="px-4 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                      <td class="px-4 py-4 text-sm text-gray-500">
                        <!-- UTR Filed Details -->
                        <div v-if="selectedRiskFlag.category === 'UTR Filed'">
                          <div class="font-medium">{{ transaction.referenceNo }}</div>
                          <div class="text-xs text-gray-400">Officer: {{ transaction.officer }}</div>
                          <div class="text-xs"
                            :class="transaction.status === 'Filed' ? 'text-green-600' : 'text-yellow-600'">{{
                              transaction.status }}</div>
                        </div>

                        <!-- Cash Transaction Details -->
                        <div v-else-if="selectedRiskFlag.category.includes('Cash')">
                          <div class="font-medium">{{ transaction.branch }}</div>
                          <div class="text-xs text-gray-400">{{ transaction.teller || transaction.manager }}</div>
                          <div v-if="transaction.purpose" class="text-xs text-gray-500">{{ transaction.purpose }}</div>
                        </div>

                        <!-- Third Party Cheque Details -->
                        <div v-else-if="selectedRiskFlag.category === 'Third Party Cheque Deposit'">
                          <div class="font-medium">{{ transaction.drawer }}</div>
                          <div class="text-xs text-gray-400">Bank: {{ transaction.bank }}</div>
                          <div class="text-xs text-gray-500">Payee: {{ transaction.payee }}</div>
                        </div>

                        <!-- Crypto Transaction Details -->
                        <div v-else-if="selectedRiskFlag.category === 'Crypto Trx'">
                          <div class="font-medium">{{ transaction.exchange }}</div>
                          <div class="text-xs text-gray-400">{{ transaction.crypto }} ({{ transaction.type }})</div>
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
                          <div class="text-xs text-gray-400">{{ transaction.country }}{{ transaction.city ? ', ' +
                            transaction.city : '' }}</div>
                          <div v-if="transaction.bank" class="text-xs text-gray-500">{{ transaction.bank }}</div>
                          <div v-if="transaction.terminal" class="text-xs text-gray-500">{{ transaction.terminal }}
                          </div>
                          <div v-if="transaction.status" class="text-xs text-red-600 font-medium">{{ transaction.status
                          }}
                          </div>
                        </div>

                        <!-- Cashier Cheque Details -->
                        <div v-else-if="selectedRiskFlag.category === 'Cashier Cheque Purchase'">
                          <div class="font-medium">{{ transaction.payee }}</div>
                          <div class="text-xs text-gray-400">{{ transaction.purpose }}</div>
                          <div class="text-xs text-gray-500">{{ transaction.branch }}</div>
                        </div>

                        <!-- Cannabis Transaction Details -->
                        <div v-else-if="selectedRiskFlag.category === 'Cannabis-Related Trx'">
                          <div class="font-medium">{{ transaction.merchant }}</div>
                          <div class="text-xs text-gray-400">{{ transaction.category || transaction.license }}</div>
                          <div class="text-xs text-gray-500">{{ transaction.location }}</div>
                        </div>

                        <!-- Default Details -->
                        <div v-else>
                          <div class="text-xs text-gray-500">{{ transaction.purpose || transaction.note || 'N/A' }}
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
                      <div class="text-xs text-gray-500 mt-1">Assigned to: {{ investigation.assignedTo }}</div>
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
              <button @click="closeRiskFlagModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
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
  </div>

  <!-- Loan Applications Tab Content -->


  <!-- Alert Modal -->
  <div v-if="showAlertModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="showAlertModal = false">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              ⚠️ Client Alerts - {{ clientData?.name }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ totalAlertCount }} active alert{{ totalAlertCount > 1 ? 's' : '' }} requiring attention
            </p>
          </div>
          <button @click="showAlertModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Alert Tabs -->
        <div class="mt-4 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Alert Tabs">
            <button @click="activeAlertTab = 'delinquency'" :class="[
              activeAlertTab === 'delinquency'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
            ]">
              <span>🚨</span>
              <span>Loan Delinquency</span>
              <span v-if="loanDelinquencyAlerts.length > 0"
                class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {{ loanDelinquencyAlerts.length }}
              </span>
            </button>
            <button @click="activeAlertTab = 'overdraft'" :class="[
              activeAlertTab === 'overdraft'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
            ]">
              <span>💰</span>
              <span>Overdraft</span>
              <span v-if="overdraftAlerts.length > 0"
                class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                {{ overdraftAlerts.length }}
              </span>
            </button>
            <button @click="activeAlertTab = 'other'" :class="[
              activeAlertTab === 'other'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
            ]">
              <span>⚠️</span>
              <span>Other Alerts</span>
              <span v-if="otherAlerts.length > 0" class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {{ otherAlerts.length }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 max-h-96 overflow-y-auto">
        <!-- Loan Delinquency Tab -->
        <div v-show="activeAlertTab === 'delinquency'">
          <div v-if="loanDelinquencyAlerts.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl">✅</span>
            <p class="mt-2">No loan delinquency alerts</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="alert in loanDelinquencyAlerts" :key="alert.id"
              class="border border-red-200 rounded-lg p-4 bg-red-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-3">
                    <h4 class="font-semibold text-red-900">{{ alert.loanType }}</h4>
                    <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {{ alert.daysPastDue }} days past due
                    </span>
                    <span class="bg-red-200 text-red-900 text-xs px-2 py-1 rounded-full font-medium">
                      {{ alert.severity }}
                    </span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span class="text-gray-600">Account:</span>
                      <div class="font-medium">{{ alert.accountNumber }}</div>
                    </div>
                    <div>
                      <span class="text-gray-600">Amount Due:</span>
                      <div class="font-medium text-red-600">{{ formatCurrency(alert.amountDue) }}</div>
                    </div>
                    <div>
                      <span class="text-gray-600">Last Payment:</span>
                      <div class="font-medium">{{ alert.lastPaymentDate }}</div>
                    </div>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-600">Total Outstanding:</span>
                    <span class="font-medium text-red-700 ml-1">{{ formatCurrency(alert.totalOutstanding) }}</span>
                    <span class="text-gray-600 ml-3">Original Amount:</span>
                    <span class="font-medium ml-1">{{ formatCurrency(alert.originalAmount) }}</span>
                  </div>
                </div>
                <div class="flex flex-col space-y-2 ml-4">
                  <button @click="handleDelinquencyAlert(alert)"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                    Review Now
                  </button>
                  <button @click="scheduleCall(alert)"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overdraft Tab -->
        <div v-show="activeAlertTab === 'overdraft'">
          <div v-if="overdraftAlerts.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl">✅</span>
            <p class="mt-2">No overdraft alerts</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="alert in overdraftAlerts" :key="alert.id"
              class="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-3">
                    <h4 class="font-semibold text-orange-900">{{ alert.accountType }}</h4>
                    <span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {{ alert.severity }} Priority
                    </span>
                    <span class="bg-orange-200 text-orange-900 text-xs px-2 py-1 rounded-full font-medium">
                      {{ alert.daysOverdrawn }} days overdrawn
                    </span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span class="text-gray-600">Account:</span>
                      <div class="font-medium">{{ alert.accountNumber }}</div>
                    </div>
                    <div>
                      <span class="text-gray-600">Current Balance:</span>
                      <div class="font-medium text-orange-600">{{ formatCurrency(alert.currentBalance) }}</div>
                    </div>
                    <div>
                      <span class="text-gray-600">Overdraft Amount:</span>
                      <div class="font-medium text-red-600">{{ formatCurrency(Math.abs(alert.currentBalance)) }}</div>
                    </div>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-600">Overdraft Limit:</span>
                    <span class="font-medium ml-1">{{ formatCurrency(alert.overdraftLimit) }}</span>
                    <span class="text-gray-600 ml-3">Fee Accrued:</span>
                    <span class="font-medium text-red-600 ml-1">{{ formatCurrency(alert.feeAccrued) }}</span>
                  </div>
                </div>
                <div class="flex flex-col space-y-2 ml-4">
                  <button @click="handleOverdraftAlert(alert)"
                    class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">
                    Review Account
                  </button>
                  <button @click="contactClient(alert)"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Contact Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Alerts Tab -->
        <div v-show="activeAlertTab === 'other'">
          <div v-if="otherAlerts.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl">✅</span>
            <p class="mt-2">No other alerts</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="alert in otherAlerts" :key="alert.id"
              class="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h4 class="font-semibold text-yellow-900">{{ alert.type }}</h4>
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {{ alert.severity }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">{{ alert.description }}</p>
                </div>
                <button @click="handleOtherAlert(alert)"
                  class="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex space-x-3">
            <button @click="markAllAsReviewed"
              class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Mark All as Reviewed
            </button>
            <button @click="exportAlertReport"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Export Report
            </button>
          </div>
          <button @click="showAlertModal = false"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { formatCurrency } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'
import DoughnutChart from './charts/DoughnutChart.vue'
import LineChart from './charts/LineChart.vue'

const props = defineProps({
  metroId: { type: String, required: true },
  marketId: { type: String, required: true },
  regionId: { type: String, required: true },
  rmId: { type: String, required: true },
  relationshipId: { type: String, required: false },
  clientId: { type: String, required: true }
})

const router = useRouter()

// Transaction Modal State
const showTransactionModal = ref(false)
const currentPage = ref(1)
const pageSize = 100
const allTransactions = ref([])

// UI State
const accountViewType = ref('cards')
const showBulkActions = ref(false)
const showTaskModal = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')
const openMenus = ref({})

// Risk Flag Modal State
const showRiskFlagModal = ref(false)
const selectedRiskFlag = ref(null)

// Risk Analytics State
const riskTimeframe = ref('6M')
const modalTimeframe = ref('3M')
const timelineRange = ref('3M')
const showAllEvents = ref(false)
const selectedTxnTypes = ref(['Wire', 'Cash', 'Crypto', 'MSB'])
const selectedFlagTypes = ref(['UTR', 'High Cash', 'MSB', 'Crypto'])

// Tab State
const activeTab = ref('portfolio')

// Loan Application Tracker Collapse State
const isLoanTrackerCollapsed = ref(false)

// Alert Modal State
const showAlertModal = ref(false)
const activeAlertTab = ref('delinquency')

// Removed loan-related state variables as they are not used in API version

// Filter and chart options
const transactionTypes = ['Wire', 'Cash', 'Crypto', 'MSB', 'ATM', 'ACH', 'Check']
const flagTypes = ['UTR', 'High Cash', 'MSB', 'Crypto', 'HRJ', 'Sanctions', 'EDD']

// Risk Analytics Data
const riskTransactionTypes = [
  'Cannabis-Related Trx',
  'Cashier Check Purchase',
  'Casino Trx',
  'Crypto Trx',
  'High Cash Deposit',
  'High Cash Withdrawals',
  'HRJ Trx ATM withdrawal',
  'HRJ Trx Debit Purchase',
  'HRJ Trx Wire In',
  'HRJ Trx Wire Out',
  'Luxury Goods Trx',
  'Third Party Check Deposit'
]

const selectedRiskTxnTypes = ref([...riskTransactionTypes]) // All selected by default

// Task Creation State
const newTask = ref({
  type: 'review',
  priority: 'medium',
  title: '',
  description: '',
  dueDate: '',
  accountId: ''
})

const transactionFilters = ref({
  startDate: '',
  endDate: '',
  type: ''
})

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api'

// Data from API
const clientData = ref(null)
const relationshipManager = ref(null)
const breadcrumbData = ref(null)
const accountsData = ref([])
const transactionsData = ref([])
const isLoading = ref(true)
const error = ref(null)

// Fetch data from API
const fetchClientData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Fetch client data
    const clientResponse = await axios.get(`${API_BASE_URL}/clients/${props.clientId}`)
    clientData.value = clientResponse.data

    // Fetch relationship manager data
    const rmResponse = await axios.get(`${API_BASE_URL}/relationship-managers/${props.rmId}`)
    relationshipManager.value = rmResponse.data

    // Fetch breadcrumb data
    const breadcrumbResponse = await axios.get(
      `${API_BASE_URL}/breadcrumb/${props.metroId}/${props.marketId}/${props.regionId}/${props.rmId}/${props.relationshipId || 'none'}`
    )
    breadcrumbData.value = breadcrumbResponse.data

    // Fetch accounts
    const accountsResponse = await axios.get(`${API_BASE_URL}/clients/${props.clientId}/accounts`)
    accountsData.value = accountsResponse.data

    // Fetch transactions
    const transactionsResponse = await axios.get(`${API_BASE_URL}/clients/${props.clientId}/transactions`)
    transactionsData.value = transactionsResponse.data.transactions
    allTransactions.value = transactionsResponse.data.transactions

  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Computed property for breadcrumb
const breadcrumb = computed(() => {
  if (!breadcrumbData.value) return 'Loading...'
  const bd = breadcrumbData.value
  if (props.relationshipId) {
    return `${bd.metro} > ${bd.market} > ${bd.region} > ${bd.rm} > ${bd.relationship} > Client Details`
  }
  return `${bd.metro} > ${bd.market} > ${bd.region} > ${bd.rm} > Client Details`
})



// Computed values
const totalAccounts = computed(() => {
  if (!clientData.value) return 0
  // Generate mock account count based on portfolio size
  const portfolioValue = clientData.value.portfolioValue || 0
  if (portfolioValue >= 100000000) return Math.floor(Math.random() * 8) + 6 // 6-13 accounts
  if (portfolioValue >= 50000000) return Math.floor(Math.random() * 6) + 4   // 4-9 accounts
  if (portfolioValue >= 10000000) return Math.floor(Math.random() * 4) + 3   // 3-6 accounts
  return Math.floor(Math.random() * 3) + 2                                   // 2-4 accounts
})

const totalBalance = computed(() => {
  if (!clientData.value) return 0
  return clientData.value.portfolioValue || 0
})

const clientTier = computed(() => {
  const balance = totalBalance.value
  if (balance >= 5000000) return 'Commercial'
  return 'Small Business'
})

const riskScore = computed(() => {
  if (!clientData.value) return 0
  if (clientData.value.riskScore) return clientData.value.riskScore

  // Generate risk score based on risk flags and portfolio size
  const flagCount = clientData.value.riskFlags?.length || 0
  const portfolioValue = clientData.value.portfolioValue || 0

  let score = 2.0 // Base score
  score += flagCount * 1.5 // Add 1.5 per risk flag
  if (portfolioValue > 100000000) score += 0.5 // Large portfolios get slight bump

  return Math.min(10, Math.max(1, parseFloat(score.toFixed(1))))
})

// Account Details (Generated based on client portfolio)
const accountDetails = computed(() => {
  // Use accounts from API
  return accountsData.value || []
})

// Loan Delinquency Alerts
const loanDelinquencyAlerts = computed(() => {
  if (!clientData.value || clientData.value.name !== 'Johnson Manufacturing LLC') return []

  return [
    {
      id: 'del_001',
      loanType: 'Commercial Term Loan',
      accountNumber: 'TL-2024-0892',
      daysPastDue: 62,
      amountDue: 125000,
      totalOutstanding: 2156000,
      originalAmount: 2800000,
      lastPaymentDate: 'Oct 14, 2024',
      severity: 'Critical'
    }
  ]
})

// Overdraft Alerts
const overdraftAlerts = computed(() => {
  if (!clientData.value) return []

  // Generate overdraft alerts for business checking accounts
  const alerts = []

  // Check if this client should have overdraft issues
  if (clientData.value.name === 'Johnson Manufacturing LLC' || Math.random() > 0.7) {
    alerts.push({
      id: 'od_001',
      accountType: 'Business Checking',
      accountNumber: 'CHK-847291',
      currentBalance: -15250,
      overdraftLimit: 50000,
      feeAccrued: 275,
      severity: 'High',
      daysOverdrawn: 3
    })
  }

  return alerts
})

// Loan Applications Tracker

// Other Alerts (placeholder for additional alert types)
const otherAlerts = computed(() => {
  // Placeholder for other types of alerts (compliance, risk flags, etc.)
  return []
})

// Critical Alerts (General) - for backward compatibility
const criticalAlerts = computed(() => {
  const alerts = []

  // Add delinquency alerts
  alerts.push(...loanDelinquencyAlerts.value)

  // Add overdraft alerts  
  alerts.push(...overdraftAlerts.value)

  return alerts
})

// Alert Indicator Computed Properties
const totalAlertCount = computed(() => {
  return loanDelinquencyAlerts.value.length + overdraftAlerts.value.length + otherAlerts.value.length
})

const hasCriticalAlerts = computed(() => {
  return loanDelinquencyAlerts.value.some(alert => alert.severity === 'Critical') ||
    overdraftAlerts.value.some(alert => alert.severity === 'High')
})

const alertIndicatorClass = computed(() => {
  if (hasCriticalAlerts.value) {
    return 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
  } else if (overdraftAlerts.value.length > 0) {
    return 'bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-300'
  } else {
    return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
  }
})

const alertIndicatorIcon = computed(() => {
  if (hasCriticalAlerts.value) return '🚨'
  if (overdraftAlerts.value.length > 0) return '⚠️'
  return '⚠️'
})

// Account Summary Computed Properties
const activeAccountsCount = computed(() => {
  return accountDetails.value.filter(acc => acc.balance > 1000).length
})

const totalDeposits = computed(() => {
  if (!accountDetails.value || accountDetails.value.length === 0) return 0
  return accountDetails.value.reduce((sum, acc) => sum + (acc.balance || 0), 0)
})

const totalMonthlyVolume = computed(() => {
  return accountDetails.value.reduce((sum, acc) => sum + acc.monthlyVolume, 0)
})

const highRiskAccountsCount = computed(() => {
  return accountDetails.value.filter(acc => acc.riskLevel === 'High').length
})

const productRecommendationVolume = computed(() => {
  if (!clientData.value) return 0

  // Calculate product recommendation volume based on client profile and portfolio
  const portfolioValue = clientData.value.portfolioValue || 0
  const penetration = clientData.value.productPenetration || 0

  // Generate opportunity volume based on missing products and client size
  const opportunityFactor = (100 - penetration) / 100 // Higher if lower penetration
  const baseOpportunity = portfolioValue * 0.15 // 15% of portfolio as potential

  return Math.floor(baseOpportunity * opportunityFactor)
})

const totalLoanAmount = computed(() => {
  if (!clientData.value) return 0

  // Calculate total loan amount based on portfolio value and client tier
  const portfolioValue = clientData.value.portfolioValue || 0
  const tier = clientTier.value

  // Commercial clients typically have higher loan ratios
  const loanRatio = tier === 'Commercial' ? 0.35 : 0.25

  return Math.floor(portfolioValue * loanRatio)
})

const loanUtilityRate = computed(() => {
  if (!clientData.value) return 0

  // Calculate utility rate as percentage of loan usage
  // Based on client activity and risk profile
  const baseRate = Math.floor(Math.random() * 40) + 45 // 45-85%
  return baseRate
})

const loanUtilityPercentile = computed(() => {
  return Math.floor(Math.random() * 30) + 70 // 70-99th percentile
})

const highRiskTrxVolume = computed(() => {
  if (!clientData.value) return 0

  // Calculate high risk transaction volume from monthly volumes
  const totalVolume = totalMonthlyVolume.value
  const riskPercentage = 0.12 // 12% of transactions flagged as high risk

  return Math.floor(totalVolume * riskPercentage)
})

// Loan Applications Tab Computed Properties


// New KPI computed properties
const depositsPercentile = computed(() => {
  // Generate percentile rank for deposits (higher is better)
  return Math.floor(Math.random() * 30) + 70 // 70-99th percentile
})

const loansPercentile = computed(() => {
  // Generate percentile rank for loans (higher is better)
  return Math.floor(Math.random() * 25) + 75 // 75-99th percentile
})

const numberOfOpportunities = computed(() => {
  // Calculate number of opportunities based on product penetration
  const penetration = clientData.value?.productPenetration || 0
  const maxOpportunities = 8
  return Math.floor((100 - penetration) / 100 * maxOpportunities) + 2
})

const inflowsPercentile = computed(() => {
  // Generate percentile rank for inflows
  return Math.floor(Math.random() * 20) + 80 // 80-99th percentile
})

const outflowsPercentile = computed(() => {
  // Generate percentile rank for outflows
  return Math.floor(Math.random() * 25) + 65 // 65-89th percentile
})

const revenuePercentile = computed(() => {
  // Generate percentile rank for revenue (higher is better)
  return Math.floor(Math.random() * 35) + 65 // 65-99th percentile
})

const totalRiskFlags = computed(() => {
  // Calculate total risk flags based on various factors
  if (!clientData.value) return 0

  const baseRiskFlags = Math.floor(Math.random() * 3) + 1 // 1-3 base flags
  const industryRisk = clientData.value.industry?.toLowerCase().includes('high-risk') ? 2 : 0
  const volumeRisk = totalMonthlyVolume.value > 5000000 ? 1 : 0 // High volume adds risk

  return baseRiskFlags + industryRisk + volumeRisk
})

const riskFlagsPercentile = computed(() => {
  // Generate percentile rank for risk flags (lower is better, so invert)
  const basePercentile = Math.floor(Math.random() * 40) + 10 // 10-49th percentile (lower is better for risk)
  return Math.min(95, basePercentile + (totalRiskFlags.value * 5)) // Risk flags increase percentile
})

// Account & Loan Portfolio Chart Data
const accountLoanPortfolioData = computed(() => {
  if (!accountDetails.value || accountDetails.value.length === 0) return null

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Group accounts by type and get their actual balances
  const accountsByType = {}
  accountDetails.value.forEach(account => {
    if (!accountsByType[account.type]) {
      accountsByType[account.type] = 0
    }
    accountsByType[account.type] += account.balance
  })

  // Generate historical data based on current balances with small variations
  const accountDatasets = []
  const colors = [
    { bg: 'rgba(34, 197, 94, 0.8)', border: '#22C55E' },
    { bg: 'rgba(16, 185, 129, 0.8)', border: '#10B981' },
    { bg: 'rgba(6, 182, 212, 0.8)', border: '#06B6D4' },
    { bg: 'rgba(59, 130, 246, 0.8)', border: '#3B82F6' },
    { bg: 'rgba(99, 102, 241, 0.8)', border: '#6366F1' }
  ]

  let colorIndex = 0
  Object.entries(accountsByType).forEach(([accountType, balance]) => {
    if (balance > 0 && !accountType.toLowerCase().includes('credit') && !accountType.toLowerCase().includes('loan')) {
      // For deposit accounts (positive values)
      const baseValue = balance / 1000 // Convert to thousands
      const monthlyData = months.map((month, index) => {
        if (index === months.length - 1) {
          // Last month (December) should match exact current balance
          return Math.floor(baseValue)
        }
        // Historical months with variation
        const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
        return Math.floor(baseValue * (1 + variation))
      })

      accountDatasets.push({
        label: accountType,
        data: monthlyData,
        backgroundColor: colors[colorIndex % colors.length].bg,
        borderColor: colors[colorIndex % colors.length].border,
        borderWidth: 1,
        stack: 'assets'
      })
      colorIndex++
    }
  })

  // Add loan data (negative values)
  const loanColors = [
    { bg: 'rgba(239, 68, 68, 0.8)', border: '#EF4444' },
    { bg: 'rgba(220, 38, 38, 0.8)', border: '#DC2626' },
    { bg: 'rgba(185, 28, 28, 0.8)', border: '#B91C1C' }
  ]

  // Generate loan utilization based on totalLoanAmount
  const loanAmount = totalLoanAmount.value / 1000 // Convert to thousands
  const loanDatasets = [
    {
      label: 'Commercial Lending',
      data: months.map((month, index) => {
        if (index === months.length - 1) {
          // Last month (December) should match exact proportion of current total loans
          return -(Math.floor(loanAmount * 0.4))
        }
        // Historical months with variation
        return -(Math.floor(loanAmount * 0.4 * (0.9 + Math.random() * 0.2)))
      }),
      backgroundColor: loanColors[0].bg,
      borderColor: loanColors[0].border,
      borderWidth: 1,
      stack: 'liabilities'
    },
    {
      label: 'Term Loans',
      data: months.map((month, index) => {
        if (index === months.length - 1) {
          // Last month (December) should match exact proportion of current total loans
          return -(Math.floor(loanAmount * 0.4))
        }
        // Historical months with variation
        return -(Math.floor(loanAmount * 0.4 * (0.9 + Math.random() * 0.2)))
      }),
      backgroundColor: loanColors[1].bg,
      borderColor: loanColors[1].border,
      borderWidth: 1,
      stack: 'liabilities'
    },
    {
      label: 'Equipment Financing',
      data: months.map((month, index) => {
        if (index === months.length - 1) {
          // Last month (December) should match exact proportion of current total loans
          return -(Math.floor(loanAmount * 0.2))
        }
        // Historical months with variation
        return -(Math.floor(loanAmount * 0.2 * (0.9 + Math.random() * 0.2)))
      }),
      backgroundColor: loanColors[2].bg,
      borderColor: loanColors[2].border,
      borderWidth: 1,
      stack: 'liabilities'
    }
  ]

  return {
    labels: months,
    datasets: [
      ...accountDatasets,
      ...loanDatasets
    ]
  }
})

const aiRecommendations = computed(() => {
  if (!clientData.value) return []

  const portfolioValue = clientData.value.portfolioValue || 0
  const penetration = clientData.value.productPenetration || 0
  const industry = clientData.value.industry || ''
  const relationshipYears = clientData.value.relationshipYears || 0
  const tier = clientTier.value

  // AI/ML-based product recommendations based on client profile
  const recommendations = []

  // Liquidity Management - High confidence for Commercial clients with high volume
  if (tier === 'Commercial' && portfolioValue > 2000000) {
    recommendations.push({
      product: 'Liquidity Management',
      reason: 'High transaction volume suggests need for cash management solutions',
      confidence: 87,
      potentialRevenue: Math.floor(portfolioValue * 0.008), // 0.8% of portfolio
      priority: 'High',
      aiFactors: ['Portfolio size', 'Commercial tier', 'Transaction patterns']
    })
  }

  // Credit Line - Based on industry and relationship length
  if (relationshipYears >= 2 && !industry.includes('Non-Profit')) {
    const creditConfidence = tier === 'Commercial' ? 92 : 78
    recommendations.push({
      product: 'Commercial Lending',
      reason: `${relationshipYears}+ year relationship with growing transaction volume`,
      confidence: creditConfidence,
      potentialRevenue: Math.floor(portfolioValue * 0.025), // 2.5% of portfolio
      priority: 'Medium',
      aiFactors: ['Relationship tenure', 'Payment history', 'Industry risk']
    })
  }

  // Investment Services - Low penetration but high portfolio
  if (penetration < 40 && portfolioValue > 1000000) {
    recommendations.push({
      product: 'Investments',
      reason: 'Low product penetration with high asset base indicates growth potential',
      confidence: 73,
      potentialRevenue: Math.floor(portfolioValue * 0.015), // 1.5% of portfolio
      priority: 'Medium',
      aiFactors: ['Portfolio concentration', 'Product gaps', 'Wealth management needs']
    })
  }

  // Digital Banking - Based on transaction patterns and business type
  if (industry.includes('Technology') || industry.includes('Retail')) {
    recommendations.push({
      product: 'Digital Banking Platform',
      reason: 'Industry profile suggests high digital adoption likelihood',
      confidence: 84,
      potentialRevenue: Math.floor(portfolioValue * 0.005), // 0.5% of portfolio
      priority: 'Low',
      aiFactors: ['Industry digitization', 'Transaction channels', 'Age demographics']
    })
  }



  // Sort by confidence and return top 3
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 3)
})

// Risk Analytics Computed Properties
const totalRiskTransactionAmount = computed(() => {
  // Generate total risk transaction amount based on client profile
  const portfolioValue = clientData.value?.portfolioValue || 0
  return Math.floor(portfolioValue * (0.15 + Math.random() * 0.25)) // 15-40% of portfolio
})

const totalRiskTransactionCount = computed(() => {
  // Generate total risk transaction count
  return Math.floor(Math.random() * 150) + 50 // 50-200 transactions
})

const totalUTRFiled = computed(() => {
  // Generate UTR count
  return Math.floor(Math.random() * 8) + 4 // 4-12 UTRs
})

const averageRiskTransactionAmount = computed(() => {
  return Math.floor(totalRiskTransactionAmount.value / totalRiskTransactionCount.value)
})

const riskAmountPercentile = computed(() => {
  return Math.floor(Math.random() * 15) + 85 // 85-99th percentile
})

const riskCountPercentile = computed(() => {
  return Math.floor(Math.random() * 20) + 75 // 75-94th percentile
})

const utrPercentile = computed(() => {
  return Math.floor(Math.random() * 10) + 90 // 90-99th percentile
})

const avgRiskPercentile = computed(() => {
  return Math.floor(Math.random() * 25) + 70 // 70-94th percentile
})

// Risk Flag Distribution Summary

const highRiskFlags = computed(() => {
  return Math.floor(Math.random() * 8) + 6 // 6-13 high risk flags
})

const mediumRiskFlags = computed(() => {
  return Math.floor(Math.random() * 6) + 4 // 4-9 medium risk flags
})

const reportedFlags = computed(() => {
  return Math.floor(Math.random() * 4) + 3 // 3-6 reported flags
})

const selectedTypesTotalAmount = computed(() => {
  // Calculate total amount for selected transaction types
  return Math.floor(totalRiskTransactionAmount.value * (selectedRiskTxnTypes.value.length / riskTransactionTypes.length))
})

const filteredRiskTransactionData = computed(() => {
  const months = ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024']

  const datasets = selectedRiskTxnTypes.value.map((txnType, index) => {
    const colors = [
      '#2D5A5A', '#7FB3B3', '#F5F5F5', '#F4C2C2', '#D4A574',
      '#8FBC8F', '#5A7A5A', '#6B8E6B', '#A8C8A8', '#C8E6C8',
      '#E8F4E8', '#F0F8F0'
    ]

    // Generate monthly data for each transaction type
    const baseAmount = Math.floor(totalRiskTransactionAmount.value / riskTransactionTypes.length)
    const monthlyData = months.map(() => {
      const variation = 0.7 + Math.random() * 0.6 // 70-130% variation
      return Math.floor(baseAmount * variation)
    })

    return {
      label: txnType,
      data: monthlyData,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length],
      borderWidth: 1
    }
  })

  return {
    labels: months,
    datasets: datasets
  }
})

const riskTransactionChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 15,
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return formatCurrency(value)
        },
        font: {
          size: 10
        }
      }
    }
  }
}))

const utrEvents = computed(() => {
  // Generate UTR events with positions along timeline
  const events = []
  const totalEvents = totalUTRFiled.value

  const officers = ['Sarah Johnson', 'Mike Rodriguez', 'Jennifer Chen', 'David Kim', 'Lisa Wang', 'Robert Taylor']
  const descriptions = [
    'Structured transaction pattern detected',
    'Multiple cash deposits under threshold',
    'Customer avoided CTR requirements',
    'Suspicious deposit timing patterns',
    'Client showed knowledge of reporting thresholds',
    'Evasive behavior regarding fund sources'
  ]
  const notes = [
    'Client made structured deposits of $9,900 each over consecutive days, inquired about CTR reporting thresholds',
    'Customer asked detailed questions about CTR threshold amounts, then backed off from transaction',
    'Multiple cash deposits avoiding $10K CTR threshold. Client became evasive when questioned about source',
    'Customer inquired about structuring laws, then made series of deposits just under threshold',
    'Client attempted large cashier check, reduced amount when informed of CTR requirements',
    'Pattern of deposits with unusual knowledge of banking regulations for stated business type'
  ]

  for (let i = 0; i < totalEvents; i++) {
    const position = Math.random() * 90 + 5 // 5-95% along timeline
    const eventDate = new Date(2023, 6 + Math.floor(position / 12.5), Math.floor(Math.random() * 28) + 1)

    events.push({
      id: `utr_${i + 1}`,
      date: eventDate.toLocaleDateString(),
      position: position,
      description: descriptions[i % descriptions.length],
      amount: Math.floor(Math.random() * 50000) + 10000,
      officer: officers[i % officers.length],
      notes: notes[i % notes.length]
    })
  }

  return events.sort((a, b) => a.position - b.position)
})

// Risk Analytics Computed Properties
const riskTransactionTimeSeriesData = computed(() => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return {
    labels: months,
    datasets: [
      {
        label: 'Wire Transfers',
        data: [12, 18, 25, 22, 28, 31],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1
      },
      {
        label: 'Cash Transactions',
        data: [8, 15, 18, 16, 22, 25],
        backgroundColor: '#F59E0B',
        borderColor: '#D97706',
        borderWidth: 1
      },
      {
        label: 'Crypto Activities',
        data: [3, 7, 12, 8, 15, 18],
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1
      },
      {
        label: 'MSB Related',
        data: [5, 8, 14, 11, 16, 20],
        backgroundColor: '#EC4899',
        borderColor: '#DB2777',
        borderWidth: 1
      }
    ]
  }
})

const riskFlagTimeSeriesData = computed(() => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return {
    labels: months,
    datasets: [
      {
        label: 'UTR Flags',
        data: [2, 3, 5, 4, 6, 7],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3
      },
      {
        label: 'High Cash Flags',
        data: [1, 2, 4, 3, 5, 6],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3
      },
      {
        label: 'MSB Flags',
        data: [0, 1, 2, 1, 3, 4],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3
      },
      {
        label: 'Crypto Flags',
        data: [1, 1, 3, 2, 4, 5],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.3
      }
    ]
  }
})

const riskScoreTimeSeriesData = computed(() => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  return {
    labels: months,
    datasets: [
      {
        label: 'Risk Score',
        data: [45, 52, 67, 58, 71, 74],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }
})

const complianceActionsData = computed(() => {
  return {
    labels: ['SARs Filed', 'UTRs Filed', 'EDD Reviews', 'Sanctions Screening'],
    datasets: [{
      data: [3, 7, 12, 8],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#6B7280'],
      borderWidth: 0
    }]
  }
})

const totalHighRiskTransactions = computed(() => 132)
const riskTrend = computed(() => 15.3)
const activeInvestigations = computed(() => 8)
const currentRiskScore = computed(() => 74)
const riskScoreChange = computed(() => 3)

const complianceStats = computed(() => ({
  sars: 3,
  utrs: 7,
  edd: 12,
  sanctions: 8
}))

const filteredRiskEvents = computed(() => {
  const events = [
    {
      id: 1,
      title: 'Large Cash Deposit Flagged',
      description: '$25,000 cash deposit exceeds threshold',
      date: '2024-03-01',
      type: 'cash',
      severity: 'High'
    },
    {
      id: 2,
      title: 'UTR Filed - Structured Transactions',
      description: 'Pattern of deposits under $10,000',
      date: '2024-02-28',
      type: 'utr',
      severity: 'Medium'
    },
    {
      id: 3,
      title: 'Crypto Exchange Wire Transfer',
      description: 'Wire to Coinbase Pro for $45,000',
      date: '2024-02-25',
      type: 'crypto',
      severity: 'High'
    },
    {
      id: 4,
      title: 'MSB Transaction Review',
      description: 'Transaction with Western Union flagged',
      date: '2024-02-22',
      type: 'msb',
      severity: 'Medium'
    },
    {
      id: 5,
      title: 'EDD Review Completed',
      description: 'Enhanced due diligence review finalized',
      date: '2024-02-20',
      type: 'compliance',
      severity: 'Low'
    }
  ]

  return showAllEvents.value ? events : events.slice(0, 3)
})

// Timeline Data
const timelineLabels = computed(() => {
  switch (timelineRange.value) {
    case '1M': return ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    case '3M': return ['Jan', 'Feb', 'Mar']
    case '6M': return ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
    case '1Y': return ['Q1', 'Q2', 'Q3', 'Q4']
    default: return ['Jan', 'Feb', 'Mar']
  }
})

const severeEvents = computed(() => [
  {
    id: 'sev-1',
    label: 'MSB_flag',
    description: 'MSB classification flagged',
    startTime: 20,
    duration: 15,
    type: 'msb'
  },
  {
    id: 'sev-2',
    label: 'crypto_wire',
    description: 'Large crypto wire transfer',
    startTime: 65,
    duration: 10,
    type: 'crypto'
  }
])

const elevatedEvents = computed(() => [
  {
    id: 'elev-1',
    label: 'cash_deposit',
    description: 'High cash deposit flagged',
    startTime: 10,
    duration: 12,
    type: 'cash'
  },
  {
    id: 'elev-2',
    label: 'utr_filed',
    description: 'UTR filed for structured transactions',
    startTime: 30,
    duration: 8,
    type: 'utr'
  },
  {
    id: 'elev-3',
    label: 'sanctions_hit',
    description: 'Sanctions screening hit',
    startTime: 75,
    duration: 6,
    type: 'sanctions'
  }
])

const lowEvents = computed(() => [
  {
    id: 'low-1',
    label: 'routine_review',
    description: 'Routine compliance review',
    startTime: 45,
    duration: 20,
    type: 'compliance'
  },
  {
    id: 'low-2',
    label: 'kyc_update',
    description: 'KYC information updated',
    startTime: 85,
    duration: 8,
    type: 'kyc'
  }
])

// Category-based timeline events
const utrCategoryEvents = computed(() => [
  {
    id: 'utr-1',
    description: 'UTR filed for structured transactions',
    startTime: 30,
    risk: 'medium',
    type: 'utr'
  },
  {
    id: 'utr-2',
    description: 'UTR filed for suspicious activity',
    startTime: 65,
    risk: 'high',
    type: 'utr'
  },
  {
    id: 'utr-3',
    description: 'UTR filed for cash activity',
    startTime: 85,
    risk: 'medium',
    type: 'utr'
  }
])

const msbCategoryEvents = computed(() => [
  {
    id: 'msb-1',
    description: 'MSB classification flagged',
    startTime: 20,
    risk: 'high',
    type: 'msb'
  },
  {
    id: 'msb-2',
    description: 'MSB transaction review',
    startTime: 55,
    risk: 'medium',
    type: 'msb'
  }
])

const cashCategoryEvents = computed(() => [
  {
    id: 'cash-1',
    description: 'High cash deposit flagged',
    startTime: 10,
    risk: 'medium',
    type: 'cash'
  },
  {
    id: 'cash-2',
    description: 'Large cash withdrawal',
    startTime: 40,
    risk: 'high',
    type: 'cash'
  },
  {
    id: 'cash-3',
    description: 'Pattern of cash transactions',
    startTime: 70,
    risk: 'medium',
    type: 'cash'
  }
])

const cryptoCategoryEvents = computed(() => [
  {
    id: 'crypto-1',
    description: 'Large crypto wire transfer',
    startTime: 25,
    risk: 'high',
    type: 'crypto'
  },
  {
    id: 'crypto-2',
    description: 'Crypto exchange transaction',
    startTime: 60,
    risk: 'medium',
    type: 'crypto'
  }
])

const sanctionsCategoryEvents = computed(() => [
  {
    id: 'sanctions-1',
    description: 'Sanctions screening hit',
    startTime: 75,
    risk: 'high',
    type: 'sanctions'
  },
  {
    id: 'sanctions-2',
    description: 'False positive resolved',
    startTime: 90,
    risk: 'low',
    type: 'sanctions'
  }
])

const complianceCategoryEvents = computed(() => [
  {
    id: 'compliance-1',
    description: 'Routine compliance review',
    startTime: 45,
    risk: 'low',
    type: 'compliance'
  },
  {
    id: 'compliance-2',
    description: 'Enhanced due diligence',
    startTime: 80,
    risk: 'medium',
    type: 'compliance'
  }
])

// Risk Statistics
const utrStats = computed(() => ({
  total: 15,
  rank: 23,
  totalClients: 2847,
  percentile: 92,
  trend: '↑ 3 filed this month'
}))

const msbStats = computed(() => ({
  classifiedDate: 'Jan 15, 2024',
  status: 'Active',
  riskLevel: 'High'
}))

const cashStats = computed(() => ({
  flags: 28,
  recent: 8,
  breaches: 12,
  status: 'Active monitoring'
}))

const cryptoStats = computed(() => ({
  flags: 18,
  exchanges: 5,
  volume: 245000,
  trend: '↑ Increasing activity'
}))

const sanctionsStats = computed(() => ({
  hits: 3,
  falsePositives: 2,
  lastScreen: 'Mar 10, 2024',
  status: 'Clean - no matches'
}))

const overallRisk = computed(() => ({
  score: 87,
  level: 'HIGH',
  factors: ['MSB Classification', 'High Cash Activity', 'Crypto Transactions']
}))

// Computed properties for Performance Summary
const topPercentile = computed(() => {
  if (!clientData.value?.rankings) return 95
  const percentiles = Object.values(clientData.value.rankings).map(r => r.percentile)
  return Math.min(...percentiles)
})

const bestCategory = computed(() => {
  if (!clientData.value?.rankings) return 'Revenue Growth'
  const best = Object.entries(clientData.value.rankings).reduce(
    (best, [key, val]) => val.percentile > best.percentile ? { key, percentile: val.percentile } : best,
    { key: '', percentile: 0 }
  )
  return best.key.replace(/([A-Z])/g, ' $1').trim()
})



// Enhanced Transaction Volume Data (Stacked Bar Chart)
const transactionVolumeData = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Generate transaction data by type (amounts in thousands)
  const transactionTypes = {
    // Inflows (positive values)
    'Cash Deposits': months.map(() => Math.floor(Math.random() * 150) + 50),
    'Check Deposits': months.map(() => Math.floor(Math.random() * 250) + 100),
    'ACH In': months.map(() => Math.floor(Math.random() * 200) + 80),
    'Wire In': months.map(() => Math.floor(Math.random() * 300) + 150),

    // Outflows (negative values)
    'Cash Withdrawals': months.map(() => -(Math.floor(Math.random() * 100) + 30)),
    'Check Payments': months.map(() => -(Math.floor(Math.random() * 180) + 70)),
    'ACH Out': months.map(() => -(Math.floor(Math.random() * 220) + 120)),
    'Wire Out': months.map(() => -(Math.floor(Math.random() * 250) + 100))
  }

  return {
    labels: months,
    datasets: [
      // Inflow transactions
      {
        label: 'Cash Deposits',
        data: transactionTypes['Cash Deposits'],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22C55E',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'Check Deposits',
        data: transactionTypes['Check Deposits'],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'ACH In',
        data: transactionTypes['ACH In'],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: '#A855F7',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'Wire In',
        data: transactionTypes['Wire In'],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: '#0EA5E9',
        borderWidth: 1,
        stack: 'transactions'
      },
      // Outflow transactions (negative values)
      {
        label: 'Cash Withdrawals',
        data: transactionTypes['Cash Withdrawals'],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#EF4444',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'Check Payments',
        data: transactionTypes['Check Payments'],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: '#F59E0B',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'ACH Out',
        data: transactionTypes['ACH Out'],
        backgroundColor: 'rgba(236, 72, 153, 0.8)',
        borderColor: '#EC4899',
        borderWidth: 1,
        stack: 'transactions'
      },
      {
        label: 'Wire Out',
        data: transactionTypes['Wire Out'],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: '#9CA3AF',
        borderWidth: 1,
        stack: 'transactions'
      }
    ]
  }
})

const accountDistributionData = computed(() => {
  if (!clientData.value) return null

  // Generate mock account distribution based on portfolio value
  const portfolioValue = clientData.value.portfolioValue || 0
  const accountTypes = {
    'Checking': Math.floor(portfolioValue * 0.15),
    'Savings': Math.floor(portfolioValue * 0.25),
    'Money Market': Math.floor(portfolioValue * 0.20),
    'Certificate of Deposit': Math.floor(portfolioValue * 0.30),
    'Liquidity Management': Math.floor(portfolioValue * 0.10)
  }

  return {
    labels: Object.keys(accountTypes),
    datasets: [{
      data: Object.values(accountTypes),
      backgroundColor: [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#8B5CF6', // Purple
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
})

const accountSummary = computed(() => {
  if (!clientData.value) return []

  const portfolioValue = clientData.value.portfolioValue || 0
  const total = totalBalance.value

  // Generate mock account data
  const accountTypes = {
    'Checking': { balance: Math.floor(portfolioValue * 0.15), count: 2 },
    'Savings': { balance: Math.floor(portfolioValue * 0.25), count: 1 },
    'Money Market': { balance: Math.floor(portfolioValue * 0.20), count: 1 },
    'Certificate of Deposit': { balance: Math.floor(portfolioValue * 0.30), count: Math.ceil(totalAccounts.value * 0.4) },
    'Liquidity Management': { balance: Math.floor(portfolioValue * 0.10), count: 1 }
  }

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'
  ]

  return Object.entries(accountTypes).map(([type, data], index) => ({
    type,
    balance: data.balance,
    count: data.count,
    percentage: total > 0 ? Math.round((data.balance / total) * 100) : 0,
    color: colors[index % colors.length]
  }))
})

const riskTimelineData = computed(() => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const riskFlags = Array.from({ length: 30 }, () => Math.floor(Math.random() * 5))

  return {
    labels: days,
    datasets: [{
      label: 'Risk Flags',
      data: riskFlags,
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// Risk Flag Distribution Data
const riskFlagSummary = computed(() => {
  if (!clientData.value || !clientData.value.riskFlags) {
    // Generate mock risk flag data matching RM view categories
    const mockFlags = [
      { category: 'Crypto Activity', severity: 'Critical', count: 2, color: 'bg-red-500', description: 'Cryptocurrency transactions or blockchain business' },
      { category: 'High Cash Transactions', severity: 'Critical', count: 4, color: 'bg-red-600', description: 'Cash transactions above threshold' },
      { category: 'Foreign ATM', severity: 'Critical', count: 3, color: 'bg-red-400', description: 'ATM withdrawals in high-risk countries' },
      { category: 'High-Risk Wires', severity: 'Review', count: 3, color: 'bg-orange-500', description: 'International wire transfers to high-risk countries' },
      { category: 'Luxury Spend', severity: 'Review', count: 2, color: 'bg-orange-400', description: 'Large purchases of luxury goods using business funds' },
      { category: 'UTR', severity: 'Review', count: 1, color: 'bg-orange-600', description: 'Unusual Transaction Reports filed by staff' }
    ]

    const total = mockFlags.reduce((sum, flag) => sum + flag.count, 0)
    return mockFlags.map(flag => ({
      ...flag,
      percentage: total > 0 ? Math.round((flag.count / total) * 100) : 0
    }))
  }

  // Process actual risk flags if available
  const flagCounts = {}
  const flagSeverities = {}

  clientData.value.riskFlags.forEach(flag => {
    const category = flag.type || flag.category || 'Other'
    const severity = flag.severity || 'Watch'

    flagCounts[category] = (flagCounts[category] || 0) + (flag.count || 1)
    flagSeverities[category] = severity
  })

  const total = Object.values(flagCounts).reduce((sum, count) => sum + count, 0)
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500']

  return Object.entries(flagCounts).map(([category, count], index) => ({
    category,
    severity: flagSeverities[category],
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    color: colors[index % colors.length]
  }))
})

// Filtered risk flag summary (excludes Watch level)
const riskFlagSummaryFiltered = computed(() => {
  const filtered = riskFlagSummary.value.filter(flag => flag.severity !== 'Watch')
  const total = filtered.reduce((sum, flag) => sum + flag.count, 0)

  return filtered.map(flag => ({
    ...flag,
    percentage: total > 0 ? Math.round((flag.count / total) * 100) : 0
  }))
})

// Risk Industries computed property
const riskIndustries = computed(() => {
  if (!clientData.value) return []

  const clientIndustry = clientData.value.industry?.toLowerCase() || ''

  const industries = [
    { name: 'Gambling industry', confirmed: clientIndustry.includes('gambling') || clientIndustry.includes('casino') || clientIndustry.includes('gaming') },
    { name: 'Crypto industry', confirmed: clientIndustry.includes('crypto') || clientIndustry.includes('bitcoin') || clientIndustry.includes('blockchain') || clientIndustry.includes('digital asset') },
    { name: 'High cash Business', confirmed: clientIndustry.includes('cash') || clientIndustry.includes('retail') || clientIndustry.includes('restaurant') || clientIndustry.includes('convenience') },
    { name: 'Real Estate', confirmed: clientIndustry.includes('real estate') || clientIndustry.includes('property') || clientIndustry.includes('development') },
    { name: 'Cannabis Industry', confirmed: clientIndustry.includes('cannabis') || clientIndustry.includes('marijuana') || clientIndustry.includes('hemp') },
    { name: 'Money Service Business (MSB)', confirmed: clientIndustry.includes('money service') || clientIndustry.includes('msb') || clientIndustry.includes('money transfer') || clientIndustry.includes('currency exchange') },
    { name: 'Import/Export Business', confirmed: clientIndustry.includes('import') || clientIndustry.includes('export') || clientIndustry.includes('trade') || clientIndustry.includes('international commerce') }
  ]

  return industries
})

const riskFlagDistributionData = computed(() => {
  if (!riskFlagSummary.value || riskFlagSummary.value.length === 0) return null

  return {
    labels: riskFlagSummary.value.map(flag => flag.category),
    datasets: [{
      data: riskFlagSummary.value.map(flag => flag.count),
      backgroundColor: riskFlagSummary.value.map(flag => {
        switch (flag.severity) {
          case 'Critical': return '#EF4444'
          case 'Review': return '#F59E0B'
          case 'Watch': return '#10B981'
          default: return '#6B7280'
        }
      }),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
})

// Transaction Computed Properties
const filteredTransactions = computed(() => {
  let filtered = allTransactions.value

  if (transactionFilters.value.startDate) {
    const startDate = new Date(transactionFilters.value.startDate)
    filtered = filtered.filter(t => new Date(t.date) >= startDate)
  }

  if (transactionFilters.value.endDate) {
    const endDate = new Date(transactionFilters.value.endDate)
    endDate.setHours(23, 59, 59, 999) // Include the entire end date
    filtered = filtered.filter(t => new Date(t.date) <= endDate)
  }

  if (transactionFilters.value.type) {
    filtered = filtered.filter(t => t.type.toLowerCase().includes(transactionFilters.value.type.toLowerCase()))
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / pageSize)
})

const transactionSummary = computed(() => {
  const transactions = filteredTransactions.value

  const totalInflows = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutflows = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const inflowCount = transactions.filter(t => t.amount > 0).length
  const outflowCount = transactions.filter(t => t.amount < 0).length
  const totalCount = transactions.length

  return {
    totalInflows,
    totalOutflows,
    netAmount: totalInflows - totalOutflows,
    averageAmount: totalCount > 0 ? (totalInflows + totalOutflows) / totalCount : 0,
    inflowCount,
    outflowCount,
    totalCount
  }
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getOrdinalSuffix = (num) => {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) {
    return 'st'
  }
  if (j === 2 && k !== 12) {
    return 'nd'
  }
  if (j === 3 && k !== 13) {
    return 'rd'
  }
  return 'th'
}

const getTierBadgeClass = (tier) => {
  switch (tier?.toLowerCase()) {
    case 'commercial': return 'bg-blue-100 text-blue-800'
    case 'small business': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRiskScoreColor = (score) => {
  if (score >= 8) return 'text-red-600'
  if (score >= 6) return 'text-yellow-600'
  return 'text-green-600'
}

const getRiskFlagColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-500'
    case 'Review': return 'bg-yellow-500'
    case 'Watch': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getRiskFlagBorderClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'border-red-200 bg-red-50'
    case 'Review': return 'border-yellow-200 bg-yellow-50'
    case 'Watch': return 'border-green-200 bg-green-50'
    default: return 'border-gray-200 bg-gray-50'
  }
}

const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800'
    case 'Review': return 'bg-yellow-100 text-yellow-800'
    case 'Watch': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// New risk flag styling methods for enhanced data structure
const getRiskFlagBgClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-50'
    case 'Review': return 'bg-orange-50'
    case 'Watch': return 'bg-yellow-50'
    default: return 'bg-gray-50'
  }
}

const getRiskFlagDotClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-500'
    case 'Review': return 'bg-orange-500'
    case 'Watch': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getRiskFlagTextClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'text-red-800'
    case 'Review': return 'text-orange-800'
    case 'Watch': return 'text-yellow-800'
    default: return 'text-gray-800'
  }
}

const getRiskFlagBadgeClass = (severity) => {
  switch (severity) {
    case 'Critical': return 'text-red-600'
    case 'Review': return 'text-orange-600'
    case 'Watch': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

const getActionPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'bg-red-500'
    case 'High': return 'bg-orange-500'
    case 'Medium': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getRiskScoreBarColor = (score) => {
  if (score >= 8) return 'bg-red-500'
  if (score >= 6) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Transaction Methods
const generateMockTransactions = () => {
  const transactions = []
  const types = ['deposit', 'withdrawal', 'transfer', 'wire', 'ach', 'check']
  const descriptions = {
    deposit: ['Cash Deposit', 'Check Deposit', 'Direct Deposit', 'Mobile Deposit'],
    withdrawal: ['ATM Withdrawal', 'Cash Withdrawal', 'Teller Withdrawal'],
    transfer: ['Internal Transfer', 'Wire Transfer', 'Online Transfer'],
    wire: ['Incoming Wire', 'Outgoing Wire', 'International Wire'],
    ach: ['ACH Credit', 'ACH Debit', 'Payroll ACH', 'Vendor Payment'],
    check: ['Check Payment', 'Cashier Check', 'Certified Check']
  }
  const accounts = ['Checking - ****1234', 'Savings - ****5678', 'Money Market - ****9012']
  const statuses = ['Completed', 'Pending', 'Processed', 'Cleared']
  const riskFlags = ['High Cash', 'Crypto Activity', 'Cross-Border', 'MSB Related', 'Geographic Risk', null, null, null] // Most transactions have no flags

  // Generate transactions for the last 90 days
  for (let i = 0; i < 300; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const isInflow = type === 'deposit' || type === 'ach' || (type === 'wire' && Math.random() > 0.3)
    const amount = isInflow
      ? Math.floor(Math.random() * 50000) + 1000 // $1K - $50K for inflows
      : -(Math.floor(Math.random() * 30000) + 500) // $500 - $30K for outflows

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      type: type.charAt(0).toUpperCase() + type.slice(1),
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      account: accounts[Math.floor(Math.random() * accounts.length)],
      amount: amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      riskFlag: riskFlags[Math.floor(Math.random() * riskFlags.length)]
    })
  }

  return transactions
}

const loadTransactions = () => {
  // Reset pagination when filtering
  currentPage.value = 1

  // In a real app, this would make an API call with the filters
  if (allTransactions.value.length === 0) {
    allTransactions.value = generateMockTransactions()
  }
}

const resetFilters = () => {
  transactionFilters.value.startDate = ''
  transactionFilters.value.endDate = ''
  transactionFilters.value.type = ''
  currentPage.value = 1

  // Set default date range to last 30 days
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  transactionFilters.value.endDate = endDate.toISOString().split('T')[0]
  transactionFilters.value.startDate = startDate.toISOString().split('T')[0]
}

const getTransactionTypeClass = (type) => {
  switch (type.toLowerCase()) {
    case 'deposit': return 'bg-green-100 text-green-800'
    case 'withdrawal': return 'bg-red-100 text-red-800'
    case 'transfer': return 'bg-blue-100 text-blue-800'
    case 'wire': return 'bg-purple-100 text-purple-800'
    case 'ach': return 'bg-indigo-100 text-indigo-800'
    case 'check': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'processed': return 'bg-blue-100 text-blue-800'
    case 'cleared': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRiskFlagClass = (riskFlag) => {
  switch (riskFlag) {
    case 'High Cash': return 'bg-red-100 text-red-800'
    case 'Crypto Activity': return 'bg-purple-100 text-purple-800'
    case 'Cross-Border': return 'bg-orange-100 text-orange-800'
    case 'MSB Related': return 'bg-orange-100 text-orange-800'
    case 'Geographic Risk': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Loan Application Methods

// Lifecycle
onMounted(async () => {
  console.log('ClientDetailViewAPI mounted for client:', props.clientId)

  // Fetch data from API
  await fetchClientData()

  console.log('Client data from API:', clientData.value)

  // Initialize default date range for transactions (last 30 days)
  resetFilters()

  // Load transactions data
  loadTransactions()

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      Object.keys(openMenus.value).forEach(key => {
        openMenus.value[key] = false
      })
      showBulkActions.value = false
    }
  })
})

// Action Helper Functions
const toggleAccountMenu = (accountId) => {
  // Close all other menus first
  Object.keys(openMenus.value).forEach(key => {
    if (key !== accountId) {
      openMenus.value[key] = false
    }
  })
  // Toggle the clicked menu
  openMenus.value[accountId] = !openMenus.value[accountId]
}

const quickAction = (action, account) => {
  openMenus.value[account.id] = false // Close menu

  switch (action) {
    case 'view-transactions':
      showTransactionModal.value = true
      loadTransactions()
      showNotification.value = true
      notificationMessage.value = `Viewing transactions for ${account.name}`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'create-task':
      newTask.value.accountId = account.id
      newTask.value.title = `Review ${account.name}`
      newTask.value.description = `Account review for ${account.type} ending in ****${account.number.slice(-4)}`
      showTaskModal.value = true
      break
    case 'flag-review':
      showNotification.value = true
      notificationMessage.value = `${account.name} flagged for review`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'generate-statement':
      showNotification.value = true
      notificationMessage.value = `Statement generated for ${account.name}`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'freeze-account':
      if (confirm(`Are you sure you want to freeze ${account.name}?`)) {
        showNotification.value = true
        notificationMessage.value = `${account.name} has been frozen`
        setTimeout(() => showNotification.value = false, 3000)
      }
      break
  }
}

const bulkAction = (action) => {
  showBulkActions.value = false

  switch (action) {
    case 'review-all':
      const highRiskCount = accountDetails.value.filter(acc => acc.riskLevel === 'High').length
      showNotification.value = true
      notificationMessage.value = `Reviewing ${highRiskCount} high-risk accounts`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'generate-statements':
      showNotification.value = true
      notificationMessage.value = `Generating statements for all ${accountDetails.value.length} accounts`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'schedule-review':
      newTask.value.type = 'meeting'
      newTask.value.title = `Relationship Review - ${clientData.value?.name}`
      newTask.value.description = 'Comprehensive relationship review including all accounts and risk assessment'
      showTaskModal.value = true
      break
    case 'compliance-check':
      showNotification.value = true
      notificationMessage.value = 'Running compliance check on all accounts'
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'freeze-all':
      if (confirm(`Are you sure you want to freeze ALL accounts for ${clientData.value?.name}? This is irreversible.`)) {
        showNotification.value = true
        notificationMessage.value = `All accounts for ${clientData.value?.name} have been frozen`
        setTimeout(() => showNotification.value = false, 3000)
      }
      break
  }
}

const clientAction = (action) => {
  switch (action) {
    case 'create-task':
      newTask.value.title = `Client Follow-up - ${clientData.value?.name}`
      newTask.value.description = 'General client relationship management task'
      showTaskModal.value = true
      break
    case 'schedule-meeting':
      newTask.value.type = 'meeting'
      newTask.value.title = `Meeting - ${clientData.value?.name}`
      newTask.value.description = 'Client meeting to discuss relationship and services'
      showTaskModal.value = true
      break
    case 'generate-report':
      showNotification.value = true
      notificationMessage.value = `Comprehensive report generated for ${clientData.value?.name}`
      setTimeout(() => showNotification.value = false, 3000)
      break
    case 'export-data':
      showNotification.value = true
      notificationMessage.value = `Data exported for ${clientData.value?.name}`
      setTimeout(() => showNotification.value = false, 3000)
      break
  }
}

const createTask = () => {
  // Simulate task creation
  showNotification.value = true
  notificationMessage.value = `Task "${newTask.value.title}" created successfully`

  // Reset form
  newTask.value = {
    type: 'review',
    priority: 'medium',
    title: '',
    description: '',
    dueDate: '',
    accountId: ''
  }

  showTaskModal.value = false
  setTimeout(() => showNotification.value = false, 3000)
}

// Alert and Loan Application Methods
const handleDelinquencyAlert = (alert) => {
  showNotification.value = true
  notificationMessage.value = `Opening review for ${alert.loanType} - ${alert.accountNumber}`
  setTimeout(() => showNotification.value = false, 3000)
  // In real implementation, would navigate to loan review page
}

const handleOverdraftAlert = (alert) => {
  showNotification.value = true
  notificationMessage.value = `Opening account review for ${alert.accountNumber}`
  setTimeout(() => showNotification.value = false, 3000)
  // In real implementation, would navigate to account detail page
}

const getApplicationStatusClass = (status) => {
  switch (status) {
    case 'Under Review': return 'text-orange-600'
    case 'Approved': return 'text-green-600'
    case 'Pending': return 'text-yellow-600'
    case 'Rejected': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getStepClass = (step, application) => {
  if (isStepCompleted(step, application)) {
    return 'bg-green-50 border border-green-200'
  } else if (isStepInProgress(step, application)) {
    return 'bg-blue-50 border border-blue-200'
  } else {
    return 'bg-gray-50 border border-gray-200'
  }
}

const getStepIconClass = (step, application) => {
  if (isStepCompleted(step, application)) {
    return 'bg-green-500'
  } else if (isStepInProgress(step, application)) {
    return 'bg-blue-500'
  } else {
    return 'bg-gray-300'
  }
}

const getStepStatusClass = (step, application) => {
  if (isStepCompleted(step, application)) {
    return 'text-green-600'
  } else if (isStepInProgress(step, application)) {
    return 'text-blue-600'
  } else {
    return 'text-gray-500'
  }
}

const isStepCompleted = (step, application) => {
  return step.id < application.currentStep
}

const isStepInProgress = (step, application) => {
  return step.id === application.currentStep
}

const getStepStatus = (step, application) => {
  if (isStepCompleted(step, application)) {
    return 'Completed'
  } else if (isStepInProgress(step, application)) {
    return 'In Progress'
  } else {
    return 'Pending'
  }
}

// Additional Alert Modal Methods
const scheduleCall = (alert) => {
  showNotification.value = true
  notificationMessage.value = `Scheduling call for ${alert.loanType} - ${alert.accountNumber}`
  setTimeout(() => showNotification.value = false, 3000)
}

const contactClient = (alert) => {
  showNotification.value = true
  notificationMessage.value = `Initiating client contact for ${alert.accountNumber}`
  setTimeout(() => showNotification.value = false, 3000)
}

const handleOtherAlert = (alert) => {
  showNotification.value = true
  notificationMessage.value = `Reviewing ${alert.type} alert`
  setTimeout(() => showNotification.value = false, 3000)
}

const markAllAsReviewed = () => {
  showNotification.value = true
  notificationMessage.value = `All ${totalAlertCount.value} alerts marked as reviewed`
  setTimeout(() => showNotification.value = false, 3000)

  // In real implementation, would update alert status in backend
  // For demo, close modal after marking as reviewed
  setTimeout(() => {
    showAlertModal.value = false
  }, 1500)
}

const exportAlertReport = () => {
  showNotification.value = true
  notificationMessage.value = `Exporting alert report for ${clientData.value?.name}`
  setTimeout(() => showNotification.value = false, 3000)
}

const generateAccountTransactions = () => {
  const transactions = []
  const types = ['Deposit', 'Withdrawal', 'Transfer', 'Wire', 'ACH', 'Check']
  const descriptions = {
    'Deposit': ['Cash Deposit', 'Check Deposit', 'Direct Deposit'],
    'Withdrawal': ['ATM Withdrawal', 'Cash Withdrawal'],
    'Transfer': ['Internal Transfer', 'Wire Transfer'],
    'Wire': ['Incoming Wire', 'Outgoing Wire'],
    'ACH': ['ACH Credit', 'ACH Debit'],
    'Check': ['Check Payment', 'Cashier Check']
  }

  for (let i = 0; i < 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const isInflow = type === 'Deposit' || (type === 'Wire' && Math.random() > 0.5)
    const amount = isInflow
      ? Math.floor(Math.random() * 10000) + 500
      : -(Math.floor(Math.random() * 5000) + 200)

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    transactions.push({
      id: `acc-txn-${i + 1}`,
      type,
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      amount,
      date: date.toISOString().split('T')[0],
      status: ['Completed', 'Pending', 'Processed'][Math.floor(Math.random() * 3)]
    })
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const generateAccountRiskFactors = () => {
  const riskTypes = [
    { type: 'High Cash Volume', severity: 'Medium', description: 'Frequent large cash transactions' },
    { type: 'Unusual Wire Activity', severity: 'High', description: 'Wires to high-risk countries' },
    { type: 'Velocity Alerts', severity: 'Low', description: 'Transaction frequency above normal' },
    { type: 'Geographic Risk', severity: 'Medium', description: 'Activity in high-risk locations' }
  ]

  // Return 1-3 random risk factors
  const count = Math.floor(Math.random() * 3) + 1
  return riskTypes.slice(0, count)
}

const getAccountCardClass = (type) => {
  switch (type) {
    case 'Business Checking': return 'from-blue-50 to-blue-100 border-blue-200'
    case 'Business Savings': return 'from-green-50 to-green-100 border-green-200'
    case 'Money Market': return 'from-purple-50 to-purple-100 border-purple-200'
    case 'Investment Account': return 'from-orange-50 to-orange-100 border-orange-200'
    case 'Credit Line': return 'from-red-50 to-red-100 border-red-200'
    default: return 'from-gray-50 to-gray-100 border-gray-200'
  }
}

const getAccountBalanceColor = (balance) => {
  if (balance >= 1000000) return 'text-green-600'
  if (balance >= 100000) return 'text-blue-600'
  if (balance >= 10000) return 'text-gray-900'
  return 'text-orange-600'
}

const getRiskLevelClass = (level) => {
  switch (level) {
    case 'High': return 'bg-red-100 text-red-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAccountTypeClass = (type) => {
  switch (type) {
    case 'Business Checking': return 'bg-blue-100 text-blue-800'
    case 'Business Savings': return 'bg-green-100 text-green-800'
    case 'Money Market': return 'bg-purple-100 text-purple-800'
    case 'Investment Account': return 'bg-orange-100 text-orange-800'
    case 'Credit Line': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getAccountActionClass = (type) => {
  switch (type) {
    case 'Business Checking': return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    case 'Business Savings': return 'bg-green-100 text-green-700 hover:bg-green-200'
    case 'Money Market': return 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    case 'Investment Account': return 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    case 'Credit Line': return 'bg-red-100 text-red-700 hover:bg-red-200'
    default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
}

const getTransactionIconClass = (type) => {
  switch (type.toLowerCase()) {
    case 'deposit': return 'bg-green-100 text-green-600'
    case 'withdrawal': return 'bg-red-100 text-red-600'
    case 'transfer': return 'bg-blue-100 text-blue-600'
    case 'wire': return 'bg-purple-100 text-purple-600'
    case 'ach': return 'bg-indigo-100 text-indigo-600'
    case 'check': return 'bg-orange-100 text-orange-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getRiskFactorClass = (severity) => {
  switch (severity) {
    case 'High': return 'border-red-200 bg-red-50'
    case 'Medium': return 'border-yellow-200 bg-yellow-50'
    case 'Low': return 'border-green-200 bg-green-50'
    default: return 'border-gray-200 bg-gray-50'
  }
}

const getRiskIndicatorClass = (severity) => {
  switch (severity) {
    case 'High': return 'bg-red-500'
    case 'Medium': return 'bg-yellow-500'
    case 'Low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getRiskSeverityClass = (severity) => {
  switch (severity) {
    case 'High': return 'bg-red-100 text-red-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const generateNineDigitId = (id, prefix) => {
  // Generate a hash-based 9-digit ID from the input
  let hash = 0
  const str = (id || '').toString()
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  // Convert to positive and ensure 9 digits
  const numericId = Math.abs(hash).toString().padStart(9, '0').slice(-9)
  return numericId
}

const drillDownToAccount = (account) => {
  // Implement drill-down functionality
  console.log('Drill down to account:', account)
}

const acceptRecommendation = (recommendation) => {
  // Simulate accepting an AI recommendation
  showNotification.value = true
  notificationMessage.value = `Recommendation accepted: ${recommendation.product} (${recommendation.confidence}% confidence)`

  // In a real app, this would:
  // 1. Create a task or opportunity
  // 2. Notify the relationship manager
  // 3. Update the client's opportunity pipeline
  // 4. Send to CRM system

  setTimeout(() => showNotification.value = false, 4000)
}

const openRiskFlagModal = (flag) => {
  selectedRiskFlag.value = flag
  showRiskFlagModal.value = true
}

const closeRiskFlagModal = () => {
  showRiskFlagModal.value = false
  selectedRiskFlag.value = null
}

// Generate mock data for risk flag details
// Chart Options
const stackedBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: { stacked: true }
  },
  plugins: {
    legend: { position: 'top' }
  }
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  }
}

const riskScoreOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { min: 0, max: 100 }
  },
  plugins: {
    legend: { position: 'top' }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
}

const modalChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}

// Risk Analytics Methods
const resetRiskFilters = () => {
  selectedTxnTypes.value = ['Wire', 'Cash', 'Crypto', 'MSB']
  selectedFlagTypes.value = ['UTR', 'High Cash', 'MSB', 'Crypto']
}

const exportRiskData = () => {
  // Implement risk data export
  console.log('Exporting risk analytics data...')
}

// Risk Analytics Helper Functions
const resetRiskTransactionFilters = () => {
  selectedRiskTxnTypes.value = [...riskTransactionTypes]
}

const viewUTRDetails = (utrEvent) => {
  console.log('Viewing UTR details:', utrEvent)
  // Could open a modal with UTR details
}

const getUTRTrend = () => {
  const trends = ['Increasing', 'Stable', 'Decreasing']
  return trends[Math.floor(Math.random() * trends.length)]
}

const drillDownRiskTxn = () => {
  // Open transaction details modal for high-risk transactions
  showTransactionModal.value = true
}

const drillDownRiskFlags = () => {
  // Open detailed risk flags view
  console.log('Drilling down into risk flags...')
}

const drillDownRiskScore = () => {
  // Open detailed risk score analysis
  console.log('Drilling down into risk score...')
}

const drillDownCompliance = () => {
  // Open detailed compliance view
  console.log('Drilling down into compliance actions...')
}

const openRiskEventModal = () => {
  // Open risk event timeline modal
  console.log('Opening risk event timeline...')
}

const viewEventDetails = (event) => {
  // View specific risk event details
  console.log('Viewing event details:', event)
}

const getRiskEventColor = (type) => {
  const colors = {
    cash: 'bg-yellow-500',
    utr: 'bg-orange-500',
    crypto: 'bg-purple-500',
    msb: 'bg-pink-500',
    compliance: 'bg-green-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getRiskEventBadge = (severity) => {
  const badges = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  }
  return badges[severity] || 'bg-gray-100 text-gray-800'
}

const generateModalTimeSeriesData = (category) => {
  const months = modalTimeframe.value === '3M' ? ['Jan', 'Feb', 'Mar'] :
    modalTimeframe.value === '6M' ? ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] :
      ['Q1', 'Q2', 'Q3', 'Q4']

  // Generate data based on category
  const dataMap = {
    'UTR': [2, 4, 7, 5, 6, 8],
    'High Cash Deposits': [3, 6, 8, 7, 9, 11],
    'MSB Transactions': [1, 3, 5, 4, 6, 7],
    'Crypto Activities': [2, 5, 8, 6, 9, 12],
    'HRJ Wire Transfers': [1, 2, 4, 3, 5, 6]
  }

  const data = dataMap[category] || [1, 2, 3, 2, 4, 5]

  return {
    labels: months.slice(0, modalTimeframe.value === '3M' ? 3 : months.length),
    datasets: [{
      label: category,
      data: data.slice(0, modalTimeframe.value === '3M' ? 3 : data.length),
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.3,
      fill: true
    }]
  }
}

const getModalTrend = (category) => {
  const trends = {
    'UTR': 'Increasing',
    'High Cash Deposits': 'Decreasing',
    'MSB Transactions': 'Stable',
    'Crypto Activities': 'Increasing',
    'HRJ Wire Transfers': 'Increasing'
  }
  return trends[category] || 'Stable'
}

const getModalPeak = (category) => {
  const peaks = {
    'UTR': 'Feb 2024',
    'High Cash Deposits': 'Jan 2024',
    'MSB Transactions': 'Mar 2024',
    'Crypto Activities': 'Mar 2024',
    'HRJ Wire Transfers': 'Feb 2024'
  }
  return peaks[category] || 'Mar 2024'
}

const exportModalData = () => {
  console.log('Exporting modal chart data...')
}

// Timeline Methods
const getEventPosition = (event) => {
  return {
    left: `${event.startTime}%`,
    width: `${event.duration}%`,
    top: '1px'
  }
}

const exportTimelineData = () => {
  console.log('Exporting timeline data...')
}

// New methods for category-based timeline
const getCircleEventPosition = (event) => {
  return {
    left: `${event.startTime}%`,
    top: '1px'
  }
}

const getEventColorClass = (risk) => {
  switch (risk) {
    case 'high':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

const generateRiskFlagData = (flagCategory) => {
  const baseDate = new Date()

  switch (flagCategory) {
    // UTR Filed - Volume and trend data
    case 'UTR Filed':
      return {
        volumeData: {
          totalCount: 12,
          currentMonth: 3,
          previousMonth: 2,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'UTR Filings',
            data: [1, 0, 2, 1, 3, 2, 2, 3],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        flagDetails: [
          { date: '2024-02-15', officer: 'Sarah Johnson', note: 'Client made structured deposits of $9,900 each over consecutive days, inquired about CTR reporting thresholds, and showed knowledge of $10K reporting requirements', status: 'Filed', referenceNo: 'UTR-2024-003', amount: '$29,700' },
          { date: '2024-02-08', officer: 'Mike Rodriguez', note: 'Customer asked detailed questions about CTR threshold amounts, then backed off from purchasing bank note when told about detailed inquiries for usage documentation', status: 'Filed', referenceNo: 'UTR-2024-002', amount: '$19,800' },
          { date: '2024-01-25', officer: 'Jennifer Chen', note: 'Client made multiple cash deposits of $9,950, $9,875, and $9,925 over 3 consecutive days, avoiding $10K CTR threshold. When questioned about source, client became evasive', status: 'Filed', referenceNo: 'UTR-2024-001', amount: '$28,500' },
          { date: '2024-01-18', officer: 'David Kim', note: 'Customer inquired about structuring laws and CTR exemptions, then made series of $9,800 deposits. Showed unusual knowledge of banking regulations for stated business type', status: 'Filed', referenceNo: 'UTR-2024-004', amount: '$39,200' },
          { date: '2024-01-10', officer: 'Lisa Wang', note: 'Client attempted to purchase $15K cashier check, when informed of CTR requirements, reduced amount to $9,500 and paid in cash. Returned next day for another $9,500 check', status: 'Filed', referenceNo: 'UTR-2024-005', amount: '$19,000' }
        ],
        summary: 'Client shows consistent pattern of structuring behavior with 12 UTR filings in past 8 months. Demonstrates knowledge of CTR thresholds and actively avoids reporting requirements. Recent increase in frequency requires enhanced monitoring.'
      }

    // High Risk Industry - Industry details with flags
    case 'High Risk Industry':
      return {
        industryDetails: {
          primaryIndustry: 'Money Services Business (MSB)',
          naicsCode: '522320',
          riskRating: 'High',
          ctrExempt: false,
          whiteFlag: {
            status: 'Active',
            reason: 'Licensed MSB with compliant AML program',
            lastReview: '2024-01-15',
            nextReview: '2024-07-15'
          },
          redFlag: {
            status: 'Active',
            reason: 'High-volume cash transactions with international remittances',
            triggers: ['Volume exceeds $500K monthly', 'Multiple high-risk jurisdictions', 'Frequent structuring patterns'],
            lastTriggered: '2024-02-10'
          }
        },
        flagDetails: [
          { category: 'Business Classification', detail: 'Check Cashing & Money Transfer Services', riskLevel: 'High', status: 'Red Flag' },
          { category: 'License Status', detail: 'Active MSB License CA-MSB-2024-001', riskLevel: 'Compliant', status: 'White Flag' },
          { category: 'AML Program', detail: 'BSA compliance program implemented', riskLevel: 'Medium', status: 'White Flag' },
          { category: 'Transaction Volume', detail: 'Monthly volume: $750K+ in remittances', riskLevel: 'High', status: 'Red Flag' },
          { category: 'Geographic Risk', detail: 'Services to 15+ high-risk jurisdictions', riskLevel: 'High', status: 'Red Flag' },
          { category: 'CTR Exemption', detail: 'Not eligible for CTR exemption', riskLevel: 'Standard', status: 'N/A' }
        ],
        summary: 'Licensed MSB with compliant programs but high transaction volumes and geographic risk exposure requiring enhanced monitoring.'
      }

    // High Cash Activities - Monthly volume with charts and transaction details
    case 'High Cash Activities Deposit':
      return {
        monthlyVolume: {
          totalAmount: 2450000,
          currentMonth: 385000,
          previousMonth: 342000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Cash Deposits ($)',
            data: [245000, 289000, 312000, 298000, 356000, 378000, 342000, 385000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 45000, description: 'Cash deposit - retail sales revenue', branch: 'Main St Branch', teller: 'Teller #3', time: '10:30 AM', cumulative: 45000 },
          { date: '2024-02-14', amount: 38500, description: 'Large cash deposit - business operations', branch: 'Downtown Branch', teller: 'Teller #7', time: '2:15 PM', cumulative: 83500 },
          { date: '2024-02-13', amount: 52000, description: 'Cash deposit exceeding daily threshold', branch: 'Main St Branch', teller: 'Teller #1', time: '11:45 AM', cumulative: 135500 },
          { date: '2024-02-12', amount: 29800, description: 'Weekend cash collection deposit', branch: 'North Branch', teller: 'Teller #5', time: '9:20 AM', cumulative: 165300 },
          { date: '2024-02-10', amount: 41200, description: 'Multi-location cash consolidation', branch: 'Main St Branch', teller: 'Teller #2', time: '3:30 PM', cumulative: 206500 }
        ],
        summary: 'High-volume cash deposit activity with $2.45M total over 8 months. Recent monthly increase of 12.6% requires enhanced monitoring.'
      }

    case 'High Cash Withdrawals':
      return {
        monthlyVolume: {
          totalAmount: 1850000,
          currentMonth: 285000,
          previousMonth: 245000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Cash Withdrawals ($)',
            data: [185000, 210000, 225000, 198000, 235000, 258000, 245000, 285000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 35000, description: 'Cash withdrawal for payroll', purpose: 'Employee wages', branch: 'Main St Branch', manager: 'Branch Manager', time: '9:00 AM' },
          { date: '2024-02-12', amount: 28500, description: 'Large cash withdrawal - vendor payments', purpose: 'Supplier payments', branch: 'Downtown Branch', manager: 'Asst. Manager', time: '1:30 PM' },
          { date: '2024-02-10', amount: 42000, description: 'Cash withdrawal exceeding normal patterns', purpose: 'Operational costs', branch: 'Main St Branch', manager: 'Branch Manager', time: '11:15 AM' },
          { date: '2024-02-08', amount: 31200, description: 'Weekly cash needs withdrawal', purpose: 'Business operations', branch: 'North Branch', manager: 'Branch Manager', time: '2:45 PM' },
          { date: '2024-02-05', amount: 25800, description: 'Cash for contractor payments', purpose: 'Service payments', branch: 'Main St Branch', manager: 'Asst. Manager', time: '10:20 AM' }
        ],
        summary: 'High-volume cash withdrawal activity with $1.85M total over 8 months. Recent monthly increase of 16.3% requires verification of business necessity.'
      }

    // High Risk Transactions - All with monthly volume and transaction details
    case 'Third Party Cheque Deposit':
      return {
        monthlyVolume: {
          totalAmount: 3250000,
          currentMonth: 485000,
          previousMonth: 425000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Third Party Cheque Deposits ($)',
            data: [325000, 385000, 410000, 395000, 445000, 465000, 425000, 485000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 85000, description: 'Third party business cheque', drawer: 'ABC Construction Ltd', payee: 'Client Corp', bank: 'Chase Bank', time: '10:15 AM' },
          { date: '2024-02-12', amount: 65000, description: 'Vendor payment cheque deposit', drawer: 'XYZ Suppliers Inc', payee: 'Client Corp', bank: 'Wells Fargo', time: '2:30 PM' },
          { date: '2024-02-10', amount: 95000, description: 'Large third party cheque', drawer: 'DEF Holdings LLC', payee: 'Client Corp', bank: 'Bank of America', time: '11:45 AM' },
          { date: '2024-02-08', amount: 72000, description: 'Contract payment cheque', drawer: 'GHI Services Corp', payee: 'Client Corp', bank: 'Citibank', time: '9:20 AM' },
          { date: '2024-02-05', amount: 58000, description: 'Third party settlement cheque', drawer: 'JKL Trading Co', payee: 'Client Corp', bank: 'US Bank', time: '3:15 PM' }
        ],
        summary: 'High-volume third party cheque deposits with $3.25M total over 8 months. Recent monthly increase of 14.1% requires enhanced verification.'
      }

    case 'Crypto Trx':
      return {
        monthlyVolume: {
          totalAmount: 1850000,
          currentMonth: 285000,
          previousMonth: 245000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Crypto Transactions ($)',
            data: [185000, 210000, 225000, 198000, 235000, 258000, 245000, 285000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 65000, description: 'Bitcoin purchase via Coinbase Pro', exchange: 'Coinbase Pro', crypto: 'Bitcoin', type: 'Purchase', wallet: '1A1zP1eP...DivfNa', time: '10:30 AM' },
          { date: '2024-02-12', amount: 48500, description: 'Ethereum sale on Binance US', exchange: 'Binance US', crypto: 'Ethereum', type: 'Sale', wallet: '0x742d35...50d1f8A', time: '2:15 PM' },
          { date: '2024-02-10', amount: 72000, description: 'Large crypto exchange transaction', exchange: 'Kraken', crypto: 'Bitcoin', type: 'Exchange', wallet: '1BvBMSE...c5xw7k', time: '11:45 AM' },
          { date: '2024-02-08', amount: 35000, description: 'Litecoin purchase', exchange: 'Gemini', crypto: 'Litecoin', type: 'Purchase', wallet: 'LTC1qw5...ary0c5', time: '9:20 AM' },
          { date: '2024-02-05', amount: 41200, description: 'Multi-crypto portfolio rebalancing', exchange: 'Coinbase Pro', crypto: 'Mixed', type: 'Exchange', wallet: 'Multiple', time: '3:30 PM' }
        ],
        summary: 'High-volume cryptocurrency transactions with $1.85M total over 8 months. Recent monthly increase of 16.3% requires enhanced due diligence.'
      }

    case 'Luxury Goods Trx':
      return {
        monthlyVolume: {
          totalAmount: 1250000,
          currentMonth: 185000,
          previousMonth: 165000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Luxury Goods Transactions ($)',
            data: [125000, 145000, 155000, 138000, 165000, 175000, 165000, 185000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 45000, description: 'Luxury watch purchase', merchant: 'Rolex Boutique', category: 'Jewelry & Watches', location: 'Beverly Hills, CA', time: '2:30 PM' },
          { date: '2024-02-12', amount: 35000, description: 'High-end jewelry transaction', merchant: 'Tiffany & Co', category: 'Jewelry & Watches', location: 'New York, NY', time: '11:15 AM' },
          { date: '2024-02-10', amount: 28500, description: 'Designer handbag purchase', merchant: 'Louis Vuitton', category: 'Fashion & Accessories', location: 'Las Vegas, NV', time: '4:45 PM' },
          { date: '2024-02-08', amount: 52000, description: 'Luxury car down payment', merchant: 'Ferrari Dealership', category: 'Automotive', location: 'Miami, FL', time: '10:20 AM' },
          { date: '2024-02-05', amount: 18500, description: 'Fine art purchase', merchant: 'Sotheby\'s Auction', category: 'Art & Collectibles', location: 'Los Angeles, CA', time: '6:30 PM' }
        ],
        summary: 'High-value luxury goods transactions with $1.25M total over 8 months. Recent monthly increase of 12.1% requires source of funds verification.'
      }

    case 'Casino Trx':
      return {
        monthlyVolume: {
          totalAmount: 950000,
          currentMonth: 145000,
          previousMonth: 125000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Casino Transactions ($)',
            data: [95000, 105000, 115000, 108000, 125000, 135000, 125000, 145000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 25000, description: 'Casino chip purchase', casino: 'Bellagio Las Vegas', type: 'Chip Purchase', location: 'Las Vegas, NV', time: '9:30 PM' },
          { date: '2024-02-12', amount: 18500, description: 'Gaming transaction', casino: 'Mohegan Sun', type: 'Gaming Credit', location: 'Connecticut', time: '7:45 PM' },
          { date: '2024-02-10', amount: 32000, description: 'Large casino transaction', casino: 'Borgata Hotel Casino', type: 'Chip Purchase', location: 'Atlantic City, NJ', time: '10:15 PM' },
          { date: '2024-02-08', amount: 15000, description: 'Casino credit line draw', casino: 'Wynn Las Vegas', type: 'Credit Draw', location: 'Las Vegas, NV', time: '11:30 PM' },
          { date: '2024-02-05', amount: 22500, description: 'High-stakes gaming', casino: 'Foxwoods Resort', type: 'Gaming Transaction', location: 'Connecticut', time: '8:20 PM' }
        ],
        summary: 'High-volume casino transactions with $950K total over 8 months. Recent monthly increase of 16.0% requires enhanced monitoring for potential money laundering.'
      }

    case 'HRJ Trx (ATM/Wire/Debit)':
      return {
        monthlyVolume: {
          totalAmount: 750000,
          currentMonth: 115000,
          previousMonth: 95000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly HRJ Transactions ($)',
            data: [75000, 85000, 92000, 88000, 98000, 105000, 95000, 115000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 25000, description: 'Wire transfer to Iran', type: 'Wire Transfer', country: 'Iran', bank: 'Bank Melli Iran', purpose: 'Equipment Purchase', time: '10:30 AM' },
          { date: '2024-02-12', amount: 1500, description: 'ATM withdrawal in Syria', type: 'ATM Withdrawal', country: 'Syria', city: 'Damascus', terminal: 'ATM-DAM-003', time: '2:15 PM' },
          { date: '2024-02-10', amount: 18500, description: 'Debit card transaction in Afghanistan', type: 'Debit Transaction', country: 'Afghanistan', merchant: 'Local Supplier', city: 'Kabul', time: '11:45 AM' },
          { date: '2024-02-08', amount: 32000, description: 'Wire to North Korea (BLOCKED)', type: 'Wire Transfer', country: 'North Korea', bank: 'Foreign Trade Bank', status: 'BLOCKED', time: '9:20 AM' },
          { date: '2024-02-05', amount: 800, description: 'ATM cash withdrawal', type: 'ATM Withdrawal', country: 'Iran', city: 'Tehran', terminal: 'ATM-TEH-007', time: '3:30 PM' }
        ],
        summary: 'High-risk jurisdiction transactions with $750K total over 8 months. Recent monthly increase of 21.1% requires immediate sanctions screening.'
      }

    case 'Cashier Cheque Purchase':
      return {
        monthlyVolume: {
          totalAmount: 1450000,
          currentMonth: 225000,
          previousMonth: 195000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Cashier Cheque Purchases ($)',
            data: [145000, 165000, 175000, 168000, 185000, 205000, 195000, 225000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 45000, description: 'Cashier cheque for real estate', payee: 'ABC Real Estate LLC', purpose: 'Property Purchase', branch: 'Main St Branch', time: '10:30 AM' },
          { date: '2024-02-12', amount: 35000, description: 'Large cashier cheque purchase', payee: 'XYZ Construction Co', purpose: 'Contract Payment', branch: 'Downtown Branch', time: '2:15 PM' },
          { date: '2024-02-10', amount: 58000, description: 'Cashier cheque for vehicle', payee: 'Luxury Auto Dealers', purpose: 'Car Purchase', branch: 'North Branch', time: '11:45 AM' },
          { date: '2024-02-08', amount: 28500, description: 'Business payment cheque', payee: 'DEF Services Inc', purpose: 'Service Payment', branch: 'Main St Branch', time: '9:20 AM' },
          { date: '2024-02-05', amount: 42000, description: 'Investment cashier cheque', payee: 'GHI Investment Fund', purpose: 'Investment Purchase', branch: 'Downtown Branch', time: '3:30 PM' }
        ],
        summary: 'High-volume cashier cheque purchases with $1.45M total over 8 months. Recent monthly increase of 15.4% requires enhanced verification of payees and purposes.'
      }

    case 'Cannabis-Related Trx':
      return {
        monthlyVolume: {
          totalAmount: 850000,
          currentMonth: 125000,
          previousMonth: 105000,
          trend: 'increasing'
        },
        chartData: {
          labels: ['Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024'],
          datasets: [{
            label: 'Monthly Cannabis-Related Transactions ($)',
            data: [85000, 95000, 105000, 98000, 115000, 125000, 105000, 125000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }]
        },
        transactions: [
          { date: '2024-02-15', amount: 25000, description: 'Cannabis dispensary payment', merchant: 'Green Valley Dispensary', license: 'CA-DISP-2024-001', location: 'Los Angeles, CA', time: '10:30 AM' },
          { date: '2024-02-12', amount: 18500, description: 'Cannabis cultivation supplies', merchant: 'Hydro Supply Co', category: 'Cultivation Equipment', location: 'Denver, CO', time: '2:15 PM' },
          { date: '2024-02-10', amount: 32000, description: 'Cannabis processing equipment', merchant: 'Extract Tech Solutions', category: 'Processing Equipment', location: 'Portland, OR', time: '11:45 AM' },
          { date: '2024-02-08', amount: 15000, description: 'Cannabis testing services', merchant: 'Lab Analytics Inc', category: 'Testing & Compliance', location: 'Seattle, WA', time: '9:20 AM' },
          { date: '2024-02-05', amount: 22500, description: 'Cannabis retail transaction', merchant: 'Wellness Cannabis Co', license: 'WA-RET-2024-003', location: 'Seattle, WA', time: '3:30 PM' }
        ],
        summary: 'Cannabis-related business transactions with $850K total over 8 months. Recent monthly increase of 19.0% requires compliance with state regulations and enhanced monitoring.'
      }

    default:
      return {
        flagDetails: [{ category: 'General', detail: 'Risk flag under review', riskLevel: 'Medium', lastReview: '2024-01-01' }],
        investigations: [{ id: 'GEN-REV-2024-001', description: 'General risk assessment', priority: 'Standard', assignedTo: 'Compliance Team' }],
        summary: 'General risk flag requiring standard compliance review.'
      }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.profile-section {
  @apply border-b border-gray-100 pb-4 last:border-b-0 last:pb-0;
}

.risk-flag-item {
  transition: all 0.2s ease-in-out;
}

.risk-flag-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>