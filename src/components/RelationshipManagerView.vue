<template>
  <div class="min-h-screen bg-gray-50">
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
                  <li>
                    <router-link :to="getRegionPath()" class="hover:text-gray-700">{{ regionName }}</router-link>
                  </li>
                  <li><span class="mx-2">›</span></li>
                  <li><span class="font-medium text-gray-700">{{ rmData.name }}</span></li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button @click="exportData"
              class="px-4 py-2 bg-td-green text-white rounded-lg hover:bg-green-600 transition-colors">
              Export CSV / PPTX
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
        <!-- RM Summary Banner -->
        <div class="mt-6 bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
          <div>
            <div class="text-lg font-semibold text-gray-900">{{ rmData.name }}</div>
            <div class="text-sm text-gray-600">Metro: <span class="font-medium">{{ metroName }}</span> | Market: <span
                class="font-medium">{{ marketName }}</span> | Region: <span class="font-medium">{{ regionName }}</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">Last Review: <span class="font-medium">{{ lastReviewDate }}</span>
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
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="grid grid-cols-7 gap-4">
          <!-- Revenue FYTD -->
          <div class="text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="showRevenueModal = true">
            <div class="text-xl font-bold text-cyan-600">{{ formatCurrency(totalRevenue) }}</div>
            <div class="text-xs text-gray-600">Revenue FYTD</div>
            <div class="text-xs font-medium mt-1" :class="revenueYoY >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% YoY
            </div>
          </div>

          <!-- Relationships -->
          <div class="text-center cursor-pointer hover:bg-gray-50 transition-colors"
            @click="showRelationshipsModal = true">
            <div class="text-xl font-bold text-blue-600">{{ totalRelationships }}</div>
            <div class="text-xs text-gray-600">Relationships</div>
            <div class="text-xs text-green-500 font-medium mt-1">+{{ relationshipsDelta }} new FYTD</div>
          </div>

          <!-- Deposits -->
          <div class="text-center cursor-pointer hover:bg-gray-50 transition-colors" @click="showDepositsModal = true">
            <div class="text-xl font-bold text-green-600">{{ formatCurrency(totalDeposits) }}</div>
            <div class="text-xs text-gray-600">Deposits</div>
            <div class="text-xs text-green-500 font-medium">{{ depositsGrowth }}% YoY</div>
            <div v-if="showNetNew" class="text-xs text-green-500 font-medium mt-1">+{{ formatCurrency(depositsDelta) }}
              since {{ netNewPeriod }}</div>
          </div>

          <!-- ROE -->
          <div class="text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="showROEModal = true">
            <div class="text-xl font-bold text-purple-600">{{ roe }}%</div>
            <div class="text-xs text-gray-600">ROE</div>
            <div class="text-xs font-medium mt-1" :class="roeChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ roeChange >= 0 ? '+' : '' }}{{ roeChange }}% vs peers
            </div>
          </div>

          <!-- Credit Commitments -->
          <div class="text-center border-r border-gray-200 pr-4 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="showCreditModal = true">
            <div class="text-xl font-bold text-orange-600">{{ formatCurrency(totalLoanCommitments) }}</div>
            <div class="text-xs text-gray-600">Credit Commitments</div>
            <div class="text-xs text-orange-500 font-medium">{{ loanUtilization }}% utilized</div>
            <div v-if="showNetNew" class="text-xs text-green-500 font-medium mt-1">+{{ formatCurrency(loanDelta) }}
              since {{ netNewPeriod }}</div>
          </div>

          <!-- Number of Referrals -->
          <div class="text-center border-r border-gray-100 pr-4 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="showReferralModal = true">
            <div class="text-xl font-bold text-indigo-600">{{ totalReferrals }}</div>
            <div class="text-xs text-gray-600">Referrals</div>
            <div class="text-xs text-indigo-500 font-medium">+{{ Math.max(0, totalReferrals - referralTarget) }} vs
              target</div>
          </div>

          <!-- Risk Reviews Pending -->
          <div class="text-center cursor-pointer hover:bg-gray-50 transition-colors" @click="showRiskModal = true">
            <div class="text-xl font-bold text-red-600 flex items-center justify-center">
              {{ riskReviewsPending }}
              <span v-if="riskReviewsPending > 10" class="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></span>
            </div>
            <div class="text-xs text-gray-600">Risk Reviews Pending</div>
            <div class="text-xs text-red-500 font-medium" v-if="riskReviewsPending > 10">Above threshold</div>
          </div>
        </div>
      </div>
    </div>

    <!-- YTD Performance Score Dashboard -->
    <div class="px-8 py-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
      <h4 class="font-medium text-purple-900 mb-4">🎯 YTD Performance Score Dashboard</h4>
      <div class="grid grid-cols-5 gap-4 mb-4">
        <!-- Revenue FYTD -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ formatCurrency(performanceMetrics.revenueFYTD.actual) }}</div>
            <div class="ml-2">
              <svg v-if="performanceMetrics.revenueFYTD.achieved" class="w-5 h-5 text-green-500" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Revenue FYTD</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ formatCurrency(performanceMetrics.revenueFYTD.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-cyan-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, performanceMetrics.revenueFYTD.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="performanceMetrics.revenueFYTD.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ performanceMetrics.revenueFYTD.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Net New Deposits -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{
              formatCurrency(performanceMetrics.netNewDeposits.actual) }}</div>
            <div class="ml-2">
              <svg v-if="performanceMetrics.netNewDeposits.achieved" class="w-5 h-5 text-green-500" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Net New Deposits</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{
            formatCurrency(performanceMetrics.netNewDeposits.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, performanceMetrics.netNewDeposits.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="performanceMetrics.netNewDeposits.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ performanceMetrics.netNewDeposits.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Net New Commitments -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{
              formatCurrency(performanceMetrics.netNewCommitments.actual) }}</div>
            <div class="ml-2">
              <svg v-if="performanceMetrics.netNewCommitments.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Net New Commitments</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{
            formatCurrency(performanceMetrics.netNewCommitments.target) }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, performanceMetrics.netNewCommitments.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="performanceMetrics.netNewCommitments.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ performanceMetrics.netNewCommitments.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Net New Credit Relationships -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ performanceMetrics.netNewCreditRelationships.actual }}
            </div>
            <div class="ml-2">
              <svg v-if="performanceMetrics.netNewCreditRelationships.achieved" class="w-5 h-5 text-green-500"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">New Credit Relationships</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ performanceMetrics.netNewCreditRelationships.target }}
          </div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, performanceMetrics.netNewCreditRelationships.achievementPercent)}%`">
              </div>
            </div>
            <div class="text-xs mt-1"
              :class="performanceMetrics.netNewCreditRelationships.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ performanceMetrics.netNewCreditRelationships.achievementPercent }}% of target
            </div>
          </div>
        </div>

        <!-- Referrals -->
        <div class="bg-white p-4 rounded-lg border border-purple-200 text-center">
          <div class="flex items-center justify-center mb-2">
            <div class="text-lg font-bold text-purple-600">{{ performanceMetrics.referrals.actual }}</div>
            <div class="ml-2">
              <svg v-if="performanceMetrics.referrals.achieved" class="w-5 h-5 text-green-500" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600">Referrals</div>
          <div class="text-xs text-gray-500 mt-1">Target: {{ performanceMetrics.referrals.target }}</div>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-500 h-2 rounded-full"
                :style="`width: ${Math.min(100, performanceMetrics.referrals.achievementPercent)}%`"></div>
            </div>
            <div class="text-xs mt-1"
              :class="performanceMetrics.referrals.achieved ? 'text-green-600' : 'text-orange-600'">
              {{ performanceMetrics.referrals.achievementPercent }}% of target
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Performance Summary -->
      <div class="bg-white p-4 rounded-lg border border-purple-200">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-medium text-gray-900">Overall YTD Performance Score</h5>
          <div class="flex items-center">
            <span class="text-2xl font-bold"
              :class="overallPerformanceScore >= 75 ? 'text-green-600' : overallPerformanceScore >= 50 ? 'text-yellow-600' : 'text-red-600'">
              {{ overallPerformanceScore }}%
            </span>
            <div class="ml-2">
              <span v-if="overallPerformanceScore >= 75"
                class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Excellent</span>
              <span v-else-if="overallPerformanceScore >= 50"
                class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Good</span>
              <span v-else class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Needs Improvement</span>
            </div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div class="h-3 rounded-full"
            :class="overallPerformanceScore >= 75 ? 'bg-green-500' : overallPerformanceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
            :style="`width: ${overallPerformanceScore}%`"></div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-gray-600">Targets Achieved:</span>
            <span class="font-medium text-green-600 ml-2">{{ performanceTargetsAchieved }}/4</span>
          </div>
          <div>
            <span class="text-gray-600">Next Review:</span>
            <span class="font-medium text-gray-900 ml-2">{{ nextPerformanceReview }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Summary Statistics Table -->
    <div class="px-8 py-6 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-xl font-semibold text-gray-900">📊 Relationships Summary</h4>
        <div class="flex items-center space-x-4">
          <!-- Comparison Toggle -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              @click="comparisonMode = 'target'"
              :class="comparisonMode === 'target' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'"
              class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            >
              vs Target
            </button>
            <button 
              @click="comparisonMode = 'yoy'"
              :class="comparisonMode === 'yoy' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'"
              class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            >
              vs YoY
            </button>
          </div>
          <!-- Export Button -->
          <button @click="exportSummaryData" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Export CSV
          </button>
        </div>
      </div>

      <!-- Enhanced KPI Summary Table -->
      <div class="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Relationship</th>
              <th class="text-right py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Revenue FYTD</th>
              <th class="text-right py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Net New Commitments</th>
              <th class="text-right py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Net New Deposits</th>
              <th class="text-right py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">New Credit Relationships</th>
              <th class="text-center py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Opportunities</th>
              <th class="text-center py-3 px-4 font-medium text-gray-900 text-xs uppercase tracking-wider">Risk Flags</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <!-- Individual Relationships -->
            <tr v-for="relationship in sortedRelationships" :key="relationship.id" 
                class="hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                @click="viewRelationshipDetail(relationship)">
              <!-- Relationship Name -->
              <td class="py-3 px-4">
                <div class="font-medium text-gray-900 text-sm">{{ relationship.name }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ relationship.type }} • {{ relationship.industry }}</div>
              </td>

              <!-- Revenue FYTD -->
              <td class="text-right py-3 px-4">
                <div class="text-gray-900 font-medium text-sm">{{ formatCurrency(relationship.revenue) }}</div>
              </td>

              <!-- Net New Commitments -->
              <td class="text-right py-3 px-4">
                <div class="text-gray-900 font-medium text-sm">{{ formatCurrency(relationship.netNewCommitments || relationship.loans * 0.3) }}</div>
              </td>

              <!-- Net New Deposits -->
              <td class="text-right py-3 px-4">
                <div class="text-gray-900 font-medium text-sm">{{ formatCurrency(relationship.netNewDeposits || relationship.deposits * 0.2) }}</div>
              </td>

              <!-- New Credit Relationships -->
              <td class="text-right py-3 px-4">
                <div class="text-gray-900 font-medium text-sm">{{ relationship.newCreditRelationship }}</div>
              </td>

              <!-- Opportunities -->
              <td class="text-center py-3 px-4">
                <div class="text-gray-900 font-bold text-sm">{{ relationship.opportunities }}</div>
                <div class="text-xs text-green-600 font-medium">{{ formatCurrency(relationship.totalPotentialValue) }}</div>
              </td>

              <!-- Risk Flags -->
              <td class="text-center py-3 px-4">
                <div class="flex items-center justify-center">
                  <span v-if="relationship.riskFlags && relationship.riskFlags.length > 0" 
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getRelationshipRiskClass(relationship.riskFlags)">
                    {{ relationship.riskFlags.length }}
                  </span>
                  <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>
                </div>
                <div v-if="relationship.pendingReviews > 0" class="text-xs text-orange-600 mt-1">
                  {{ relationship.pendingReviews }} pending
                </div>
              </td>
            </tr>
            
            <!-- Total Row -->
            <tr class="border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold">
              <td class="py-4 px-4 text-gray-900">
                <div class="font-bold text-base">Portfolio Totals</div>
                <div class="text-xs font-medium text-gray-600 mt-1">{{ totalRelationships }} relationships</div>
              </td>
              
              <!-- Revenue FYTD Total -->
              <td class="text-right py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ formatCurrency(totalRevenue) }}</div>
                <div v-if="comparisonMode === 'target'" class="text-xs font-medium mt-1"
                     :class="getPerformanceClass(totalRevenue, 15000000)">
                  {{ Math.round((totalRevenue / 15000000) * 100) }}% of target
                </div>
                <div v-else class="text-xs font-medium mt-1"
                     :class="getGrowthClass(revenueYoY)">
                  {{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% YoY
                </div>
              </td>
              
              <!-- Net New Commitments Total -->
              <td class="text-right py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ formatCurrency(performanceMetrics.netNewCommitments.actual) }}</div>
                <div v-if="comparisonMode === 'target'" class="text-xs font-medium mt-1"
                     :class="getPerformanceClass(performanceMetrics.netNewCommitments.actual, performanceMetrics.netNewCommitments.target)">
                  {{ performanceMetrics.netNewCommitments.achievementPercent }}% of target
                </div>
                <div v-else class="text-xs font-medium mt-1 text-green-600">
                  +23% YoY
                </div>
              </td>
              
              <!-- Net New Deposits Total -->
              <td class="text-right py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ formatCurrency(performanceMetrics.netNewDeposits.actual) }}</div>
                <div v-if="comparisonMode === 'target'" class="text-xs font-medium mt-1"
                     :class="getPerformanceClass(performanceMetrics.netNewDeposits.actual, performanceMetrics.netNewDeposits.target)">
                  {{ performanceMetrics.netNewDeposits.achievementPercent }}% of target
                </div>
                <div v-else class="text-xs font-medium mt-1 text-green-600">
                  +25% YoY
                </div>
              </td>
              
              <!-- New Credit Relationships Total -->
              <td class="text-right py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ performanceMetrics.netNewCreditRelationships.actual }}</div>
                <div v-if="comparisonMode === 'target'" class="text-xs font-medium mt-1"
                     :class="getPerformanceClass(performanceMetrics.netNewCreditRelationships.actual, performanceMetrics.netNewCreditRelationships.target)">
                  {{ performanceMetrics.netNewCreditRelationships.achievementPercent }}% of target
                </div>
                <div v-else class="text-xs font-medium mt-1 text-yellow-600">
                  -30% YoY
                </div>
              </td>
              
              <!-- Opportunities Total -->
              <td class="text-center py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ totalOpportunities }}</div>
                <div class="text-xs font-medium text-green-600 mt-1">{{ formatCurrency(totalPotentialValue) }}</div>
              </td>
              
              <!-- Risk Flags Total -->
              <td class="text-center py-4 px-4 text-gray-900">
                <div class="font-bold text-sm">{{ totalRiskFlags }}</div>
                <div class="text-xs font-medium text-gray-600 mt-1">{{ totalPendingReviews }} pending</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Main Content -->

  </div>

  <!-- Alerts Modal -->
  <div v-if="showAlertsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">⚠️</span>
          <h3 class="text-xl font-bold text-gray-900">Client Alerts - Johnson Holdings Group</h3>
        </div>
        <button @click="showAlertsModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Alert Summary -->
      <div class="mb-6 text-gray-700">
        <span class="font-medium">{{ totalActiveAlerts }} active alerts requiring attention</span>
      </div>

      <!-- Alert Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8" aria-label="Alert Tabs">
          <button v-for="tab in alertTabs" :key="tab.id" @click="activeAlertTab = tab.id" :class="['flex items-center space-x-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium',
            activeAlertTab === tab.id
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
            <span :class="tab.iconClass">{{ tab.icon }}</span>
            <span>{{ tab.name }}</span>
            <span v-if="tab.count > 0" :class="['ml-2 px-2 py-0.5 text-xs font-bold rounded-full', tab.badgeClass]">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Alert Content -->
      <div class="space-y-6">
        <!-- Loan Delinquency Tab -->
        <div v-if="activeAlertTab === 'delinquency'" class="space-y-4">
          <div v-for="alert in delinquencyAlerts" :key="alert.id"
            class="bg-red-50 border border-red-200 rounded-lg p-6">
            <!-- Alert Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRiskLevelClass(alert.riskLevel)">
                    {{ alert.riskLevel }}
                  </span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-red-900">{{ alert.loanType }}</h4>
                  <p class="text-sm text-red-700">{{ alert.daysOverdue }} days past due</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="reviewAlert(alert)"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Review Now
                </button>
                <button @click="scheduleCall(alert)"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Schedule Call
                </button>
              </div>
            </div>

            <!-- Alert Details Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <div>
                <div class="text-sm font-medium text-gray-700">Account:</div>
                <div class="text-sm text-gray-900 font-mono">{{ alert.accountNumber }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Amount Due:</div>
                <div class="text-lg font-bold text-red-600">{{ formatCurrency(alert.amountDue) }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Last Payment:</div>
                <div class="text-sm text-gray-900">{{ alert.lastPayment }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Client:</div>
                <div class="text-sm text-gray-900">{{ alert.clientName }}</div>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="bg-white rounded-lg p-4 border border-red-200">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm font-medium text-gray-700">Total Outstanding:</div>
                  <div class="text-lg font-bold text-red-600">{{ formatCurrency(alert.totalOutstanding) }}</div>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-700">Original Amount:</div>
                  <div class="text-lg font-bold text-gray-900">{{ formatCurrency(alert.originalAmount) }}</div>
                </div>
              </div>
            </div>

            <!-- Risk Analysis -->
            <div class="mt-4 bg-white rounded-lg p-4 border border-red-200">
              <h5 class="font-medium text-gray-900 mb-2">Risk Analysis</h5>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Payment History Score:</span>
                  <span :class="getScoreColor(alert.paymentHistoryScore)">{{ alert.paymentHistoryScore }}/100</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Covenant Compliance:</span>
                  <span :class="alert.covenantCompliance ? 'text-green-600' : 'text-red-600'">
                    {{ alert.covenantCompliance ? 'Compliant' : 'Non-Compliant' }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Estimated Recovery:</span>
                  <span class="text-gray-900">{{ alert.estimatedRecovery }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overdraft Tab -->
        <div v-if="activeAlertTab === 'overdraft'" class="space-y-4">
          <div v-for="alert in overdraftAlerts" :key="alert.id"
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <!-- Alert Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRiskLevelClass(alert.riskLevel)">
                    {{ alert.riskLevel }}
                  </span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-yellow-900">{{ alert.accountType }}</h4>
                  <p class="text-sm text-yellow-700">Overdraft limit exceeded</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="reviewAlert(alert)"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                  Review Now
                </button>
                <button @click="scheduleCall(alert)"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Schedule Call
                </button>
              </div>
            </div>

            <!-- Alert Details Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <div>
                <div class="text-sm font-medium text-gray-700">Account:</div>
                <div class="text-sm text-gray-900 font-mono">{{ alert.accountNumber }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Overdraft Amount:</div>
                <div class="text-lg font-bold text-yellow-600">{{ formatCurrency(alert.overdraftAmount) }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Limit:</div>
                <div class="text-sm text-gray-900">{{ formatCurrency(alert.overdraftLimit) }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Days Overdrawn:</div>
                <div class="text-sm text-gray-900">{{ alert.daysOverdrawn }}</div>
              </div>
            </div>

            <!-- Account Activity -->
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <h5 class="font-medium text-gray-900 mb-2">Recent Activity</h5>
              <div class="space-y-2">
                <div v-for="transaction in alert.recentTransactions" :key="transaction.id"
                  class="flex justify-between text-sm">
                  <span class="text-gray-600">{{ transaction.date }} - {{ transaction.description }}</span>
                  <span :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Alerts Tab -->
        <div v-if="activeAlertTab === 'other'" class="space-y-4">
          <div v-for="alert in otherAlerts" :key="alert.id" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <!-- Alert Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getRiskLevelClass(alert.riskLevel)">
                    {{ alert.riskLevel }}
                  </span>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-blue-900">{{ alert.alertType }}</h4>
                  <p class="text-sm text-blue-700">{{ alert.description }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="reviewAlert(alert)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Review Now
                </button>
                <button @click="scheduleCall(alert)"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Schedule Call
                </button>
              </div>
            </div>

            <!-- Alert Details -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
              <div>
                <div class="text-sm font-medium text-gray-700">Priority:</div>
                <div class="text-sm font-semibold" :class="getPriorityColor(alert.priority)">{{ alert.priority }}
                </div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Date Created:</div>
                <div class="text-sm text-gray-900">{{ alert.dateCreated }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">Due Date:</div>
                <div class="text-sm text-gray-900">{{ alert.dueDate }}</div>
              </div>
            </div>

            <!-- Additional Details -->
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <h5 class="font-medium text-gray-900 mb-2">Details</h5>
              <p class="text-sm text-gray-700">{{ alert.details }}</p>
              <div v-if="alert.recommendations" class="mt-3">
                <h6 class="text-sm font-medium text-gray-900 mb-1">Recommended Actions:</h6>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li v-for="rec in alert.recommendations" :key="rec" class="flex items-start">
                    <span class="text-blue-500 mr-2">•</span>
                    <span>{{ rec }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
        <div class="flex space-x-3">
          <button @click="markAllAsReviewed"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Mark All as Reviewed
          </button>
          <button @click="exportAlertReport"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Export Report
          </button>
        </div>
        <button @click="showAlertsModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Revenue Modal -->
  <div v-if="showRevenueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">💰 Revenue Analytics Command Center</h3>
        <button @click="showRevenueModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Revenue Performance Overview -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-cyan-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-cyan-600">{{ formatCurrency(totalRevenue) }}</div>
          <div class="text-sm text-gray-600">Total Revenue FYTD</div>
          <div class="text-xs font-medium mt-1" :class="revenueYoY >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ revenueYoY >= 0 ? '+' : '' }}{{ revenueYoY }}% YoY
          </div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(Math.round(totalRevenue /
            totalRelationships)) }}</div>
          <div class="text-sm text-gray-600">Revenue per Relationship</div>
          <div class="text-xs text-green-500 font-medium">+12% vs peers</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ Math.round((totalRevenue * 0.32 / totalRevenue) * 100)
          }}%
          </div>
          <div class="text-sm text-gray-600">Revenue Concentration</div>
          <div class="text-xs text-gray-500">Top 3 relationships</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">🥇 #2</div>
          <div class="text-sm text-gray-600">Regional Ranking</div>
          <div class="text-xs text-green-500">of 12 RMs</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Trends Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📈 24-Month Revenue Trends</h4>
          <div class="h-64 mb-4">
            <LineChart v-if="enhanced24MonthRevenueData" :data="enhanced24MonthRevenueData"
              :options="enhanced24MonthRevenueOptions" />
          </div>
          <!-- Seasonality Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Seasonal Patterns</h5>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-600">Peak Quarter:</span>
                <span class="font-medium text-green-600 ml-1">Q4 (+18%)</span>
              </div>
              <div>
                <span class="text-gray-600">Low Quarter:</span>
                <span class="font-medium text-orange-600 ml-1">Q1 (-8%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Composition Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">🎯 Revenue by Product Type</h4>
          <div class="h-64 mb-4">
            <DoughnutChart v-if="revenueCompositionData" :data="revenueCompositionData"
              :options="revenueCompositionOptions" />
          </div>
          <!-- Product Performance -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Product Performance</h5>
            <div class="space-y-1">
              <div v-for="product in topRevenueProducts" :key="product.name" class="flex justify-between text-xs">
                <span class="text-gray-600">{{ product.name }}:</span>
                <span class="font-medium" :class="product.growth >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Revenue Breakdown Table -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">📊 Detailed Revenue Analysis by Relationship</h4>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue FYTD
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Fee
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TMS Fee
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposit NII
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan NII
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YoY Growth %
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Share
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peer Rank
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rel, index) in enhancedRevenueAnalysis" :key="rel.id"
                class="hover:bg-green-50 cursor-pointer transition-colors" @click="drillDownToRelationship(rel)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">{{ rel.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ rel.name }}</div>
                      <div class="text-xs text-gray-500">{{ rel.industry }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-cyan-600">
                  {{ formatCurrency(rel.totalRevenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rel.loanFee) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rel.tmsFee) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rel.depositNII) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rel.loanNII) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="font-medium" :class="rel.yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ rel.yoyGrowth >= 0 ? '+' : '' }}{{ rel.yoyGrowth }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {{ rel.marketShare }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'">
                    #{{ index + 1 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Regional RM Performance Comparison -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">🏆 Regional RM Revenue Ranking & Benchmarking</h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Ranking Table -->
          <div class="bg-white rounded border">
            <div class="p-3 border-b border-gray-200">
              <h5 class="text-sm font-medium text-gray-900">Revenue Performance Ranking</h5>
            </div>
            <div class="p-3">
              <div class="space-y-2">
                <div v-for="(rm, index) in regionalRMRanking" :key="rm.name"
                  class="flex justify-between items-center p-2 rounded"
                  :class="rm.isYou ? 'bg-cyan-100' : 'bg-gray-50'">
                  <div class="flex items-center">
                    <span class="text-sm font-medium mr-2">{{ index + 1 }}.</span>
                    <span class="text-sm" :class="rm.isYou ? 'font-bold text-cyan-700' : 'text-gray-900'">
                      {{ rm.name }}{{ rm.isYou ? ' (You)' : '' }}
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium">{{ formatCurrency(rm.revenue) }}</div>
                    <div class="text-xs text-gray-500">{{ rm.relationships }} rels</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-white rounded border">
            <div class="p-3 border-b border-gray-200">
              <h5 class="text-sm font-medium text-gray-900">Performance vs Peers</h5>
            </div>
            <div class="p-3 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Revenue per Relationship:</span>
                <span class="text-sm font-medium text-green-600">+12% above avg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Revenue Growth YoY:</span>
                <span class="text-sm font-medium text-green-600">+{{ revenueYoY }}% vs +8% avg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Product Diversification:</span>
                <span class="text-sm font-medium text-green-600">4.2 vs 3.1 avg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Client Retention Rate:</span>
                <span class="text-sm font-medium text-green-600">96% vs 92% avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Practice Insights -->
      <div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-3">💡 Revenue Optimization Insights</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Top Opportunities</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• TechCorp Industries: +$450K potential from treasury expansion</li>
              <li>• Johnson Holdings: +$320K from FX services cross-sell</li>
              <li>• Global Retail: +$280K from lending restructure</li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Best Practices from Top Performers</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Focus on treasury solutions for tech sector clients</li>
              <li>• Quarterly business reviews drive 23% higher revenue</li>
              <li>• Cross-selling ratio of 3.5+ products per relationship</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="showRevenueModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Relationships Modal -->
  <div v-if="showRelationshipsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">👥 Relationship Portfolio Analytics</h3>
        <button @click="showRelationshipsModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Relationship Portfolio Overview -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalRelationships }}</div>
          <div class="text-sm text-gray-600">Total Relationships</div>
          <div class="text-xs text-green-500 font-medium">+{{ relationshipsDelta }} FYTD</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ Math.round(totalRelationships * 0.87) }}</div>
          <div class="text-sm text-gray-600">Credit Relationships</div>
          <div class="text-xs text-green-500 font-medium">87% penetration</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(Math.round(totalRevenue /
            totalRelationships)) }}</div>
          <div class="text-sm text-gray-600">Avg Revenue per Rel</div>
          <div class="text-xs text-green-500 font-medium">+12% vs peers</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-600">96%</div>
          <div class="text-sm text-gray-600">Retention Rate</div>
          <div class="text-xs text-green-500 font-medium">+4% vs peers</div>
        </div>
      </div>



      <!-- Detailed Relationship Performance Table -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">📈 Detailed Relationship Performance & Rankings</h4>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue per Rel
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Penetration
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposit & Loan
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Trend
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peer Rank
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rel, index) in enhancedRelationshipAnalysis" :key="rel.id"
                class="hover:bg-blue-50 cursor-pointer transition-colors" @click="drillDownToRelationship(rel)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">{{ rel.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ rel.name }}</div>
                      <div class="text-xs text-gray-500">{{ rel.industry }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                  {{ formatCurrency(rel.revenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="font-medium text-purple-600">{{ rel.productPenetration }}/6</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Deposit & Loan
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="font-medium" :class="rel.growthTrend >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ rel.growthTrend >= 0 ? '+' : '' }}{{ rel.growthTrend }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'">
                    #{{ index + 1 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Regional Performance Comparison -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">🏆 Regional RM Relationship Performance Ranking</h4>
        <div class="grid grid-cols-1 gap-4">
          <!-- Relationship Count Ranking -->
          <div class="bg-white rounded border">
            <div class="p-3 border-b border-gray-200">
              <h5 class="text-sm font-medium text-gray-900">Total Relationships</h5>
            </div>
            <div class="p-3">
              <div class="space-y-2">
                <div v-for="(rm, index) in relationshipCountRanking" :key="rm.name"
                  class="flex justify-between items-center p-2 rounded"
                  :class="rm.isYou ? 'bg-blue-100' : 'bg-gray-50'">
                  <div class="flex items-center">
                    <span class="text-sm font-medium mr-2">{{ index + 1 }}.</span>
                    <span class="text-sm" :class="rm.isYou ? 'font-bold text-blue-700' : 'text-gray-900'">
                      {{ rm.name }}{{ rm.isYou ? ' (You)' : '' }}
                    </span>
                  </div>
                  <div class="text-sm font-medium">{{ rm.count }}</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- Best Practice Insights -->
      <div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-3">💡 Relationship Management Best Practices</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">High-Impact Actions</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Schedule quarterly business reviews with top 5 relationships</li>
              <li>• Increase touchpoints with TechCorp (last contact 8 days ago)</li>
              <li>• Introduce Global Retail to treasury team for cross-sell</li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Relationship Optimization</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Top performers average 2.8 meetings/month per relationship</li>
              <li>• 94% of high-growth relationships have 4+ product penetration</li>
              <li>• Executive-level contacts drive 35% higher revenue growth</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="showRelationshipsModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Deposits Modal -->
  <div v-if="showDepositsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">💰 Deposits Portfolio Analytics</h3>
        <button @click="showDepositsModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Deposits Performance Overview -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-green-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(totalDeposits) }}</div>
          <div class="text-sm text-gray-600">Total Deposits</div>
          <div class="text-xs font-medium mt-1" :class="depositsGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ depositsGrowth >= 0 ? '+' : '' }}{{ depositsGrowth }}% YoY
          </div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(Math.round(totalDeposits /
            totalRelationships)) }}</div>
          <div class="text-sm text-gray-600">Avg Deposits per Rel</div>
          <div class="text-xs text-green-500 font-medium">+18% vs peers</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">2.4%</div>
          <div class="text-sm text-gray-600">Avg Interest Rate</div>
          <div class="text-xs text-green-500 font-medium">Market competitive</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-orange-600">🥇 #1</div>
          <div class="text-sm text-gray-600">Regional Ranking</div>
          <div class="text-xs text-green-500">of 12 RMs</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Deposit Composition Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📊 Deposit Portfolio Composition</h4>
          <div class="h-64 mb-4">
            <DoughnutChart v-if="depositCompositionData" :data="depositCompositionData"
              :options="depositCompositionOptions" />
          </div>
          <!-- Composition Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Portfolio Balance</h5>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-gray-600">Operating Accounts:</span>
                <span class="font-medium text-blue-600 ml-1">42%</span>
              </div>
              <div>
                <span class="text-gray-600">Investment Accounts:</span>
                <span class="font-medium text-green-600 ml-1">35%</span>
              </div>
              <div>
                <span class="text-gray-600">Money Market:</span>
                <span class="font-medium text-purple-600 ml-1">18%</span>
              </div>
              <div>
                <span class="text-gray-600">Savings:</span>
                <span class="font-medium text-orange-600 ml-1">5%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Interest Rate Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📈 Interest Rate & Spread Analysis</h4>
          <div class="h-64 mb-4">
            <LineChart v-if="interestRateAnalysisData" :data="interestRateAnalysisData"
              :options="interestRateAnalysisOptions" />
          </div>
          <!-- Rate Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Rate Performance</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Avg Rate Paid:</span>
                <span class="font-medium text-blue-600">2.4%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Net Interest Margin:</span>
                <span class="font-medium text-green-600">3.2%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rate Sensitivity:</span>
                <span class="font-medium text-purple-600">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Deposits Analysis Table -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">📈 Detailed Deposits Analysis & Performance Rankings</h4>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Deposits
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth FYTD
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Interest Rate
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Types
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposit Stability
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peer Rank
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rel, index) in enhancedDepositsAnalysis" :key="rel.id"
                class="hover:bg-green-50 cursor-pointer transition-colors" @click="drillDownToRelationship(rel)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">{{ rel.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ rel.name }}</div>
                      <div class="text-xs text-gray-500">{{ rel.industry }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600">
                  {{ formatCurrency(rel.deposits) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="font-medium" :class="rel.depositsDelta >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ rel.depositsDelta >= 0 ? '+' : '' }}{{ formatCurrency(rel.depositsDelta) }}
                  </span>
                  <div class="text-xs text-gray-500">
                    {{ rel.depositGrowthPercent >= 0 ? '+' : '' }}{{ rel.depositGrowthPercent }}%
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="font-medium text-blue-600">{{ rel.avgInterestRate }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="font-medium text-purple-600">{{ rel.accountTypes }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getDepositStabilityClass(rel.depositStability)">
                    {{ rel.depositStability }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'">
                    #{{ index + 1 }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Deposit Trends Analysis -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">📈 24-Month Deposit Trends by Relationship</h4>
        <div class="h-64 mb-4">
          <BarChart v-if="enhanced24MonthDepositsData" :data="enhanced24MonthDepositsData"
            :options="enhanced24MonthDepositsOptions" />
        </div>
        <!-- Trend Insights -->
        <div class="bg-white p-3 rounded border">
          <h5 class="text-sm font-medium text-gray-900 mb-2">Trend Analysis</h5>
          <div class="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span class="text-gray-600">Strongest Growth:</span>
              <span class="font-medium text-green-600 ml-1">Johnson Holdings (+{{ Math.round(depositsGrowth * 1.2)
              }}%)</span>
            </div>
            <div>
              <span class="text-gray-600">Most Stable:</span>
              <span class="font-medium text-blue-600 ml-1">TechCorp Industries</span>
            </div>
            <div>
              <span class="text-gray-600">Seasonal Pattern:</span>
              <span class="font-medium text-purple-600 ml-1">Q4 peak (+15%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Regional Performance Comparison -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-3">🏆 Regional RM Deposits Performance Ranking</h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Deposits Ranking -->
          <div class="bg-white rounded border">
            <div class="p-3 border-b border-gray-200">
              <h5 class="text-sm font-medium text-gray-900">Total Deposits Ranking</h5>
            </div>
            <div class="p-3">
              <div class="space-y-2">
                <div v-for="(rm, index) in depositsRanking" :key="rm.name"
                  class="flex justify-between items-center p-2 rounded"
                  :class="rm.isYou ? 'bg-green-100' : 'bg-gray-50'">
                  <div class="flex items-center">
                    <span class="text-sm font-medium mr-2">{{ index + 1 }}.</span>
                    <span class="text-sm" :class="rm.isYou ? 'font-bold text-green-700' : 'text-gray-900'">
                      {{ rm.name }}{{ rm.isYou ? ' (You)' : '' }}
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium">{{ formatCurrency(rm.deposits) }}</div>
                    <div class="text-xs text-gray-500">{{ rm.growth }}% growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-white rounded border">
            <div class="p-3 border-b border-gray-200">
              <h5 class="text-sm font-medium text-gray-900">Performance vs Peers</h5>
            </div>
            <div class="p-3 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Deposits per Relationship:</span>
                <span class="text-sm font-medium text-green-600">+18% above avg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Deposit Growth YoY:</span>
                <span class="text-sm font-medium text-green-600">+{{ depositsGrowth }}% vs +8% avg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Interest Rate Competitiveness:</span>
                <span class="text-sm font-medium text-green-600">Market rate +0.1%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Account Diversification:</span>
                <span class="text-sm font-medium text-green-600">3.8 vs 2.9 avg types</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Practice Insights -->
      <div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-3">💡 Deposit Growth Optimization</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Growth Opportunities</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Global Retail Corp: Introduce sweep accounts for cash optimization</li>
              <li>• TechCorp Industries: Treasury management for subsidiary accounts</li>
              <li>• Johnson Holdings: Investment account upgrade for excess liquidity</li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Best Practices</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Top performers maintain 3.5+ account types per relationship</li>
              <li>• Quarterly liquidity reviews drive 25% higher deposit growth</li>
              <li>• Operating account sweeps increase deposits by avg 40%</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="showDepositsModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced ROE Analytics Modal -->
  <div v-if="showROEModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">📊 ROE Performance Analytics & Peer Comparison</h3>
        <button @click="showROEModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- ROE Performance Overview -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
          <div class="text-2xl font-bold text-purple-600">{{ roe }}%</div>
          <div class="text-sm text-gray-600">Your ROE</div>
          <div class="text-xs font-medium mt-1" :class="roeChange >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ roeChange >= 0 ? '+' : '' }}{{ roeChange }}% vs peers
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
          <div class="text-2xl font-bold text-gray-600">{{ peerAverageROE }}%</div>
          <div class="text-sm text-gray-600">Regional Average</div>
          <div class="text-xs text-gray-500">12 RMs</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
          <div class="text-2xl font-bold text-orange-600">{{ Math.round((totalExpenses / totalRevenue) * 100) }}%
          </div>
          <div class="text-sm text-gray-600">Expense Ratio</div>
          <div class="text-xs text-orange-500">vs 78% industry avg</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <div class="text-2xl font-bold text-green-600">🥈 #2</div>
          <div class="text-sm text-gray-600">Regional Ranking</div>
          <div class="text-xs text-green-500">Top 17% performance</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- ROE Trend Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📈 12-Month ROE Trends</h4>
          <div class="h-64 mb-4">
            <LineChart v-if="roeTrendAnalysisData" :data="roeTrendAnalysisData" :options="roeTrendAnalysisOptions" />
          </div>
          <!-- Performance Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Performance Insights</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Peak Month:</span>
                <span class="font-medium text-green-600">Nov 2024 ({{ roe + 2 }}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Improvement:</span>
                <span class="font-medium text-purple-600">+{{ Math.abs(roeChange) }}% vs last year</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Trend:</span>
                <span class="font-medium text-green-600">Consistent growth</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Peer Comparison Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">👥 Peer vs You Comparison</h4>
          <div class="h-64 mb-4">
            <BarChart v-if="roePeerComparisonData" :data="roePeerComparisonData" :options="roePeerComparisonOptions" />
          </div>
          <!-- Competitive Analysis -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Competitive Position</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Above Average RMs:</span>
                <span class="font-medium text-green-600">8 out of 12</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Gap to #1:</span>
                <span class="font-medium text-orange-600">-3.2%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Lead over #3:</span>
                <span class="font-medium text-green-600">+4.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed RM Ranking Table -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">🏆 Regional RM Performance Ranking</h4>
          <p class="text-sm text-gray-500 mt-1">ROE performance comparison with relationship ranking factors</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank & RM Name
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROE %
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationships
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Revenue/Rel
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expense Ratio
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YoY Change
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio Quality
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rm, index) in roeRankingAnalysis" :key="rm.id"
                :class="rm.name === 'Sarah Johnson' ? 'bg-purple-50' : 'hover:bg-gray-50'"
                class="cursor-pointer transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full flex items-center justify-center"
                        :class="rm.name === 'Sarah Johnson' ? 'bg-purple-600' : 'bg-gray-600'">
                        <span class="text-xs font-medium text-white">{{ rm.rank }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ rm.name }}
                        <span v-if="rm.name === 'Sarah Johnson'"
                          class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          You
                        </span>
                      </div>
                      <div class="text-xs text-gray-500">{{ rm.region }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="text-sm font-bold" :class="getRoeColor(rm.roe)">{{ rm.roe }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {{ formatCurrency(rm.totalRevenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {{ rm.relationshipCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {{ formatCurrency(rm.avgRevenuePerRel) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="getExpenseRatioColor(rm.expenseRatio)">{{ rm.expenseRatio
                  }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="rm.yoyChange >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ rm.yoyChange >= 0 ? '+' : '' }}{{ rm.yoyChange }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getPortfolioQualityClass(rm.portfolioQuality)">
                    {{ rm.portfolioQuality }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Best Practice Insights -->
      <div class="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 class="font-medium text-green-900 mb-3">💡 ROE Optimization Insights</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-gray-900 mb-2">Your Strengths</h5>
            <ul class="text-sm text-gray-700 space-y-1">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>Revenue per relationship 12% above peer average</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>Expense ratio below industry benchmark</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>Consistent quarter-over-quarter improvement</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-gray-900 mb-2">Growth Opportunities</h5>
            <ul class="text-sm text-gray-700 space-y-1">
              <li class="flex items-start">
                <span class="text-orange-500 mr-2">→</span>
                <span>Cross-sell ratio improvement potential</span>
              </li>
              <li class="flex items-start">
                <span class="text-orange-500 mr-2">→</span>
                <span>Focus on relationship quality enhancement</span>
              </li>
              <li class="flex items-start">
                <span class="text-orange-500 mr-2">→</span>
                <span>Learn from top performer's fee income strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="showROEModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Enhanced Credit Commitments Analytics Modal -->
  <div v-if="showCreditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">🏦 Credit Commitments Portfolio Analytics</h3>
        <button @click="showCreditModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Credit Portfolio Overview -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <div class="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
          <div class="text-2xl font-bold text-orange-600">{{ formatCurrency(totalCreditCommitments) }}</div>
          <div class="text-sm text-gray-600">Total Credit Commitments</div>
          <div class="text-xs font-medium mt-1 text-green-500">+12% YoY growth</div>
        </div>
        <div class="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-200">
          <div class="text-2xl font-bold text-emerald-600">{{ formatCurrency(fytdNewCommitments) }}</div>
          <div class="text-sm text-gray-600">FYTD New Commitments</div>
          <div class="text-xs font-medium mt-1 text-emerald-500">{{ newCommitmentsGrowth }}% vs target</div>
        </div>
        <div class="bg-red-50 p-4 rounded-lg text-center border border-red-200">
          <div class="text-2xl font-bold text-red-600">{{ creditUtilizationRate }}%</div>
          <div class="text-sm text-gray-600">Utilization Rate</div>
          <div class="text-xs text-red-500">{{ creditUtilizationRate - 68 }}% above optimal</div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
          <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(avgCreditPerRelationship) }}</div>
          <div class="text-sm text-gray-600">Avg Credit per Relationship</div>
          <div class="text-xs text-blue-500">18% above peer average</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <div class="text-2xl font-bold text-green-600">🥈 #2</div>
          <div class="text-sm text-gray-600">Regional Ranking</div>
          <div class="text-xs text-green-500">Credit portfolio quality</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Credit Trend Analysis -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📈 12-Month Credit Trends</h4>
          <div class="h-64 mb-4">
            <BarChart v-if="creditTrendAnalysisData" :data="creditTrendAnalysisData"
              :options="creditTrendAnalysisOptions" />
          </div>
          <!-- Credit Growth Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Credit Growth Analysis</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Peak Growth Month:</span>
                <span class="font-medium text-green-600">Oct 2024 (+8.2%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Avg Monthly Growth:</span>
                <span class="font-medium text-blue-600">2.1%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Credit Quality Trend:</span>
                <span class="font-medium text-green-600">Improving</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Credit Type Distribution -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">🎯 Credit Type Distribution</h4>
          <div class="h-64 mb-4">
            <DoughnutChart v-if="creditTypeDistributionData" :data="creditTypeDistributionData"
              :options="creditTypeDistributionOptions" />
          </div>
          <!-- Credit Type Performance -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Type Performance</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Highest Growth:</span>
                <span class="font-medium text-green-600">SBA Loans (+28%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Highest Yield:</span>
                <span class="font-medium text-blue-600">Equipment Finance (6.8%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Concentration Risk:</span>
                <span class="font-medium text-orange-600">{{ creditConcentration }}% (Top 3)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Credit Analysis Table -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">🏢 Credit Analysis by Relationship</h4>
          <p class="text-sm text-gray-500 mt-1">Comprehensive credit exposure with Johnson Holdings Group
            highlighted
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Commitment
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding Balance
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FYTD New Commitment
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization %
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profitability Ratio
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rel, index) in enhancedCreditAnalysis" :key="rel.id"
                :class="rel.name === 'Johnson Holdings Group' ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'"
                class="cursor-pointer transition-colors" @click="drillDownToRelationshipCredit(rel)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full flex items-center justify-center"
                        :class="rel.name === 'Johnson Holdings Group' ? 'bg-orange-600' : 'bg-gray-600'">
                        <span class="text-xs font-medium text-white">{{ rel.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ rel.name }}
                        <span v-if="rel.name === 'Johnson Holdings Group'"
                          class="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Primary Focus
                        </span>
                      </div>
                      <div class="text-xs text-gray-500">{{ rel.industry }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {{ formatCurrency(rel.totalCommitment) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rel.loans) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  <span :class="rel.fytdNewCommitment > 0 ? 'text-green-600' : 'text-gray-500'">
                    {{ formatCurrency(rel.fytdNewCommitment) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="getUtilizationColor(rel.utilizationRate)">
                    {{ rel.utilizationRate }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="rel.profitability >= 0.02 ? 'text-green-600' : 'text-red-600'">
                    {{ rel.profitability.toFixed(2) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Regional RM Credit Performance Ranking -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">🏆 Regional Credit Portfolio Ranking</h4>
          <p class="text-sm text-gray-500 mt-1">Credit management performance comparison among regional RMs</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank & RM Name
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Commitments
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization %
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Credit/Rel
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Growth %
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rm in creditRankingAnalysis" :key="rm.id"
                :class="rm.name === 'Sarah Johnson' ? 'bg-orange-50' : 'hover:bg-gray-50'"
                class="cursor-pointer transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full flex items-center justify-center"
                        :class="rm.name === 'Sarah Johnson' ? 'bg-orange-600' : 'bg-gray-600'">
                        <span class="text-xs font-medium text-white">{{ rm.rank }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ rm.name }}
                        <span v-if="rm.name === 'Sarah Johnson'"
                          class="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          You
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {{ formatCurrency(rm.totalCommitments) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="getUtilizationColor(rm.utilization)">{{ rm.utilization
                  }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ formatCurrency(rm.avgCreditPerRel) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <span class="font-medium" :class="rm.creditGrowth >= 10 ? 'text-green-600' : 'text-orange-600'">
                    +{{ rm.creditGrowth }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Johnson Holdings Group - Detailed Credit Profile -->
      <div class="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 class="font-medium text-orange-900 mb-3">🔍 Johnson Holdings Group - Credit Portfolio Details</h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Credit Facilities Breakdown -->
          <div class="bg-white rounded border border-orange-200">
            <div class="p-3 border-b border-orange-200">
              <h5 class="text-sm font-medium text-gray-900">Credit Facilities Breakdown</h5>
            </div>
            <div class="p-3">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <div>
                    <div class="text-sm font-medium text-gray-900">Term Loan A</div>
                    <div class="text-xs text-gray-600">Maturity: Dec 2027 • Rate: 5.75%</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold text-orange-600">{{ formatCurrency(111000000) }}</div>
                    <div class="text-xs text-gray-500">Outstanding</div>
                  </div>
                </div>
                <div class="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <div>
                    <div class="text-sm font-medium text-gray-900">Revolving Credit Line</div>
                    <div class="text-xs text-gray-600">Maturity: Jun 2026 • Rate: SOFR+275</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold text-orange-600">{{ formatCurrency(55500000) }}</div>
                    <div class="text-xs text-gray-500">Available</div>
                  </div>
                </div>
                <div class="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <div>
                    <div class="text-sm font-medium text-gray-900">Equipment Finance</div>
                    <div class="text-xs text-gray-600">Maturity: Mar 2029 • Rate: 6.25%</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold text-orange-600">{{ formatCurrency(18500000) }}</div>
                    <div class="text-xs text-gray-500">Outstanding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Credit Performance Metrics -->
          <div class="bg-white rounded border border-orange-200">
            <div class="p-3 border-b border-orange-200">
              <h5 class="text-sm font-medium text-gray-900">Performance Metrics</h5>
            </div>
            <div class="p-3 space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-2 bg-green-50 rounded">
                  <div class="text-lg font-bold text-green-600">A+</div>
                  <div class="text-xs text-gray-600">Credit Rating</div>
                </div>
                <div class="text-center p-2 bg-blue-50 rounded">
                  <div class="text-lg font-bold text-blue-600">1.85x</div>
                  <div class="text-xs text-gray-600">DSCR Ratio</div>
                </div>
              </div>
              <div class="border-t pt-3">
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment History:</span>
                    <span class="font-medium text-green-600">Excellent (98.5%)</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Covenant Compliance:</span>
                    <span class="font-medium text-green-600">All Current</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Last Review Date:</span>
                    <span class="font-medium text-blue-600">Nov 15, 2024</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Profitability Score:</span>
                    <span class="font-medium text-green-600">1.73% ROA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Management Best Practices -->
      <div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-3">💡 Credit Portfolio Optimization Insights</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Portfolio Strengths</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Credit quality above regional average (AA+ vs AA)</li>
              <li>• Strong covenant compliance across all relationships</li>
              <li>• Diversified credit type distribution</li>
              <li>• Johnson Holdings Group excellent payment history</li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Growth Opportunities</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Consider SBA loan expansion for manufacturing clients</li>
              <li>• Cross-sell equipment financing to existing relationships</li>
              <li>• Optimize utilization rates for better fee income</li>
              <li>• Focus on covenant-light structures for premium clients</li>
            </ul>
          </div>
        </div>
      </div>



      <div class="mt-6 flex justify-end">
        <button @click="showCreditModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Referral Modal -->
  <div v-if="showReferralModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">🤝 Referral Details</h3>
        <button @click="showReferralModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ wealthReferrals }}</div>
            <div class="text-sm text-gray-600">Wealth Referrals</div>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ commercialReferrals }}</div>
            <div class="text-sm text-gray-600">Commercial Referrals</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ retailReferrals }}</div>
            <div class="text-sm text-gray-600">Retail Referrals</div>
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Referral Performance</h4>
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ referralRate }}%</div>
            <div class="text-sm text-gray-600">Overall referral conversion rate</div>
            <div class="text-xs text-gray-500 mt-1">{{ totalReferrals }} total referrals this period</div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="showReferralModal = false"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div> -->

  <!-- Enhanced Risk Analytics Modal -->
  <div v-if="showRiskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div
      class="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">🚨 Risk Analytics & Review Dashboard</h3>
        <button @click="showRiskModal = false" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Risk Overview Dashboard -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-red-50 p-4 rounded-lg text-center border border-red-200">
          <div class="text-2xl font-bold text-red-600">{{ totalRiskReviews }}</div>
          <div class="text-sm text-gray-600">Total Risk Reviews</div>
          <div class="text-xs text-red-500 font-medium">{{ Math.floor(totalRiskReviews / totalRelationships * 100)
          }}% of portfolio</div>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
          <div class="text-2xl font-bold text-orange-600">{{ riskReviewsPending }}</div>
          <div class="text-sm text-gray-600">Pending Review</div>
          <div class="text-xs text-orange-500 font-medium">{{ riskFlagsPercentile }}th percentile</div>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
          <div class="text-2xl font-bold text-blue-600">{{ reviewedWithAction }}</div>
          <div class="text-sm text-gray-600">Reviewed with Action</div>
          <div class="text-xs text-blue-500 font-medium">{{ Math.floor(reviewedWithAction / totalRiskFlags * 100)
          }}%
            of flags</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <div class="text-2xl font-bold text-green-600">{{ reviewedWithoutAction }}</div>
          <div class="text-sm text-gray-600">Reviewed without Action</div>
          <div class="text-xs text-green-500 font-medium">{{ Math.floor(reviewedWithoutAction / totalRiskFlags *
            100)
          }}% of flags</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Risk Review Distribution -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📊 Risk Review Distribution</h4>
          <div class="h-64 mb-4">
            <DoughnutChart v-if="riskReviewDistributionData" :data="riskReviewDistributionData"
              :options="riskReviewDistributionOptions" />
          </div>
          <!-- Risk Review Legend -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Review Categories</h5>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div v-for="review in riskReviewCategories" :key="review.name" class="flex justify-between">
                <span class="text-gray-600">{{ review.name }}:</span>
                <span class="font-medium" :class="review.color">{{ review.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Review Trends -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">📈 Risk Review Trends</h4>
          <div class="h-64 mb-4">
            <BarChart v-if="riskReviewTrendData" :data="riskReviewTrendData" :options="riskReviewTrendOptions" />
          </div>
          <!-- Risk Review Insights -->
          <div class="bg-white p-3 rounded border">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Review Trend Insights</h5>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Peak Review Month:</span>
                <span class="font-medium text-red-600">{{ peakRiskMonth }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Review Trend:</span>
                <span class="font-medium"
                  :class="riskTrendDirection === 'Increasing' ? 'text-red-600' : 'text-green-600'">{{
                    riskTrendDirection }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Avg Resolution Time:</span>
                <span class="font-medium text-blue-600">{{ avgResolutionTime }} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Risk Analysis by Relationship -->
      <div class="mt-6 bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h4 class="font-medium text-gray-900">🔍 Detailed Risk Analysis by Relationship</h4>
          <p class="text-sm text-gray-500 mt-1">Comprehensive risk assessment with Johnson Holdings Group
            highlighted
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Reviews
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending Reviews
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UTRs Filed
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewed with Action
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewed without Action
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(rel, index) in enhancedRiskAnalysis" :key="rel.id" class="cursor-pointer transition-colors"
                :class="rel.name === 'Johnson Holdings Group' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'"
                @click="drillDownToRelationshipRisk(rel)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ rel.name }}
                      <span v-if="rel.name === 'Johnson Holdings Group'"
                        class="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Primary Client
                      </span>
                    </div>
                    <div class="text-xs text-gray-500">{{ rel.industry }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="rel.riskFlags > 0"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {{ rel.riskFlags }}
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">0</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="rel.pendingReviews > 0"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    {{ rel.pendingReviews }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="rel.utrs > 0"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    {{ rel.utrs }}
                  </span>
                  <span v-else class="text-gray-400">0</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {{ rel.reviewedWithAction || 0 }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {{ rel.reviewedWithoutAction || 0 }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex space-x-2">
                    <button @click.stop="reviewRisk(rel)" class="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Review
                    </button>
                    <button @click.stop="viewRiskDetails(rel)"
                      class="text-green-600 hover:text-green-800 text-xs font-medium">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Johnson Holdings Group - Detailed Risk Profile -->
      <div class="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 class="font-medium text-red-900 mb-3">🔍 Johnson Holdings Group - Detailed Risk Profile</h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Risk Flag Details -->
          <div class="bg-white rounded border border-red-200">
            <div class="p-3 border-b border-red-200">
              <h5 class="text-sm font-medium text-gray-900">Active Risk Flags</h5>
            </div>
            <div class="p-3">
              <div class="space-y-3">
                <div v-for="flag in johnsonRiskFlags" :key="flag.id" class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="flag.severityClass">
                      {{ flag.severity }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ flag.category }}</div>
                    <div class="text-xs text-gray-600">{{ flag.description }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ flag.dateIdentified }} • {{ flag.amount ?
                      formatCurrency(flag.amount) : 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Metrics & Analytics -->
          <div class="bg-white rounded border border-red-200">
            <div class="p-3 border-b border-red-200">
              <h5 class="text-sm font-medium text-gray-900">Risk Analytics</h5>
            </div>
            <div class="p-3 space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-2 bg-red-50 rounded">
                  <div class="text-lg font-bold text-red-600">{{ johnsonRiskMetrics.totalTransactions }}</div>
                  <div class="text-xs text-gray-600">Risk Transactions</div>
                </div>
                <div class="text-center p-2 bg-orange-50 rounded">
                  <div class="text-lg font-bold text-orange-600">{{ formatCurrency(johnsonRiskMetrics.totalAmount)
                  }}
                  </div>
                  <div class="text-xs text-gray-600">Total Risk Amount</div>
                </div>
              </div>
              <div class="border-t pt-3">
                <div class="space-y-2 text-xs">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Management Actions -->
      <div class="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-3">🎯 Risk Management Actions & Recommendations</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Immediate Actions Required</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Complete Johnson Holdings Group risk assessment (2 days overdue)</li>
              <li>• Review TechCorp Industries high-cash transaction patterns</li>
              <li>• Update Global Retail Corp compliance documentation</li>
              <li>• File pending UTR for Johnson Holdings crypto activity</li>
            </ul>
          </div>
          <div>
            <h5 class="text-sm font-medium text-blue-800 mb-2">Strategic Risk Mitigation</h5>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Implement enhanced monitoring for manufacturing sector clients</li>
              <li>• Schedule quarterly risk reviews for high-exposure relationships</li>
              <li>• Update risk appetite framework for portfolio concentration</li>
              <li>• Enhance due diligence procedures for cash-intensive businesses</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-between items-center">
        <div class="flex space-x-3">
          <button @click="generateRiskReport"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Generate Risk Report
          </button>
          <button @click="scheduleRiskReview"
            class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            Schedule Reviews
          </button>
          <button @click="exportRiskData"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Export Data
          </button>
        </div>
        <button @click="showRiskModal = false"
          class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
          Close
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency, clients, relationshipManagers, getRegionById, getMarketById, getMetroById, regions, markets, metros } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'
import DoughnutChart from './charts/DoughnutChart.vue'
import LineChart from './charts/LineChart.vue'

const props = defineProps({
  metroId: String,
  marketId: String,
  regionId: String,
  rmId: String
})

const router = useRouter()

// Reactive state
const activeTab = ref('portfolio')
const selectedDateRange = ref('ytd')
const selectedCurrency = ref('usd')
const showNetNew = ref(true)
const showAlertsModal = ref(false)

// Modal states
const showRevenueModal = ref(false)
const showRelationshipsModal = ref(false)
const showDepositsModal = ref(false)
const showROEModal = ref(false)
const showReferralModal = ref(false)
const showRiskModal = ref(false)
const showCreditModal = ref(false)

// Summary table controls
const comparisonMode = ref('target')

// Collapsible sections state
const isPortfolioSectionCollapsed = ref(true)
const isRiskAppetiteCollapsed = ref(true)

// Alert system states
const activeAlertTab = ref('delinquency')

// Sorting state
const sortField = ref('')
const sortDirection = ref('asc')

// Opportunities filter state
const opportunitiesFilter = ref('all')
const opportunitiesTimePeriod = ref('6m')

// RM Data - get from mockData
const rmData = computed(() => {
  const rm = relationshipManagers.find(rm => rm.id === props.rmId)
  if (rm) {
    return rm
  }
  // Fallback if RM not found
  return {
    id: props.rmId || 'rm-001',
    name: 'Relationship Manager',
    region: props.regionId,
    market: 'Market',
    metro: 'Metro'
  }
})

// Add these after rmData and before computed properties
// Computed properties for hierarchy data
const regionData = computed(() => {
  return getRegionById(props.regionId) || {}
})

const marketData = computed(() => {
  const region = regionData.value
  if (props.marketId) {
    return getMarketById(props.marketId)
  } else if (region.marketId) {
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

const regionName = computed(() => {
  return regionData.value.name || (props.regionId ? props.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Region')
})

const marketName = computed(() => {
  return marketData.value?.name
})

const metroName = computed(() => {
  return metroData.value?.name
})

const getRegionPath = () => {
  if (props.metroId && props.marketId) {
    return `/metro/${props.metroId}/market/${props.marketId}/region/${props.regionId}`
  } else {
    return `/region/${props.regionId}`
  }
}
const lastReviewDate = computed(() => {
  // Mock: last review 2 weeks ago
  return '2024-05-15';
})
const urgentAlertCount = computed(() => {
  // Count of urgent alerts from the enhanced alert system
  return totalActiveAlerts.value;
})

// Computed properties
const breadcrumb = computed(() => {
  return `Metro › Market › Region › ${rmData.value.name} › Portfolio Dashboard`
})

const netNewPeriod = computed(() => {
  switch (selectedDateRange.value) {
    case 'ytd': return '1 Jan'
    case '6m': return '6 months ago'
    case '12m': return '12 months ago'
    default: return '1 Jan'
  }
})

// Sample relationship data for the RM
const relationships = computed(() => [
  {
    id: 'rel-001',
    name: 'Johnson Holdings Group',
    industry: 'Manufacturing',
    deposits: 425000000,
    depositsDelta: 45000000,
    loans: 185000000,
    loansDelta: 25000000,
    utilization: 68,
    revenue: 3200000,
    revenueDelta: 480000,
    crossSellIndex: 3.2,
    rci: 6.8,
    pendingReviews: 2,
    leadCount: 3,
    leadValue: 2400000,
    stage: 'Defend',
    newCreditRelationship: 0,  // Existing credit relationship
    opportunities: 5,
    totalPotentialValue: 2850000
  },
  {
    id: 'rel-002',
    name: 'TechCorp Industries',
    industry: 'Technology',
    deposits: 185000000,
    depositsDelta: 12000000,
    loans: 95000000,
    loansDelta: 18000000,
    utilization: 72,
    revenue: 1850000,
    revenueDelta: 220000,
    crossSellIndex: 2.8,
    rci: 4.2,
    pendingReviews: 1,
    leadCount: 5,
    leadValue: 1800000,
    stage: 'Build',
    newCreditRelationship: 0,  // Existing credit relationship
    opportunities: 7,
    totalPotentialValue: 3450000
  },
  {
    id: 'rel-003',
    name: 'Global Retail Corp',
    industry: 'Retail',
    deposits: 320000000,
    depositsDelta: -8000000,
    loans: 145000000,
    loansDelta: -5000000,
    utilization: 89,
    revenue: 2100000,
    revenueDelta: -150000,
    crossSellIndex: 2.1,
    rci: 7.8,
    pendingReviews: 4,
    leadCount: 2,
    leadValue: 950000,
    stage: 'Watch',
    newCreditRelationship: 0,  // Existing credit relationship
    opportunities: 3,
    totalPotentialValue: 1275000
  },
  {
    id: 'rel-004',
    name: 'NewTech Startup Inc',
    industry: 'Technology',
    deposits: 15000000,
    depositsDelta: 15000000,  // All new deposits (new client)
    loans: 8000000,
    loansDelta: 8000000,      // All new loans (new credit relationship)
    utilization: 45,
    revenue: 180000,
    revenueDelta: 180000,     // All new revenue
    crossSellIndex: 1.8,
    rci: 2.1,
    pendingReviews: 1,
    leadCount: 4,
    leadValue: 3200000,
    stage: 'Build',
    newCreditRelationship: 1,  // NEW client with credit = 1 new credit relationship
    opportunities: 8,
    totalPotentialValue: 4850000
  },
  {
    id: 'rel-005',
    name: 'Established Services Corp',
    industry: 'Professional Services',
    deposits: 95000000,
    depositsDelta: 5000000,   // Modest deposit growth (existing client)
    loans: 12000000,
    loansDelta: 12000000,     // All new loans (new credit relationship)
    utilization: 30,
    revenue: 850000,
    revenueDelta: 120000,     // Revenue increase from new credit
    crossSellIndex: 2.8,
    rci: 5.2,
    pendingReviews: 0,
    leadCount: 2,
    leadValue: 1500000,
    stage: 'Build',
    newCreditRelationship: 1,  // Existing client added credit = 1 new credit relationship
    opportunities: 4,
    totalPotentialValue: 1950000
  }
])

// Sorted relationships
const sortedRelationships = computed(() => {
  if (!sortField.value) return relationships.value

  const sorted = [...relationships.value].sort((a, b) => {
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

// KPI computations
const totalRelationships = computed(() => relationships.value.length)
const relationshipsDelta = computed(() => 2)
const totalDeposits = computed(() => relationships.value.reduce((sum, rel) => sum + rel.deposits, 0))
const depositsDelta = computed(() => relationships.value.reduce((sum, rel) => sum + rel.depositsDelta, 0))
const totalLoanCommitments = computed(() => relationships.value.reduce((sum, rel) => sum + rel.loans, 0))
const loanDelta = computed(() => relationships.value.reduce((sum, rel) => sum + rel.loansDelta, 0))
const totalOpportunities = computed(() => relationships.value.reduce((sum, rel) => sum + rel.opportunities, 0))
const totalPotentialValue = computed(() => relationships.value.reduce((sum, rel) => sum + rel.totalPotentialValue, 0))
const loanUtilization = computed(() => {
  const totalUsed = relationships.value.reduce((sum, rel) => sum + rel.loans, 0)
  const totalCommitted = totalUsed * 1.4 // Assuming 40% headroom
  return Math.round((totalUsed / totalCommitted) * 100)
})
const totalRevenue = computed(() => relationships.value.reduce((sum, rel) => sum + rel.revenue, 0))
const revenueYoY = computed(() => {
  const totalDelta = relationships.value.reduce((sum, rel) => sum + rel.revenueDelta, 0)
  const previousRevenue = totalRevenue.value - totalDelta
  return Math.round((totalDelta / previousRevenue) * 100)
})
const depositsGrowth = computed(() => {
  const totalDelta = relationships.value.reduce((sum, rel) => sum + rel.depositsDelta, 0)
  const previousDeposits = totalDeposits.value - totalDelta
  return Math.round((totalDelta / previousDeposits) * 100)
})

const totalLeads = computed(() => relationships.value.reduce((sum, rel) => sum + rel.leadCount, 0))
const closedWon = computed(() => 12)
const totalClosed = computed(() => 18)
const closingRate = computed(() => Math.round((closedWon.value / totalClosed.value) * 100))
const riskReviewsPending = computed(() => relationships.value.reduce((sum, rel) => sum + rel.pendingReviews, 0))

// New metrics for updated KPI ribbon
const referralRate = computed(() => 67) // Mock referral rate percentage
const totalReferrals = computed(() => 24) // Mock total referrals
const referralTarget = computed(() => 20) // Mock target for referrals
const wealthReferrals = computed(() => 8)
const commercialReferrals = computed(() => 12)
const retailReferrals = computed(() => 4)
const netNewClientsFYTD = computed(() => 15)
const netNewCreditRelationshipsFYTD = computed(() => 7)

// ROE calculations
const totalExpenses = computed(() => totalRevenue.value * 0.75) // Mock: 75% expense ratio
const roe = computed(() => Math.round((totalRevenue.value / totalExpenses.value) * 100))
const roeChange = computed(() => 8) // Mock: 8% above peer average
const peerAverageROE = computed(() => roe.value - roeChange.value)

// Opportunities data
const opportunitiesData = computed(() => {
  const baseData = [
    {
      client: 'Johnson Holdings Group',
      pending: 8,
      value: 2400000,
      priority: 'High',
      dateAdded: '2024-11-01',
      category: 'Lending'
    },
    {
      client: 'TechCorp Industries',
      pending: 12,
      value: 1800000,
      priority: 'High',
      dateAdded: '2024-10-15',
      category: 'Treasury'
    },
    {
      client: 'Global Retail Corp',
      pending: 5,
      value: 950000,
      priority: 'Medium',
      dateAdded: '2024-10-28',
      category: 'Investment'
    },
    {
      client: 'Manufacturing Plus',
      pending: 6,
      value: 750000,
      priority: 'Medium',
      dateAdded: '2024-11-10',
      category: 'Deposits'
    },
    {
      client: 'Retail Solutions Inc',
      pending: 4,
      value: 480000,
      priority: 'Low',
      dateAdded: '2024-11-05',
      category: 'FX'
    }
  ]

  // Apply filters
  return baseData.filter(item => {
    if (opportunitiesFilter.value === 'high-value' && item.value <= 500000) return false
    if (opportunitiesFilter.value === 'high-priority' && item.priority !== 'High') return false
    if (opportunitiesFilter.value === 'recent') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (new Date(item.dateAdded) < thirtyDaysAgo) return false
    }
    return true
  })
})

// Use green palette for Opportunities Trends
const opportunitiesPalette = ['#04442c', '#a1e57e', '#6db75c', '#397a43', '#7c978c', '#5c7f6e', '#26563f', '#3b6554']
const opportunitiesChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })
  const clients = [...new Set(opportunitiesData.value.map(item => item.client))]
  const datasets = clients.map((client, index) => ({
    label: client,
    data: labels.map(() => Math.floor(Math.random() * 15) + 2), // Mock data for each month
    backgroundColor: opportunitiesPalette[index % opportunitiesPalette.length],
    borderColor: opportunitiesPalette[index % opportunitiesPalette.length],
    borderWidth: 1
  }))
  return { labels, datasets }
})

// Opportunities summary stats
const filteredOpportunitiesCount = computed(() => opportunitiesData.value.reduce((sum, item) => sum + item.pending, 0))
const filteredOpportunitiesValue = computed(() => opportunitiesData.value.reduce((sum, item) => sum + item.value, 0))
const avgOpportunityValue = computed(() => formatCurrency(filteredOpportunitiesValue.value / Math.max(filteredOpportunitiesCount.value, 1)))
const opportunitiesConversionRate = computed(() => 67) // Mock conversion rate

// Product penetration data
const productPenetration = computed(() => [
  { name: 'Deposits', penetration: 100, relationshipCount: totalRelationships.value },
  { name: 'Lending', penetration: 85, relationshipCount: Math.round(totalRelationships.value * 0.85) },
  { name: 'Treasury', penetration: 67, relationshipCount: Math.round(totalRelationships.value * 0.67) },
  { name: 'FX', penetration: 45, relationshipCount: Math.round(totalRelationships.value * 0.45) },
  { name: 'Trade', penetration: 30, relationshipCount: Math.round(totalRelationships.value * 0.30) },
  { name: 'Wealth', penetration: 25, relationshipCount: Math.round(totalRelationships.value * 0.25) }
])

// AI Recommendations
const aiRecommendations = computed(() => [
  {
    id: 1,
    relationship: 'TechCorp Industries',
    recommendation: 'Opportunity to expand treasury management solutions given their rapid growth and multiple subsidiaries',
    confidence: 92,
    impact: 650000,
    priority: 'High'
  },
  {
    id: 2,
    relationship: 'Johnson Holdings Group',
    recommendation: 'Cross-sell FX services for international expansion plans',
    confidence: 88,
    impact: 420000,
    priority: 'Medium'
  },
  {
    id: 3,
    relationship: 'Global Retail Corp',
    recommendation: 'Defensive play - restructure lending facilities to improve utilization',
    confidence: 85,
    impact: 380000,
    priority: 'High'
  }
])

// Lead Funnel
const leadFunnel = computed(() => [
  { name: 'Qualified', count: 24, value: 8500000 },
  { name: 'Proposal', count: 18, value: 6200000 },
  { name: 'Negotiation', count: 12, value: 4100000 },
  { name: 'Closed Won', count: 6, value: 2800000 },
  { name: 'Closed Lost', count: 3, value: 1200000 }
])

// Risk Metrics
const riskMetrics = computed(() => ({
  totalRiskFlags: relationships.value.reduce((sum, rel) => sum + Math.max(0, Math.floor(rel.rci) - 4), 0),
  pending: relationships.value.reduce((sum, rel) => sum + rel.pendingReviews, 0),
  reviewedWithAction: 12, // mock
  reviewedWithoutAction: 8, // mock
  avgTimeToClose: 18
}))

// High RCI Relationships
const highRCIRelationships = computed(() =>
  relationships.value.filter(rel => rel.rci > 6.5).map(rel => ({
    ...rel,
    lastReview: '2 weeks ago',
    riskFlags: Math.floor(rel.rci)
  }))
)

// Chart data
const revenueChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Revenue',
    data: [850000, 920000, 1100000, 980000, 1150000, 1200000],
    backgroundColor: '#10B981'
  }]
}))

const penetrationChartData = computed(() => ({
  labels: productPenetration.value.map(p => p.name),
  datasets: [{
    data: productPenetration.value.map(p => p.penetration),
    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
  }]
}))

// Add these computed properties in the script section
const chartLabels = computed(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])
const revenueTrendsActiveLegends = ref(sortedRelationships.value.map(rel => rel.name))
const revenuePalette = ['#04442c', '#a1e57e', '#5c7f6e', '#7c978c', '#6db75c', '#26563f', '#3b6554', '#397a43']
const toggleRevenueTrendsLegend = (name) => {
  if (revenueTrendsActiveLegends.value.includes(name)) {
    revenueTrendsActiveLegends.value = revenueTrendsActiveLegends.value.filter(n => n !== name)
  } else {
    revenueTrendsActiveLegends.value.push(name)
  }
}
const revenueTrendsStackedChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })
  const datasets = sortedRelationships.value
    .filter((rel) => revenueTrendsActiveLegends.value.includes(rel.name))
    .map((rel, idx) => ({
      label: rel.name,
      data: labels.map(() => Math.floor(rel.revenue / 12 * (0.8 + Math.random() * 0.4))),
      backgroundColor: revenuePalette[idx % revenuePalette.length],
      stack: 'revenue'
    }))
  return { labels, datasets }
})
const depositTrendsChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: sortedRelationships.value.map((rel, idx) => ({
    label: rel.name,
    data: chartLabels.value.map(() => Math.floor(rel.deposits / 6 * (0.8 + Math.random() * 0.4))),
    borderColor: ['#3B82F6', '#10B981', '#F59E0B'][idx % 3],
    backgroundColor: 'rgba(59,130,246,0.1)',
    tension: 0.4
  }))
}))
const loanTrendsChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: sortedRelationships.value.map((rel, idx) => ({
    label: rel.name,
    data: chartLabels.value.map(() => Math.floor(rel.loans / 6 * (0.8 + Math.random() * 0.4))),
    borderColor: ['#F59E0B', '#10B981', '#3B82F6'][idx % 3],
    backgroundColor: 'rgba(245,158,11,0.1)',
    tension: 0.4
  }))
}))

// Helper methods

const getCrossSellColor = (index) => {
  if (index >= 3.0) return 'text-green-600'
  if (index >= 2.0) return 'text-yellow-600'
  return 'text-red-600'
}

const getRCIColor = (rci) => {
  if (rci > 7) return 'text-red-600'
  if (rci > 5) return 'text-yellow-600'
  return 'text-green-600'
}

const getStageColor = (stage) => {
  switch (stage) {
    case 'Build': return 'bg-green-100 text-green-800'
    case 'Defend': return 'bg-blue-100 text-blue-800'
    case 'Watch': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Methods
const createLead = () => {
  console.log('Creating new lead...')
  // Implement lead creation logic
}

const refreshData = () => {
  console.log('Refreshing data...')
  // Implement data refresh logic
}

const exportData = () => {
  console.log('Exporting data...')
  // Implement export logic
}

const exportSummaryData = () => {
  // Create CSV data for relationship summary table
  const headers = ['Relationship', 'Revenue FYTD', 'Net New Commitments', 'Net New Deposits', 'New Credit Relationships', 'Opportunities', 'Total Potential Value', 'Risk Flags']
  const data = relationships.value.map(rel => [
    rel.name,
    formatCurrency(rel.revenue),
    formatCurrency(rel.netNewCommitments || rel.loans * 0.3),
    formatCurrency(rel.netNewDeposits || rel.deposits * 0.2),
    rel.newCreditRelationship.toString(),
    rel.opportunities.toString(),
    formatCurrency(rel.totalPotentialValue),
    rel.riskFlags ? rel.riskFlags.length.toString() : '0'
  ])
  
  // Convert to CSV format
  const csvContent = [headers, ...data]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `rm-relationships-summary-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Helper functions for relationship table styling
