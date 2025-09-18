# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Client 360 Business Intelligence Platform - A comprehensive Vue.js application for commercial banking portfolio management with hierarchical drill-down capabilities from executive to transaction level.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## High-Level Architecture

### Hierarchical Navigation Structure
The application follows a strict hierarchical data model reflected in routing:
```
Executive → Metro → Market → Region → RM → Relationship → Client → Account
```

Each level passes route parameters as props to child components, enabling contextual drill-down navigation with breadcrumbs.

### Core Data Flow Pattern
1. **Route Parameters** - Hierarchical IDs passed through URL (metroId, marketId, regionId, etc.)
2. **Props Propagation** - Components receive route params as props
3. **Mock Data Lookup** - `src/data/mockData.js` provides comprehensive hierarchical test data
4. **Computed Aggregations** - Parent levels compute metrics from child data
5. **Interactive Navigation** - Click handlers navigate to child views with context

### Component Architecture

#### View Components (Hierarchy Levels)
- `ExecutiveView.vue` - Top-level dashboard with metro comparison
- `MetroView.vue`, `MarketView.vue`, `RegionView.vue` - Mid-level aggregations
- `RelationshipManagerView.vue` - RM portfolio with KPI order: Revenue FYTD → Net New Deposits → Net New Commitments → New Credit Relationships → Referrals
- `RelationshipView.vue` - Business relationship grouping
- `ClientDetailView.vue` - Comprehensive client 360 profile (TIN data restricted)
- `AccountView.vue` - Account details and transactions

#### Shared Components Pattern
- `shared/BaseDetailView.vue` - Wraps all detail views with consistent layout
- `shared/DetailViewHeader.vue` - Standardized header with breadcrumb navigation
- `shared/KPICard.vue` - Reusable metric display with trends
- `shared/RiskBadge.vue`, `AlertIndicator.vue` - Risk visualization
- `charts/` - Chart.js, D3, and ApexCharts wrapper components

### State Management
- **No Vuex/Pinia** - Uses Vue 3 reactive system with props and computed properties
- **Data Source** - All data from `mockData.js` with realistic banking scenarios
- **Reactivity** - Computed properties for derived metrics and aggregations

### Database Schema
SQLite schema in `database/schema.sql` defines:
- Organizational hierarchy: metros → markets → regions → relationship_managers
- Business entities: relationships → clients → accounts → transactions
- Risk and compliance: risk_flags, beneficial_owners, compliance_alerts

### Critical Business Rules
- **Risk Assessment Terminology** - Use "Risk Assessment" not "Risk Analysis"
- **Risk Flag Modals** - Clickable flags show detailed analysis
- **Data Privacy** - TIN removed from ClientDetailView as restricted
- **TD Bank Branding** - Primary green (#00A651), professional gray palette

### AI Integration Points
- `AIChat.vue` - Contextual assistant integrated across views
- `KRIPanel.vue` - Key Risk Indicators with predictive analytics

## Key Implementation Patterns

### Route Configuration
All routes use props mode for parameter passing:
```javascript
{ path: '/metro/:metroId/market/:marketId', component: MarketView, props: true }
```

### Chart Integration
Three charting libraries integrated:
- **Chart.js** - Line, bar, doughnut charts via wrapper components
- **D3.js** - Advanced visualizations
- **ApexCharts** - Interactive sparklines and complex charts

### Performance Considerations
- Large datasets handled via computed properties
- Virtual scrolling needed for transaction lists
- Lazy loading for chart components

## Technology Stack
- **Vue 3.3.4** with Composition API
- **Vite 4.4.9** for build and dev server
- **Vue Router 4.2.4** for SPA navigation
- **Tailwind CSS 3.3.3** for styling
- **Chart.js 4.5.0**, **D3 7.9.0**, **ApexCharts 4.7.0** for visualizations

## Testing Approach
Currently no test framework configured. When adding tests:
- Unit tests for shared components
- Integration tests for hierarchical navigation
- Mock data validation tests