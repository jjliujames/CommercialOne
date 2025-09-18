# RelationshipManagerView Comprehensive Redesign Plan

## Project Overview
Complete redesign of RelationshipManagerView to serve as a **comprehensive portfolio management and risk assessment dashboard** for Commercial Banking Relationship Managers, providing balanced coverage of growth opportunities, performance tracking, and risk management.

## User Requirements Analysis
Based on detailed requirements, the RM needs:
1. **Portfolio Growth & Performance Tracking** - Portfolio value, revenue, relationship count, lead conversion
2. **Risk Management & Assessment** - Risk scores, compliance status, problem accounts
3. **Actionable Intelligence** - Clear priorities, trend insights, drill-down capabilities
4. **Performance Benchmarking** - Regional/national comparisons, peer performance
5. **Deep Dive Navigation** - Relationship → Client drill-down paths

## TODO List

### Phase 1: Enhanced Dashboard Foundation (PRIORITY)
- [ ] **Task 1.1**: Create comprehensive RM scorecard header
  - Overall performance score (composite of growth + risk + efficiency)
  - Regional/national ranking and percentile
  - YTD performance summary with trend indicators
  - Quick access to key action items

- [ ] **Task 1.2**: Redesign core KPI grid (6-8 key metrics)
  - **Portfolio Value**: Current value, growth trend, vs targets
  - **Annual Revenue**: Revenue performance, growth rate, vs targets  
  - **Relationship Count**: Active relationships, new acquisitions, retention rate
  - **Lead Conversion**: Pipeline value, conversion rate, closed opportunities
  - **Risk Score**: Portfolio-weighted risk, trend, problem accounts
  - **Compliance Status**: Review currency, UTR filings, regulatory alerts
  - Each metric clickable for detailed trend analysis

- [ ] **Task 1.3**: Add expandable trend analysis section
  - Interactive charts for each KPI with multiple time periods (3M/6M/1Y)
  - Variance analysis (MoM, YoY, QTD) with contributing factors
  - Top relationships driving positive/negative variance
  - Benchmarking against regional/national averages

### Phase 2: Advanced Analytics & Intelligence
- [ ] **Task 2.1**: Build relationship impact analysis
  - Identify top relationships by portfolio value contribution
  - Top relationships by revenue generation
  - Top growth opportunities by potential value
  - Relationships requiring immediate attention (risk/compliance)

- [ ] **Task 2.2**: Add performance benchmarking module
  - Regional average comparisons for all key metrics
  - National average comparisons for all key metrics
  - Peer ranking within region/national cohort
  - Goal achievement tracking with progress indicators

- [ ] **Task 2.3**: Create comprehensive opportunity management
  - Active opportunities by value and probability
  - Product cross-sell opportunities by relationship
  - Lead pipeline with conversion funnel
  - Closed opportunities this period with revenue impact

### Phase 3: Risk Management & Compliance
- [ ] **Task 3.1**: Build integrated risk dashboard
  - Portfolio risk distribution and concentration analysis
  - Problem accounts requiring immediate attention
  - Early warning indicators and alerts
  - Risk trend analysis with peer comparisons

- [ ] **Task 3.2**: Add compliance monitoring system
  - KYC/CDD review status across portfolio
  - UTR filing tracking and suspicious activity monitoring
  - Regulatory examination findings and remediation
  - Compliance calendar with upcoming requirements

### Phase 4: Action-Oriented Workflow
- [ ] **Task 4.1**: Create intelligent priority engine
  - Daily/weekly priority actions ranked by impact
  - Mix of growth opportunities and risk mitigation
  - Time-sensitive items with deadlines
  - Client engagement recommendations

- [ ] **Task 4.2**: Build relationship portfolio grid
  - Sortable/filterable relationship overview
  - Quick access to key metrics per relationship
  - Visual indicators for performance, risk, and opportunities
  - One-click navigation to detailed RelationshipView

### Phase 5: Deep Dive Navigation & Context
- [ ] **Task 5.1**: Implement seamless drill-down capabilities
  - From RM dashboard → specific relationship → individual client
  - Context preservation across navigation levels
  - Breadcrumb navigation with quick return options
  - Cross-relationship comparison tools

- [ ] **Task 5.2**: Add relationship-specific trend analysis
  - Individual relationship performance vs portfolio average
  - Relationship ranking within RM portfolio
  - Historical performance trends and projections
  - Opportunity identification and risk assessment

## Detailed Dashboard Layout Design

### **Header: RM Performance Scorecard** 📊
```
Performance Score: 87/100 (Top 15% Nationally) | Portfolio: $234M (+8.2% YTD) | Relationships: 23 (+2 this quarter)
Target Achievement: Revenue 103% | Growth 112% | Risk Management 94%
```

### **Row 1: Core KPI Cards (Clickable for Trends)** 🎯
```
📈 Portfolio Value        💰 Annual Revenue         🤝 Relationships         📊 Lead Pipeline
$234M (+8.2% YTD)        $18.7M (+12.4% YTD)      23 Active (+2 new)       47 Opportunities
vs Target: 112%          vs Target: 103%          Retention: 96.2%         $28.4M Pipeline Value
Regional: 92nd %ile      Regional: 88th %ile      Regional: 85th %ile      Conversion: 32.1%

⚠️ Risk Score           ✅ Compliance           🚀 Growth Rate           📞 Client Touch
6.4/10 (Stable)         91% Current             +8.2% YTD                4.2 Touches/Month
3 Problem Accounts      2 Reviews Pending       vs Regional: +5.1%       vs Target: 95%
Regional: 78th %ile     Regional: 89th %ile     National: 84th %ile      Regional: 92nd %ile
```