const getRelationshipRiskClass = (riskFlags) => {
  if (!riskFlags || riskFlags.length === 0) return ''
  if (riskFlags.length >= 3) return 'bg-red-100 text-red-800'
  if (riskFlags.length >= 2) return 'bg-orange-100 text-orange-800'
  return 'bg-yellow-100 text-yellow-800'
}

const getPerformanceClass = (actual, target) => {
  const percent = (actual / target) * 100
  if (percent >= 100) return 'text-green-600'
  if (percent >= 80) return 'text-yellow-600'
  return 'text-red-600'
}

const getGrowthClass = (growth) => {
  if (growth >= 0) return 'text-green-600'
  if (growth >= -5) return 'text-yellow-600'
  return 'text-red-600'
}

const getRiskScoreClass = (score) => {
  if (score <= 3) return 'bg-green-100 text-green-800'
  if (score <= 6) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getOverallPerformanceClass = (score) => {
  if (score >= 85) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const calculateRelationshipPerformance = (relationship) => {
  // Calculate performance score based on multiple factors
  let score = 70 // Base score
  
  // Revenue performance (30% weight)
  const revenueTarget = relationship.revenueTarget || relationship.revenue * 0.8
  const revenuePerformance = (relationship.revenue / revenueTarget) * 100
  score += Math.min(30, (revenuePerformance - 100) * 0.3)
  
  // Deposits performance (20% weight)
  const depositsTarget = relationship.depositsTarget || relationship.deposits * 0.85
  const depositsPerformance = (relationship.deposits / depositsTarget) * 100
  score += Math.min(20, (depositsPerformance - 100) * 0.2)
  
  // Risk adjustment (negative impact)
  score -= (relationship.riskScore || 5) * 2
  score -= (relationship.pendingReviews || 0) * 5
  
  // Growth adjustment
  const revenueGrowth = relationship.revenueGrowth || 5
  score += Math.min(10, revenueGrowth)
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

const getTrendIcon = (relationship) => {
  if (comparisonMode.value === 'target') {
    const revenueTarget = relationship.revenueTarget || relationship.revenue * 0.8
    const performance = (relationship.revenue / revenueTarget) * 100
    if (performance >= 100) return 'text-green-500'
    if (performance >= 80) return 'text-yellow-500'
    return 'text-red-500'
  } else {
    const growth = relationship.revenueGrowth || 5
    if (growth >= 0) return 'text-green-500'
    return 'text-red-500'
  }
}

const getTrendSymbol = (relationship) => {
  if (comparisonMode.value === 'target') {
    const revenueTarget = relationship.revenueTarget || relationship.revenue * 0.8
    const performance = (relationship.revenue / revenueTarget) * 100
    if (performance >= 100) return '↗'
    if (performance >= 80) return '→'
    return '↘'
  } else {
    const growth = relationship.revenueGrowth || 5
    if (growth > 5) return '↗'
    if (growth >= 0) return '→'
    return '↘'
  }
}

const viewRelationshipDetail = (relationship) => {
  router.push({
    name: 'Relationship',
    params: {
      metroId: props.metroId,
      marketId: props.marketId,
      regionId: props.regionId,
      rmId: props.rmId,
      relationshipId: relationship.id
    }
  })
}

const scheduleClientMeeting = (relationship) => {
  console.log('Scheduling meeting for:', relationship.name)
  // Implement meeting scheduling logic
}

const scheduleRiskReview = (relationship) => {
  console.log('Scheduling risk review for:', relationship.name)
  // Implement risk review scheduling logic
}

const sortTable = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const drillDownToRelationship = (relationship) => {
  // Use full hierarchy if available, otherwise simplified
  const market = marketData.value
  const metro = metroData.value

  if (metro && market) {
    router.push({
      name: 'Relationship',
      params: {
        metroId: metro.id,
        marketId: market.id,
        regionId: props.regionId,
        rmId: props.rmId,
        relationshipId: relationship.id
      }
    })
  } else {
    router.push({
      name: 'Relationship',
      params: {
        regionId: props.regionId,
        rmId: props.rmId,
        relationshipId: relationship.id
      }
    })
  }
}

const drillDownToRelationshipCredit = (relationship) => {
  // Use same hierarchy logic as other navigation
  const market = marketData.value
  const metro = metroData.value

  if (metro && market) {
    router.push({
      name: 'Relationship',
      params: {
        metroId: metro.id,
        marketId: market.id,
        regionId: props.regionId,
        rmId: props.rmId,
        relationshipId: relationship.id
      }
    })
  } else {
    router.push({
      name: 'Relationship',
      params: {
        regionId: props.regionId,
        rmId: props.rmId,
        relationshipId: relationship.id
      }
    })
  }
}

const actOnRecommendation = (recommendation) => {
  console.log('Acting on recommendation:', recommendation)
  // Implement recommendation action logic
}

const reviewRisk = (relationship) => {
  console.log('Reviewing risk for:', relationship.name)
  // Implement risk review logic
}

// Enhanced Risk Modal Data
const totalRiskFlags = computed(() => {
  return relationships.value.reduce((sum, rel) => sum + (rel.riskFlags ? rel.riskFlags.length : 0), 0)
})

const totalPendingReviews = computed(() => {
  return relationships.value.reduce((sum, rel) => sum + (rel.pendingReviews || 0), 0)
})

const riskFlagsPercentile = computed(() => {
  return Math.min(95, 15 + (totalRiskFlags.value * 3)) // Higher percentile is worse for risk
})

const totalRiskExposure = computed(() => {
  return relationships.value.reduce((sum, rel) => sum + (rel.deposits + rel.loans) * (rel.rci / 10), 0)
})

const totalPortfolioValue = computed(() => {
  return relationships.value.reduce((sum, rel) => sum + rel.deposits + rel.loans, 0)
})

const avgRiskScore = computed(() => {
  const avg = relationships.value.reduce((sum, rel) => sum + rel.rci, 0) / relationships.value.length
  return avg.toFixed(1)
})

const riskScoreChange = computed(() => 8) // Mock: 8% increase vs last month

const peakRiskMonth = computed(() => 'October 2024')
const riskTrendDirection = computed(() => 'Increasing')
const avgResolutionTime = computed(() => 18)

const riskReviewCategories = computed(() => [
  { name: 'High Cash Activity', count: 4, color: 'text-red-600' },
  { name: 'Crypto Transactions', count: 2, color: 'text-orange-600' },
  { name: 'Foreign ATM', count: 3, color: 'text-yellow-600' },
  { name: 'UTR Filed', count: 1, color: 'text-purple-600' },
  { name: 'Covenant Breach', count: 2, color: 'text-red-500' }
])

const riskReviewDistributionData = computed(() => {
  return {
    labels: riskReviewCategories.value.map(cat => cat.name),
    datasets: [{
      data: riskReviewCategories.value.map(cat => cat.count),
      backgroundColor: [
        '#EF4444', // High Cash Activity
        '#F97316', // Crypto Transactions  
        '#F59E0B', // Foreign ATM
        '#8B5CF6', // UTR Filed
        '#DC2626'  // Covenant Breach
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

const riskReviewDistributionOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          return `${context.label}: ${context.parsed} reviews (${percentage}%)`
        }
      }
    }
  }
}

const riskTrendAnalysisData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Portfolio Risk Score',
        data: labels.map((_, i) => {
          const base = parseFloat(avgRiskScore.value)
          const trend = (i * 0.1) - 0.5 // Slight upward trend
          return (base + trend + (Math.random() * 0.4 - 0.2)).toFixed(1)
        }),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Industry Average',
        data: labels.map(() => (5.2 + Math.random() * 0.3).toFixed(1)),
        borderColor: '#6B7280',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4
      }
    ]
  }
})

const riskTrendAnalysisOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      max: 10,
      grid: { display: true, color: 'rgba(0,0,0,0.1)' },
      title: { display: true, text: 'Risk Score (1-10)' }
    }
  }
}

const enhancedRiskAnalysis = computed(() => {
  return relationships.value.map((rel, index) => ({
    ...rel,
    riskScore: rel.rci.toFixed(1),
    riskFlags: Math.max(0, Math.floor(rel.rci) - 4),
    pendingReviews: Math.max(0, Math.floor(rel.rci) - 6),
    riskExposure: (rel.deposits + rel.loans) * (rel.rci / 10),
    lastReview: rel.name === 'Johnson Holdings Group' ? '2024-10-15' : '2024-11-20',
    utrs: rel.name === 'Johnson Holdings Group' ? 3 : Math.floor(Math.random() * 2),
    reviewedWithAction: rel.name === 'Johnson Holdings Group' ? 4 : Math.floor(Math.random() * 3),
    reviewedWithoutAction: rel.name === 'Johnson Holdings Group' ? 2 : Math.floor(Math.random() * 2)
  })).sort((a, b) => b.riskScore - a.riskScore)
})

const johnsonRiskFlags = computed(() => [
  {
    id: 'rf-001',
    category: 'High Cash Activity',
    severity: 'Critical',
    severityClass: 'bg-red-100 text-red-800',
    description: 'Multiple cash transactions above $10K threshold in manufacturing operations',
    dateIdentified: '2024-11-28',
    amount: 450000
  },
  {
    id: 'rf-002',
    category: 'Crypto Currency Exposure',
    severity: 'High',
    severityClass: 'bg-orange-100 text-orange-800',
    description: 'Business payments to cryptocurrency exchanges for equipment purchases',
    dateIdentified: '2024-11-25',
    amount: 125000
  },
  {
    id: 'rf-003',
    category: 'Foreign ATM Withdrawals',
    severity: 'Medium',
    severityClass: 'bg-yellow-100 text-yellow-800',
    description: 'ATM withdrawals in high-risk jurisdictions during business travel',
    dateIdentified: '2024-11-22',
    amount: 35000
  },
  {
    id: 'rf-004',
    category: 'Third Party Deposits',
    severity: 'Medium',
    severityClass: 'bg-yellow-100 text-yellow-800',
    description: 'Deposits from non-customer entities requiring enhanced due diligence',
    dateIdentified: '2024-11-20',
    amount: 280000
  }
])

