# Client 360 Portfolio Management Tool

A comprehensive Vue.js mockup demonstrating a hierarchical portfolio management dashboard for commercial banking, with full drill-down capabilities from executive level to individual transactions.

## Overview

This mockup implements the Client 360 vision discussed in your meeting notes, providing:

- **Executive Dashboard**: High-level portfolio overview with key metrics and trends
- **Relationship Manager View**: RM-specific portfolio performance and client relationships
- **Relationship View**: Consolidated view of client entities within a relationship group
- **Client 360 View**: Comprehensive client profile with risk assessment and behavioral analysis
- **Account View**: Detailed account-level information and transaction history

## Key Features

### 🎯 **Drill-Down Navigation**
Complete hierarchical navigation: Executive → RM → Relationship → Client → Account → Transaction

### 📊 **Interactive Charts**
- Revenue trends and performance metrics
- Risk distribution visualization
- Transaction behavior analysis
- Cash flow patterns

### 🔍 **Risk Management Focus**
- Risk flags and markers (MSB, High-Cash, Crypto, etc.)
- Beneficial ownership tracking
- Transaction anomaly detection
- Real-time risk scoring

### 💼 **Client 360 Components**
- **Client Profile**: Basic information, industry, geography
- **TD Relationship Summary**: Accounts, deposits, loans, revenue
- **Beneficial Ownership**: Ownership structure and related parties
- **Transaction Behavior**: Volume trends, frequency analysis
- **Risk Assessment**: Flags, markers, and compliance indicators

## Technology Stack

- **Vue.js 3** - Modern reactive framework
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive data visualization
- **Vue Router** - Client-side routing
- **Vite** - Fast development and build tool

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Application Structure

```
src/
├── components/
│   ├── ExecutiveView.vue          # Executive dashboard
│   ├── RelationshipManagerView.vue # RM portfolio view
│   ├── RelationshipView.vue       # Relationship-level view
│   ├── ClientView.vue             # Client 360 profile
│   ├── AccountView.vue            # Account details & transactions
│   └── charts/
│       ├── LineChart.vue          # Reusable line chart component
│       └── DoughnutChart.vue      # Risk distribution charts
├── data/
│   └── mockData.js                # Comprehensive mock dataset
└── style.css                     # Global styles and components
```

## Demo Data

The application includes realistic mock data representing:

- **4 Relationship Managers** across different regions
- **Multiple client relationships** per RM
- **Detailed client profiles** with risk indicators
- **Account-level data** with transaction history
- **6 months of trend data** for all metrics

## Key Personas Supported

### 🏢 **Executive Leadership**
- Portfolio overview and performance metrics
- Risk distribution across the organization
- RM performance comparison
- Revenue trends and forecasting

### 👔 **Relationship Managers**
- Personal portfolio management
- Client relationship tracking
- Revenue generation metrics
- Cross-sell opportunity identification

### 🛡️ **Risk Officers**
- Client risk assessment
- Transaction monitoring
- Beneficial ownership analysis
- Compliance flag management

## Features Demonstrated

### ✅ **Implemented**
- Complete drill-down navigation
- Interactive dashboards with charts
- Risk flag management
- Transaction behavior analysis
- Responsive design
- TD Bank branding

### 🚧 **Mockup Areas (Future Development)**
- Non-financial interactions (address changes, channel usage)
- Real-time data integration
- Advanced analytics and ML insights
- Workflow automation
- Document management

## Design Principles

- **Persona-First**: Each view tailored to specific user needs
- **Action-Oriented**: Clear call-to-actions and next steps
- **Hierarchical Navigation**: Logical drill-down paths
- **Risk-Focused**: Risk indicators prominently displayed
- **Modern UI/UX**: Clean, professional interface

## Navigation Flow

1. **Start**: Executive Dashboard showing portfolio overview
2. **Drill Down**: Click any RM to see their portfolio
3. **Relationships**: View client relationships within RM portfolio
4. **Client 360**: Comprehensive client profile and risk assessment
5. **Account Details**: Account-level activity and transactions
6. **Breadcrumbs**: Easy navigation back up the hierarchy

## Mockup Capabilities

This tool demonstrates the vision outlined in your meeting notes:

- **Unified Client View**: Consolidates fragmented data sources
- **Risk & Revenue Focus**: Supports both risk assessment and relationship deepening
- **Clear Hierarchy**: From executive oversight to transaction details
- **Actionable Insights**: Surfaces opportunities and risks
- **Cross-Functional**: Serves multiple personas with tailored views

## Next Steps for Implementation

1. **Data Integration**: Connect to real banking systems and APIs
2. **User Authentication**: Implement role-based access control
3. **Real-Time Updates**: Add live data feeds and notifications
4. **Advanced Analytics**: Integrate ML models for predictive insights
5. **Workflow Integration**: Connect to existing banking workflows
6. **Mobile Optimization**: Responsive design for mobile devices

---

This mockup serves as a **North Star vision** for the Client 360 Portfolio Management Tool, demonstrating the potential for a unified, actionable dashboard that serves multiple personas across commercial banking operations. 