### **Row 2: Expandable Trend Analysis** 📈
- Interactive ApexCharts for selected KPI
- Time period selector (3M/6M/1Y)
- Variance analysis with contributing relationships
- Regional/national benchmark overlays

### **Row 3: Relationship Impact Analysis** 🎯
```
🌟 Top Portfolio Contributors     📈 Growth Drivers              ⚠️ Attention Required
├── Johnson Holdings: $45M         ├── TechCorp: +$12M (YTD)      ├── Energy LLC: Risk Score 8.2
├── Global Mfg: $38M              ├── Healthcare: +$8.4M         ├── Real Estate: Overdue Review
├── TechCorp Ventures: $32M       ├── Construction: +$6.1M       ├── Trading Co: UTR Filing
└── Energy Solutions: $28M        └── Maritime: +$4.8M           └── Retail Corp: Delinquent
```

### **Row 4: Action Priorities & Opportunities** 🚨
```
🚨 Today's Priorities                    🚀 Top Opportunities
├── Review: Energy LLC Risk Score 8.2    ├── TechCorp Treasury Services: $2.1M
├── Complete: Real Estate KYC Renewal    ├── Healthcare Equipment Loan: $1.8M  
├── Call: Trading Co UTR Discussion      ├── Construction Line Increase: $1.5M
└── Meeting: Johnson Holdings QBR        └── Maritime Cash Management: $900K
```

### **Row 5: Relationship Portfolio Overview** 📋
- Sortable table/card view of all relationships
- Key metrics, risk indicators, opportunity flags
- Quick navigation to detailed RelationshipView
- Filter capabilities (risk level, tier, industry, performance)

## New Data Requirements

### **Enhanced Metrics**
1. **Lead Management**: Pipeline value, conversion rates, closed opportunities
2. **Benchmarking**: Regional and national averages for all metrics
3. **Performance Scoring**: Composite scores for portfolio, risk, efficiency
4. **Goal Tracking**: Target vs actual for all key metrics
5. **Touch Frequency**: Client engagement metrics and recommendations

### **Advanced Analytics**
6. **Variance Attribution**: Which relationships drive overall variance
7. **Correlation Analysis**: Risk vs performance relationships
8. **Trend Prediction**: Forward-looking performance indicators
9. **Peer Comparison**: RM ranking within region/national cohort
10. **Opportunity Scoring**: Probability-weighted opportunity values

## Implementation Approach
- **User-Centric Design**: Focus on daily RM workflow and decision-making
- **Progressive Disclosure**: Summary → Details → Deep Dive navigation
- **Balanced Perspective**: Equal weight to growth and risk management
- **Actionable Intelligence**: Every metric leads to specific actions
- **Context Preservation**: Maintain context during drill-down navigation

## Success Criteria
- RMs can quickly assess overall portfolio health and performance
- Clear identification of top priorities for daily/weekly focus
- Seamless navigation from portfolio → relationship → client levels
- Performance benchmarking provides context for all metrics
- Risk and opportunity identification drives proactive management

## Validation Required
- Confirm metric priorities and target ranges for different RM levels
- Validate regional/national benchmarking data availability
- Approve navigation flow and drill-down context preservation
- Define alert thresholds and priority scoring algorithms

---

# Previous Plans (For Reference)

# RelationshipManagerView Redesign Plan

## Project Overview
Redesign the RelationshipManagerView to serve as a **balanced portfolio management dashboard** for Commercial Banking Relationship Managers, providing equal prominence to portfolio growth/performance metrics AND risk management/operational concerns.

## Analysis Summary
- **Current State**: Basic daily actions, RM relationship table
- **Target State**: **Balanced RM dashboard** integrating portfolio performance with risk monitoring
- **Key Focus**: **BALANCED VIEW** - Portfolio Growth + Risk Management + Relationship Trends

## TODO List

### Phase 1: Balanced Core Dashboard (PRIORITY)
- [x] **Task 1.1**: Create balanced metric overview ✅ COMPLETED
  - **Left Side**: Portfolio performance (growth, revenue, opportunities)
  - **Right Side**: Risk management (overdrafts, delinquencies, compliance)
  - **Center**: Relationship health and trends

- [x] **Task 1.2**: Add portfolio performance panel ✅ COMPLETED
  - Portfolio value growth trends (monthly/quarterly)
  - Revenue performance vs targets
  - New relationships gained/lost this period
  - Cross-sell opportunities and success rates

- [x] **Task 1.3**: Add risk management panel ✅ COMPLETED
  - Current overdraft exposure and incidents
  - Active delinquent loans (30/60/90+ days)
  - High-priority risk alerts requiring action
  - Compliance review status and UTR filings

### Phase 2: Enhanced Analytics
- [ ] **Task 2.1**: Add relationship growth tracking
  - Relationship acquisition trends and pipeline
  - Relationship retention rates and churn analysis
  - Average relationship age and lifecycle stages
  - Territory/market penetration analysis

- [ ] **Task 2.2**: Add comprehensive risk scoring
  - Portfolio-level risk scores and trends
  - Client risk distribution and concentration
  - Early warning indicators and predictive analytics
  - Regulatory compliance dashboard

### Phase 3: Performance Optimization
- [ ] **Task 3.1**: Add RM performance benchmarking
  - Peer comparison metrics (portfolio size, growth, risk)
  - Goal achievement tracking (revenue, client acquisition)
  - Market share within assigned territory
  - Efficiency metrics (revenue per relationship, risk-adjusted returns)

- [ ] **Task 3.2**: Add actionable insights
  - Priority action recommendations (portfolio + risk)
  - Opportunity prioritization with risk considerations
  - Client engagement optimization
  - Resource allocation suggestions