const johnsonRiskMetrics = computed(() => ({
  totalTransactions: 47,
  totalAmount: 890000,
  riskLevel: 'High',
  peerRank: 8,
  geographicRisk: 'Medium',
  transactionPattern: 'Irregular',
  complianceScore: 68
}))

// New risk analytics computed properties
const reviewedWithAction = computed(() => 15)
const reviewedWithoutAction = computed(() => 8)
const totalRiskReviews = computed(() => riskReviewsPending.value + reviewedWithAction.value + reviewedWithoutAction.value)

const riskReviewTrendData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Pending Review',
      data: [12, 15, 8, 18, 22, 16, 14, 20, 25, 19, 17, totalRiskFlags.value],
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      borderWidth: 2
    },
    {
      label: 'Reviewed with Action',
      data: [8, 10, 6, 12, 15, 11, 9, 13, 16, 12, 10, reviewedWithAction.value],
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderWidth: 2
    },
    {
      label: 'Reviewed without Action',
      data: [4, 5, 2, 6, 7, 5, 5, 7, 9, 7, 7, reviewedWithoutAction.value],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 2
    }
  ]
}))

const riskReviewTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      grid: { display: true },
      title: {
        display: true,
        text: 'Number of Reviews'
      }
    }
  }
}

// Helper functions for risk modal
const getRiskScoreColor = (score) => {
  if (score >= 8) return 'text-red-600'
  if (score >= 6) return 'text-orange-600'
  if (score >= 4) return 'text-yellow-600'
  return 'text-green-600'
}

