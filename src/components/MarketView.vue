<template>
  <div class="market-view">
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
          <router-link :to="`/metro/${metroId}`" class="text-gray-500 hover:text-td-green">{{ metro?.name
            }}</router-link>
        </li>
        <li class="flex items-center">
          <svg class="h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
          <span class="text-gray-900 font-medium">{{ market?.name }}</span>
        </li>
      </ol>
    </nav>

    <!-- Header with Role Context -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ market?.name }} Market</h1>
          <p class="text-gray-600">Risk Management & Regional Operations Dashboard</p>
        </div>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p class="text-sm font-medium text-orange-800">Role: Risk Manager / Regional Operations</p>
          <p class="text-xs text-orange-600">Market-level risk monitoring & compliance</p>
        </div>
      </div>
    </div>

    <!-- Alert Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="metric-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div class="flex items-center">
          <div class="p-2 bg-red-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-red-800">Typologies Identified</p>
            <p class="text-2xl font-bold text-red-900">{{ riskMetrics.typologiesIdentified }}</p>
            <p class="text-xs text-red-600">{{ riskMetrics.newTypologiesThisWeek }} new this week</p>
          </div>
        </div>
      </div>

      <div class="metric-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div class="flex items-center">
          <div class="p-2 bg-orange-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0V7.5a7.5 7.5 0 1115 0z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-orange-800">High Volume Patterns</p>
            <p class="text-2xl font-bold text-orange-900">{{ riskMetrics.highVolumePatterns }}</p>
            <p class="text-xs text-orange-600">{{ riskMetrics.volumeAlertsToday }} alerts today</p>
          </div>
        </div>
      </div>

      <div class="metric-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-yellow-800">Alerts (90 days)</p>
            <p class="text-2xl font-bold text-yellow-900">{{ riskMetrics.alerts90Days }}</p>
            <p class="text-xs text-yellow-600">{{ riskMetrics.alertsToday }} today</p>
          </div>
        </div>
      </div>

      <div class="metric-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div class="flex items-center">
          <div class="p-2 bg-blue-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-800">Reviews Pending</p>
            <p class="text-2xl font-bold text-blue-900">{{ riskMetrics.reviewsPending }}</p>
            <p class="text-xs text-blue-600">{{ riskMetrics.overdue }} overdue</p>
          </div>
        </div>
      </div>

      <div class="metric-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
              </path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-purple-800">Risk Score Avg</p>
            <p class="text-2xl font-bold text-purple-900">{{ riskMetrics.avgRiskScore }}</p>
            <p class="text-xs text-purple-600">{{ riskMetrics.highRiskClients }} high-risk</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Risk Score Breakdown (Histogram) -->
      <div class="card">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Risk Score Distribution</h3>
          <p class="text-sm text-gray-500">Client risk histogram</p>
        </div>
        <div class="p-4">
          <div class="h-48">
            <BarChart v-if="riskHistogramData" :data="riskHistogramData" />
            <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-500">Loading chart...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Trends -->
      <div class="card">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Alert Trends</h3>
          <p class="text-sm text-gray-500">6-month alert volume</p>
        </div>
        <div class="p-4">
          <div class="h-48">
            <LineChart v-if="alertTrendData" :data="alertTrendData" />
            <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-500">Loading chart...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Typology Patterns -->
      <div class="card">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Typology Patterns</h3>
          <p class="text-sm text-gray-500">Risk pattern distribution</p>
        </div>
        <div class="p-4">
          <div class="h-48">
            <DoughnutChart v-if="typologyPatternData" :data="typologyPatternData" />
            <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-500">Loading chart...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Risk Management Workflow (Risk Manager Focus) -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">🔍 Risk Investigation Workflow</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Case management and investigation tracking for risk managers
            </p>
          </div>
          <div class="flex space-x-2">
            <button class="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">
              Create Case
            </button>
            <button class="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>
      </div>
      <div class="p-6">
        <!-- Investigation Status Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="investigation-status">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Open Cases</span>
              <span class="text-2xl font-bold text-red-600">23</span>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600">• 5 High Priority</div>
              <div class="text-xs text-gray-600">• 12 Medium Priority</div>
              <div class="text-xs text-gray-600">• 6 Low Priority</div>
            </div>
          </div>

          <div class="investigation-status">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">SLA Performance</span>
              <span class="text-2xl font-bold text-orange-600">84%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div class="bg-orange-500 h-2 rounded-full" style="width: 84%"></div>
            </div>
            <p class="text-xs text-gray-500">Target: >90%</p>
          </div>

          <div class="investigation-status">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Avg Resolution Time</span>
              <span class="text-2xl font-bold text-blue-600">4.2</span>
            </div>
            <p class="text-xs text-gray-500 mb-1">days</p>
            <p class="text-xs text-green-600">↓ 12% vs last month</p>
          </div>

          <div class="investigation-status">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Cases This Month</span>
              <span class="text-2xl font-bold text-purple-600">47</span>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-gray-600">• 31 Closed</div>
              <div class="text-xs text-gray-600">• 16 Active</div>
            </div>
          </div>
        </div>

        <!-- Active Investigations -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">High Priority Active Investigations</h4>
          <div class="space-y-3">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <span class="bg-red-600 text-white text-xs px-2 py-1 rounded-full">URGENT</span>
                  <span class="font-medium text-gray-900">Global Tech Industries</span>
                  <span class="text-sm text-gray-600">Case #INV-2024-1203</span>
                </div>
                <span class="text-sm text-red-600 font-medium">2 days overdue</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Type:</span>
                  <span class="ml-1 text-gray-900">Crypto + Structuring</span>
                </div>
                <div>
                  <span class="text-gray-500">Risk Score:</span>
                  <span class="ml-1 text-red-600 font-medium">9.2/10</span>
                </div>
                <div>
                  <span class="text-gray-500">Assigned:</span>
                  <span class="ml-1 text-gray-900">Sarah Chen</span>
                </div>
                <div>
                  <span class="text-gray-500">Due:</span>
                  <span class="ml-1 text-red-600">Dec 1, 2024</span>
                </div>
              </div>
              <div class="mt-3 flex space-x-2">
                <button class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Escalate</button>
                <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">View Details</button>
                <button class="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Add Note</button>
              </div>
            </div>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <span class="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">HIGH</span>
                  <span class="font-medium text-gray-900">Alpha Manufacturing Corp</span>
                  <span class="text-sm text-gray-600">Case #INV-2024-1198</span>
                </div>
                <span class="text-sm text-orange-600 font-medium">Due in 1 day</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Type:</span>
                  <span class="ml-1 text-gray-900">High Cash Volume</span>
                </div>
                <div>
                  <span class="text-gray-500">Risk Score:</span>
                  <span class="ml-1 text-orange-600 font-medium">7.8/10</span>
                </div>
                <div>
                  <span class="text-gray-500">Assigned:</span>
                  <span class="ml-1 text-gray-900">Mike Rodriguez</span>
                </div>
                <div>
                  <span class="text-gray-500">Due:</span>
                  <span class="ml-1 text-orange-600">Dec 4, 2024</span>
                </div>
              </div>
              <div class="mt-3 flex space-x-2">
                <button class="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700">Review</button>
                <button class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">View Details</button>
                <button class="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">Add Note</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Regulatory Compliance Tracking -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 class="text-sm font-medium text-blue-800 mb-3">🏛️ Regulatory Status</h5>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-blue-700">BSA/AML Compliance</span>
                <span class="font-medium text-green-600">94%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-blue-700">SAR Filing Rate</span>
                <span class="font-medium text-green-600">98%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-blue-700">Next Exam</span>
                <span class="font-medium text-orange-600">Q2 2025</span>
              </div>
            </div>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 class="text-sm font-medium text-green-800 mb-3">📊 Performance Metrics</h5>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-green-700">False Positive Rate</span>
                <span class="font-medium text-green-600">12%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-green-700">Model Accuracy</span>
                <span class="font-medium text-green-600">91%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-green-700">Auto-Close Rate</span>
                <span class="font-medium text-blue-600">67%</span>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 class="text-sm font-medium text-purple-800 mb-3">⚠️ Risk Alerts</h5>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-purple-700">High-Risk Alerts</span>
                <span class="font-medium text-red-600">8 today</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-purple-700">Medium-Risk Alerts</span>
                <span class="font-medium text-orange-600">23 today</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-purple-700">Trend</span>
                <span class="font-medium text-green-600">↓ 15% vs avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flagged Clients Summary -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Flagged Clients Summary</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Clients requiring immediate attention and recommended
              actions</p>
          </div>
          <div class="flex space-x-2">
            <button @click="filterClients('all')"
              :class="['px-3 py-1 text-xs rounded-full', clientFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']">
              All ({{ flaggedClients.length }})
            </button>
            <button @click="filterClients('escalate')"
              :class="['px-3 py-1 text-xs rounded-full', clientFilter === 'escalate' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700']">
              Escalate ({{ getClientsWithAction('Escalate for Review').length }})
            </button>
            <button @click="filterClients('review')"
              :class="['px-3 py-1 text-xs rounded-full', clientFilter === 'review' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700']">
              Review Patterns ({{ getClientsWithAction('Pattern Review').length }})
            </button>
            <button @click="filterClients('upsell')"
              :class="['px-3 py-1 text-xs rounded-full', clientFilter === 'upsell' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700']">
              Upsell ({{ getClientsWithAction('Upsell Opportunity').length }})
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerts (90d)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended
                Action</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50"
              :class="getClientRowClass(client.recommendedAction)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="getActionIconClass(client.recommendedAction)">
                    <span class="text-xs font-medium">{{ getActionIcon(client.recommendedAction) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                    <div class="text-sm text-gray-500">{{ client.industry }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span v-for="risk in client.riskTypes" :key="risk" class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getRiskTypeClass(risk)">
                    {{ risk }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm font-bold" :class="getRiskScoreColor(client.riskScore)">{{ client.riskScore
                    }}</span>
                  <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" :style="{ width: (client.riskScore / 10 * 100) + '%' }">
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.lastActivity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium" :class="client.alerts90Days >= 3 ? 'text-red-600' : 'text-gray-900'">
                  {{ client.alerts90Days }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getRecommendedActionClass(client.recommendedAction)">
                  {{ client.recommendedAction }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button v-if="client.recommendedAction === 'Escalate for Review'"
                    class="text-red-600 hover:text-red-800 font-medium">Escalate</button>
                  <button v-if="client.recommendedAction === 'Auto Investigation'"
                    class="text-orange-600 hover:text-orange-800 font-medium">Investigate</button>
                  <button v-if="client.recommendedAction === 'Upsell Opportunity'"
                    class="text-green-600 hover:text-green-800 font-medium">View Products</button>
                  <button class="text-blue-600 hover:text-blue-800 font-medium">Review</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Gap Analysis -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Product Gap Analysis</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Clients missing key products and revenue opportunities</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eligible
                Clients</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current
                Adoption</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gap %</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue
                Potential</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in productGaps" :key="product.name" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.eligibleClients }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.currentAdoption }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900">{{ product.gapPercentage }}%</span>
                  <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div class="bg-orange-400 h-2 rounded-full" :style="{ width: product.gapPercentage + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{{
                formatCurrency(product.revenuePotential) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPriorityBadgeClass(product.priority)">
                  {{ product.priority }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Regions Table -->
    <div class="card">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Regional Performance</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Click on any row to drill down into region's relationship
          managers</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMs</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerts</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="region in marketRegions" :key="region.id" @click="drillDownToRegion(region)"
              class="hover:bg-gray-50 cursor-pointer transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{region.name.split(' ').map(n => n[0]).join('')
                        }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ region.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(region.portfolioValue) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ region.clientCount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(region.revenue) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ region.rmCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['risk-flag', getRiskColor(region.riskScore)]">{{ region.riskScore }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-red-600">{{ getRandomAlertCount() }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMarketById, getRegionsByMarket, formatCurrency, getRiskColor, getMetroById } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'
import LineChart from './charts/LineChart.vue'
import DoughnutChart from './charts/DoughnutChart.vue'

const props = defineProps({
  metroId: {
    type: String,
    required: true
  },
  marketId: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Reactive data
const clientFilter = ref('all')
const riskMetrics = reactive({
  typologiesIdentified: 31,
  newTypologiesThisWeek: 6,
  highVolumePatterns: 24,
  volumeAlertsToday: 5,
  alerts90Days: 156,
  alertsToday: 8,
  reviewsPending: 42,
  overdue: 7,
  avgRiskScore: 6.2,
  highRiskClients: 15
})

const flaggedClients = ref([
  {
    id: 'client-fl-001',
    name: 'Global Trading LLC',
    industry: 'Trading',
    riskScore: 9.2,
    riskTypes: ['Cross-Border', 'High-Cash', 'PEP'],
    lastActivity: '2 days ago',
    alerts90Days: 5,
    recommendedAction: 'Escalate for Review'
  },
  {
    id: 'client-fl-002',
    name: 'Crypto Exchange Corp',
    industry: 'Financial Services',
    riskScore: 8.7,
    riskTypes: ['Crypto', 'MSB', 'High-Volume'],
    lastActivity: '1 week ago',
    alerts90Days: 4,
    recommendedAction: 'Pattern Review'
  },
  {
    id: 'client-fl-003',
    name: 'Manufacturing Plus Inc',
    industry: 'Manufacturing',
    riskScore: 4.2,
    riskTypes: ['Cross-Border'],
    lastActivity: '3 days ago',
    alerts90Days: 1,
    recommendedAction: 'Upsell Opportunity'
  },
  {
    id: 'client-fl-004',
    name: 'Energy Dynamics LLC',
    industry: 'Energy',
    riskScore: 8.9,
    riskTypes: ['Sanctions', 'High-Cash'],
    lastActivity: '12 hours ago',
    alerts90Days: 6,
    recommendedAction: 'Escalate for Review'
  },
  {
    id: 'client-fl-005',
    name: 'Caribbean Holdings SA',
    industry: 'Investment',
    riskScore: 8.4,
    riskTypes: ['Offshore', 'PEP', 'High-Cash'],
    lastActivity: '4 days ago',
    alerts90Days: 3,
    recommendedAction: 'Pattern Review'
  },
  {
    id: 'client-fl-006',
    name: 'Tech Solutions Corp',
    industry: 'Technology',
    riskScore: 3.8,
    riskTypes: ['Cross-Border'],
    lastActivity: '1 day ago',
    alerts90Days: 0,
    recommendedAction: 'Upsell Opportunity'
  }
])

const productGaps = ref([
  { name: 'Treasury Management', eligibleClients: 145, currentAdoption: 89, gapPercentage: 39, revenuePotential: 3400000, priority: 'High' },
  { name: 'FX Services', eligibleClients: 178, currentAdoption: 134, gapPercentage: 25, revenuePotential: 2800000, priority: 'High' },
  { name: 'Commercial Lending', eligibleClients: 120, currentAdoption: 98, gapPercentage: 18, revenuePotential: 4200000, priority: 'Medium' },
  { name: 'Trade Finance', eligibleClients: 89, currentAdoption: 76, gapPercentage: 15, revenuePotential: 1800000, priority: 'Medium' },
  { name: 'Investment Services', eligibleClients: 156, currentAdoption: 142, gapPercentage: 9, revenuePotential: 2100000, priority: 'Low' }
])

// Computed properties
const market = computed(() => getMarketById(props.marketId))
const metro = computed(() => getMetroById(props.metroId))
const marketRegions = computed(() => getRegionsByMarket(props.marketId))

const filteredClients = computed(() => {
  if (clientFilter.value === 'all') return flaggedClients.value
  return flaggedClients.value.filter(client => {
    switch (clientFilter.value) {
      case 'escalate': return client.recommendedAction === 'Escalate for Review'
      case 'review': return client.recommendedAction === 'Pattern Review'
      case 'upsell': return client.recommendedAction === 'Upsell Opportunity'
      default: return true
    }
  })
})

const riskHistogramData = computed(() => {
  return {
    labels: ['0-2', '2-4', '4-6', '6-8', '8-10'],
    datasets: [{
      label: 'Number of Clients',
      data: [12, 45, 89, 67, 23],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(127, 29, 29, 0.8)'
      ],
      borderColor: [
        '#22C55E',
        '#3B82F6',
        '#F59E0B',
        '#EF4444',
        '#7F1D1D'
      ],
      borderWidth: 1
    }]
  }
})

const alertTrendData = computed(() => {
  const months = ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024']
  const alerts = [89, 124, 156, 142, 178, 156]

  return {
    labels: months,
    datasets: [{
      label: 'Total Alerts',
      data: alerts,
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

const typologyPatternData = computed(() => {
  return {
    labels: ['Structuring', 'Trade-Based ML', 'Cash Intensive', 'Digital Assets'],
    datasets: [{
      data: [12, 8, 15, 9],
      backgroundColor: [
        '#EF4444',
        '#F59E0B',
        '#3B82F6',
        '#10B981'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
})

// Methods
const drillDownToRegion = (region) => {
  console.log('Navigating to Region:', region.id)
  router.push({
    name: 'Region',
    params: {
      metroId: props.metroId,
      marketId: props.marketId,
      regionId: region.id
    }
  })
}

const filterClients = (filter) => {
  clientFilter.value = filter
}

const getClientsWithAction = (action) => {
  return flaggedClients.value.filter(client => client.recommendedAction === action)
}

const getClientRowClass = (action) => {
  switch (action) {
    case 'Escalate for Review': return 'bg-red-50 border-l-4 border-red-500'
    case 'Pattern Review': return 'bg-orange-50 border-l-4 border-orange-500'
    case 'Upsell Opportunity': return 'bg-green-50 border-l-4 border-green-500'
    default: return ''
  }
}

const getActionIconClass = (action) => {
  switch (action) {
    case 'Escalate for Review': return 'bg-red-100 text-red-800'
    case 'Pattern Review': return 'bg-orange-100 text-orange-800'
    case 'Upsell Opportunity': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getActionIcon = (action) => {
  switch (action) {
    case 'Escalate for Review': return '!'
    case 'Pattern Review': return '🔍'
    case 'Upsell Opportunity': return '$'
    default: return 'i'
  }
}

const getRiskTypeClass = (riskType) => {
  const classes = {
    'Cross-Border': 'bg-blue-100 text-blue-800',
    'High-Cash': 'bg-red-100 text-red-800',
    'PEP': 'bg-purple-100 text-purple-800',
    'Crypto': 'bg-yellow-100 text-yellow-800',
    'MSB': 'bg-orange-100 text-orange-800',
    'High-Volume': 'bg-indigo-100 text-indigo-800',
    'Sanctions': 'bg-red-100 text-red-800',
    'Offshore': 'bg-gray-100 text-gray-800'
  }
  return classes[riskType] || 'bg-gray-100 text-gray-800'
}

const getRiskScoreColor = (score) => {
  if (score >= 8) return 'text-red-600'
  if (score >= 6) return 'text-yellow-600'
  return 'text-green-600'
}

const getRecommendedActionClass = (action) => {
  switch (action) {
    case 'Escalate for Review': return 'bg-red-100 text-red-800'
    case 'Pattern Review': return 'bg-orange-100 text-orange-800'
    case 'Upsell Opportunity': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityBadgeClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getRandomAlertCount = () => {
  return Math.floor(Math.random() * 15) + 1
}

// Lifecycle
onMounted(() => {
  console.log('MarketView mounted for market:', props.marketId)
  console.log('Market data:', market.value)
  console.log('Market regions:', marketRegions.value)
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