### Phase 4: Advanced Features
- [ ] **Task 4.1**: Add predictive analytics
  - Relationship churn risk modeling
  - Portfolio growth forecasting
  - Risk event prediction (defaults, overdrafts)
  - Revenue opportunity scoring

- [ ] **Task 4.2**: Add interactive features
  - Drill-down capabilities to relationship/client details
  - Customizable dashboard widgets
  - Alert management and workflow integration
  - Mobile-responsive design

## **BALANCED DASHBOARD LAYOUT**

### **Header: RM Overview** 📊
```
Portfolio Value: $847M (+5.2% QTD) | Risk Score: 6.4/10 (Stable) | Relationships: 23 (+2 this quarter)
```

### **Row 1: BALANCED PERFORMANCE & RISK CARDS** ⚖️
```
📈 PORTFOLIO PERFORMANCE          |  ⚠️ RISK MANAGEMENT
├── $847M Total Portfolio (+5.2%)  |  ├── $2.3M Overdraft Exposure
├── $12.4M Revenue (103% of target)|  ├── $1.8M Delinquent Loans (5 accounts)
├── +2 New Relationships (Q4)      |  ├── 7 High-Risk Alerts (3 critical)
└── 15 Active Opportunities ($8.2M)|  └── 2 UTR Filings (this month)
```

### **Row 2: TRENDS & ANALYTICS** 📈📉
```
🔄 RELATIONSHIP TRENDS             |  📊 RISK ANALYTICS
├── Relationship Growth: +8.7% YTD |  ├── Portfolio Risk: 6.4/10 (↔️ Stable)
├── Retention Rate: 96.2%          |  ├── Problem Accounts: 8 (3.4% of portfolio)
├── Avg Relationship: 4.2 years    |  ├── Collection Pipeline: $920K
└── Territory Coverage: 67%        |  └── Compliance: 91% current reviews
```

### **Row 3: ACTION PRIORITIES** 🎯
```
TODAY'S PRIORITIES (Balanced Portfolio + Risk Actions)
├── 🚨 Review: $450K overdraft at Johnson Holdings (Risk)
├── 💰 Close: $2.1M lending opportunity at Tech Corp (Portfolio)
├── 📞 Call: Delinquent payment follow-up - Manufacturing LLC (Risk)
├── 🤝 Meeting: Cross-sell treasury services - Real Estate Group (Portfolio)
└── 📋 Complete: KYC renewal for International Trading (Compliance)
```

## Proposed Balanced Metrics

### **PORTFOLIO PERFORMANCE METRICS** 📈
1. **Portfolio Value Growth**: YTD/QTD/MTD growth rates
2. **Revenue Performance**: Current vs targets with trends
3. **Relationship Count**: New/lost/net growth
4. **Cross-sell Success**: Opportunities closed vs pipeline
5. **Client Penetration**: Products per relationship
6. **Territory Coverage**: Market share in assigned area

### **RISK MANAGEMENT METRICS** ⚠️
7. **Overdraft Exposure**: Current balances and incident frequency
8. **Delinquency Status**: Aging buckets and collection progress
9. **Portfolio Risk Score**: Weighted average with trends
10. **Compliance Currency**: Review status and regulatory alerts
11. **UTR Activity**: Filings and suspicious activity monitoring
12. **Problem Account Ratio**: Percentage requiring attention

### **RELATIONSHIP HEALTH METRICS** 🤝
13. **Relationship Retention**: Churn rate and longevity
14. **Client Engagement**: Touch frequency and response rates
15. **Health Score**: Combined portfolio + risk assessment
16. **Lifecycle Stage**: New/growing/mature/at-risk distribution

### **OPERATIONAL EXCELLENCE METRICS** ⚡
17. **Goal Achievement**: Portfolio and risk targets
18. **Response Time**: Client request and alert resolution
19. **Meeting Completion**: Scheduled vs actual client interactions
20. **Efficiency Ratio**: Revenue per relationship vs risk exposure

## **Balanced Design Principles**

### **Visual Balance** ⚖️
- **50/50 Layout**: Equal screen real estate for portfolio and risk
- **Color Coordination**: Green (portfolio growth) + Red (risk alerts) + Blue (neutral metrics)
- **Priority Weighting**: Critical items from both sides get top placement

### **Workflow Integration** 🔄
- **Action Items**: Mix portfolio opportunities with risk mitigation tasks
- **Drill-down Paths**: Navigate to both relationship growth AND risk details
- **Alert System**: Balanced notifications for both opportunity and risk events

### **Performance Context** 📊
- **Risk-Adjusted Returns**: Portfolio performance metrics include risk considerations
- **Opportunity Scoring**: Risk factors included in opportunity prioritization
- **Balanced KPIs**: Success measures include both growth AND risk management

## Implementation Approach
- **Balanced Priority**: Equal development focus on portfolio and risk features
- **Incremental**: Phase-based rollout maintaining balance in each phase
- **Simple**: Each task impacts minimal code with balanced complexity
- **Integrated**: Portfolio and risk metrics work together, not in isolation
- **User-Centric**: RM workflow needs both perspectives simultaneously

## Validation Required
- Confirm equal importance of portfolio vs risk metrics for daily RM workflow
- Validate balanced visual layout with equal prominence
- Approve integrated action priority system (portfolio + risk)
- Define drill-down paths that support both portfolio growth and risk management decisions 

# RelationshipManagerView Enhanced Trend Analysis Implementation Plan

