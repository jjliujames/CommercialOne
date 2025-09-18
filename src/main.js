import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

import RegionalVPLandingView from './components/RegionalVPLandingView.vue'
import RegionView from './components/RegionView.vue'
import RelationshipManagerView from './components/RelationshipManagerView.vue'
import RelationshipView from './components/RelationshipView.vue'
import ClientDetailView from './components/ClientDetailView.vue'
import ClientDetailViewAPI from './components/ClientDetailViewAPI.vue'
import AccountView from './components/AccountView.vue'

// Legacy views kept for reference but not in main navigation
import ExecutiveView from './components/ExecutiveView.vue'
import MetroView from './components/MetroView.vue'
import MarketView from './components/MarketView.vue'

const routes = [
    // Main routes - simplified hierarchy starting from Regional VP
    { path: '/', component: RegionalVPLandingView, name: 'Landing' },
    { path: '/region/:regionId', component: RegionView, name: 'Region', props: true },
    { path: '/region/:regionId/rm/:rmId', component: RelationshipManagerView, name: 'RelationshipManager', props: true },
    { path: '/region/:regionId/rm/:rmId/relationship/:relationshipId', component: RelationshipView, name: 'Relationship', props: true },
    { path: '/region/:regionId/rm/:rmId/relationship/:relationshipId/client/:clientId', component: ClientDetailView, name: 'ClientDetail', props: true },
    { path: '/region/:regionId/rm/:rmId/relationship/:relationshipId/client/:clientId/account/:accountId', component: AccountView, name: 'Account', props: true },

    // Direct client access (without relationship)
    { path: '/region/:regionId/rm/:rmId/client/:clientId', component: ClientDetailView, name: 'DirectClient', props: true },

    // API version for testing
    { path: '/api/region/:regionId/rm/:rmId/relationship/:relationshipId/client/:clientId', component: ClientDetailViewAPI, name: 'ClientDetailAPI', props: true },

    // Legacy routes - kept for backward compatibility but not in main navigation
    { path: '/executive', component: ExecutiveView, name: 'Executive' },
    { path: '/metro/:metroId', component: MetroView, name: 'Metro', props: true },
    { path: '/metro/:metroId/market/:marketId', component: MarketView, name: 'Market', props: true },
    { path: '/metro/:metroId/market/:marketId/region/:regionId', component: RegionView, name: 'LegacyRegion', props: true },
    { path: '/metro/:metroId/market/:marketId/region/:regionId/rm/:rmId', component: RelationshipManagerView, name: 'LegacyRM', props: true }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Always scroll to top on route change
        return { top: 0 }
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app') 