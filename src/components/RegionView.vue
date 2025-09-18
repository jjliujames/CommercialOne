<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="navigateHome" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </button>
            <div>
              <!-- Breadcrumbs with specific names -->
              <nav class="text-sm text-gray-500 mb-1" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2">
                  <li>
                    <router-link to="/" class="hover:text-gray-700">Regional VPs</router-link>
                  </li>
                  <li v-if="metroName"><span class="mx-2">›</span></li>
                  <li v-if="metroName">
                    <router-link :to="metroId ? `/metro/${metroId}` : '#'" class="hover:text-gray-700">{{ metroName }}</router-link>
                  </li>
                  <li v-if="marketName"><span class="mx-2">›</span></li>
                  <li v-if="marketName">
                    <router-link :to="marketId && metroId ? `/metro/${metroId}/market/${marketId}` : '#'" class="hover:text-gray-700">{{ marketName }}</router-link>
                  </li>
                  <li><span class="mx-2">›</span></li>
                  <li><span class="font-medium text-gray-700">{{ regionName }}</span></li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button @click="exportData"
              class="px-4 py-2 bg-td-green text-white rounded-lg hover:bg-green-600 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        <!-- Show Net-New and Date Range inline -->
        <div class="mt-4 flex items-center space-x-8">
          <label class="flex items-center space-x-2 text-sm text-gray-700">
            <input type="checkbox" v-model="showNetNew" class="rounded border-gray-300">
            <span>Show Net-New</span>
          </label>
          <div class="flex items-center">
            <label class="text-sm text-gray-700 mr-3">Date Range:</label>
            <select v-model="selectedDateRange" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="ytd">YTD</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        </div>

        <!-- RVP (Regional VP) Summary Banner -->
        <div class="mt-6 bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
          <div>
            <div class="text-lg font-semibold text-gray-900">{{ regionData.vpName || 'Regional VP' }}</div>
            <div class="text-sm text-gray-600">
              RVP (Regional VP) |
              <span class="font-medium">{{ regionName }}</span>
              <span v-if="marketName"> | {{ marketName }}</span>
              <span v-if="metroName"> | {{ metroName }}</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">Managing {{ totalRMs }} Relationship Managers | Last Review: <span class="font-medium">{{ lastReviewDate }}</span>
            </div>
          </div>
          <button @click="showAlertsModal = true"
            class="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            <span class="text-lg">⚠️</span>
            <span>Alerts</span>
            <span v-if="urgentAlertCount > 0"
              class="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ urgentAlertCount
              }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Executive KPI Ribbon -->
    <div class="bg-white shadow-md border-b border-gray-200">
      <div class="px-8 py-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
          <span class="mr-2">📊</span>
          RVP KEY PERFORMANCE INDICATORS
          <span class="ml-auto text-xs font-normal text-gray-500">Click any metric for detailed analysis</span>
        </h3>
        <div class="grid grid-cols-7 gap-4">
          <!-- Revenue FYTD -->
          <div class="relative group text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gradient-to-b hover:from-cyan-50 hover:to-white transition-all duration-200 rounded-lg p-2"
            @click="showRevenueModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">💰</span>
              <div class="text-2xl font-bold text-cyan-600">{{ formatCurrency(totalRevenue) }}</div>
            </div>
            <div class="text-xs font-medium text-gray-700">Revenue FYTD</div>
            <div class="flex items-center justify-center mt-1">
              <svg v-if="revenueYoY >= 0" class="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-xs font-bold" :class="revenueYoY >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ Math.abs(revenueYoY) }}% YoY
              </span>
            </div>
          </div>

          <!-- Relationship Managers -->
          <div class="relative group text-center cursor-pointer hover:bg-gradient-to-b hover:from-blue-50 hover:to-white transition-all duration-200 rounded-lg p-2"
            @click="showRMsModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">👥</span>
              <div class="text-2xl font-bold text-blue-600">{{ totalRMs }}</div>
            </div>
            <div class="text-xs font-medium text-gray-700">Relationship Managers</div>
            <div class="text-xs text-green-600 font-bold mt-1">+{{ rmsDelta || 0 }} new FYTD</div>
          </div>

          <!-- Deposits -->
          <div class="relative group text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gradient-to-b hover:from-green-50 hover:to-white transition-all duration-200 rounded-lg p-2" 
            @click="showDepositsModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">🏦</span>
              <div class="text-2xl font-bold text-green-600">{{ formatCurrency(showNetNew ? netNewDeposits : totalDeposits) }}</div>
            </div>
            <div class="text-xs font-medium text-gray-700">{{ showNetNew ? 'Deposits Net New' : 'Total Deposits' }}</div>
            <div class="flex items-center justify-center mt-1">
              <svg class="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-xs font-bold text-green-600">{{ depositsGrowth }}% YoY</span>
            </div>
            <div v-if="showNetNew" class="text-xs text-gray-500 font-medium mt-1">Total: {{ formatCurrency(totalDeposits) }}</div>
          </div>

          <!-- ROE -->
          <div class="relative group text-center cursor-pointer hover:bg-gradient-to-b hover:from-purple-50 hover:to-white transition-all duration-200 rounded-lg p-2"
            @click="showROEModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">📈</span>
              <div class="text-2xl font-bold text-purple-600">{{ regionalROE }}%</div>
            </div>
            <div class="text-xs font-medium text-gray-700">Return on Equity</div>
            <div class="flex items-center justify-center mt-1">
              <svg v-if="roeChange >= 0" class="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-xs font-bold" :class="roeChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ Math.abs(roeChange || 5) }}% vs peers
              </span>
            </div>
          </div>

          <!-- Credit Commitments -->
          <div class="relative group text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gradient-to-b hover:from-orange-50 hover:to-white transition-all duration-200 rounded-lg p-2"
            @click="showCreditModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">💳</span>
              <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(showNetNew ? netNewCommitments : totalLoanCommitments) }}</div>
            </div>
            <div class="text-xs font-medium text-gray-700">{{ showNetNew ? 'Credit Net New' : 'Credit Commitments' }}</div>
            <div class="text-xs text-orange-600 font-bold mt-1">{{ loanUtilization }}% utilized</div>
            <div v-if="showNetNew" class="text-xs text-gray-500 font-medium">Total: {{ formatCurrency(totalLoanCommitments) }}</div>
          </div>

          <!-- Referrals -->
          <div class="relative group text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gradient-to-b hover:from-indigo-50 hover:to-white transition-all duration-200 rounded-lg p-2"
            @click="showReferralsModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">🤝</span>
              <div class="text-2xl font-bold text-indigo-600">{{ totalReferrals }}</div>
            </div>
            <div class="text-xs font-medium text-gray-700">Referrals</div>
            <div class="text-xs font-bold" :class="totalReferrals >= referralTarget ? 'text-green-600' : 'text-orange-600'">
              {{ totalReferrals >= referralTarget ? '✓' : '' }} Target: {{ referralTarget }}
            </div>
          </div>

          <!-- Risk Reviews Pending -->
          <div class="relative group text-center cursor-pointer hover:bg-gradient-to-b hover:from-red-50 hover:to-white transition-all duration-200 rounded-lg p-2" 
            @click="showRiskModal = true">
            <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <div class="flex items-center justify-center mb-1">
              <span class="text-2xl mr-2">⚠️</span>
              <div class="text-2xl font-bold text-red-600 flex items-center">
                {{ riskReviewsPending }}
                <span v-if="riskReviewsPending > 10" class="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></span>
              </div>
            </div>
            <div class="text-xs font-medium text-gray-700">Risk Reviews Pending</div>
            <div class="text-xs font-bold" :class="riskReviewsPending > 10 ? 'text-red-600' : 'text-gray-500'">
              {{ riskReviewsPending }} pending
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RVP Performance Score Dashboard -->
    <div class="px-8 py-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
      <h4 class="font-medium text-purple-900 mb-4">🎯 RVP Performance Score Dashboard</h4>
      <div class="grid grid-cols-5 gap-4 mb-4">
        <!-- Revenue FYTD -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ formatCurrency(regionalPerformanceMetrics.revenueFYTD.actual) }}</div>
            <div class="ml-2">
              <svg v-if="regionalPerformanceMetrics.revenueFYTD.achieved" class="w-5 h-5 text-green-500" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Revenue FYTD</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ formatCurrency(regionalPerformanceMetrics.revenueFYTD.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-cyan-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, regionalPerformanceMetrics.revenueFYTD.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="regionalPerformanceMetrics.revenueFYTD.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ regionalPerformanceMetrics.revenueFYTD.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Net New Commitments -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{
              formatCurrency(regionalPerformanceMetrics.netNewCommitments.actual) }}</div>
            <div class="ml-2">
              <svg v-if="regionalPerformanceMetrics.netNewCommitments.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Net New Commitments</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ formatCurrency(regionalPerformanceMetrics.netNewCommitments.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, regionalPerformanceMetrics.netNewCommitments.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="regionalPerformanceMetrics.netNewCommitments.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ regionalPerformanceMetrics.netNewCommitments.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Net New Deposits -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ formatCurrency(regionalPerformanceMetrics.netNewDeposits.actual) }}</div>
            <div class="ml-2">
              <svg v-if="regionalPerformanceMetrics.netNewDeposits.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Net New Deposits</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ formatCurrency(regionalPerformanceMetrics.netNewDeposits.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, regionalPerformanceMetrics.netNewDeposits.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="regionalPerformanceMetrics.netNewDeposits.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ regionalPerformanceMetrics.netNewDeposits.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- New Credit Relationships -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ regionalPerformanceMetrics.netNewCreditRelationships.actual }}</div>
            <div class="ml-2">
              <svg v-if="regionalPerformanceMetrics.netNewCreditRelationships.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">New Credit Relationships</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ regionalPerformanceMetrics.netNewCreditRelationships.target }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, regionalPerformanceMetrics.netNewCreditRelationships.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="regionalPerformanceMetrics.netNewCreditRelationships.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ regionalPerformanceMetrics.netNewCreditRelationships.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Referrals -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ regionalPerformanceMetrics.referrals.actual }}</div>
            <div class="ml-2">
              <svg v-if="regionalPerformanceMetrics.referrals.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Referrals</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ regionalPerformanceMetrics.referrals.target }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, regionalPerformanceMetrics.referrals.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="regionalPerformanceMetrics.referrals.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ regionalPerformanceMetrics.referrals.achievementPercent }}% of target
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Performance Score -->
      <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200">
        <div class="flex items-center space-x-4">
          <div>
            <div class="text-sm font-medium text-gray-700">Overall RVP Performance Score</div>
            <div class="text-xs text-gray-500 mt-1">Targets Achieved: {{ regionalPerformanceTargetsAchieved }}/5</div>
          </div>
        </div>
        <div class="flex items-center space-x-6">
          <div class="text-right">
            <div class="text-3xl font-bold" :class="overallRegionalPerformanceScore >= 80 ? 'text-green-600' : overallRegionalPerformanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'">
              {{ overallRegionalPerformanceScore }}%
            </div>
            <div class="text-xs font-medium mt-1" 
              :class="overallRegionalPerformanceScore >= 80 ? 'text-green-600' : overallRegionalPerformanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'">
              {{ overallRegionalPerformanceScore >= 80 ? 'Excellent' : overallRegionalPerformanceScore >= 60 ? 'Good' : 'Needs Improvement' }}
            </div>
          </div>
          <div class="text-xs text-gray-500">
            Next Review: {{ nextRegionalPerformanceReview }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-1 py-5">
      <!-- Tab Navigation -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button @click="activeTab = 'rms'"
              :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'rms' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              Relationship Managers
            </button>
            <button @click="activeTab = 'trends'"
              :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'trends' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              Trends Analysis
            </button>
            <button @click="activeTab = 'opportunities'"
              :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'opportunities' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              Opportunities & Growth
            </button>
            <button @click="activeTab = 'risk'"
              :class="['whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium', activeTab === 'risk' ? 'border-td-green text-td-green' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
              Risk Management
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Relationship Managers Tab -->
          <div v-if="activeTab === 'rms'">
            <div class="space-y-6">
              <!-- RM Performance Summary -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900">👥 RM Performance Summary</h3>
                  <div class="text-sm text-gray-500">
                    {{ totalRMs }} Relationship Managers | Last Updated: {{ new Date().toLocaleDateString() }}
                  </div>
                </div>
                
                <!-- RM Performance Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('name')">
                          Relationship Manager
                          <span v-if="sortField === 'name'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('revenue')">
                          Revenue FYTD
                          <span v-if="sortField === 'revenue'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('netNewCommitments')">
                          Net New Commitments
                          <span v-if="sortField === 'netNewCommitments'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('netNewDeposits')">
                          Net New Deposits
                          <span v-if="sortField === 'netNewDeposits'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('newCreditRelationships')">
                          New Credit Relationships
                          <span v-if="sortField === 'newCreditRelationships'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('referrals')">
                          Referrals
                          <span v-if="sortField === 'referrals'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('riskFlags')">
                          Risk Flags
                          <span v-if="sortField === 'riskFlags'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          @click="sortTable('targetAchievement')">
                          Target Achievement
                          <span v-if="sortField === 'targetAchievement'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </th>
                        <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="rm in sortedRMsByPerformance" :key="rm.id"
                        class="hover:bg-green-50 cursor-pointer transition-colors" @click="drillDownToRM(rm)">
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-8 w-8">
                              <div class="h-8 w-8 rounded-full bg-td-green flex items-center justify-center">
                                <span class="text-xs font-medium text-white">{{ rm.name.split(' ').map(n => n[0]).join('') }}</span>
                              </div>
                            </div>
                            <div class="ml-3">
                              <div class="text-sm font-medium text-gray-900">{{ rm.name }}</div>
                              <div class="text-xs text-gray-500">{{ rm.relationships }} relationships</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-medium text-gray-900">{{ formatCurrency(rm.revenue) }}</div>
                          <div class="text-xs" :class="rm.revenueDelta >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ rm.revenueDelta >= 0 ? '+' : '' }}{{ rm.revenueDelta }}% YoY
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-medium text-gray-900">{{ formatCurrency(rm.netNewCommitments || 0) }}</div>
                          <div class="text-xs text-gray-500">Target: {{ formatCurrency(rm.commitmentTarget || 0) }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-medium text-gray-900">{{ formatCurrency(rm.netNewDeposits || 0) }}</div>
                          <div class="text-xs text-gray-500">Target: {{ formatCurrency(rm.depositTarget || 0) }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-medium text-gray-900">{{ rm.newCreditRelationships || 0 }}</div>
                          <div class="text-xs text-gray-500">Target: {{ rm.creditTarget || 0 }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-medium text-gray-900">{{ rm.referrals || 0 }}</div>
                          <div class="text-xs text-gray-500">Target: {{ rm.referralTarget || 0 }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <span class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getRiskFlagColor(rm.riskFlags || 0)">
                            {{ rm.riskFlags || 0 }}
                          </span>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <div class="flex items-center justify-center">
                            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                                :style="`width: ${Math.min(100, (rm.targetAchievement || 0))}%`"></div>
                            </div>
                            <span class="text-sm font-medium"
                              :class="(rm.targetAchievement || 0) >= 100 ? 'text-green-600' : (rm.targetAchievement || 0) >= 80 ? 'text-yellow-600' : 'text-red-600'">
                              {{ Math.round(rm.targetAchievement || 0) }}%
                            </span>
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <span class="text-td-green font-medium hover:text-td-green-dark">View Details ›</span>
                        </td>
                      </tr>
                      
                      <!-- Portfolio Totals Row -->
                      <tr class="bg-gray-50 font-medium border-t-2 border-gray-300">
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm font-bold text-gray-900">📊 RVP Portfolio Totals</div>
                          <div class="text-xs text-gray-600">{{ totalRMs }} RMs</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</div>
                          <div class="text-xs" :class="revenueYoY >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% YoY
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">{{ formatCurrency(netNewCommitments) }}</div>
                          <div class="text-xs text-gray-600">RVP Total</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">{{ formatCurrency(netNewDeposits) }}</div>
                          <div class="text-xs text-gray-600">RVP Total</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">{{ newCreditRelationships }}</div>
                          <div class="text-xs text-gray-600">RVP Total</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">{{ totalReferrals }}</div>
                          <div class="text-xs text-gray-600">RVP Total</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <span class="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">
                            {{ riskReviewsPending }}
                          </span>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <div class="flex items-center justify-center">
                            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                                :style="`width: ${Math.min(100, overallRegionalPerformanceScore)}%`"></div>
                            </div>
                            <span class="text-sm font-bold"
                              :class="overallRegionalPerformanceScore >= 100 ? 'text-green-600' : overallRegionalPerformanceScore >= 80 ? 'text-yellow-600' : 'text-red-600'">
                              {{ overallRegionalPerformanceScore }}%
                            </span>
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-center">
                          <span class="text-gray-500 text-sm">—</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Trends Analysis Tab -->
          <div v-if="activeTab === 'trends'">
            <div class="space-y-6">
              <!-- Regional Performance Chart -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl">📊</span>
                    <h3 class="text-lg font-bold text-gray-900 ml-2">RVP Portfolio Balance Trends</h3>
                    <div class="flex items-center space-x-2 text-sm text-gray-500 ml-auto">
                      <span>Last 12 Months</span>
                    </div>
                  </div>
                  <div class="h-60 px-10">
                    <BarChart v-if="regionalPortfolioChartData" :data="regionalPortfolioChartData"
                      :options="regionalPortfolioChartOptions" />
                  </div>
                </div>
              </div>

              <!-- Revenue by RM -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="p-6">
                  <div class="flex items-center mb-4">
                    <span class="text-2xl">💰</span>
                    <h3 class="text-lg font-bold text-gray-900 ml-2">Revenue by Relationship Manager</h3>
                  </div>
                  <div class="h-60 px-10">
                    <BarChart v-if="revenueByRMChartData" :data="revenueByRMChartData"
                      :options="revenueByRMChartOptions" />
                  </div>
                </div>
              </div>

              <!-- Performance Metrics Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600">{{ formatCurrency(totalRevenue) }}</div>
                    <div class="text-sm text-gray-600 mt-1">Total Revenue FYTD</div>
                    <div class="text-xs font-medium mt-2" :class="revenueYoY >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% YoY
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-green-600">{{ formatCurrency(netNewDeposits) }}</div>
                    <div class="text-sm text-gray-600 mt-1">Net New Deposits</div>
                    <div class="text-xs font-medium text-green-600 mt-2">{{ depositsGrowth }}% Growth</div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-orange-600">{{ formatCurrency(netNewCommitments) }}</div>
                    <div class="text-sm text-gray-600 mt-1">Net New Commitments</div>
                    <div class="text-xs font-medium text-orange-600 mt-2">{{ loanUtilization }}% Utilized</div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-purple-600">{{ newCreditRelationships }}</div>
                    <div class="text-sm text-gray-600 mt-1">New Credit Relationships</div>
                    <div class="text-xs font-medium text-purple-600 mt-2">+{{ newCreditRelationships }} FYTD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opportunities & Growth Tab -->
          <div v-if="activeTab === 'opportunities'">
            <div class="space-y-6">
              <!-- Growth Metrics -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(newDepositVolume) }}</div>
                  <div class="text-xs text-gray-600">New Deposit Volume</div>
                  <div class="text-xs text-blue-500 font-medium">vs target {{ formatCurrency(depositTarget) }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ newCreditRelationships }}</div>
                  <div class="text-xs text-gray-600">New Credit Relationships</div>
                  <div class="text-xs text-green-500 font-medium">vs target {{ creditTarget }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(incrementalTMSRevenue) }}</div>
                  <div class="text-xs text-gray-600">Incremental TMS Revenue</div>
                  <div class="text-xs text-orange-500 font-medium">vs target {{ formatCurrency(tmsTarget) }}</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">{{ totalReferrals }}</div>
                  <div class="text-xs text-gray-600">Total Referrals</div>
                  <div class="text-xs text-purple-500 font-medium">{{ retailReferrals }} Retail | {{ wealthReferrals }}
                    Wealth</div>
                </div>
              </div>

              <!-- Opportunities by RM Table -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Growth Opportunities by RM</h3>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relationship Manager</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Opportunities</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Potential Value</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Conversion Rate</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="rm in sortedRMs" :key="rm.id"
                          class="hover:bg-green-50 cursor-pointer transition-colors" @click="drillDownToRM(rm)">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-8 w-8">
                                <div class="h-8 w-8 rounded-full bg-td-green flex items-center justify-center">
                                  <span class="text-xs font-medium text-white">{{rm.name.split(' ').map(n =>
                                    n[0]).join('')}}</span>
                                </div>
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">{{ rm.name }}</div>
                                <div class="text-xs text-gray-500">{{ rm.relationships }} relationships</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-600 font-bold">{{
                            getRMOpportunityCount(rm) }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-bold">{{
                            formatCurrency(getRMOpportunityValue(rm)) }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-purple-600 font-bold">{{
                            getRMConversionRate(rm) }}%</td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <span class="text-td-green font-medium">View Details ›</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Management Tab -->
          <div v-if="activeTab === 'risk'">
            <div class="space-y-6">
              <!-- Risk Status Overview -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">🚨 Regional Risk Overview</h3>
                  <div class="grid grid-cols-5 gap-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-orange-600">{{ riskMetrics.totalRiskFlags }}</div>
                      <div class="text-xs text-gray-600">Total Risk Flags</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-red-600">{{ riskMetrics.pending }}</div>
                      <div class="text-xs text-gray-600">Pending Reviews</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ riskMetrics.reviewedWithAction }}</div>
                      <div class="text-xs text-gray-600">Reviewed w/ Action</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-purple-600">{{ riskMetrics.reviewedWithoutAction }}</div>
                      <div class="text-xs text-gray-600">Reviewed w/o Action</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-cyan-600">{{ riskMetrics.avgTimeToClose }}</div>
                      <div class="text-xs text-gray-600">Avg Days to Close</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Risk by RM Table -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">🚨 Risk Management by RM</h3>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relationship Manager</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Risk Flags</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pending Reviews</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            High Risk Relationships</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            UTR Filed</th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="rm in sortedRMs" :key="rm.id"
                          class="hover:bg-green-50 cursor-pointer transition-colors" @click="drillDownToRM(rm)">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 h-8 w-8">
                                <div class="h-8 w-8 rounded-full bg-td-green flex items-center justify-center">
                                  <span class="text-xs font-medium text-white">{{rm.name.split(' ').map(n =>
                                    n[0]).join('')}}</span>
                                </div>
                              </div>
                              <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">{{ rm.name }}</div>
                                <div class="text-xs text-gray-500">{{ rm.relationships }} relationships</div>
                              </div>
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span v-if="rm.riskFlags > 0"
                              class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              {{ rm.riskFlags }}
                            </span>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span v-if="rm.pendingReviews > 0"
                              class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              {{ rm.pendingReviews }}
                            </span>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span v-if="rm.highRiskRelationships > 0"
                              class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                              {{ rm.highRiskRelationships }}
                            </span>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span v-if="rm.utrFiled > 0"
                              class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {{ rm.utrFiled }}
                            </span>
                            <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <span class="text-td-green font-medium">Review Portfolio ›</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts Modal -->
    <div v-if="showAlertsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">🚨 RVP Alerts</h3>
          <button @click="showAlertsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-red-500 text-lg mr-2">⚠️</span>
              <div>
                <h4 class="font-medium text-red-900">Global Retail Corp - Covenant Breach</h4>
                <p class="text-sm text-red-700">Debt-to-equity ratio exceeded 3.5x threshold. RM: Sarah Johnson</p>
              </div>
            </div>
          </div>
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-yellow-500 text-lg mr-2">⚠️</span>
              <div>
                <h4 class="font-medium text-yellow-900">RVP Risk Review Overdue</h4>
                <p class="text-sm text-yellow-700">15 relationships have overdue risk reviews across the RVP area.</p>
              </div>
            </div>
          </div>
          <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="flex items-center">
              <span class="text-orange-500 text-lg mr-2">⚠️</span>
              <div>
                <h4 class="font-medium text-orange-900">Target Performance Alert</h4>
                <p class="text-sm text-orange-700">New credit relationships 40% below YTD target.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="showAlertsModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Revenue Modal -->
    <div v-if="showRevenueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4 border-b pb-4">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <span class="text-2xl mr-3">💰</span>
            Revenue Analysis - RVP {{ regionName }}
          </h3>
          <button @click="showRevenueModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Revenue Summary Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
            <div class="text-2xl font-bold text-cyan-700">{{ formatCurrency(totalRevenue) }}</div>
            <div class="text-sm text-cyan-600">Total Revenue FYTD</div>
            <div class="text-xs text-cyan-500 mt-1">{{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% vs Last Year</div>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-700">{{ formatCurrency(totalRevenue / totalRMs) }}</div>
            <div class="text-sm text-green-600">Avg Revenue per RM</div>
            <div class="text-xs text-green-500 mt-1">{{ totalRMs }} RMs Total</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-700">{{ Math.round((totalRevenue / regionalPerformanceMetrics.revenueFYTD.target) * 100) }}%</div>
            <div class="text-sm text-purple-600">Target Achievement</div>
            <div class="text-xs text-purple-500 mt-1">Target: {{ formatCurrency(regionalPerformanceMetrics.revenueFYTD.target) }}</div>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-700">{{ formatCurrency(totalRevenue / totalRelationships) }}</div>
            <div class="text-sm text-orange-600">Revenue per Relationship</div>
            <div class="text-xs text-orange-500 mt-1">{{ totalRelationships }} Relationships</div>
          </div>
        </div>

        <!-- Revenue by RM Table -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Revenue Breakdown by Relationship Manager</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RM Name</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue FYTD</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">YoY Growth</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Target</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Achievement</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="rm in sortedRMsByRevenue" :key="rm.id" 
                    class="hover:bg-gray-50 cursor-pointer" @click="drillDownToRM(rm)">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
                        <span class="text-xs font-medium text-white">{{ rm.name.split(' ').map(n => n[0]).join('') }}</span>
                      </div>
                      <div class="text-sm font-medium text-gray-900">{{ rm.name }}</div>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {{ formatCurrency(rm.revenue) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                    {{ Math.round((rm.revenue / totalRevenue) * 100) }}%
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <span :class="rm.revenueDelta >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ rm.revenueDelta >= 0 ? '+' : '' }}{{ rm.revenueDelta }}%
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                    {{ formatCurrency(rm.revenueTarget) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center">
                      <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full" 
                             :class="(rm.revenue / rm.revenueTarget) >= 1 ? 'bg-green-500' : (rm.revenue / rm.revenueTarget) >= 0.8 ? 'bg-yellow-500' : 'bg-red-500'"
                             :style="`width: ${Math.min(100, (rm.revenue / rm.revenueTarget) * 100)}%`"></div>
                      </div>
                      <span class="text-xs font-medium">{{ Math.round((rm.revenue / rm.revenueTarget) * 100) }}%</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <div class="h-8 w-20">
                      <svg viewBox="0 0 80 30" class="w-full h-full">
                        <polyline fill="none" :stroke="rm.revenueDelta >= 0 ? '#10b981' : '#ef4444'" stroke-width="2"
                          points="5,25 20,20 35,15 50,18 65,10 75,5" />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Revenue Trends Chart -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Revenue Trend Analysis</h4>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="h-64">
              <BarChart v-if="revenueChartData" :data="revenueChartData" :options="revenueChartOptions" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="exportRevenueData" 
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Generate Report
          </button>
          <button @click="showRevenueModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Deposits Modal -->
    <div v-if="showDepositsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4 border-b pb-4">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <span class="text-2xl mr-3">🏦</span>
            Deposits Analysis - RVP {{ regionName }}
          </h3>
          <button @click="showDepositsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Deposits Summary Cards -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-700">{{ formatCurrency(totalDeposits) }}</div>
            <div class="text-sm text-green-600">Total Deposits</div>
            <div class="text-xs text-green-500 mt-1">{{ depositsGrowth }}% YoY Growth</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-700">{{ formatCurrency(netNewDeposits) }}</div>
            <div class="text-sm text-blue-600">Net New Deposits</div>
            <div class="text-xs text-blue-500 mt-1">FYTD Achievement</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-700">{{ formatCurrency(totalDeposits / totalRelationships) }}</div>
            <div class="text-sm text-purple-600">Avg Deposit per Relationship</div>
            <div class="text-xs text-purple-500 mt-1">{{ totalRelationships }} Relationships</div>
          </div>
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
            <div class="text-2xl font-bold text-indigo-700">{{ Math.round((netNewDeposits / regionalPerformanceMetrics.netNewDeposits.target) * 100) }}%</div>
            <div class="text-sm text-indigo-600">Target Achievement</div>
            <div class="text-xs text-indigo-500 mt-1">Target: {{ formatCurrency(regionalPerformanceMetrics.netNewDeposits.target) }}</div>
          </div>
        </div>

        <!-- Deposit Mix Chart -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Deposit Mix by Type</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Operating Accounts</span>
                  <span class="text-sm font-medium">{{ formatCurrency(totalDeposits * 0.45) }} (45%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 45%"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Money Market</span>
                  <span class="text-sm font-medium">{{ formatCurrency(totalDeposits * 0.25) }} (25%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 25%"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Term Deposits</span>
                  <span class="text-sm font-medium">{{ formatCurrency(totalDeposits * 0.20) }} (20%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 20%"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Other</span>
                  <span class="text-sm font-medium">{{ formatCurrency(totalDeposits * 0.10) }} (10%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-orange-500 h-2 rounded-full" style="width: 10%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Growth Trend Analysis</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="h-48">
                <BarChart v-if="depositsChartData" :data="depositsChartData" :options="depositsChartOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- RM Deposits Performance Table -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Deposits by Relationship Manager</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RM Name</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Deposits</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net New FYTD</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Growth %</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Target</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Achievement</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="rm in enhancedRMData" :key="rm.id" 
                    class="hover:bg-gray-50 cursor-pointer">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                        <span class="text-xs font-medium text-white">{{ rm.name.split(' ').map(n => n[0]).join('') }}</span>
                      </div>
                      <div class="text-sm font-medium text-gray-900">{{ rm.name }}</div>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {{ formatCurrency(rm.portfolioValue * 0.6) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-green-600">
                    {{ formatCurrency(rm.netNewDeposits) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <span class="text-green-600">+{{ Math.round(Math.random() * 15 + 5) }}%</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                    {{ formatCurrency(rm.depositTarget) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center">
                      <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full bg-green-500"
                             :style="`width: ${Math.min(100, (rm.netNewDeposits / rm.depositTarget) * 100)}%`"></div>
                      </div>
                      <span class="text-xs font-medium">{{ Math.round((rm.netNewDeposits / rm.depositTarget) * 100) }}%</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <button @click="drillDownToRM(rm)" class="text-green-600 hover:text-green-800 text-sm font-medium">
                      View Details →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="exportDepositsData" 
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Generate Report
          </button>
          <button @click="showDepositsModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
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
import { getRegionById, getMarketById, getMetroById, getRMsByRegion, formatCurrency, getRiskColor, markets, metros } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'

const props = defineProps({
  metroId: {
    type: String,
    required: true
  },
  marketId: {
    type: String,
    required: true
  },
  regionId: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Reactive state
const activeTab = ref('rms')
const selectedDateRange = ref('ytd')
const showNetNew = ref(true)
const showAlertsModal = ref(false)

// Modal states for KPI drill-downs
const showRevenueModal = ref(false)
const showRMsModal = ref(false)
const showDepositsModal = ref(false)
const showROEModal = ref(false)
const showCreditModal = ref(false)
const showReferralsModal = ref(false)
const showRiskModal = ref(false)

// Sorting state
const sortField = ref('')
const sortDirection = ref('asc')

// Regional Data - get from mockData
const regionData = computed(() => {
  const region = getRegionById(props.regionId)
  if (region) {
    return region
  }
  // Fallback if region not found
  return {
    vpName: 'Regional VP',
    id: props.regionId,
    name: props.regionId ? props.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Region'
  }
})

// Computed properties for hierarchy data
const marketData = computed(() => {
  const region = getRegionById(props.regionId)
  if (props.marketId) {
    return getMarketById(props.marketId)
  } else if (region?.marketId) {
    return getMarketById(region.marketId)
  }
  return null
})

const metroData = computed(() => {
  const market = marketData.value
  if (props.metroId) {
    return getMetroById(props.metroId)
  } else if (market?.metroId) {
    return getMetroById(market.metroId)
  }
  return null
})

// Computed properties for names
const regionName = computed(() => {
  const region = getRegionById(props.regionId)
  return region?.name || (props.regionId ? props.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Region')
})

const marketName = computed(() => {
  return marketData.value?.name
})

const metroName = computed(() => {
  return metroData.value?.name
})
const lastReviewDate = computed(() => {
  return '2024-11-15';
})
const urgentAlertCount = computed(() => {
  return 3;
})

const netNewPeriod = computed(() => {
  switch (selectedDateRange.value) {
    case 'ytd': return '1 Jan'
    case '6m': return '6 months ago'
    case '12m': return '12 months ago'
    default: return '1 Jan'
  }
})

// Sample RM data for the region with Sarah Johnson as example
const relationshipManagers = computed(() => [
  {
    id: 'rm-001',
    name: 'Sarah Johnson',
    relationships: 15,
    portfolioValue: 950000000,
    revenue: 5650000,
    revenueDelta: 12,
    utilization: 75,
    riskScore: 6.2,
    riskFlags: 3,
    pendingReviews: 2,
    highRiskRelationships: 2,
    utrFiled: 1,
    opportunityCount: 25,
    opportunityValue: 5150000,
    conversionRate: 72
  },
  {
    id: 'rm-002',
    name: 'Michael Chen',
    relationships: 12,
    portfolioValue: 780000000,
    revenue: 4320000,
    revenueDelta: 8,
    utilization: 68,
    riskScore: 4.8,
    riskFlags: 1,
    pendingReviews: 1,
    highRiskRelationships: 1,
    utrFiled: 0,
    opportunityCount: 18,
    opportunityValue: 3200000,
    conversionRate: 65
  },
  {
    id: 'rm-003',
    name: 'Jennifer Wu',
    relationships: 18,
    portfolioValue: 1200000000,
    revenue: 6800000,
    revenueDelta: -3,
    utilization: 82,
    riskScore: 7.1,
    riskFlags: 4,
    pendingReviews: 4,
    highRiskRelationships: 3,
    utrFiled: 2,
    opportunityCount: 22,
    opportunityValue: 4100000,
    conversionRate: 58
  },
  {
    id: 'rm-004',
    name: 'Robert Taylor',
    relationships: 14,
    portfolioValue: 890000000,
    revenue: 4950000,
    revenueDelta: 15,
    utilization: 71,
    riskScore: 5.3,
    riskFlags: 2,
    pendingReviews: 1,
    highRiskRelationships: 1,
    utrFiled: 0,
    opportunityCount: 20,
    opportunityValue: 3800000,
    conversionRate: 69
  },
  {
    id: 'rm-005',
    name: 'Lisa Anderson',
    relationships: 10,
    portfolioValue: 650000000,
    revenue: 3500000,
    revenueDelta: 7,
    utilization: 60,
    riskScore: 3.2,
    riskFlags: 0,
    pendingReviews: 0,
    highRiskRelationships: 0,
    utrFiled: 0,
    opportunityCount: 15,
    opportunityValue: 2800000,
    conversionRate: 80
  }
])

// Sorted RMs
const sortedRMs = computed(() => {
  if (!sortField.value) return relationshipManagers.value

  const sorted = [...relationshipManagers.value].sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    // Handle string sorting
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return sorted
})

// Regional KPI computations
const totalRMs = computed(() => relationshipManagers.value.length)
const totalRelationships = computed(() => relationshipManagers.value.reduce((sum, rm) => sum + rm.relationships, 0))
const relationshipsDelta = computed(() => 8)
const totalDeposits = computed(() => relationshipManagers.value.reduce((sum, rm) => sum + rm.portfolioValue * 0.6, 0))
const totalLoanCommitments = computed(() => relationshipManagers.value.reduce((sum, rm) => sum + rm.portfolioValue * 0.4, 0))
const loanUtilization = computed(() => {
  const totalUsed = relationshipManagers.value.reduce((sum, rm) => sum + rm.portfolioValue * 0.4 * (rm.utilization / 100), 0)
  const totalCommitted = totalLoanCommitments.value
  return Math.round((totalUsed / totalCommitted) * 100)
})
const totalRevenue = computed(() => relationshipManagers.value.reduce((sum, rm) => sum + rm.revenue, 0))
const revenueYoY = computed(() => {
  const weightedDelta = relationshipManagers.value.reduce((sum, rm) => sum + (rm.revenue * rm.revenueDelta / 100), 0)
  return Math.round((weightedDelta / totalRevenue.value) * 100)
})
const depositsGrowth = computed(() => 18) // Mock YoY growth

// Additional computed properties for RegionView
const regionalROE = computed(() => {
  // Calculate weighted average ROE based on portfolio values and risk scores
  const totalPortfolio = relationshipManagers.value.reduce((sum, rm) => sum + rm.portfolioValue, 0)
  const weightedROE = relationshipManagers.value.reduce((sum, rm) => {
    const weight = rm.portfolioValue / totalPortfolio
    const roe = (rm.revenue / rm.portfolioValue) * 100 * (10 - rm.riskScore) / 10 // Risk-adjusted ROE
    return sum + (roe * weight)
  }, 0)
  return Math.round(weightedROE * 10) / 10
})

const roeChange = computed(() => {
  // Calculate ROE change vs peers (mock calculation based on performance)
  const avgRevenueDelta = relationshipManagers.value.reduce((sum, rm) => sum + rm.revenueDelta, 0) / relationshipManagers.value.length
  return Math.round(avgRevenueDelta * 0.3) // Mock peer comparison factor
})

const totalReferrals = computed(() => {
  // Sum all RM referrals (using existing opportunityCount as proxy for referrals)
  return relationshipManagers.value.reduce((sum, rm) => sum + Math.floor((rm.opportunityCount || 0) * 0.15), 0)
})

const referralTarget = computed(() => {
  // Referral target based on number of RMs and relationships
  return Math.round(totalRMs.value * totalRelationships.value * 0.02)
})

const loanDelta = computed(() => {
  // Net new loan commitments
  return 78000000
})

const depositsDelta = computed(() => {
  // Net new deposits
  return 125000000
})

const rmsDelta = computed(() => {
  // New RMs added to region
  return 1
})

const newCreditRelationships = computed(() => 7)
const creditTarget = computed(() => 12)
const newCommitments = computed(() => 20282018)
const commitmentsTarget = computed(() => 10062500)
const riskReviewsPending = computed(() => relationshipManagers.value.reduce((sum, rm) => sum + rm.pendingReviews, 0))

// Opportunities metrics
const newDepositVolume = computed(() => 1232264)
const depositTarget = computed(() => 5366669)
const incrementalTMSRevenue = computed(() => 92659)
const tmsTarget = computed(() => 54292)
// totalReferrals defined above with RM-based calculation
const retailReferrals = computed(() => 1)
const wealthReferrals = computed(() => 2)

// Risk Metrics
const riskMetrics = computed(() => ({
  totalRiskFlags: relationshipManagers.value.reduce((sum, rm) => sum + rm.riskFlags, 0),
  pending: relationshipManagers.value.reduce((sum, rm) => sum + rm.pendingReviews, 0),
  reviewedWithAction: 28, // mock
  reviewedWithoutAction: 15, // mock
  avgTimeToClose: 22
}))

// Chart data
const regionalPortfolioChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  const datasets = [
    {
      label: 'Deposits',
      data: labels.map(() => Math.floor(totalDeposits.value / 12 * (0.8 + Math.random() * 0.4))),
      backgroundColor: '#10B981'
    },
    {
      label: 'Loans',
      data: labels.map(() => -Math.floor(totalLoanCommitments.value / 12 * (0.8 + Math.random() * 0.4))),
      backgroundColor: '#EF4444'
    }
  ]

  return { labels, datasets }
})

const regionalPortfolioChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: function (value) {
          return `$${Math.abs(value / 1e6).toFixed(0)}M`;
        }
      }
    }
  }
}

const revenueByRMChartData = computed(() => ({
  labels: relationshipManagers.value.map(rm => rm.name),
  datasets: [{
    label: 'YTD Revenue',
    data: relationshipManagers.value.map(rm => rm.revenue),
    backgroundColor: '#10B981'
  }]
}))

const revenueByRMChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        callback: function (value) {
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    }
  }
}

// Helper methods
const getUtilizationColor = (utilization) => {
  if (utilization > 85) return 'text-red-600'
  if (utilization > 70) return 'text-yellow-600'
  return 'text-green-600'
}

const getRiskScoreColor = (score) => {
  if (score > 7) return 'bg-red-100 text-red-800'
  if (score > 5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getRMOpportunityCount = (rm) => rm.opportunityCount || 0
const getRMOpportunityValue = (rm) => rm.opportunityValue || 0
const getRMConversionRate = (rm) => rm.conversionRate || 0

// Methods
const exportData = () => {
  console.log('Exporting regional data...')
}

const sortTable = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const drillDownToRM = (rm) => {
  console.log('Navigating to RM:', rm.id)
  // Use full hierarchy if available, otherwise simplified
  const market = marketData.value
  const metro = metroData.value

  if (metro && market) {
    router.push({
      name: 'LegacyRM',
      params: {
        metroId: metro.id,
        marketId: market.id,
        regionId: props.regionId,
        rmId: rm.id
      }
    })
  } else {
    router.push({
      name: 'RelationshipManager',
      params: {
        regionId: props.regionId,
        rmId: rm.id
      }
    })
  }
}

const navigateHome = () => {
  router.push('/')
}

// RM Performance calculation helpers
const getRiskFlagColor = (riskFlags) => {
  if (riskFlags === 0) return 'bg-green-100 text-green-800'
  if (riskFlags <= 2) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const calculateRMTargetAchievement = (rm) => {
  const revenueTarget = rm.revenueTarget || 8500000 // Default ~8.5M per RM
  const commitmentTarget = rm.commitmentTarget || 5000000
  const depositTarget = rm.depositTarget || 3000000
  const creditTarget = rm.creditTarget || 8
  const referralTarget = rm.referralTarget || 12
  
  const revenueAchievement = ((rm.revenue || 0) / revenueTarget) * 100
  const commitmentAchievement = ((rm.netNewCommitments || 0) / commitmentTarget) * 100
  const depositAchievement = ((rm.netNewDeposits || 0) / depositTarget) * 100
  const creditAchievement = ((rm.newCreditRelationships || 0) / creditTarget) * 100
  const referralAchievement = ((rm.referrals || 0) / referralTarget) * 100
  
  // Weighted average: Revenue 40%, Commitments 20%, Deposits 20%, Credit 10%, Referrals 10%
  return Math.round(
    (revenueAchievement * 0.4) + 
    (commitmentAchievement * 0.2) + 
    (depositAchievement * 0.2) + 
    (creditAchievement * 0.1) + 
    (referralAchievement * 0.1)
  )
}

// Enhanced RM data with performance calculations
const enhancedRMData = computed(() => {
  return regionRMs.value.map(rm => ({
    ...rm,
    // Add individual target data for each RM
    revenueTarget: rm.revenueTarget || 8500000, // ~$8.5M per RM
    netNewCommitments: rm.netNewCommitments || Math.floor(Math.random() * 6000000) + 2000000, // $2M-8M
    commitmentTarget: rm.commitmentTarget || 5000000, // $5M target
    netNewDeposits: rm.netNewDeposits || Math.floor(Math.random() * 4000000) + 1000000, // $1M-5M
    depositTarget: rm.depositTarget || 3000000, // $3M target
    newCreditRelationships: rm.newCreditRelationships || Math.floor(Math.random() * 12) + 2, // 2-14
    creditTarget: rm.creditTarget || 8, // 8 new relationships target
    referrals: rm.referrals || Math.floor(Math.random() * 20) + 5, // 5-25
    referralTarget: rm.referralTarget || 12, // 12 referrals target
    riskFlags: rm.riskFlags || Math.floor(Math.random() * 5), // 0-4 risk flags
    targetAchievement: 0 // Will be calculated below
  })).map(rm => ({
    ...rm,
    targetAchievement: calculateRMTargetAchievement(rm)
  }))
})

// Sorted RMs by performance for table display
const sortedRMsByPerformance = computed(() => {
  let sortedData = [...enhancedRMData.value]
  
  if (sortField.value) {
    sortedData.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]
      
      // Handle string sorting
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  } else {
    // Default sort by target achievement descending
    sortedData.sort((a, b) => b.targetAchievement - a.targetAchievement)
  }
  
  return sortedData
})

// Regional totals for portfolio row
const totalRiskFlags = computed(() => {
  return enhancedRMData.value.reduce((sum, rm) => sum + (rm.riskFlags || 0), 0)
})

// Regional Performance Score Dashboard computed properties
const regionalPerformanceMetrics = computed(() => {
  // Aggregate targets from all RMs for more accurate regional targets
  const totalRevenueTarget = enhancedRMData.value.reduce((sum, rm) => sum + rm.revenueTarget, 0)
  const totalCommitmentTarget = enhancedRMData.value.reduce((sum, rm) => sum + rm.commitmentTarget, 0)
  const totalDepositTarget = enhancedRMData.value.reduce((sum, rm) => sum + rm.depositTarget, 0)
  const totalCreditTarget = enhancedRMData.value.reduce((sum, rm) => sum + rm.creditTarget, 0)
  const totalReferralTargetSum = enhancedRMData.value.reduce((sum, rm) => sum + rm.referralTarget, 0)
  
  // Aggregate actuals from all RMs
  const totalCommitmentActual = enhancedRMData.value.reduce((sum, rm) => sum + (rm.netNewCommitments || 0), 0)
  const totalDepositActual = enhancedRMData.value.reduce((sum, rm) => sum + (rm.netNewDeposits || 0), 0)
  const totalCreditActual = enhancedRMData.value.reduce((sum, rm) => sum + (rm.newCreditRelationships || 0), 0)
  const totalReferralActual = enhancedRMData.value.reduce((sum, rm) => sum + (rm.referrals || 0), 0)
  
  return {
    revenueFYTD: {
      actual: totalRevenue.value,
      target: totalRevenueTarget,
      achieved: totalRevenue.value >= totalRevenueTarget,
      achievementPercent: Math.round((totalRevenue.value / totalRevenueTarget) * 100)
    },
    netNewCommitments: {
      actual: totalCommitmentActual,
      target: totalCommitmentTarget,
      achieved: totalCommitmentActual >= totalCommitmentTarget,
      achievementPercent: Math.round((totalCommitmentActual / totalCommitmentTarget) * 100)
    },
    netNewDeposits: {
      actual: totalDepositActual,
      target: totalDepositTarget,
      achieved: totalDepositActual >= totalDepositTarget,
      achievementPercent: Math.round((totalDepositActual / totalDepositTarget) * 100)
    },
    netNewCreditRelationships: {
      actual: totalCreditActual,
      target: totalCreditTarget,
      achieved: totalCreditActual >= totalCreditTarget,
      achievementPercent: Math.round((totalCreditActual / totalCreditTarget) * 100)
    },
    referrals: {
      actual: totalReferralActual,
      target: totalReferralTargetSum,
      achieved: totalReferralActual >= totalReferralTargetSum,
      achievementPercent: Math.round((totalReferralActual / totalReferralTargetSum) * 100)
    }
  }
})

const overallRegionalPerformanceScore = computed(() => {
  const metrics = regionalPerformanceMetrics.value
  const scores = [
    metrics.revenueFYTD.achievementPercent,
    metrics.netNewCommitments.achievementPercent,
    metrics.netNewDeposits.achievementPercent,
    metrics.netNewCreditRelationships.achievementPercent,
    metrics.referrals.achievementPercent
  ]
  return Math.round(scores.reduce((sum, score) => sum + Math.min(score, 100), 0) / 5)
})

const regionalPerformanceTargetsAchieved = computed(() => {
  const metrics = regionalPerformanceMetrics.value
  return [
    metrics.revenueFYTD.achieved,
    metrics.netNewCommitments.achieved,
    metrics.netNewDeposits.achieved,
    metrics.netNewCreditRelationships.achieved,
    metrics.referrals.achieved
  ].filter(Boolean).length
})

const nextRegionalPerformanceReview = computed(() => 'Feb 28, 2025')

// Modal computed properties
const sortedRMsByRevenue = computed(() => {
  return [...enhancedRMData.value].sort((a, b) => b.revenue - a.revenue)
})

const revenueChartData = computed(() => {
  const labels = ['Q1', 'Q2', 'Q3', 'Q4']
  const currentQ = Math.ceil(new Date().getMonth() / 3)
  
  return {
    labels,
    datasets: [{
      label: 'Actual Revenue',
      data: labels.map((_, i) => i < currentQ ? Math.random() * 10000000 + 8000000 : 0),
      backgroundColor: 'rgba(6, 182, 212, 0.8)',
      borderColor: 'rgba(6, 182, 212, 1)',
      borderWidth: 1
    }, {
      label: 'Target Revenue',
      data: labels.map(() => 8750000),
      backgroundColor: 'rgba(156, 163, 175, 0.3)',
      borderColor: 'rgba(156, 163, 175, 1)',
      borderWidth: 1,
      type: 'line'
    }]
  }
})

const revenueChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return context.dataset.label + ': $' + context.parsed.y.toLocaleString()
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => '$' + (value / 1000000).toFixed(1) + 'M'
      }
    }
  }
}))

// Deposits modal computed properties
const depositsChartData = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  
  return {
    labels: months,
    datasets: [{
      label: 'Deposits',
      data: months.map(() => Math.random() * 500000000 + 1500000000),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1
    }]
  }
})

const depositsChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return '$' + (context.parsed.y / 1000000).toFixed(1) + 'M'
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => '$' + (value / 1000000000).toFixed(1) + 'B'
      }
    }
  }
}))

// Export functions
const exportRevenueData = () => {
  console.log('Exporting revenue data...')
  // Implementation for CSV export
}

const exportDepositsData = () => {
  console.log('Exporting deposits data...')
  // Implementation for CSV export
}

// Legacy computed properties for compatibility
const region = computed(() => getRegionById(props.regionId))
const market = computed(() => getMarketById(props.marketId))
const metro = computed(() => getMetroById(props.metroId))
const regionRMs = computed(() => getRMsByRegion(props.regionId))

// Lifecycle
onMounted(() => {
  console.log('RegionView mounted for region:', props.regionId)
  console.log('RVP (Regional VP):', regionData.value.vpName)
  console.log('Total RMs:', totalRMs.value)
})
</script>