## Overview
Implement comprehensive trend analysis system for RelationshipManagerView with:
- High-level summary metrics with variance options (MoM, YoY, 6-month)
- Expandable trend analysis area with interactive charts
- Identification of top relationships driving variance
- Clickable drill-down to relationship-specific trend analysis

## Phase 1: Core Infrastructure Setup ✅ COMPLETED
- [x] Add reactive data properties for trend analysis
  - [x] Add variance type selection (MoM, YoY, 6-month, QTD)
  - [x] Add show/hide toggle for detailed trend area
  - [x] Add current variance calculations
  - [x] Add selected relationship tracking

- [x] Create base trend data structure
  - [x] Define trend data for each metric (portfolio, revenue, opportunities, risk)
  - [x] Create variance calculation methods
  - [x] Implement period-based data generation

## Phase 2: Enhanced Metrics Display ✅ COMPLETED
- [x] Update existing metric cards with variance indicators
  - [x] Add variance percentage display (+18.7%, -5.2%, etc.)
  - [x] Add trend direction indicators (📈📉)
  - [x] Add variance period labels (6M, YoY, MoM)
  - [x] Color-code based on positive/negative variance

- [x] Add variance type selector
  - [x] Create dropdown for MoM, YoY, 6-month, QTD selection
  - [x] Implement real-time variance updates on selection change
  - [x] Add "Show Details" toggle button

## Phase 3: Expandable Trend Analysis Area
- [ ] Create collapsible trend section
  - [ ] Add summary variance card with current metric and change
  - [ ] Implement interactive trend charts (line charts for time series)
  - [ ] Add period selector (3M, 6M, 1Y) for chart detail level

- [ ] Build variance contributors section
  - [ ] Create "Top Contributors to Growth" panel (green)
  - [ ] Create "Areas Requiring Attention" panel (red)
  - [ ] Show specific relationships driving variance
  - [ ] Display variance percentage and impact amount for each relationship

## Phase 4: Relationship Drill-Down Functionality
- [ ] Implement clickable relationship cards
  - [ ] Add hover effects and click handlers
  - [ ] Route to relationship-specific trend view
  - [ ] Pass selected metric and variance type as context

- [ ] Create relationship-specific trend analysis
  - [ ] Show individual relationship performance vs portfolio average
  - [ ] Display relationship rank within portfolio
  - [ ] Add actionable recommendations based on trend

- [ ] Add cross-metric analysis
  - [ ] Allow switching between metrics while maintaining relationship focus
  - [ ] Show correlation between different metrics for selected relationship

## Phase 5: Advanced Features
- [ ] Add variance attribution analysis
  - [ ] Calculate which relationships contribute most to overall variance
  - [ ] Show percentage breakdown of variance by relationship
  - [ ] Implement threshold-based alerts for significant variances

- [ ] Create trend insights and recommendations
  - [ ] Generate automatic insights based on variance patterns
  - [ ] Suggest action items for relationships with concerning trends
  - [ ] Highlight opportunities for growth based on positive trends

- [ ] Add export and reporting capabilities
  - [ ] Enable export of trend analysis data
  - [ ] Create printable trend reports
  - [ ] Add scheduled trend monitoring alerts

## Technical Implementation Details

### Data Structure
```javascript
// Trend data structure per relationship
relationshipTrends: {
  [relationshipId]: {
    portfolio: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    revenue: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    opportunities: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    risk: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 }
  }
}
```

### Key Components
1. **Enhanced Metric Cards** - Display current value + variance
2. **Variance Selector** - Dropdown for MoM/YoY/6M/QTD
3. **Trend Chart Area** - Expandable section with ApexCharts
4. **Variance Contributors** - Lists of relationships with impact
5. **Drill-Down Navigation** - Routes to relationship detail with context

### User Experience Flow
1. User sees metric cards with variance indicators
2. User selects variance type (MoM, YoY, etc.)
3. User clicks "Show Details" to expand trend analysis
4. User sees trend chart and variance contributors
5. User clicks on specific relationship to drill down
6. User sees relationship-specific trend analysis with recommendations

## Success Criteria
- [ ] All metrics show variance with clear visual indicators
- [ ] Trend analysis area smoothly expands/collapses
- [ ] Charts update dynamically based on variance type selection
- [ ] Relationship drill-down provides actionable insights
- [ ] Performance remains smooth with all features active
- [ ] UI is intuitive and follows existing design patterns

## Testing Plan
- [ ] Test variance calculations for accuracy
- [ ] Verify chart rendering performance with large datasets
- [ ] Test drill-down navigation and context preservation
- [ ] Validate responsive design on different screen sizes
- [ ] Test accessibility of new interactive elements 

# RelationshipManagerView Comprehensive Redesign - PHASE 2

## New Comprehensive Requirements Analysis (Updated)

### Primary User Needs Identified:
1. **Rolled-up Summary + Scorecard**: Executive-level portfolio overview with composite performance scoring
2. **Deep Dive Capability**: Portfolio growth analysis with relationship-level attribution  
3. **Risk Management Tools**: Integrated risk monitoring with actionable alerts
4. **Performance Metrics**: Relationship count, leads generated/closed, conversion tracking
5. **Action Intelligence**: Clear priorities with impact assessment
6. **Relationship Impact Analysis**: Which relationships drive key metrics performance
7. **Top Performers & Opportunities**: Relationship ranking and opportunity identification
8. **Trend Analysis**: Performance vs regional/national averages with benchmarking
9. **Navigation Flow**: Seamless RM → Relationship → Client drill-down with context preservation

## NEW COMPREHENSIVE TODO LIST

