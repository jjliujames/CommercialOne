<template>
  <div class="executive-view">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Executive Portfolio Dashboard</h1>
      <p class="text-gray-600">Commercial Banking Portfolio Overview</p>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Filters & Analysis</h3>
        <button @click="resetFilters"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        <!-- Metro Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Metro</label>
          <select v-model="filters.metro" class="filter-select">
            <option value="">All Metros</option>
            <option value="new-york">New York Metro</option>
            <option value="boston">Boston Metro</option>
            <option value="philadelphia">Philadelphia Metro</option>
            <option value="atlanta">Atlanta Metro</option>
            <option value="miami">Miami Metro</option>
            <option value="chicago">Chicago Metro</option>
            <option value="london">London Metro</option>
            <option value="toronto">Toronto Metro</option>
          </select>
        </div>

        <!-- Market Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Market</label>
          <select v-model="filters.market" class="filter-select">
            <option value="">All Markets</option>
            <option value="north-america">North America</option>
            <option value="international">International</option>
          </select>
        </div>

        <!-- Region Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select v-model="filters.region" class="filter-select">
            <option value="">All Regions</option>
            <option value="northeast">Northeast US</option>
            <option value="southeast">Southeast US</option>
            <option value="midwest">Midwest US</option>
            <option value="europe">Europe</option>
            <option value="asia-pacific">Asia Pacific</option>
          </select>
        </div>

        <!-- Vertical Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vertical</label>
          <select v-model="filters.vertical" class="filter-select">
            <option value="">All Verticals</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="financial-services">Financial Services</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="energy">Energy & Utilities</option>
            <option value="real-estate">Real Estate</option>
            <option value="retail">Retail & Consumer</option>
          </select>
        </div>

        <!-- RVP Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">RVP</label>
          <select v-model="filters.rvp" class="filter-select">
            <option value="">All RVPs</option>
            <option value="sarah-johnson">Sarah Johnson</option>
            <option value="michael-chen">Michael Chen</option>
            <option value="emily-rodriguez">Emily Rodriguez</option>
            <option value="david-thompson">David Thompson</option>
            <option value="lisa-wang">Lisa Wang</option>
            <option value="robert-martinez">Robert Martinez</option>
            <option value="jennifer-kim">Jennifer Kim</option>
            <option value="christopher-lee">Christopher Lee</option>
          </select>
        </div>

        <!-- Year Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select v-model="filters.year" class="filter-select">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <!-- Month Range Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Month Range</label>
          <select v-model="filters.monthRange" class="filter-select">
            <option value="last-6">Last 6 Months</option>
            <option value="last-12">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
            <option value="q4">Q4 2024</option>
            <option value="q3">Q3 2024</option>
            <option value="q2">Q2 2024</option>
            <option value="q1">Q1 2024</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="metric-card">
        <div class="flex items-center">
          <div class="p-2 bg-td-green rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
              </path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total Portfolio</p>
            <div class="flex items-center justify-between">
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.totalPortfolioValue) }}</p>
              <div class="ml-3">
                <div class="flex items-center space-x-2">
                  <button @click="toggleMetricView('portfolio')"
                    class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                    {{ metricViewType === 'yoy' ? 'YoY' : 'MoM' }}
                  </button>
                  <span :class="['text-sm font-medium', getChangeColor(getMetricChange('portfolio'))]">
                    {{ getMetricChange('portfolio') }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Sparkline -->
            <div class="mt-2 h-8 flex items-end space-x-1">
              <div v-for="(value, index) in metrics.sparklines.portfolioValue" :key="index"
                class="bg-td-green opacity-60 rounded-sm transition-all duration-200" :style="{
                  height: `${(value / Math.max(...metrics.sparklines.portfolioValue)) * 100}%`,
                  width: '8px'
                }">
              </div>
            </div>
          </div>
        </div>
        <!-- Trend Analysis Button -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button @click="showTrendChart('portfolio')"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            View Trend Analysis
          </button>
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
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total Clients</p>
            <div class="flex items-center justify-between">
              <p class="text-2xl font-bold text-gray-900">{{ metrics.totalClients.toLocaleString() }}</p>
              <div class="ml-3">
                <div class="flex items-center space-x-2">
                  <button @click="toggleMetricView('clients')"
                    class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                    {{ metricViewType === 'yoy' ? 'YoY' : 'MoM' }}
                  </button>
                  <span :class="['text-sm font-medium', getChangeColor(getMetricChange('clients'))]">
                    {{ getMetricChange('clients') }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Sparkline -->
            <div class="mt-2 h-8 flex items-end space-x-1">
              <div v-for="(value, index) in metrics.sparklines.clientCount" :key="index"
                class="bg-green-600 opacity-60 rounded-sm transition-all duration-200" :style="{
                  height: `${(value / Math.max(...metrics.sparklines.clientCount)) * 100}%`,
                  width: '8px'
                }">
              </div>
            </div>
          </div>
        </div>
        <!-- Trend Analysis Button -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button @click="showTrendChart('clients')"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            View Trend Analysis
          </button>
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
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Annual Revenue</p>
            <div class="flex items-center justify-between">
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.totalRevenue) }}</p>
              <div class="ml-3">
                <div class="flex items-center space-x-2">
                  <button @click="toggleMetricView('revenue')"
                    class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                    {{ metricViewType === 'yoy' ? 'YoY' : 'MoM' }}
                  </button>
                  <span :class="['text-sm font-medium', getChangeColor(getMetricChange('revenue'))]">
                    {{ getMetricChange('revenue') }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Sparkline -->
            <div class="mt-2 h-8 flex items-end space-x-1">
              <div v-for="(value, index) in metrics.sparklines.revenue" :key="index"
                class="bg-green-500 opacity-60 rounded-sm transition-all duration-200" :style="{
                  height: `${(value / Math.max(...metrics.sparklines.revenue)) * 100}%`,
                  width: '8px'
                }">
              </div>
            </div>
          </div>
        </div>
        <!-- Trend Analysis Button -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button @click="showTrendChart('revenue')"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
              </path>
            </svg>
            View Trend Analysis
          </button>
        </div>
      </div>
    </div>

    <!-- AI Opportunity Insights Section -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Opportunity Value -->
      <div class="metric-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
              </path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-purple-800">Opportunity Value</p>
            <p class="text-2xl font-bold text-purple-900">{{
              formatCurrency(metrics.opportunityInsights.totalOpportunityValue) }}</p>
            <p class="text-xs text-purple-600">Potential Revenue</p>
            <!-- Sparkline for opportunities -->
            <div class="mt-2 h-6 flex items-end space-x-1">
              <div v-for="(value, index) in metrics.sparklines.opportunities" :key="index"
                class="bg-purple-600 opacity-60 rounded-sm transition-all duration-200" :style="{
                  height: `${(value / Math.max(...metrics.sparklines.opportunities)) * 100}%`,
                  width: '6px'
                }">
              </div>
            </div>
          </div>
        </div>
        <!-- Trend Analysis Button -->
        <div class="mt-4 pt-4 border-t border-purple-200">
          <button @click="showTrendChart('opportunities')"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 transition-colors">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
              </path>
            </svg>
            View Opportunities
          </button>
        </div>
      </div>

      <!-- Clients Needing Upsell -->
      <div class="metric-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div class="flex items-center">
          <div class="p-2 bg-blue-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
              </path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-blue-800">Upsell Opportunities</p>
            <p class="text-2xl font-bold text-blue-900">{{
              metrics.opportunityInsights.clientsNeedingUpsell.toLocaleString() }}</p>
            <p class="text-xs text-blue-600">{{ ((metrics.opportunityInsights.clientsNeedingUpsell /
              metrics.totalClients) * 100).toFixed(1) }}% of clients</p>
            <!-- Sparkline for high risk clients -->
            <div class="mt-2 h-6 flex items-end space-x-1">
              <div v-for="(value, index) in metrics.sparklines.highRiskClients" :key="index"
                class="bg-blue-600 opacity-60 rounded-sm transition-all duration-200" :style="{
                  height: `${(value / Math.max(...metrics.sparklines.highRiskClients)) * 100}%`,
                  width: '6px'
                }">
              </div>
            </div>
          </div>
        </div>
        <!-- Trend Analysis Button -->
        <div class="mt-4 pt-4 border-t border-blue-200">
          <button @click="showTrendChart('risk')"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            View Risk Trends
          </button>
        </div>
      </div>

      <!-- Average Opportunity Size -->
      <div class="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div class="flex items-center">
          <div class="p-2 bg-green-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
              </path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-green-800">Avg Opportunity</p>
            <p class="text-2xl font-bold text-green-900">{{
              formatCurrency(metrics.opportunityInsights.avgOpportunityPerClient) }}</p>
            <p class="text-xs text-green-600">Per Client</p>
          </div>
        </div>
      </div>

      <!-- Product Penetration Overall -->
      <div class="metric-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div class="flex items-center">
          <div class="p-2 bg-orange-600 rounded-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-orange-800">Product Penetration</p>
            <p class="text-2xl font-bold text-orange-900">{{ metrics.productPenetrationOverall }}%</p>
            <p class="text-xs text-orange-600">Overall Coverage</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Penetration Dashboard -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Product Penetration Dashboard</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Current product adoption across client base with opportunity
          gaps</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(product, key) in metrics.productPenetration" :key="key" class="product-penetration-card">
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-sm font-medium text-gray-900 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</h4>
              <span class="text-lg font-bold" :class="getPenetrationColor(product.penetration)">{{ product.penetration
                }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div class="bg-td-green h-2 rounded-full" :style="{ width: product.penetration + '%' }"></div>
            </div>
            <div class="grid grid-cols-3 gap-3 text-xs">
              <div class="text-center">
                <p class="font-medium text-gray-900">{{ product.clients }}</p>
                <p class="text-gray-500">Current</p>
              </div>
              <div class="text-center">
                <p class="font-medium text-blue-600">{{ product.gap }}</p>
                <p class="text-gray-500">Gap</p>
              </div>
              <div class="text-center">
                <p class="font-medium text-green-600">{{ product.potential }}</p>
                <p class="text-gray-500">Potential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Opportunity Heatmap -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">AI Opportunity Score Heatmap</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Metro-level opportunity rankings based on AI analysis</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="metro in metrics.aiOpportunityHeatmap" :key="metro.metro" class="opportunity-heatmap-card"
            :class="getOpportunityScoreClass(metro.score)">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-900">{{ metro.metro }}</h4>
              <span class="text-lg font-bold" :class="getScoreColor(metro.score)">{{ metro.score }}</span>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Opportunities:</span>
                <span class="font-medium">{{ metro.opportunities }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Potential:</span>
                <span class="font-medium text-green-600">{{ formatCurrency(metro.potential) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Opportunities by Metro -->
    <div class="card mb-8">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Top Opportunities by Metro</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Highest priority revenue opportunities across key metros</p>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div v-for="metro in metrics.topOpportunitiesByMetro" :key="metro.metro" class="metro-opportunities">
            <h4 class="text-lg font-medium text-gray-900 mb-3">{{ metro.metro }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="opportunity in metro.opportunities" :key="opportunity.type" class="opportunity-item"
                :class="getPriorityClass(opportunity.priority)">
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm font-medium text-gray-900">{{ opportunity.type }}</h5>
                  <span class="text-xs px-2 py-1 rounded-full" :class="getPriorityBadgeClass(opportunity.priority)">
                    {{ opportunity.priority }}
                  </span>
                </div>
                <div class="space-y-1 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Clients:</span>
                    <span class="font-medium">{{ opportunity.clients }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Revenue:</span>
                    <span class="font-medium text-green-600">{{ formatCurrency(opportunity.revenue) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Portfolio Value Trend -->
      <div class="card">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Portfolio Value Trend</h3>
          <p class="text-sm text-gray-500">6-month portfolio growth</p>
        </div>
        <div class="h-40">
          <BarChart v-if="portfolioTrendData" :data="portfolioTrendData" />
          <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-500">Loading chart...</span>
          </div>
        </div>
      </div>

      <!-- Client Growth Trend -->
      <div class="card">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Client Growth</h3>
          <p class="text-sm text-gray-500">Total client base growth</p>
        </div>
        <div class="h-40">
          <BarChart v-if="clientGrowthData" :data="clientGrowthData" />
          <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-500">Loading chart...</span>
          </div>
        </div>
      </div>

      <!-- Revenue Trend -->
      <div class="card">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Revenue Trend</h3>
          <p class="text-sm text-gray-500">Monthly revenue performance</p>
        </div>
        <div class="h-40">
          <BarChart v-if="revenueChartData" :data="revenueChartData" />
          <div v-else class="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-500">Loading chart...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Risk Indicators Panel -->
    <div class="card mb-8">
      <KRIPanel :kri="metrics.keyRiskIndicators" />
    </div>

    <!-- Markets Table -->
    <div class="card">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Metro Performance</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Click on any row to drill down into metro markets</p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metro</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Value
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Markets</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="metro in metrosList" :key="metro.id" @click="drillDownToMetro(metro)"
              class="hover:bg-gray-50 cursor-pointer transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-td-green flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{metro.name.split(' ').map(n => n[0]).join('')
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ metro.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(metro.portfolioValue) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ metro.clientCount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(metro.revenue) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ metro.marketCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['risk-flag', getRiskColor(metro.riskScore)]">{{ metro.riskScore }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Hover Trend Chart Modal -->
    <div v-if="showChart" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="hideTrendChart()">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ currentChart.title }}</h3>
              <p class="text-sm text-gray-600">{{ currentChart.subtitle }}</p>
            </div>
            <button @click="hideTrendChart()" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Chart Content -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Main Trend Chart -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">6-Month Trend</h4>
              <div class="h-64">
                <canvas :data-ref="`trendChart-${currentChart.type}`" class="w-full h-full"></canvas>
              </div>
            </div>

            <!-- Key Insights -->
            <div class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-blue-800 mb-2">📊 Key Insights</h4>
                <ul class="space-y-1 text-sm text-blue-700">
                  <li v-for="insight in currentChart.insights" :key="insight">• {{ insight }}</li>
                </ul>
              </div>

              <!-- Trend Statistics -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-green-800 mb-3">📈 Trend Analysis</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="stat in currentChart.stats" :key="stat.label" class="text-center">
                    <p class="text-lg font-bold text-green-900">{{ stat.value }}</p>
                    <p class="text-xs text-green-600">{{ stat.label }}</p>
                  </div>
                </div>
              </div>

              <!-- Risk Factors (if applicable) -->
              <div v-if="currentChart.risks" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-orange-800 mb-2">⚠️ Risk Factors</h4>
                <ul class="space-y-1 text-sm text-orange-700">
                  <li v-for="risk in currentChart.risks" :key="risk">• {{ risk }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-3">🎯 Recommended Actions</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button v-for="action in currentChart.actions" :key="action.title" :class="action.class"
                class="border rounded-lg p-3 text-left text-sm hover:shadow-sm transition-all">
                <p class="font-medium">{{ action.title }}</p>
                <p class="text-xs opacity-75">{{ action.description }}</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { executiveMetrics, metros, formatCurrency, getRiskColor } from '../data/mockData.js'
import BarChart from './charts/BarChart.vue'
import DoughnutChart from './charts/DoughnutChart.vue'
import KRIPanel from './KRIPanel.vue'
import Chart from 'chart.js/auto'

const router = useRouter()

// Reactive data
const metrics = ref(executiveMetrics)
const metrosList = ref(metros)
const metricViewType = ref('yoy')

// Trend Chart State
const showChart = ref(false)
const currentChart = ref({})
let chartInstance = null

const filters = reactive({
  metro: '',
  market: '',
  region: '',
  vertical: '',
  rvp: '',
  year: '2024',
  monthRange: 'last-6'
})

const metricChanges = reactive({
  portfolio: {
    yoy: 12.5,
    mom: 2.3
  },
  clients: {
    yoy: 8.7,
    mom: 1.2
  },
  revenue: {
    yoy: 15.2,
    mom: 3.1
  }
})

// Computed properties
const revenueChartData = computed(() => {
  try {
    if (!metrics.value?.monthlyTrends) return null
    return {
      labels: metrics.value.monthlyTrends.map(trend => trend.month),
      datasets: [
        {
          label: 'Revenue ($M)',
          data: metrics.value.monthlyTrends.map(trend => trend.revenue / 1e6),
          backgroundColor: 'rgba(107, 142, 35, 0.8)',
          borderColor: '#6B8E23',
          borderWidth: 1
        }
      ]
    }
  } catch (error) {
    console.error('Error creating revenue chart data:', error)
    return null
  }
})

const portfolioTrendData = computed(() => {
  try {
    if (!metrics.value?.portfolioTrend) return null
    return {
      labels: metrics.value.portfolioTrend.map(trend => trend.month),
      datasets: [
        {
          label: 'Portfolio Value ($B)',
          data: metrics.value.portfolioTrend.map(trend => trend.portfolioValue / 1e9),
          backgroundColor: 'rgba(34, 139, 34, 0.8)',
          borderColor: '#228B22',
          borderWidth: 1
        }
      ]
    }
  } catch (error) {
    console.error('Error creating portfolio trend data:', error)
    return null
  }
})

const clientGrowthData = computed(() => {
  try {
    if (!metrics.value?.clientGrowth) return null
    return {
      labels: metrics.value.clientGrowth.map(trend => trend.month),
      datasets: [
        {
          label: 'Client Count',
          data: metrics.value.clientGrowth.map(trend => trend.clientCount),
          backgroundColor: 'rgba(50, 205, 50, 0.8)',
          borderColor: '#32CD32',
          borderWidth: 1
        }
      ]
    }
  } catch (error) {
    console.error('Error creating client growth data:', error)
    return null
  }
})

// Trend Chart Methods
const showTrendChart = async (type) => {
  const chartConfigs = {
    portfolio: {
      title: 'Portfolio Value Trend Analysis',
      subtitle: '6-Month Portfolio Value Trajectory & Key Metrics',
      type: 'portfolio',
      data: {
        labels: metrics.value.monthlyTrends.map(t => t.month),
        datasets: [{
          label: 'Portfolio Value ($B)',
          data: metrics.value.monthlyTrends.map(t => t.portfolioValue / 1e9),
          borderColor: '#6B8E23',
          backgroundColor: 'rgba(107, 142, 35, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      insights: [
        'Portfolio grew 9.1% over 6 months ($200M increase)',
        'Strongest growth in Oct 2024 (+7.8% MoM)',
        'September dip was temporary (-3.1% recovered)',
        'Currently at all-time high of $2.4B'
      ],
      stats: [
        { label: 'Growth Rate', value: '+9.1%' },
        { label: 'Peak Month', value: 'Dec 2024' },
        { label: 'Monthly Avg', value: '$2.28B' },
        { label: 'Volatility', value: 'Low' }
      ],
      risks: [
        'September volatility suggests market sensitivity',
        'Growth rate slowing in recent months',
        'Concentration risk in top 3 metros (65% of portfolio)'
      ],
      actions: [
        {
          title: 'Diversify Geographic Exposure',
          description: 'Expand into emerging markets',
          class: 'bg-blue-50 border-blue-200 text-blue-800'
        },
        {
          title: 'Review Risk Management',
          description: 'Assess portfolio concentration',
          class: 'bg-orange-50 border-orange-200 text-orange-800'
        },
        {
          title: 'Monitor Market Trends',
          description: 'Track economic indicators',
          class: 'bg-green-50 border-green-200 text-green-800'
        }
      ]
    },
    clients: {
      title: 'Client Growth Analysis',
      subtitle: 'Client Acquisition Trends & Portfolio Expansion',
      type: 'clients',
      data: {
        labels: metrics.value.monthlyTrends.map(t => t.month),
        datasets: [{
          label: 'Total Clients',
          data: metrics.value.monthlyTrends.map(t => t.clientCount),
          borderColor: '#16A34A',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      insights: [
        'Added 67 new clients in 6 months (+5.7%)',
        'Consistent monthly growth averaging 11 clients',
        'August had highest acquisition (31 new clients)',
        'Client retention remains strong at 98.2%'
      ],
      stats: [
        { label: 'Net Growth', value: '+67' },
        { label: 'Growth Rate', value: '+5.7%' },
        { label: 'Monthly Avg', value: '11 clients' },
        { label: 'Retention', value: '98.2%' }
      ],
      actions: [
        {
          title: 'Accelerate Acquisition',
          description: 'Launch referral programs',
          class: 'bg-green-50 border-green-200 text-green-800'
        },
        {
          title: 'Enhance Onboarding',
          description: 'Improve client experience',
          class: 'bg-blue-50 border-blue-200 text-blue-800'
        },
        {
          title: 'Target High-Value Prospects',
          description: 'Focus on enterprise clients',
          class: 'bg-purple-50 border-purple-200 text-purple-800'
        }
      ]
    },
    revenue: {
      title: 'Revenue Performance Analysis',
      subtitle: 'Monthly Revenue Trends & Profitability Metrics',
      type: 'revenue',
      data: {
        labels: metrics.value.monthlyTrends.map(t => t.month),
        datasets: [{
          label: 'Monthly Revenue ($M)',
          data: metrics.value.monthlyTrends.map(t => t.revenue / 1e6),
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      insights: [
        'Revenue increased 11.7% over 6 months',
        'December reached record high of $16.2M',
        'Strong Q4 performance (+13.2% vs Q3)',
        'Revenue per client up 5.8% to $144K annually'
      ],
      stats: [
        { label: 'Growth Rate', value: '+11.7%' },
        { label: 'Peak Month', value: 'Dec 2024' },
        { label: 'Per Client', value: '$144K' },
        { label: 'Run Rate', value: '$194M' }
      ],
      risks: [
        'Revenue concentration in top 20 clients (45%)',
        'Seasonal patterns may impact Q1 performance',
        'Fee pressure from market competition'
      ],
      actions: [
        {
          title: 'Diversify Revenue Streams',
          description: 'Expand service offerings',
          class: 'bg-green-50 border-green-200 text-green-800'
        },
        {
          title: 'Client Wallet Share',
          description: 'Increase cross-selling',
          class: 'bg-blue-50 border-blue-200 text-blue-800'
        },
        {
          title: 'Pricing Strategy Review',
          description: 'Optimize fee structures',
          class: 'bg-orange-50 border-orange-200 text-orange-800'
        }
      ]
    },
    opportunities: {
      title: 'Opportunity Pipeline Analysis',
      subtitle: 'AI-Identified Revenue Opportunities & Growth Potential',
      type: 'opportunities',
      data: {
        labels: metrics.value.monthlyTrends.map(t => t.month),
        datasets: [{
          label: 'Opportunities Identified',
          data: metrics.value.monthlyTrends.map(t => t.opportunities),
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      insights: [
        '95 new opportunities identified this month (+21.8%)',
        'AI has identified $65M in potential revenue',
        'Treasury Management shows highest opportunity gap',
        'Average opportunity size is $124K per client'
      ],
      stats: [
        { label: 'New Opportunities', value: '+95' },
        { label: 'Potential Value', value: '$65M' },
        { label: 'Conversion Rate', value: '34%' },
        { label: 'Avg Size', value: '$124K' }
      ],
      actions: [
        {
          title: 'Prioritize High-Value Opportunities',
          description: 'Focus on $500K+ opportunities',
          class: 'bg-purple-50 border-purple-200 text-purple-800'
        },
        {
          title: 'Deploy Sales Teams',
          description: 'Target treasury management gaps',
          class: 'bg-green-50 border-green-200 text-green-800'
        },
        {
          title: 'Enhance AI Models',
          description: 'Improve opportunity scoring',
          class: 'bg-blue-50 border-blue-200 text-blue-800'
        }
      ]
    },
    risk: {
      title: 'Risk Management Dashboard',
      subtitle: 'High-Risk Client Monitoring & Compliance Trends',
      type: 'risk',
      data: {
        labels: metrics.value.riskTrends.map(t => t.month),
        datasets: [{
          label: 'High Risk Clients',
          data: metrics.value.riskTrends.map(t => t.high),
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      insights: [
        'High-risk clients decreased to 71 (-8.9% vs Jul)',
        '5.7% of portfolio remains in high-risk category',
        'Improved compliance scores across all metrics',
        '3 clients moved from high to medium risk this month'
      ],
      stats: [
        { label: 'High Risk', value: '71' },
        { label: 'Risk Ratio', value: '5.7%' },
        { label: 'Improved', value: '+3' },
        { label: 'Compliance', value: '92%' }
      ],
      risks: [
        'Cannabis sector clients require enhanced monitoring',
        'Cryptocurrency transaction volumes increasing',
        '5 clients pending regulatory review'
      ],
      actions: [
        {
          title: 'Enhanced Due Diligence',
          description: 'Review high-risk client portfolios',
          class: 'bg-red-50 border-red-200 text-red-800'
        },
        {
          title: 'Compliance Training',
          description: 'Update RM training programs',
          class: 'bg-orange-50 border-orange-200 text-orange-800'
        },
        {
          title: 'Risk Model Updates',
          description: 'Refine risk scoring algorithms',
          class: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }
      ]
    }
  }

  currentChart.value = chartConfigs[type]
  showChart.value = true

  await nextTick()
  await createTrendChart()
}

const hideTrendChart = () => {
  showChart.value = false
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

const createTrendChart = async () => {
  await nextTick()
  const canvas = document.querySelector(`canvas[data-ref="trendChart-${currentChart.value.type}"]`)

  if (!canvas) {
    // Create a temporary canvas element
    const tempCanvas = document.createElement('canvas')
    tempCanvas.setAttribute('data-ref', `trendChart-${currentChart.value.type}`)
    const container = document.querySelector('.h-64')
    if (container) {
      container.appendChild(tempCanvas)
    }
  }

  const ctx = canvas?.getContext('2d') || document.querySelector(`canvas[data-ref="trendChart-${currentChart.value.type}"]`)?.getContext('2d')

  if (!ctx) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: currentChart.value.data,
    options: {
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
          display: true,
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: currentChart.value.data.datasets[0].label
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

// Methods
const drillDownToMetro = (metro) => {
  console.log('Navigating to Metro:', metro.id)
  router.push({ name: 'Metro', params: { metroId: metro.id } })
}

const resetFilters = () => {
  Object.assign(filters, {
    metro: '',
    market: '',
    region: '',
    vertical: '',
    rvp: '',
    year: '2024',
    monthRange: 'last-6'
  })
}

const toggleMetricView = (metric) => {
  metricViewType.value = metricViewType.value === 'yoy' ? 'mom' : 'yoy'
}

const getChangeColor = (change) => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-500'
}

const getMetricChange = (metric) => {
  const change = metricChanges[metric]?.[metricViewType.value]
  if (change === undefined) return 'N/A'

  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

const getPenetrationColor = (penetration) => {
  if (penetration >= 80) return 'text-green-600'
  if (penetration >= 60) return 'text-yellow-600'
  if (penetration >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getOpportunityScoreClass = (score) => {
  if (score >= 8.5) return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
  if (score >= 7.5) return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
  if (score >= 6.5) return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
  return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
}

const getScoreColor = (score) => {
  if (score >= 8.5) return 'text-red-600'
  if (score >= 7.5) return 'text-orange-600'
  if (score >= 6.5) return 'text-yellow-600'
  return 'text-green-600'
}

const getPriorityClass = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-50 border-red-200'
    case 'medium': return 'bg-yellow-50 border-yellow-200'
    case 'low': return 'bg-green-50 border-green-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}

const getPriorityBadgeClass = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Lifecycle
onMounted(() => {
  console.log('ExecutiveView mounted')
  console.log('Metrics:', metrics.value)
  console.log('Metros:', metrosList.value)
})
</script>

<style scoped>
.filter-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-td-green focus:border-td-green;
  @apply hover:border-gray-400 transition-colors;
}

.filter-select:focus {
  @apply ring-2 ring-offset-0;
}

/* AI Opportunity Styles */
.product-penetration-card {
  @apply bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow;
}

.opportunity-heatmap-card {
  @apply border rounded-lg p-4 hover:shadow-md transition-shadow;
}

.opportunity-item {
  @apply border rounded-lg p-3 hover:shadow-sm transition-shadow;
}

.metro-opportunities {
  @apply border-b border-gray-200 pb-4 last:border-b-0;
}

/* Enhanced metric cards */
.metric-card {
  @apply bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow;
}

/* Charts and cards */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

/* Risk flags */
.risk-flag {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}
</style>