<template>
  <div class="account-view">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <span @click="$router.push('/')" class="breadcrumb-item">Regional VP Dashboard</span>
      <span>></span>
      <span @click="goBackToRM" class="breadcrumb-item">RM</span>
      <span>></span>
      <span @click="goBackToRelationship" class="breadcrumb-item">Relationship</span>
      <span>></span>
      <span @click="goBackToClient" class="breadcrumb-item">{{ account?.clientId }}</span>
      <span>></span>
      <span class="text-gray-900">{{ account?.type }}</span>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center mr-4">
            <span class="text-lg font-medium text-white">{{ account?.type?.split(' ')[0][0] }}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ account?.type }}</h1>
            <p class="text-gray-600">{{ account?.number }} • {{ account?.currency }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-td-green">{{ formatCurrency(account?.balance) }}</div>
          <div class="text-sm text-gray-600">Current Balance</div>
        </div>
      </div>
    </div>

    <!-- Account Summary -->
    <div class="card mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <dt class="text-sm font-medium text-gray-600">Account Number</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ account?.number }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-600">Account Type</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ account?.type }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-600">Currency</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ account?.currency }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-600">Status</dt>
          <dd class="mt-1">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {{ account?.status }}
            </span>
          </dd>
        </div>
      </div>
    </div>

    <!-- Monthly Activity Chart -->
    <div class="card mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Monthly Activity (6 Months)</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 class="text-md font-medium text-gray-700 mb-3">Deposits vs Withdrawals</h4>
          <LineChart :data="cashFlowData" />
        </div>
        <div>
          <h4 class="text-md font-medium text-gray-700 mb-3">Transaction Count</h4>
          <LineChart :data="transactionCountData" />
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Latest transaction activity for this account</p>
      </div>
      <div v-if="accountTransactions && accountTransactions.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="transaction in accountTransactions" 
              :key="transaction.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                  :class="transaction.direction === 'Inbound' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.direction === 'Inbound' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', 
                              transaction.direction === 'Inbound' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                  {{ transaction.direction }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.counterparty }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="flag in transaction.flags" 
                    :key="flag"
                    class="risk-flag risk-medium"
                  >
                    {{ flag }}
                  </span>
                  <span v-if="transaction.flags.length === 0" class="text-gray-400 text-xs">No flags</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        No transactions found for this account
      </div>
    </div>

    <!-- Transaction Analytics -->
    <div class="card mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Transaction Analytics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <div>
              <div class="text-sm font-medium text-blue-900">Average Transaction</div>
              <div class="text-2xl font-bold text-blue-900">{{ formatCurrency(averageTransactionAmount) }}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            <div>
              <div class="text-sm font-medium text-green-900">Monthly Volume</div>
              <div class="text-2xl font-bold text-green-900">{{ formatCurrency(monthlyVolume) }}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <div>
              <div class="text-sm font-medium text-purple-900">Transaction Count</div>
              <div class="text-2xl font-bold text-purple-900">{{ totalTransactions }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { accounts, transactions, formatCurrency } from '../data/mockData.js'
import LineChart from './charts/LineChart.vue'

const props = defineProps(['accountId'])

const router = useRouter()

const account = computed(() => {
  // Find account across all clients
  for (const clientId in accounts) {
    const found = accounts[clientId].find(account => account.id === props.accountId)
    if (found) return found
  }
  return null
})

const accountTransactions = computed(() => {
  return transactions[props.accountId] || []
})

const cashFlowData = computed(() => {
  if (!account.value?.monthlyActivity) return { labels: [], datasets: [] }

  return {
    labels: account.value.monthlyActivity.map(activity => activity.month),
    datasets: [
      {
        label: 'Deposits ($M)',
        data: account.value.monthlyActivity.map(activity => activity.deposits / 1e6),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Withdrawals ($M)',
        data: account.value.monthlyActivity.map(activity => activity.withdrawals / 1e6),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }
})

const transactionCountData = computed(() => {
  if (!account.value?.monthlyActivity) return { labels: [], datasets: [] }

  return {
    labels: account.value.monthlyActivity.map(activity => activity.month),
    datasets: [
      {
        label: 'Transaction Count',
        data: account.value.monthlyActivity.map(activity => activity.transactions),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }
})

const averageTransactionAmount = computed(() => {
  if (!accountTransactions.value.length) return 0
  const total = accountTransactions.value.reduce((sum, txn) => sum + txn.amount, 0)
  return total / accountTransactions.value.length
})

const monthlyVolume = computed(() => {
  if (!account.value?.monthlyActivity?.length) return 0
  const latest = account.value.monthlyActivity[account.value.monthlyActivity.length - 1]
  return latest.deposits + latest.withdrawals
})

const totalTransactions = computed(() => {
  if (!account.value?.monthlyActivity?.length) return 0
  return account.value.monthlyActivity.reduce((sum, activity) => sum + activity.transactions, 0)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const goBackToClient = () => {
  if (account.value) {
    router.push({ name: 'Client', params: { clientId: account.value.clientId } })
  }
}

const goBackToRelationship = () => {
  // Navigate back - would need to store relationship context
  router.push({ name: 'Relationship', params: { relationshipId: 'rel1' } })
}

const goBackToRM = () => {
  router.push({ name: 'RelationshipManager', params: { rmId: 'rm1' } })
}
</script> 