### 🎯 PHASE 1: Executive Scorecard Foundation (HIGH PRIORITY)
- [ ] **Task 1.1**: Build comprehensive RM scorecard header
  - **Composite Performance Score**: Growth + Risk + Efficiency weighted score (0-100)
  - **Regional/National Ranking**: Percentile ranking with clear positioning ("Top 15%")  
  - **Portfolio Summary**: Total value, YTD growth, relationship count, target achievement
  - **Performance Overview**: Revenue, growth, risk management goal achievement percentages

- [ ] **Task 1.2**: Create enhanced KPI metric grid (8 core metrics)
  - **Portfolio Value**: Current value, YTD growth, vs target percentage, regional percentile
  - **Annual Revenue**: Generated revenue, growth rate, target achievement, regional comparison
  - **Relationship Count**: Active relationships, new acquisitions, retention rate, regional rank
  - **Lead Conversion**: Total leads, conversion rate, closed value, pipeline management
  - **Risk Score**: Portfolio-weighted risk, trend direction, problem account count  
  - **Compliance Status**: Review currency, pending items, regulatory health score
  - **Growth Rate**: YTD growth vs regional/national averages with variance attribution
  - **Client Engagement**: Touch frequency, meeting cadence, relationship depth metrics

### 📊 PHASE 2: Advanced Analytics & Attribution (HIGH PRIORITY)  
- [ ] **Task 2.1**: Build relationship impact analysis dashboard
  - **Top Portfolio Contributors**: Relationships ranked by total portfolio value contribution
  - **Growth Drivers**: Relationships contributing most to YTD growth with specific values
  - **Revenue Leaders**: Top revenue-generating relationships with trend analysis
  - **Attention Required**: Relationships needing immediate action (risk/compliance/opportunity)

- [ ] **Task 2.2**: Add performance benchmarking engine  
  - **Regional Comparison**: All metrics vs regional RM average with percentile ranking
  - **National Comparison**: All metrics vs national RM average with percentile ranking
  - **Peer Ranking**: Position within regional/national cohort with specific rank
  - **Trend vs Benchmark**: Performance trajectory compared to regional/national trends

- [ ] **Task 2.3**: Create comprehensive trend analysis
  - **Interactive Charts**: Clickable KPI cards expanding to detailed trend analysis
  - **Multi-Period Views**: 3M/6M/1Y trend analysis with variance attribution  
  - **Benchmark Overlays**: Regional/national average overlays on all trend charts
  - **Contributing Factors**: Which specific relationships drive positive/negative variance

### 🎯 PHASE 3: Opportunity & Risk Intelligence (MEDIUM PRIORITY)
- [ ] **Task 3.1**: Build advanced opportunity management
  - **Top Opportunities**: Ranked by potential value with probability weighting
  - **Product Cross-Sell**: Specific product opportunities by relationship
  - **Lead Pipeline**: Active leads with stage tracking and conversion probability
  - **Closed Won Analysis**: Recent wins with revenue impact and replication insights

- [ ] **Task 3.2**: Add integrated risk management dashboard
  - **Problem Account Identification**: Risk scores above threshold with action requirements
  - **Risk Concentration**: Portfolio risk distribution and concentration analysis
  - **Early Warning Indicators**: Predictive risk signals requiring proactive management
  - **Risk vs Performance**: Correlation analysis between risk profile and growth

### 🔄 PHASE 4: Action-Oriented Workflow (MEDIUM PRIORITY)
- [ ] **Task 4.1**: Create intelligent priority engine
  - **Daily Action Mix**: Balance of growth opportunities and risk mitigation activities
  - **Impact-Based Ranking**: Priority scoring based on potential portfolio impact
  - **Time-Sensitive Items**: Deadlines and regulatory requirements with urgency indicators
  - **Relationship-Specific Actions**: Tailored recommendations by relationship tier and performance

- [ ] **Task 4.2**: Build enhanced relationship portfolio management
  - **Interactive Portfolio Grid**: Sortable by value, growth, risk, opportunity score
  - **Performance Indicators**: Visual status indicators for each relationship
  - **Quick Action Buttons**: Direct access to common actions (call, review, opportunity)
  - **Filtering & Search**: Multi-criteria filtering with saved filter preferences

### 🚀 PHASE 5: Deep Dive Navigation & Context (LOW PRIORITY)
- [ ] **Task 5.1**: Implement seamless drill-down navigation
  - **Context Preservation**: Maintain RM dashboard context when drilling into relationships
  - **Breadcrumb Enhancement**: Clear navigation path with quick return to summary level
  - **Cross-Relationship Analysis**: Compare relationships within RM portfolio
  - **Summary Panel Integration**: Quick relationship overview before full navigation

- [ ] **Task 5.2**: Add advanced relationship analysis
  - **Individual vs Portfolio Performance**: Relationship performance vs RM average
  - **Relationship Ranking**: Position within RM portfolio with peer comparison
  - **Growth Attribution**: How much each relationship contributes to overall metrics
  - **Optimization Recommendations**: Specific actions to improve relationship performance

## DETAILED DASHBOARD REDESIGN SPECIFICATION

### Header: RM Performance Scorecard 🏆
```
[RM Name] Portfolio Dashboard
Composite Score: 87/100 (Regional Rank: Top 15% | National Rank: Top 28%)
Portfolio Value: $234M (+8.2% YTD) | Relationships: 23 (+2 new) | Revenue: $18.7M (+12.4% YTD)
Target Achievement: Growth 112% | Revenue 103% | Risk Management 94%
```