const getRiskScoreBarColor = (score) => {
  if (score >= 8) return 'bg-red-600'
  if (score >= 6) return 'bg-orange-600'
  if (score >= 4) return 'bg-yellow-600'
  return 'bg-green-600'
}

const getComplianceStatusClass = (status) => {
  switch (status) {
    case 'Compliant': return 'bg-green-100 text-green-800'
    case 'Under Review': return 'bg-yellow-100 text-yellow-800'
    case 'Non-Compliant': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const drillDownToRelationshipRisk = (relationship) => {
  // If it's Johnson Holdings Group, navigate to relationship view
  if (relationship.name === 'Johnson Holdings Group') {
    router.push({
      name: 'Relationship',
      params: {
        regionId: props.regionId,
        rmId: props.rmId,
        relationshipId: 'rel-001'
      },
      query: { tab: 'risk' }
    })
  } else {
    router.push({
      name: 'ClientDetail',
      params: {
        clientId: relationship.id,
        rmId: props.rmId,
        activeTab: 'risk'
      }
    })
  }
}

const viewRiskDetails = (relationship) => {
  console.log('Viewing risk details for:', relationship.name)
  // Could open a detailed risk modal or navigate to risk-specific view
}

const generateRiskReport = () => {
  console.log('Generating comprehensive risk report...')
  // Implement risk report generation
}


const exportRiskData = () => {
  console.log('Exporting risk analytics data...')
  // Implement risk data export
}

// Add these below the other helper methods
const getRelationshipOpportunityCount = (rel) => {
  // Mock: use leadCount as opportunity count
  return rel.leadCount || 0;
}
const getRelationshipOpportunityValue = (rel) => {
  // Mock: use leadValue as opportunity value
  return rel.leadValue || 0;
}
const getRelationshipAvgConfidence = (rel) => {
  // Mock: random confidence between 80-95
  return 85 + Math.floor(Math.random() * 10);
}

// Add after other chart data
const accountLoanLegend = [
  { label: 'Business Checking', color: '#04442c' },
  { label: 'Business Savings', color: '#a1e57e' },
  { label: 'Money Market', color: '#dce4e0' },
  { label: 'Investment Account', color: '#5c7f6e' },
  { label: 'Commercial Lending', color: '#e57373' },
  { label: 'Term Loans', color: '#c62828' },
  { label: 'Equipment Financing', color: '#ad1d1d' }
]

// Green color palette for relationships from the image
const relationshipGreenPalette = ['#ABE3C4', '#122A2C', '#F3DDCC', '#626058', '#577564', '#6A8E7C', '#959488', '#88B59A', '#102428']

// Add state for chart segmentation and legend filter
const accountLoanSegment = ref('account') // 'relationship' or 'account'
const accountLoanActiveLegends = ref(accountLoanLegend.map(l => l.label))
const selectedRelationshipFilter = ref('all')

// Add the toggleAccountLoanLegend method
const toggleAccountLoanLegend = (label) => {
  if (accountLoanActiveLegends.value.includes(label)) {
    accountLoanActiveLegends.value = accountLoanActiveLegends.value.filter(l => l !== label)
  } else {
    accountLoanActiveLegends.value.push(label)
  }
}

// Update accountLoanPortfolioChartData for the new segmentation logic
const accountLoanPortfolioChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  let datasets = []

  if (accountLoanSegment.value === 'relationship') {
    // Simple mode: each relationship gets one positive bar (deposits) and one negative bar (loans)
    sortedRelationships.value.forEach((rel, idx) => {
      // Deposits (positive) - use green palette
      datasets.push({
        label: `${rel.name} - Deposits`,
        backgroundColor: relationshipGreenPalette[idx % relationshipGreenPalette.length],
        data: labels.map(() => Math.floor(rel.deposits / 12 * (0.9 + Math.random() * 0.2)))
      })
      // Loans (negative) - use red shades
      datasets.push({
        label: `${rel.name} - Loans`,
        backgroundColor: '#e57373',
        data: labels.map(() => -Math.floor(rel.loans / 12 * (0.9 + Math.random() * 0.2)))
      })
    })
  } else {
    // Account type mode: stacked by account types, filtered by relationship
    const depositTypes = [
      { label: 'Business Checking', color: '#04442c' },
      { label: 'Business Savings', color: '#a1e57e' },
      { label: 'Money Market', color: '#dce4e0' },
      { label: 'Investment Account', color: '#5c7f6e' }
    ]
    const loanTypes = [
      { label: 'Commercial Lending', color: '#e57373' },
      { label: 'Term Loans', color: '#c62828' },
      { label: 'Equipment Financing', color: '#ad1d1d' }
    ]

    // Filter relationships based on dropdown selection
    const filteredRelationships = selectedRelationshipFilter.value === 'all'
      ? sortedRelationships.value
      : sortedRelationships.value.filter(rel => rel.id === selectedRelationshipFilter.value)

    // Create datasets for each account type
    depositTypes.forEach((type) => {
      if (!accountLoanActiveLegends.value.includes(type.label)) return
      datasets.push({
        label: type.label,
        backgroundColor: type.color,
        data: labels.map(() => {
          return filteredRelationships.reduce((sum, rel) => {
            return sum + Math.floor(rel.deposits / depositTypes.length / 12 * (0.8 + Math.random() * 0.4))
          }, 0)
        })
      })
    })

    loanTypes.forEach((type) => {
      if (!accountLoanActiveLegends.value.includes(type.label)) return
      datasets.push({
        label: type.label,
        backgroundColor: type.color,
        data: labels.map(() => {
          return -filteredRelationships.reduce((sum, rel) => {
            return sum + Math.floor(rel.loans / loanTypes.length / 12 * (0.8 + Math.random() * 0.4))
          }, 0)
        })
      })
    })
  }

  return { labels, datasets }
})

const accountLoanPortfolioChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
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

const revenueTrendsStackedChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
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

// Add computed property for relationships with risk statistics
const relationshipsWithRiskStats = computed(() => {
  return relationships.value.map(rel => ({
    ...rel,
    riskFlags: Math.max(0, Math.floor(rel.rci) - 4), // Mock: higher RCI = more flags
    lastReviewDate: '2024-05-15',
    nextDueDate: '2024-12-31',
    daysToDue: Math.floor(Math.random() * 60) + 1, // Mock: 1-60 days
    riskStatus: rel.rci > 7 ? 'Critical' : rel.rci > 5 ? 'Moderate' : 'Low',
    reviewedWithAction: Math.floor(Math.random() * 3), // mock
    reviewedWithoutAction: Math.floor(Math.random() * 2) // mock
  }))
})

// Add helper method for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Critical': return 'bg-red-100 text-red-800'
    case 'Moderate': return 'bg-yellow-100 text-yellow-800'
    case 'Low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Add after other chart data
const revenueTypeLegend = [
  { label: 'Loan Fee', color: '#ABE3C4' },
  { label: 'TMS Fee', color: '#577564' },
  { label: 'Deposit NII', color: '#6A8E7C' },
  { label: 'Loan NII', color: '#122A2C' }
]
const selectedRevenueRelationship = ref('all')
const revenueTypeActiveLegends = ref(revenueTypeLegend.map(t => t.label))
const toggleRevenueTypeLegend = (label) => {
  if (revenueTypeActiveLegends.value.includes(label)) {
    revenueTypeActiveLegends.value = revenueTypeActiveLegends.value.filter(l => l !== label)
  } else {
    revenueTypeActiveLegends.value.push(label)
  }
}
// Mock revenue data by type per relationship per month
const revenueTypeData = computed(() => {
  // 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })
  // For each relationship, generate revenue by type
  return sortedRelationships.value.map((rel, idx) => {
    const base = rel.revenue / 12
    return {
      id: rel.id,
      name: rel.name,
      industry: rel.industry,
      months,
      data: months.map(() => ({
        'Loan Fee': Math.floor(base * 0.25 * (0.9 + Math.random() * 0.2)),
        'TMS Fee': Math.floor(base * 0.18 * (0.9 + Math.random() * 0.2)),
        'Deposit NII': Math.floor(base * 0.32 * (0.9 + Math.random() * 0.2)),
        'Loan NII': Math.floor(base * 0.25 * (0.9 + Math.random() * 0.2)),
      }))
    }
  })
})
// Chart data for stacked bar
const revenueTypeStackedChartData = computed(() => {
  const rels = selectedRevenueRelationship.value === 'all'
    ? revenueTypeData.value
    : revenueTypeData.value.filter(r => r.id === selectedRevenueRelationship.value)
  if (!rels.length) return null
  const months = rels[0].months
  // For each revenue type, sum across relationships (if all), or just one
  return {
    labels: months,
    datasets: revenueTypeLegend
      .filter(type => revenueTypeActiveLegends.value.includes(type.label))
      .map(type => ({
        label: type.label,
        backgroundColor: type.color,
        data: months.map((_, i) => rels.reduce((sum, rel) => sum + rel.data[i][type.label], 0))
      }))
  }
})
const revenueTypeStackedChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
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
// Table helpers
const revenueSummaryRelationships = computed(() => {
  return selectedRevenueRelationship.value === 'all'
    ? sortedRelationships.value
    : sortedRelationships.value.filter(r => r.id === selectedRevenueRelationship.value)
})
const getRelationshipTotalRevenue = (rel) => {
  // Sum all types for all months
  const relData = revenueTypeData.value.find(r => r.id === rel.id)
  if (!relData) return 0
  return relData.data.reduce((sum, month) => sum + Object.values(month).reduce((s, v) => s + v, 0), 0)
}
const getRelationshipRevenueByType = (rel, type) => {
  const relData = revenueTypeData.value.find(r => r.id === rel.id)
  if (!relData) return 0
  return relData.data.reduce((sum, month) => sum + (month[type] || 0), 0)
}