### Core KPI Grid (Interactive Cards) 📈
```
💰 Portfolio Value         💵 Annual Revenue         🤝 Relationships         📊 Lead Pipeline
$234M                      $18.7M                    23 Active                47 Opportunities  
+8.2% YTD (112% vs Target) +12.4% YTD (103% vs Target) +2 new (96.2% retention) $28.4M Pipeline
85th %ile (Regional)       78th %ile (Regional)      82nd %ile (Regional)     76th %ile (Regional)

⚠️ Risk Score             ✅ Compliance             🚀 Growth Rate           📞 Client Touch
6.4/10 (Stable)           91% Current               +8.2% YTD                4.2 Touches/Month
3 Problem Accounts         2 Reviews Pending         vs Regional: +3.1%       95% vs Target
71st %ile (Regional)       88th %ile (Regional)     85th %ile (Regional)     69th %ile (Regional)
```

### Relationship Impact Analysis 🎯
```
🌟 Top Portfolio Contributors   📈 Growth Drivers              🚀 Top Opportunities         ⚠️ Attention Required
Johnson Holdings: $45M          TechCorp: +$12M YTD            Treasury Services: $2.1M     Energy LLC: Risk 8.2
Global Mfg: $38M              Healthcare: +$8.4M YTD         Equipment Loans: $1.8M       Real Estate: Review Due  
TechCorp: $32M                 Construction: +$6.1M YTD       Line Increases: $1.5M        Trading Co: UTR Filing
Energy Solutions: $28M          Maritime: +$4.8M YTD          Cash Management: $900K       Retail Corp: Delinquent
```

### Expandable Trend Analysis 📊
- **Interactive Charts**: Click any KPI to see detailed trend analysis
- **Benchmark Overlays**: Regional/national averages shown on all charts  
- **Attribution Analysis**: Which relationships contribute to metric changes
- **Multi-Period Views**: 3M/6M/1Y with variance breakdowns

### Enhanced Portfolio Grid 📋
- **Sortable Columns**: Value, Growth, Risk, Revenue, Opportunity Score
- **Visual Indicators**: Performance status, risk level, opportunity flags
- **Quick Actions**: Call, Review, Opportunity buttons for each relationship
- **Navigation**: Click-through to detailed RelationshipView with context

## NEW DATA MODEL REQUIREMENTS

### Enhanced Metrics:
1. **Lead Tracking**: Pipeline by stage, conversion rates, closed revenue
2. **Benchmarking Data**: Regional/national averages for all RM metrics
3. **Performance Scoring**: Composite scores with weighted components
4. **Goal Tracking**: Targets vs actuals with achievement percentages
5. **Touch Analytics**: Client engagement frequency and quality metrics

### Advanced Analytics:
6. **Variance Attribution**: Which relationships drive overall portfolio variance
7. **Risk Correlation**: Risk profile vs performance relationship analysis  
8. **Opportunity Scoring**: Probability-weighted pipeline values
9. **Peer Ranking**: RM position within regional/national cohorts
10. **Predictive Indicators**: Forward-looking performance signals

## IMPLEMENTATION APPROACH

### Design Principles:
- **Balanced Dashboard**: Equal emphasis on growth and risk management
- **Executive Summary First**: High-level scorecard before detailed metrics
- **Action-Oriented**: Every metric leads to specific actionable insights
- **Benchmarking Context**: All metrics compared to relevant averages
- **Progressive Disclosure**: Summary → Details → Deep Dive navigation flow

### Technical Requirements:
- **Interactive Charts**: ApexCharts integration for trend analysis
- **Responsive Design**: Mobile-friendly dashboard for on-the-go access
- **Real-Time Updates**: Dynamic data refresh for current metrics
- **Context Preservation**: Maintain dashboard state during navigation
- **Performance Optimization**: Fast loading for large relationship portfolios

## SUCCESS CRITERIA

### User Experience:
- [ ] RM can assess overall portfolio health in under 30 seconds
- [ ] Clear identification of top 3 daily priorities with impact rationale  
- [ ] Seamless navigation from RM → Relationship → Client with context
- [ ] Performance benchmarking provides actionable insights for improvement
- [ ] Balanced view supports both growth and risk management decisions

### Business Impact:
- [ ] Improved portfolio performance through better relationship prioritization
- [ ] Enhanced risk management through early identification and action
- [ ] Increased opportunity conversion through better pipeline management
- [ ] Better client engagement through data-driven relationship management
- [ ] Improved RM productivity through intelligent priority setting

---

# PREVIOUS PLANS (For Reference)
[Previous content preserved below...]

# RelationshipManagerView Redesign Plan

## Project Overview
Redesign the RelationshipManagerView to serve as a **balanced portfolio management dashboard** for Commercial Banking Relationship Managers, providing equal prominence to portfolio growth/performance metrics AND risk management/operational concerns.

## Analysis Summary
- **Current State**: Basic daily actions, RM relationship table
- **Target State**: **Balanced RM dashboard** integrating portfolio performance with risk monitoring
- **Key Focus**: **BALANCED VIEW** - Portfolio Growth + Risk Management + Relationship Trends

## TODO List

### Phase 1: Balanced Core Dashboard (PRIORITY)
- [x] **Task 1.1**: Create balanced metric overview ✅ COMPLETED
  - **Left Side**: Portfolio performance (growth, revenue, opportunities)
  - **Right Side**: Risk management (overdrafts, delinquencies, compliance)
  - **Center**: Relationship health and trends

- [x] **Task 1.2**: Add portfolio performance panel ✅ COMPLETED
  - Portfolio value growth trends (monthly/quarterly)
  - Revenue performance vs targets
  - New relationships gained/lost this period
  - Cross-sell opportunities and success rates

- [x] **Task 1.3**: Add risk management panel ✅ COMPLETED
  - Current overdraft exposure and incidents
  - Active delinquent loans (30/60/90+ days)
  - High-priority risk alerts requiring action
  - Compliance review status and UTR filings

### Phase 2: Enhanced Analytics
- [ ] **Task 2.1**: Add relationship growth tracking
  - Relationship acquisition trends and pipeline
  - Relationship retention rates and churn analysis
  - Average relationship age and lifecycle stages
  - Territory/market penetration analysis

- [ ] **Task 2.2**: Add comprehensive risk scoring
  - Portfolio-level risk scores and trends
  - Client risk distribution and concentration
  - Early warning indicators and predictive analytics
  - Regulatory compliance dashboard

### Phase 3: Performance Optimization
- [ ] **Task 3.1**: Add RM performance benchmarking
  - Peer comparison metrics (portfolio size, growth, risk)
  - Goal achievement tracking (revenue, client acquisition)
  - Market share within assigned territory
  - Efficiency metrics (revenue per relationship, risk-adjusted returns)

- [ ] **Task 3.2**: Add actionable insights
  - Priority action recommendations (portfolio + risk)
  - Opportunity prioritization with risk considerations
  - Client engagement optimization
  - Resource allocation suggestions

### Phase 4: Advanced Features
- [ ] **Task 4.1**: Add predictive analytics
  - Relationship churn risk modeling
  - Portfolio growth forecasting
  - Risk event prediction (defaults, overdrafts)
  - Revenue opportunity scoring

- [ ] **Task 4.2**: Add interactive features
  - Drill-down capabilities to relationship/client details
  - Customizable dashboard widgets
  - Alert management and workflow integration
  - Mobile-responsive design

## **BALANCED DASHBOARD LAYOUT**

### **Header: RM Overview** 📊
```
Portfolio Value: $847M (+5.2% QTD) | Risk Score: 6.4/10 (Stable) | Relationships: 23 (+2 this quarter)
```

### **Row 1: BALANCED PERFORMANCE & RISK CARDS** ⚖️
```
📈 PORTFOLIO PERFORMANCE          |  ⚠️ RISK MANAGEMENT
├── $847M Total Portfolio (+5.2%)  |  ├── $2.3M Overdraft Exposure
├── $12.4M Revenue (103% of target)|  ├── $1.8M Delinquent Loans (5 accounts)
├── +2 New Relationships (Q4)      |  ├── 7 High-Risk Alerts (3 critical)
└── 15 Active Opportunities ($8.2M)|  └── 2 UTR Filings (this month)
```

### **Row 2: TRENDS & ANALYTICS** 📈📉
```
🔄 RELATIONSHIP TRENDS             |  📊 RISK ANALYTICS
├── Relationship Growth: +8.7% YTD |  ├── Portfolio Risk: 6.4/10 (↔️ Stable)
├── Retention Rate: 96.2%          |  ├── Problem Accounts: 8 (3.4% of portfolio)
├── Avg Relationship: 4.2 years    |  ├── Collection Pipeline: $920K
└── Territory Coverage: 67%        |  └── Compliance: 91% current reviews
```

### **Row 3: ACTION PRIORITIES** 🎯
```
TODAY'S PRIORITIES (Balanced Portfolio + Risk Actions)
├── 🚨 Review: $450K overdraft at Johnson Holdings (Risk)
├── 💰 Close: $2.1M lending opportunity at Tech Corp (Portfolio)
├── 📞 Call: Delinquent payment follow-up - Manufacturing LLC (Risk)
├── 🤝 Meeting: Cross-sell treasury services - Real Estate Group (Portfolio)
└── 📋 Complete: KYC renewal for International Trading (Compliance)
```

## Proposed Balanced Metrics

### **PORTFOLIO PERFORMANCE METRICS** 📈
1. **Portfolio Value Growth**: YTD/QTD/MTD growth rates
2. **Revenue Performance**: Current vs targets with trends
3. **Relationship Count**: New/lost/net growth
4. **Cross-sell Success**: Opportunities closed vs pipeline
5. **Client Penetration**: Products per relationship
6. **Territory Coverage**: Market share in assigned area

### **RISK MANAGEMENT METRICS** ⚠️
7. **Overdraft Exposure**: Current balances and incident frequency
8. **Delinquency Status**: Aging buckets and collection progress
9. **Portfolio Risk Score**: Weighted average with trends
10. **Compliance Currency**: Review status and regulatory alerts
11. **UTR Activity**: Filings and suspicious activity monitoring
12. **Problem Account Ratio**: Percentage requiring attention

### **RELATIONSHIP HEALTH METRICS** 🤝
13. **Relationship Retention**: Churn rate and longevity
14. **Client Engagement**: Touch frequency and response rates
15. **Health Score**: Combined portfolio + risk assessment
16. **Lifecycle Stage**: New/growing/mature/at-risk distribution

### **OPERATIONAL EXCELLENCE METRICS** ⚡
17. **Goal Achievement**: Portfolio and risk targets
18. **Response Time**: Client request and alert resolution
19. **Meeting Completion**: Scheduled vs actual client interactions
20. **Efficiency Ratio**: Revenue per relationship vs risk exposure

## **Balanced Design Principles**

### **Visual Balance** ⚖️
- **50/50 Layout**: Equal screen real estate for portfolio and risk
- **Color Coordination**: Green (portfolio growth) + Red (risk alerts) + Blue (neutral metrics)
- **Priority Weighting**: Critical items from both sides get top placement

### **Workflow Integration** 🔄
- **Action Items**: Mix portfolio opportunities with risk mitigation tasks
- **Drill-down Paths**: Navigate to both relationship growth AND risk details
- **Alert System**: Balanced notifications for both opportunity and risk events