// Add helper for relationship type
const getRelationshipType = (rel) => {
  const hasDeposits = rel.deposits > 0
  const hasLoans = rel.loans > 0
  if (hasDeposits && hasLoans) return 'Deposit and Loan Relationship'
  if (hasDeposits) return 'Deposit Only'
  if (hasLoans) return 'Loan Only'
  return 'No Products'
}
const getRelationshipTypeClass = (type) => {
  switch (type) {
    case 'Deposit and Loan Relationship': return 'bg-green-100 text-green-800'
    case 'Deposit Only': return 'bg-blue-100 text-blue-800'
    case 'Loan Only': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Add helper in <script setup>
const isNewRelationship = (rel) => {
  // Mock logic: new if depositsDelta > 0 or loansDelta > 0
  return rel.depositsDelta > 0 || rel.loansDelta > 0
}

// Chart data for modals
const revenueMonthlyChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  return {
    labels,
    datasets: [{
      label: 'Monthly Revenue',
      data: labels.map(() => Math.floor(totalRevenue.value / 12 * (0.8 + Math.random() * 0.4))),
      borderColor: '#06B6D4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      tension: 0.4
    }]
  }
})

const revenueMonthlyChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    }
  }
}

const relationshipsMonthlyChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  return {
    labels,
    datasets: [{
      label: 'Total Relationships',
      data: labels.map((_, i) => Math.floor(totalRelationships.value * (0.85 + i * 0.02))),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  }
})

const relationshipsMonthlyChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const creditRelationshipsMonthlyChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  const creditRelationships = Math.floor(totalRelationships.value * 0.7) // 70% have credit

  return {
    labels,
    datasets: [{
      label: 'Credit Relationships',
      data: labels.map((_, i) => Math.floor(creditRelationships * (0.8 + i * 0.03))),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    }]
  }
})

const creditRelationshipsMonthlyChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const depositsStackedChartData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  const datasets = sortedRelationships.value.map((rel, idx) => ({
    label: rel.name,
    data: labels.map(() => Math.floor(rel.deposits / 12 * (0.8 + Math.random() * 0.4))),
    backgroundColor: relationshipGreenPalette[idx % relationshipGreenPalette.length],
    stack: 'deposits'
  }))

  return { labels, datasets }
})

const depositsStackedChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
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
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    }
  }
}

// Enhanced Revenue Modal Data
const enhanced24MonthRevenueData = computed(() => {
  const labels = Array.from({ length: 24 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (23 - i))
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: labels.map((_, i) => {
          const base = totalRevenue.value / 12
          const seasonality = Math.sin((i % 12) * Math.PI / 6) * 0.15 + 1
          const growth = 1 + (i * 0.008) // 0.8% monthly growth trend
          return Math.floor(base * seasonality * growth * (0.9 + Math.random() * 0.2))
        }),
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Trend Line',
        data: labels.map((_, i) => {
          const base = totalRevenue.value / 12
          return Math.floor(base * (1 + i * 0.008))
        }),
        borderColor: '#DC2626',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4
      }
    ]
  }
})

const enhanced24MonthRevenueOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: $${(context.parsed.y / 1e6).toFixed(1)}M`
        }
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { display: true, color: 'rgba(0,0,0,0.1)' },
      ticks: {
        callback: function (value) {
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    }
  }
}

const revenueCompositionData = computed(() => {
  const products = ['Loan Fee', 'TMS Fee', 'Deposit NII', 'Loan NII']
  const colors = ['#ABE3C4', '#577564', '#6A8E7C', '#122A2C']

  return {
    labels: products,
    datasets: [{
      data: [
        totalRevenue.value * 0.25, // Loan Fee
        totalRevenue.value * 0.18, // TMS Fee
        totalRevenue.value * 0.32, // Deposit NII
        totalRevenue.value * 0.25  // Loan NII
      ],
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

const revenueCompositionOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: $${(value / 1e6).toFixed(1)}M (${percentage}%)`
        }
      }
    }
  }
}

const topRevenueProducts = computed(() => [
  { name: 'Deposit NII', growth: 15 },
  { name: 'Loan Fee', growth: 8 },
  { name: 'Loan NII', growth: 12 },
  { name: 'TMS Fee', growth: -3 }
])

const enhancedRevenueAnalysis = computed(() => {
  return relationships.value.map(rel => {
    const totalRev = rel.revenue
    return {
      ...rel,
      totalRevenue: totalRev,
      loanFee: Math.floor(totalRev * 0.25),
      tmsFee: Math.floor(totalRev * 0.18),
      depositNII: Math.floor(totalRev * 0.32),
      loanNII: Math.floor(totalRev * 0.25),
      yoyGrowth: Math.floor((rel.revenueDelta / (totalRev - rel.revenueDelta)) * 100),
      marketShare: Math.floor(Math.random() * 15) + 5 // Mock market share 5-20%
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue)
})

const regionalRMRanking = computed(() => [
  { name: 'Michael Chen', revenue: totalRevenue.value + 450000, relationships: 28, isYou: false },
  { name: 'Sarah Johnson', revenue: totalRevenue.value, relationships: totalRelationships.value, isYou: true },
  { name: 'Jennifer Wu', revenue: totalRevenue.value - 320000, relationships: 25, isYou: false },
  { name: 'Robert Taylor', revenue: totalRevenue.value - 580000, relationships: 22, isYou: false },
  { name: 'Lisa Zhang', revenue: totalRevenue.value - 750000, relationships: 19, isYou: false },
  { name: 'David Kim', revenue: totalRevenue.value - 920000, relationships: 24, isYou: false }
])

// Enhanced Relationships Modal Data
const relationshipHealthData = computed(() => {
  const healthRanges = ['90-100', '80-89', '70-79', '60-69', '50-59', '<50']
  const counts = [1, 1, 1, 0, 0, 0] // Mock distribution

  return {
    labels: healthRanges,
    datasets: [{
      label: 'Number of Relationships',
      data: counts,
      backgroundColor: [
        '#10B981', // Excellent (90-100)
        '#84CC16', // Good (80-89)
        '#F59E0B', // Fair (70-79)
        '#F97316', // Poor (60-69)
        '#EF4444', // Critical (50-59)
        '#DC2626'  // Emergency (<50)
      ],
      borderWidth: 1,
      borderColor: '#fff'
    }]
  }
})

const relationshipHealthOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed.y} relationships`
        }
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { display: true, color: 'rgba(0,0,0,0.1)' },
      ticks: { stepSize: 1 }
    }
  }
}

const engagementTrendsData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Meetings per Month',
        data: labels.map(() => Math.floor(Math.random() * 4) + 1),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Response Rate %',
        data: labels.map(() => Math.floor(Math.random() * 10) + 90),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }
})

const engagementTrendsOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      max: 5,
      title: { display: true, text: 'Meetings' }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      min: 80,
      max: 100,
      title: { display: true, text: 'Response Rate %' },
      grid: { drawOnChartArea: false }
    }
  }
}

const enhancedRelationshipAnalysis = computed(() => {
  return relationships.value.map(rel => ({
    ...rel,
    healthScore: Math.floor(Math.random() * 20) + 80, // 80-100 health score
    engagementScore: Math.floor(Math.random() * 3) + 7, // 7-10 engagement score
    productPenetration: Math.floor(Math.random() * 3) + 3, // 3-6 products
    relationshipDepth: ['Executive', 'Senior', 'Manager'][Math.floor(Math.random() * 3)],
    growthTrend: Math.floor((rel.revenueDelta / (rel.revenue - rel.revenueDelta)) * 100)
  })).sort((a, b) => b.healthScore - a.healthScore)
})

const relationshipCountRanking = computed(() => [
  { name: 'Michael Chen', count: 28, isYou: false },
  { name: 'Sarah Johnson', count: totalRelationships.value, isYou: true },
  { name: 'Jennifer Wu', count: 25, isYou: false },
  { name: 'David Kim', count: 24, isYou: false },
  { name: 'Robert Taylor', count: 22, isYou: false },
  { name: 'Lisa Zhang', count: 19, isYou: false }
])

const relationshipQualityRanking = computed(() => [
  { name: 'Sarah Johnson', score: 87, isYou: true },
  { name: 'Jennifer Wu', score: 84, isYou: false },
  { name: 'Michael Chen', score: 82, isYou: false },
  { name: 'David Kim', score: 79, isYou: false },
  { name: 'Robert Taylor', score: 76, isYou: false },
  { name: 'Lisa Zhang', score: 73, isYou: false }
])

const engagementRanking = computed(() => [
  { name: 'Sarah Johnson', engagement: 8.7, isYou: true },
  { name: 'Jennifer Wu', engagement: 8.2, isYou: false },
  { name: 'Michael Chen', engagement: 7.9, isYou: false },
  { name: 'David Kim', engagement: 7.5, isYou: false },
  { name: 'Robert Taylor', engagement: 7.1, isYou: false },
  { name: 'Lisa Zhang', engagement: 6.8, isYou: false }
])

// Helper functions for Relationships modal
const getHealthScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-green-500'
  if (score >= 70) return 'text-yellow-600'
  if (score >= 60) return 'text-orange-600'
  return 'text-red-600'
}

const getHealthScoreBarColor = (score) => {
  if (score >= 90) return 'bg-green-600'
  if (score >= 80) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-500'
  if (score >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const getEngagementColor = (score) => {
  if (score >= 8) return 'text-green-600'
  if (score >= 6) return 'text-yellow-600'
  return 'text-red-600'
}

const getRelationshipDepthClass = (depth) => {
  switch (depth) {
    case 'Executive': return 'bg-green-100 text-green-800'
    case 'Senior': return 'bg-blue-100 text-blue-800'
    case 'Manager': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Enhanced Deposits Modal Data
const depositCompositionData = computed(() => {
  const accountTypes = ['Business Checking', 'Investment Account', 'Money Market', 'Business Savings']
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']

  return {
    labels: accountTypes,
    datasets: [{
      data: [
        totalDeposits.value * 0.42, // Business Checking
        totalDeposits.value * 0.35, // Investment Account
        totalDeposits.value * 0.18, // Money Market
        totalDeposits.value * 0.05  // Business Savings
      ],
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

const depositCompositionOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: $${(value / 1e6).toFixed(1)}M (${percentage}%)`
        }
      }
    }
  }
}

const interestRateAnalysisData = computed(() => {
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return date.toLocaleDateString('en-US', { month: 'short' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Rate Paid %',
        data: labels.map(() => (2.3 + Math.random() * 0.2).toFixed(2)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Market Rate %',
        data: labels.map(() => (2.2 + Math.random() * 0.3).toFixed(2)),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        yAxisID: 'y'
      },
      {
        label: 'Net Interest Margin %',
        data: labels.map(() => (3.1 + Math.random() * 0.2).toFixed(2)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }
})

const interestRateAnalysisOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      min: 2.0,
      max: 2.8,
      title: { display: true, text: 'Interest Rate %' }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      min: 2.8,
      max: 3.6,
      title: { display: true, text: 'Net Interest Margin %' },
      grid: { drawOnChartArea: false }
    }
  }
}

const enhancedDepositsAnalysis = computed(() => {
  return relationships.value.map(rel => ({
    ...rel,
    avgInterestRate: (2.2 + Math.random() * 0.4).toFixed(2),
    accountTypes: Math.floor(Math.random() * 3) + 3, // 3-6 account types
    depositStability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    marketShare: Math.floor(Math.random() * 15) + 5, // 5-20% market share
    depositGrowthPercent: Math.floor((rel.depositsDelta / (rel.deposits - rel.depositsDelta)) * 100)
  })).sort((a, b) => b.deposits - a.deposits)
})

const enhanced24MonthDepositsData = computed(() => {
  const labels = Array.from({ length: 24 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (23 - i))
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  })

  const datasets = relationships.value.map((rel, idx) => ({
    label: rel.name,
    data: labels.map((_, i) => {
      const base = rel.deposits / 24
      const seasonality = Math.sin((i % 12) * Math.PI / 6) * 0.1 + 1
      const growth = 1 + (i * 0.005) // 0.5% monthly growth trend
      return Math.floor(base * seasonality * growth * (0.9 + Math.random() * 0.2))
    }),
    backgroundColor: relationshipGreenPalette[idx % relationshipGreenPalette.length],
    stack: 'deposits'
  }))

  return { labels, datasets }
})

const enhanced24MonthDepositsOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: { display: true, color: 'rgba(0,0,0,0.1)' },
      ticks: {
        callback: function (value) {
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    }
  }
}

const depositsRanking = computed(() => [
  { name: 'Sarah Johnson', deposits: totalDeposits.value, growth: depositsGrowth.value, isYou: true },
  { name: 'Michael Chen', deposits: totalDeposits.value - 85000000, growth: depositsGrowth.value - 3, isYou: false },
  { name: 'Jennifer Wu', deposits: totalDeposits.value - 120000000, growth: depositsGrowth.value - 5, isYou: false },
  { name: 'David Kim', deposits: totalDeposits.value - 180000000, growth: depositsGrowth.value - 8, isYou: false },
  { name: 'Robert Taylor', deposits: totalDeposits.value - 220000000, growth: depositsGrowth.value - 12, isYou: false },
  { name: 'Lisa Zhang', deposits: totalDeposits.value - 280000000, growth: depositsGrowth.value - 15, isYou: false }
])

const getDepositStabilityClass = (stability) => {
  switch (stability) {
    case 'High': return 'bg-green-100 text-green-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Low': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const depositsMonthlyChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `$${(value / 1e6).toFixed(1)}M`;
        }
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `${value.toFixed(1)}%`;
        }
      },
      grid: {
        drawOnChartArea: false,
      },
    }
  }
}

onMounted(() => {
  console.log('RelationshipManagerView mounted for RM:', props.rmId)
})

// Alert data
const delinquencyAlerts = computed(() => [
  {
    id: 'del-001',
    loanType: 'Commercial Term Loan',
    daysOverdue: 62,
    riskLevel: 'Critical',
    accountNumber: 'TL-2024-0892',
    amountDue: 125000,
    lastPayment: 'Oct 14, 2024',
    clientName: 'Johnson Manufacturing LLC',
    totalOutstanding: 2200000,
    originalAmount: 2800000,
    paymentHistoryScore: 42,
    covenantCompliance: false,
    estimatedRecovery: 65
  },
  {
    id: 'del-002',
    loanType: 'Equipment Financing',
    daysOverdue: 45,
    riskLevel: 'High',
    accountNumber: 'EF-2024-0445',
    amountDue: 85000,
    lastPayment: 'Oct 28, 2024',
    clientName: 'Johnson Holdings Group - Subsidiary A',
    totalOutstanding: 1800000,
    originalAmount: 2100000,
    paymentHistoryScore: 58,
    covenantCompliance: true,
    estimatedRecovery: 78
  }
])