### **Performance Context** 📊
- **Risk-Adjusted Returns**: Portfolio performance metrics include risk considerations
- **Opportunity Scoring**: Risk factors included in opportunity prioritization
- **Balanced KPIs**: Success measures include both growth AND risk management

## Implementation Approach
- **Balanced Priority**: Equal development focus on portfolio and risk features
- **Incremental**: Phase-based rollout maintaining balance in each phase
- **Simple**: Each task impacts minimal code with balanced complexity
- **Integrated**: Portfolio and risk metrics work together, not in isolation
- **User-Centric**: RM workflow needs both perspectives simultaneously

## Validation Required
- Confirm equal importance of portfolio vs risk metrics for daily RM workflow
- Validate balanced visual layout with equal prominence
- Approve integrated action priority system (portfolio + risk)
- Define drill-down paths that support both portfolio growth and risk management decisions 

# RelationshipManagerView Enhanced Trend Analysis Implementation Plan

## Overview
Implement comprehensive trend analysis system for RelationshipManagerView with:
- High-level summary metrics with variance options (MoM, YoY, 6-month)
- Expandable trend analysis area with interactive charts
- Identification of top relationships driving variance
- Clickable drill-down to relationship-specific trend analysis

## Phase 1: Core Infrastructure Setup ✅ COMPLETED
- [x] Add reactive data properties for trend analysis
  - [x] Add variance type selection (MoM, YoY, 6-month, QTD)
  - [x] Add show/hide toggle for detailed trend area
  - [x] Add current variance calculations
  - [x] Add selected relationship tracking

- [x] Create base trend data structure
  - [x] Define trend data for each metric (portfolio, revenue, opportunities, risk)
  - [x] Create variance calculation methods
  - [x] Implement period-based data generation

## Phase 2: Enhanced Metrics Display ✅ COMPLETED
- [x] Update existing metric cards with variance indicators
  - [x] Add variance percentage display (+18.7%, -5.2%, etc.)
  - [x] Add trend direction indicators (📈📉)
  - [x] Add variance period labels (6M, YoY, MoM)
  - [x] Color-code based on positive/negative variance

- [x] Add variance type selector
  - [x] Create dropdown for MoM, YoY, 6-month, QTD selection
  - [x] Implement real-time variance updates on selection change
  - [x] Add "Show Details" toggle button

## Phase 3: Expandable Trend Analysis Area
- [ ] Create collapsible trend section
  - [ ] Add summary variance card with current metric and change
  - [ ] Implement interactive trend charts (line charts for time series)
  - [ ] Add period selector (3M, 6M, 1Y) for chart detail level

- [ ] Build variance contributors section
  - [ ] Create "Top Contributors to Growth" panel (green)
  - [ ] Create "Areas Requiring Attention" panel (red)
  - [ ] Show specific relationships driving variance
  - [ ] Display variance percentage and impact amount for each relationship

## Phase 4: Relationship Drill-Down Functionality
- [ ] Implement clickable relationship cards
  - [ ] Add hover effects and click handlers
  - [ ] Route to relationship-specific trend view
  - [ ] Pass selected metric and variance type as context

- [ ] Create relationship-specific trend analysis
  - [ ] Show individual relationship performance vs portfolio average
  - [ ] Display relationship rank within portfolio
  - [ ] Add actionable recommendations based on trend

- [ ] Add cross-metric analysis
  - [ ] Allow switching between metrics while maintaining relationship focus
  - [ ] Show correlation between different metrics for selected relationship

## Phase 5: Advanced Features
- [ ] Add variance attribution analysis
  - [ ] Calculate which relationships contribute most to overall variance
  - [ ] Show percentage breakdown of variance by relationship
  - [ ] Implement threshold-based alerts for significant variances

- [ ] Create trend insights and recommendations
  - [ ] Generate automatic insights based on variance patterns
  - [ ] Suggest action items for relationships with concerning trends
  - [ ] Highlight opportunities for growth based on positive trends

- [ ] Add export and reporting capabilities
  - [ ] Enable export of trend analysis data
  - [ ] Create printable trend reports
  - [ ] Add scheduled trend monitoring alerts

## Technical Implementation Details

### Data Structure
```javascript
// Trend data structure per relationship
relationshipTrends: {
  [relationshipId]: {
    portfolio: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    revenue: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    opportunities: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 },
    risk: { current: 0, mom: 0, yoy: 0, '6month': 0, qtd: 0 }
  }
}
```

### Key Components
1. **Enhanced Metric Cards** - Display current value + variance
2. **Variance Selector** - Dropdown for MoM/YoY/6M/QTD
3. **Trend Chart Area** - Expandable section with ApexCharts
4. **Variance Contributors** - Lists of relationships with impact
5. **Drill-Down Navigation** - Routes to relationship detail with context

### User Experience Flow
1. User sees metric cards with variance indicators
2. User selects variance type (MoM, YoY, etc.)
3. User clicks "Show Details" to expand trend analysis
4. User sees trend chart and variance contributors
5. User clicks on specific relationship to drill down
6. User sees relationship-specific trend analysis with recommendations

## Success Criteria
- [ ] All metrics show variance with clear visual indicators
- [ ] Trend analysis area smoothly expands/collapses
- [ ] Charts update dynamically based on variance type selection
- [ ] Relationship drill-down provides actionable insights
- [ ] Performance remains smooth with all features active
- [ ] UI is intuitive and follows existing design patterns

## Testing Plan
- [ ] Test variance calculations for accuracy
- [ ] Verify chart rendering performance with large datasets
- [ ] Test drill-down navigation and context preservation
- [ ] Validate responsive design on different screen sizes
- [ ] Test accessibility of new interactive elements 