const overdraftAlerts = computed(() => [
  {
    id: 'od-001',
    accountType: 'Business Operating Account',
    riskLevel: 'Medium',
    accountNumber: 'BOA-2024-1234',
    overdraftAmount: 450000,
    overdraftLimit: 300000,
    daysOverdrawn: 12,
    clientName: 'TechCorp Industries',
    recentTransactions: [
      { id: 't1', date: '2024-12-10', description: 'Payroll Processing', amount: -125000 },
      { id: 't2', date: '2024-12-09', description: 'Supplier Payment', amount: -85000 },
      { id: 't3', date: '2024-12-08', description: 'Customer Deposit', amount: 45000 },
      { id: 't4', date: '2024-12-07', description: 'Equipment Purchase', amount: -95000 }
    ]
  },
  {
    id: 'od-002',
    accountType: 'Business Checking',
    riskLevel: 'Low',
    accountNumber: 'BC-2024-5678',
    overdraftAmount: 25000,
    overdraftLimit: 50000,
    daysOverdrawn: 3,
    clientName: 'Global Retail Corp',
    recentTransactions: [
      { id: 't5', date: '2024-12-11', description: 'Inventory Payment', amount: -35000 },
      { id: 't6', date: '2024-12-10', description: 'Sales Deposit', amount: 15000 },
      { id: 't7', date: '2024-12-09', description: 'Rent Payment', amount: -12000 }
    ]
  }
])

const otherAlerts = computed(() => [
  {
    id: 'oth-001',
    alertType: 'Compliance Review',
    description: 'Annual AML compliance review required',
    riskLevel: 'Medium',
    priority: 'High',
    dateCreated: '2024-11-15',
    dueDate: '2024-12-31',
    details: 'Annual Anti-Money Laundering compliance review is due for Johnson Holdings Group. This review is required by regulatory guidelines and must be completed before year-end.',
    recommendations: [
      'Schedule meeting with compliance team',
      'Gather required documentation',
      'Review transaction patterns for past 12 months',
      'Update risk assessment profile'
    ]
  },
  {
    id: 'oth-002',
    alertType: 'Credit Review',
    description: 'Credit facility review overdue',
    riskLevel: 'High',
    priority: 'Critical',
    dateCreated: '2024-10-01',
    dueDate: '2024-11-30',
    details: 'TechCorp Industries credit facility review is 15 days overdue. Client has requested credit line increase which requires updated financial analysis.',
    recommendations: [
      'Request updated financial statements',
      'Analyze cash flow projections',
      'Review industry outlook',
      'Schedule credit committee presentation'
    ]
  },
  {
    id: 'oth-003',
    alertType: 'Covenant Monitoring',
    description: 'Debt service coverage ratio approaching threshold',
    riskLevel: 'Medium',
    priority: 'Medium',
    dateCreated: '2024-12-01',
    dueDate: '2024-12-15',
    details: 'Global Retail Corp debt service coverage ratio has declined to 1.35x, approaching the 1.25x covenant threshold. Requires immediate attention and potential restructuring discussion.',
    recommendations: [
      'Analyze recent financial performance',
      'Discuss operational improvements with client',
      'Consider covenant modification',
      'Prepare contingency plans'
    ]
  }
])

const totalActiveAlerts = computed(() => {
  return delinquencyAlerts.value.length + overdraftAlerts.value.length + otherAlerts.value.length
})

// Alert Tabs
const alertTabs = computed(() => [
  {
    id: 'delinquency',
    name: 'Loan Delinquency',
    icon: '📋',
    iconClass: 'text-red-500',
    count: delinquencyAlerts.value.length,
    badgeClass: 'bg-red-500 text-white'
  },
  {
    id: 'overdraft',
    name: 'Overdraft',
    icon: '💰',
    iconClass: 'text-yellow-500',
    count: overdraftAlerts.value.length,
    badgeClass: 'bg-yellow-500 text-white'
  },
  {
    id: 'other',
    name: 'Other Alerts',
    icon: '⚠️',
    iconClass: 'text-blue-500',
    count: otherAlerts.value.length,
    badgeClass: 'bg-blue-500 text-white'
  }
])

// Alert system helper functions
const getRiskLevelClass = (riskLevel) => {
  switch (riskLevel) {
    case 'Critical': return 'bg-red-100 text-red-800'
    case 'High': return 'bg-orange-100 text-orange-800'
    case 'Medium': return 'bg-yellow-100 text-yellow-800'
    case 'Low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600 font-medium'
  if (score >= 60) return 'text-yellow-600 font-medium'
  if (score >= 40) return 'text-orange-600 font-medium'
  return 'text-red-600 font-medium'
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'text-red-600'
    case 'High': return 'text-orange-600'
    case 'Medium': return 'text-yellow-600'
    case 'Low': return 'text-green-600'
    default: return 'text-gray-600'
  }
}

const reviewAlert = (alert) => {
  console.log('Reviewing alert:', alert)
  // Navigate to detailed alert review page or open detailed modal
  // This could integrate with the client detail view for risk metrics
  router.push({
    name: 'AlertReview',
    params: { alertId: alert.id }
  })
}

const scheduleCall = (alert) => {
  console.log('Scheduling call for alert:', alert)
  // Integrate with calendar system
  // Could open a scheduling modal or redirect to calendar application
}

const markAllAsReviewed = () => {
  console.log('Marking all alerts as reviewed')
  // Update alert status in backend
  // Refresh alert data
}

const exportAlertReport = () => {
  console.log('Exporting alert report')
  // Generate and download alert report
  // Could be PDF or Excel format with detailed alert information
}

// Enhanced ROE Modal Computed Properties
const roeTrendAnalysisData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Your ROE',
      data: [12.2, 13.1, 12.8, 13.5, 14.2, 13.9, 14.8, 15.1, 14.6, 15.3, 15.8, roe.value],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Regional Average',
      data: [11.8, 12.0, 11.9, 12.2, 12.5, 12.3, 12.8, 13.1, 12.9, 13.2, 13.4, peerAverageROE.value],
      borderColor: '#9CA3AF',
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      fill: false,
      borderDash: [5, 5]
    }
  ]
}))

const roeTrendAnalysisOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 10,
      max: 18,
      title: {
        display: true,
        text: 'ROE %'
      }
    }
  }
}))

const roePeerComparisonData = computed(() => ({
  labels: ['Sarah Johnson (You)', 'Michael Chen', 'Jennifer Wu', 'Robert Taylor', 'Lisa Park', 'David Kim'],
  datasets: [
    {
      label: 'ROE %',
      data: [roe.value, roe.value - 3, roe.value - 5, roe.value - 8, roe.value - 10, roe.value - 12],
      backgroundColor: [
        '#8B5CF6',  // You - purple
        '#10B981',  // Top performer - green
        '#F59E0B',  // Medium - amber
        '#EF4444',  // Lower - red
        '#EF4444',  // Lower - red
        '#EF4444'   // Lower - red
      ],
      borderWidth: 2,
      borderColor: '#374151'
    }
  ]
}))

const roePeerComparisonOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 0,
      title: {
        display: true,
        text: 'ROE %'
      }
    },
    x: {
      ticks: {
        maxRotation: 45
      }
    }
  }
}))

const roeRankingAnalysis = computed(() => [
  {
    id: 'rm-1',
    rank: 1,
    name: 'Michael Chen',
    region: 'Toronto Central',
    roe: roe.value + 3,
    totalRevenue: 8500000,
    relationshipCount: 18,
    avgRevenuePerRel: 472222,
    expenseRatio: 68,
    yoyChange: 12,
    portfolioQuality: 'Excellent'
  },
  {
    id: 'rm-2',
    rank: 2,
    name: 'Sarah Johnson',
    region: 'Toronto West',
    roe: roe.value,
    totalRevenue: totalRevenue.value,
    relationshipCount: totalRelationships.value,
    avgRevenuePerRel: Math.round(totalRevenue.value / totalRelationships.value),
    expenseRatio: Math.round((totalExpenses.value / totalRevenue.value) * 100),
    yoyChange: roeChange.value,
    portfolioQuality: 'Very Good'
  },
  {
    id: 'rm-3',
    rank: 3,
    name: 'Jennifer Wu',
    region: 'Toronto East',
    roe: roe.value - 5,
    totalRevenue: 6200000,
    relationshipCount: 22,
    avgRevenuePerRel: 281818,
    expenseRatio: 82,
    yoyChange: 4,
    portfolioQuality: 'Good'
  },
  {
    id: 'rm-4',
    rank: 4,
    name: 'Robert Taylor',
    region: 'Toronto North',
    roe: roe.value - 8,
    totalRevenue: 5800000,
    relationshipCount: 28,
    avgRevenuePerRel: 207143,
    expenseRatio: 85,
    yoyChange: -2,
    portfolioQuality: 'Fair'
  }
])

const getRoeColor = (roeValue) => {
  if (roeValue >= 15) return 'text-green-600'
  if (roeValue >= 12) return 'text-blue-600'
  if (roeValue >= 10) return 'text-orange-600'
  return 'text-red-600'
}

const getExpenseRatioColor = (ratio) => {
  if (ratio <= 70) return 'text-green-600'
  if (ratio <= 80) return 'text-yellow-600'
  return 'text-red-600'
}

const getPortfolioQualityClass = (quality) => {
  switch (quality) {
    case 'Excellent': return 'bg-green-100 text-green-800'
    case 'Very Good': return 'bg-blue-100 text-blue-800'
    case 'Good': return 'bg-yellow-100 text-yellow-800'
    case 'Fair': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Credit Commitments Modal Computed Properties
const totalCreditCommitments = computed(() => totalLoanCommitments.value * 1.3) // Total available credit
const creditUtilizationRate = computed(() => Math.round((totalLoanCommitments.value / totalCreditCommitments.value) * 100))
const avgCreditPerRelationship = computed(() => Math.round(totalCreditCommitments.value / totalRelationships.value))
const creditConcentration = computed(() => 42) // Mock: top 3 relationships % of total credit
const fytdNewCommitments = computed(() => 185000000) // Mock FYTD new commitments
const newCommitmentsGrowth = computed(() => Math.round((fytdNewCommitments.value / 150000000) * 100 - 100)) // vs target

const creditTrendAnalysisData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Commitments ($M)',
      data: [650, 675, 680, 720, 745, 765, 785, 820, 835, 855, 875, Math.round(totalCreditCommitments.value / 1000000)],
      type: 'bar',
      backgroundColor: 'rgba(249, 115, 22, 0.6)',
      borderColor: '#F97316',
      borderWidth: 1,
      yAxisID: 'y'
    },
    {
      label: 'Utilization %',
      data: [58, 62, 65, 68, 70, 69, 71, 73, 72, 71, 69, creditUtilizationRate.value],
      type: 'line',
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      yAxisID: 'y1'
    }
  ]
}))

const creditTrendAnalysisOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Commitments ($M)'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Utilization %'
      },
      grid: {
        drawOnChartArea: false
      },
      max: 100
    }
  }
}))

const creditTypeDistributionData = computed(() => ({
  labels: ['Term Loans', 'Credit Lines', 'Equipment Finance', 'SBA Loans', 'Real Estate', 'Working Capital'],
  datasets: [
    {
      data: [35, 28, 15, 12, 7, 3],
      backgroundColor: [
        '#F97316', // Orange
        '#EF4444', // Red
        '#10B981', // Green
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#F59E0B'  // Amber
      ],
      borderWidth: 2,
      borderColor: '#374151'
    }
  ]
}))

const creditTypeDistributionOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}))

const enhancedCreditAnalysis = computed(() =>
  relationships.value.map((rel, index) => ({
    ...rel,
    totalCommitment: rel.loans * 1.4, // Mock: 40% headroom
    utilizationRate: Math.round((rel.loans / (rel.loans * 1.4)) * 100),
    fytdNewCommitment: rel.name === 'Johnson Holdings Group' ? 85000000 :
      rel.name === 'TechStart Solutions' ? 45000000 :
        rel.name === 'Global Manufacturing Inc.' ? 32000000 :
          rel.name === 'MedDevice Corp' ? 18000000 :
            Math.round(Math.random() * 25000000), // Random for others
    creditRating: ['A+', 'A', 'A-', 'BBB+'][index % 4],
    loanTypes: [
      { type: 'Term Loan', amount: rel.loans * 0.6 },
      { type: 'Credit Line', amount: rel.loans * 0.3 },
      { type: 'Equipment', amount: rel.loans * 0.1 }
    ],
    recentActivity: [
      { date: '2024-11-15', type: 'Drawdown', amount: 2500000 },
      { date: '2024-10-22', type: 'Payment', amount: -1800000 }
    ],
    covenantStatus: index < 2 ? 'Compliant' : 'Watch',
    nextReview: '2024-12-30',
    riskWeightedExposure: rel.loans * (rel.rci / 10),
    profitability: Math.round(rel.revenue / rel.loans * 100) / 100
  }))
)

const creditRankingAnalysis = computed(() => [
  {
    id: 'rm-cr-1',
    rank: 1,
    name: 'Michael Chen',
    totalCommitments: 950000000,
    utilization: 68,
    avgCreditPerRel: 52777778,
    creditGrowth: 15,
    portfolioQuality: 'AAA',
    nplRatio: 0.8
  },
  {
    id: 'rm-cr-2',
    rank: 2,
    name: 'Sarah Johnson',
    totalCommitments: totalCreditCommitments.value,
    utilization: creditUtilizationRate.value,
    avgCreditPerRel: avgCreditPerRelationship.value,
    creditGrowth: 12,
    portfolioQuality: 'AA+',
    nplRatio: 1.2
  },
  {
    id: 'rm-cr-3',
    rank: 3,
    name: 'Jennifer Wu',
    totalCommitments: 720000000,
    utilization: 75,
    avgCreditPerRel: 32727273,
    creditGrowth: 8,
    portfolioQuality: 'AA',
    nplRatio: 1.8
  }
])

const getCreditRatingColor = (rating) => {
  if (rating.startsWith('A')) return 'text-green-600'
  if (rating.startsWith('BBB')) return 'text-blue-600'
  if (rating.startsWith('BB')) return 'text-yellow-600'
  return 'text-red-600'
}

const getCovenantStatusClass = (status) => {
  switch (status) {
    case 'Compliant': return 'bg-green-100 text-green-800'
    case 'Watch': return 'bg-yellow-100 text-yellow-800'
    case 'Breach': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getUtilizationColor = (utilization) => {
  if (utilization >= 80) return 'text-red-600'
  if (utilization >= 70) return 'text-orange-600'
  if (utilization >= 50) return 'text-yellow-600'
  return 'text-green-600'
}



// Performance Metrics Data
const performanceMetrics = computed(() => ({
  netNewCommitments: {
    actual: loanDelta.value,
    target: 30000000,
    achieved: loanDelta.value >= 30000000,
    achievementPercent: Math.round((loanDelta.value / 30000000) * 100)
  },
  netNewDeposits: {
    actual: depositsDelta.value,
    target: 100000000,
    achieved: depositsDelta.value >= 100000000,
    achievementPercent: Math.round((depositsDelta.value / 100000000) * 100)
  },
  netNewCreditRelationships: {
    actual: relationships.value.reduce((sum, rel) => sum + rel.newCreditRelationship, 0),
    target: 10,
    achieved: relationships.value.reduce((sum, rel) => sum + rel.newCreditRelationship, 0) >= 10,
    achievementPercent: Math.round((relationships.value.reduce((sum, rel) => sum + rel.newCreditRelationship, 0) / 10) * 100)
  },
  referrals: {
    actual: totalReferrals.value,
    target: 25,
    achieved: totalReferrals.value >= 25,
    achievementPercent: Math.round((totalReferrals.value / 25) * 100)
  },
  revenueFYTD: {
    actual: totalRevenue.value,
    target: 15000000, // $15M target
    achieved: totalRevenue.value >= 15000000,
    achievementPercent: Math.round((totalRevenue.value / 15000000) * 100)
  }
}))

const overallPerformanceScore = computed(() => {
  const metrics = performanceMetrics.value
  const scores = [
    metrics.netNewCommitments.achievementPercent,
    metrics.netNewDeposits.achievementPercent,
    metrics.netNewCreditRelationships.achievementPercent,
    metrics.referrals.achievementPercent
  ]
  return Math.round(scores.reduce((sum, score) => sum + Math.min(score, 100), 0) / 4)
})

const performanceTargetsAchieved = computed(() => {
  const metrics = performanceMetrics.value
  return [
    metrics.netNewCommitments.achieved,
    metrics.netNewDeposits.achieved,
    metrics.netNewCreditRelationships.achieved,
    metrics.referrals.achieved
  ].filter(Boolean).length
})

const nextPerformanceReview = computed(() => 'Jan 15, 2025')
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}
</style>