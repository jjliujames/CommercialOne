// Mock data for Client 360 Portfolio Management Tool

// Executive level metrics - Enhanced with AI-driven opportunities
export const executiveMetrics = {
    totalPortfolioValue: 2400000000, // $2.4B
    totalClients: 1247,
    totalRevenue: 180000000, // $180M annually
    totalRMs: 12,

    // Enhanced Metrics
    transactionVolume12Mo: 45600000000, // $45.6B in transactions
    highRiskClientPercentage: 5.7, // 71/1247 clients
    totalRevenuePotential: 245000000, // $245M potential from opportunities
    productPenetrationOverall: 67.3, // Overall product penetration percentage

    // AI Opportunity Insights
    opportunityInsights: {
        totalOpportunityValue: 65000000, // $65M potential revenue
        clientsNeedingUpsell: 523, // 41.9% of clients
        avgOpportunityPerClient: 124500,
        topOpportunityTypes: [
            { type: 'Treasury Management', clients: 187, potential: 18700000, penetration: 45 },
            { type: 'FX Services', clients: 156, potential: 12480000, penetration: 62 },
            { type: 'Commercial Lending', clients: 134, potential: 20100000, penetration: 38 },
            { type: 'Investment Services', clients: 98, potential: 9800000, penetration: 72 },
            { type: 'Trade Finance', clients: 67, potential: 4020000, penetration: 81 }
        ]
    },

    // Product Penetration Dashboard
    productPenetration: {
        treasuryManagement: { penetration: 45, clients: 562, potential: 685, gap: 123 },
        fxServices: { penetration: 62, clients: 773, potential: 1247, gap: 474 },
        commercialLending: { penetration: 38, clients: 474, potential: 800, gap: 326 },
        investmentServices: { penetration: 72, clients: 898, potential: 1000, gap: 102 },
        tradeFinance: { penetration: 81, clients: 1010, potential: 1100, gap: 90 },
        cashManagement: { penetration: 89, clients: 1110, potential: 1247, gap: 137 }
    },

    // AI Opportunity Score Heatmap
    aiOpportunityHeatmap: [
        { metro: 'New York', score: 8.7, opportunities: 89, potential: 12500000 },
        { metro: 'Miami', score: 7.9, opportunities: 28, potential: 6800000 },
        { metro: 'Boston', score: 7.4, opportunities: 42, potential: 7100000 },
        { metro: 'Chicago', score: 7.1, opportunities: 31, potential: 5900000 },
        { metro: 'Philadelphia', score: 6.8, opportunities: 35, potential: 5200000 },
        { metro: 'Atlanta', score: 6.5, opportunities: 29, potential: 4800000 }
    ],

    // Top Opportunities by Metro/Market
    topOpportunitiesByMetro: [
        {
            metro: 'New York Metro',
            opportunities: [
                { type: 'Treasury Management Upsell', clients: 45, revenue: 4500000, priority: 'High' },
                { type: 'FX Service Gap', clients: 38, revenue: 3040000, priority: 'High' },
                { type: 'Commercial Credit Facility', clients: 28, revenue: 4200000, priority: 'Medium' }
            ]
        },
        {
            metro: 'Miami Metro',
            opportunities: [
                { type: 'Latin America FX Corridor', clients: 19, revenue: 2280000, priority: 'High' },
                { type: 'Commercial Real Estate Lending', clients: 16, revenue: 2400000, priority: 'High' },
                { type: 'Treasury Management', clients: 21, revenue: 2100000, priority: 'Medium' }
            ]
        }
    ],

    riskDistribution: {
        low: 892,
        medium: 284,
        high: 71
    },
    riskTrends: [
        { month: 'Jul 2024', low: 865, medium: 278, high: 78 },
        { month: 'Aug 2024', low: 873, medium: 281, high: 74 },
        { month: 'Sep 2024', low: 881, medium: 275, high: 82 },
        { month: 'Oct 2024', low: 887, medium: 279, high: 76 },
        { month: 'Nov 2024', low: 895, medium: 282, high: 69 },
        { month: 'Dec 2024', low: 892, medium: 284, high: 71 }
    ],
    monthlyTrends: [
        { month: 'Jul 2024', revenue: 14500000, newClients: 23, portfolioValue: 2200000000, clientCount: 1180, opportunities: 78 },
        { month: 'Aug 2024', revenue: 15200000, newClients: 31, portfolioValue: 2250000000, clientCount: 1195, opportunities: 82 },
        { month: 'Sep 2024', revenue: 14800000, newClients: 18, portfolioValue: 2180000000, clientCount: 1210, opportunities: 85 },
        { month: 'Oct 2024', revenue: 16100000, newClients: 28, portfolioValue: 2350000000, clientCount: 1225, opportunities: 89 },
        { month: 'Nov 2024', revenue: 15900000, newClients: 25, portfolioValue: 2320000000, clientCount: 1240, opportunities: 92 },
        { month: 'Dec 2024', revenue: 16200000, newClients: 22, portfolioValue: 2400000000, clientCount: 1247, opportunities: 95 }
    ],
    portfolioTrend: [
        { month: 'Jul 2024', portfolioValue: 2200000000 },
        { month: 'Aug 2024', portfolioValue: 2250000000 },
        { month: 'Sep 2024', portfolioValue: 2180000000 },
        { month: 'Oct 2024', portfolioValue: 2350000000 },
        { month: 'Nov 2024', portfolioValue: 2320000000 },
        { month: 'Dec 2024', portfolioValue: 2400000000 }
    ],
    clientGrowth: [
        { month: 'Jul 2024', clientCount: 1180 },
        { month: 'Aug 2024', clientCount: 1195 },
        { month: 'Sep 2024', clientCount: 1210 },
        { month: 'Oct 2024', clientCount: 1225 },
        { month: 'Nov 2024', clientCount: 1240 },
        { month: 'Dec 2024', clientCount: 1247 }
    ],
    sparklines: {
        portfolioValue: [2200, 2250, 2180, 2350, 2320, 2400], // 6-month trend in millions
        clientCount: [1180, 1195, 1210, 1225, 1240, 1247], // 6-month client growth
        revenue: [145, 152, 148, 161, 159, 162], // 6-month revenue in millions
        highRiskClients: [78, 74, 82, 76, 69, 71], // 6-month high risk client count
        opportunities: [78, 82, 85, 89, 92, 95] // 6-month opportunity count trend
    },
    keyRiskIndicators: {
        highRiskIndustry: {
            clientCount: 45,
            totalVolume: 890000000, // $890M
            categories: [
                { name: 'Cannabis', clients: 12, volume: 245000000 },
                { name: 'Gaming/Gambling', clients: 8, volume: 156000000 },
                { name: 'Cryptocurrency', clients: 15, volume: 289000000 },
                { name: 'Arms/Defense', clients: 6, volume: 134000000 },
                { name: 'Adult Entertainment', clients: 4, volume: 66000000 }
            ]
        },
        moneyServiceBusiness: {
            clientCount: 23,
            totalVolume: 456000000, // $456M
            transactionCount: 12450,
            categories: [
                { name: 'Money Transmitters', clients: 14, volume: 298000000, transactions: 8200 },
                { name: 'Currency Exchangers', clients: 6, volume: 112000000, transactions: 2800 },
                { name: 'Check Cashers', clients: 3, volume: 46000000, transactions: 1450 }
            ]
        },
        highCashTransactions: {
            clientCount: 67,
            totalVolume: 1200000000, // $1.2B
            transactionCount: 2340,
            thresholds: [
                { range: '$500K - $1M', clients: 45, volume: 580000000, transactions: 1890 },
                { range: '$1M - $5M', clients: 18, volume: 420000000, transactions: 380 },
                { range: '$5M+', clients: 4, volume: 200000000, transactions: 70 }
            ]
        },
        correspondentBanking: {
            clientCount: 34,
            totalVolume: 2100000000, // $2.1B
            transactionCount: 8900,
            countries: [
                { name: 'Mexico', clients: 12, volume: 890000000, transactions: 3200 },
                { name: 'Canada', clients: 8, volume: 567000000, transactions: 2100 },
                { name: 'UK', clients: 6, volume: 345000000, transactions: 1800 },
                { name: 'Germany', clients: 5, volume: 198000000, transactions: 1200 },
                { name: 'Others', clients: 3, volume: 100000000, transactions: 600 }
            ]
        },
        highRiskCountries: {
            clientCount: 19,
            totalVolume: 234000000, // $234M
            transactionCount: 890,
            countries: [
                { name: 'Iran', clients: 3, volume: 89000000, transactions: 230, riskLevel: 'Extreme' },
                { name: 'North Korea', clients: 1, volume: 12000000, transactions: 45, riskLevel: 'Extreme' },
                { name: 'Russia', clients: 8, volume: 78000000, transactions: 340, riskLevel: 'High' },
                { name: 'China', clients: 5, volume: 45000000, transactions: 180, riskLevel: 'Medium' },
                { name: 'Others', clients: 2, volume: 10000000, transactions: 95, riskLevel: 'Medium' }
            ]
        },
        personalSpending: {
            clientCount: 89,
            totalVolume: 145000000, // $145M
            transactionCount: 4560,
            categories: [
                { name: 'Luxury Goods', clients: 34, volume: 67000000, transactions: 1200 },
                { name: 'Cryptocurrency', clients: 28, volume: 45000000, transactions: 2100 },
                { name: 'Real Estate (Personal)', clients: 15, volume: 23000000, transactions: 890 },
                { name: 'Jewelry/Art', clients: 8, volume: 7000000, transactions: 240 },
                { name: 'Other Personal', clients: 4, volume: 3000000, transactions: 130 }
            ]
        },
        utrFilings: {
            totalFilings: 156,
            totalVolume: 890000000, // $890M
            categories: [
                { type: 'Structuring', filings: 45, volume: 234000000 },
                { type: 'Unusual Patterns', filings: 38, volume: 189000000 },
                { type: 'High-Risk Geography', filings: 29, volume: 156000000 },
                { type: 'MSB Related', filings: 24, volume: 167000000 },
                { type: 'Other Suspicious', filings: 20, volume: 144000000 }
            ]
        }
    }
}

// Metros data from CSV - Enhanced with AI-driven opportunities  
export const metros = [
    {
        id: 'new-york',
        name: 'New York Metro',
        portfolioValue: 950000000,
        clientCount: 487,
        revenue: 71250000,
        marketCount: 2,
        riskScore: 'Medium',

        // Enhanced Metro Metrics
        avgClientRiskScore: 6.8,
        revenuePerRM: 8906250, // revenue / total RMs in metro
        clientGrowthRate: 12.5, // annual %
        transactionVolume: 15800000000,

        // Opportunity Roll-Up
        opportunityMetrics: {
            totalOpportunityValue: 12500000,
            clientsNeedingUpsell: 89,
            avgOpportunitySize: 140450,
            conversionRate: 23.4
        },

        // Top 3 Product Gaps
        productGaps: [
            { product: 'Treasury Management', clientsWithoutProduct: 45, potential: 4500000, priority: 'High' },
            { product: 'FX Services', clientsWithoutProduct: 38, potential: 3040000, priority: 'High' },
            { product: 'Commercial Lending', clientsWithoutProduct: 28, potential: 4200000, priority: 'Medium' }
        ],

        // Unused High-Margin Services
        unusedServices: [
            { service: 'Investment Advisory', missedRevenue: 2100000, eligibleClients: 67 },
            { service: 'Trade Finance', missedRevenue: 1890000, eligibleClients: 34 },
            { service: 'Cash Management Premium', missedRevenue: 1230000, eligibleClients: 23 }
        ],

        // Top High-Risk Clients
        highRiskClients: [
            { name: 'Global Trading LLC', riskScore: 9.2, volume: 45000000, flags: ['Cross-Border', 'High-Cash'] },
            { name: 'International Holdings', riskScore: 8.9, volume: 38000000, flags: ['PEP', 'Sanctions'] },
            { name: 'Crypto Exchange Corp', riskScore: 8.7, volume: 28000000, flags: ['Crypto', 'MSB'] }
        ]
    },
    {
        id: 'boston',
        name: 'Boston Metro',
        portfolioValue: 420000000,
        clientCount: 218,
        revenue: 31500000,
        marketCount: 1,
        riskScore: 'Low',

        avgClientRiskScore: 4.2,
        revenuePerRM: 6300000,
        clientGrowthRate: 8.7,
        transactionVolume: 7200000000,

        opportunityMetrics: {
            totalOpportunityValue: 7100000,
            clientsNeedingUpsell: 42,
            avgOpportunitySize: 169050,
            conversionRate: 28.1
        },

        productGaps: [
            { product: 'Commercial Lending', clientsWithoutProduct: 28, potential: 2800000, priority: 'High' },
            { product: 'Investment Services', clientsWithoutProduct: 19, potential: 1900000, priority: 'Medium' },
            { product: 'Treasury Management', clientsWithoutProduct: 15, potential: 1500000, priority: 'Medium' }
        ],

        unusedServices: [
            { service: 'Portfolio Management', missedRevenue: 1450000, eligibleClients: 34 },
            { service: 'FX Premium Services', missedRevenue: 890000, eligibleClients: 18 },
            { service: 'Escrow Services', missedRevenue: 670000, eligibleClients: 12 }
        ],

        highRiskClients: [
            { name: 'Biotech Research Inc', riskScore: 7.1, volume: 18000000, flags: ['Research', 'International'] },
            { name: 'Maritime Logistics', riskScore: 6.8, volume: 15000000, flags: ['Cross-Border'] }
        ]
    },
    {
        id: 'philadelphia',
        name: 'Philadelphia Metro',
        portfolioValue: 380000000,
        clientCount: 195,
        revenue: 28500000,
        marketCount: 1,
        riskScore: 'Medium',

        avgClientRiskScore: 5.9,
        revenuePerRM: 5700000,
        clientGrowthRate: 9.2,
        transactionVolume: 6800000000,

        opportunityMetrics: {
            totalOpportunityValue: 5200000,
            clientsNeedingUpsell: 35,
            avgOpportunitySize: 148570,
            conversionRate: 25.7
        },

        productGaps: [
            { product: 'Treasury Management', clientsWithoutProduct: 23, potential: 2300000, priority: 'High' },
            { product: 'FX Services', clientsWithoutProduct: 18, potential: 1440000, priority: 'Medium' },
            { product: 'Trade Finance', clientsWithoutProduct: 12, potential: 840000, priority: 'Medium' }
        ],

        unusedServices: [
            { service: 'Commercial Real Estate Finance', missedRevenue: 1200000, eligibleClients: 28 },
            { service: 'Equipment Financing', missedRevenue: 780000, eligibleClients: 15 },
            { service: 'Letter of Credit Services', missedRevenue: 450000, eligibleClients: 8 }
        ],

        highRiskClients: [
            { name: 'Energy Trading Partners', riskScore: 8.3, volume: 22000000, flags: ['Energy', 'Cross-Border'] },
            { name: 'Chemical Imports LLC', riskScore: 7.9, volume: 19000000, flags: ['Chemical', 'Sanctions'] }
        ]
    },
    {
        id: 'atlanta',
        name: 'Atlanta Metro',
        portfolioValue: 340000000,
        clientCount: 167,
        revenue: 25500000,
        marketCount: 1,
        riskScore: 'Medium',

        avgClientRiskScore: 6.1,
        revenuePerRM: 6375000,
        clientGrowthRate: 11.3,
        transactionVolume: 5900000000,

        opportunityMetrics: {
            totalOpportunityValue: 4800000,
            clientsNeedingUpsell: 29,
            avgOpportunitySize: 165520,
            conversionRate: 22.8
        },

        productGaps: [
            { product: 'Commercial Lending', clientsWithoutProduct: 19, potential: 2280000, priority: 'High' },
            { product: 'Treasury Management', clientsWithoutProduct: 16, potential: 1600000, priority: 'Medium' },
            { product: 'Investment Services', clientsWithoutProduct: 14, potential: 1400000, priority: 'Low' }
        ],

        unusedServices: [
            { service: 'Supply Chain Finance', missedRevenue: 980000, eligibleClients: 22 },
            { service: 'International Wire Services', missedRevenue: 670000, eligibleClients: 13 },
            { service: 'Merchant Services', missedRevenue: 540000, eligibleClients: 18 }
        ],

        highRiskClients: [
            { name: 'Logistics Hub Corp', riskScore: 7.6, volume: 16000000, flags: ['Transportation', 'High-Cash'] },
            { name: 'Export Trading Co', riskScore: 7.2, volume: 13000000, flags: ['Export', 'Cross-Border'] }
        ]
    },
    {
        id: 'miami',
        name: 'Miami Metro',
        portfolioValue: 310000000,
        clientCount: 154,
        revenue: 23250000,
        marketCount: 2,
        riskScore: 'High',

        avgClientRiskScore: 7.8,
        revenuePerRM: 7750000,
        clientGrowthRate: 15.6,
        transactionVolume: 8900000000,

        opportunityMetrics: {
            totalOpportunityValue: 6800000,
            clientsNeedingUpsell: 28,
            avgOpportunitySize: 242860,
            conversionRate: 19.3
        },

        productGaps: [
            { product: 'Latin America FX Corridor', clientsWithoutProduct: 19, potential: 2280000, priority: 'High' },
            { product: 'Commercial Real Estate Finance', clientsWithoutProduct: 16, potential: 2400000, priority: 'High' },
            { product: 'Cross-Border Payment Solutions', clientsWithoutProduct: 21, potential: 2100000, priority: 'Medium' }
        ],

        unusedServices: [
            { service: 'International Trade Finance', missedRevenue: 1890000, eligibleClients: 31 },
            { service: 'Multi-Currency Accounts', missedRevenue: 1340000, eligibleClients: 24 },
            { service: 'Correspondent Banking', missedRevenue: 980000, eligibleClients: 17 }
        ],

        highRiskClients: [
            { name: 'Caribbean Trading Ltd', riskScore: 9.1, volume: 34000000, flags: ['Offshore', 'High-Cash', 'PEP'] },
            { name: 'Latin Export Partners', riskScore: 8.8, volume: 28000000, flags: ['Cross-Border', 'MSB'] },
            { name: 'Real Estate Holdings SA', riskScore: 8.4, volume: 25000000, flags: ['Real Estate', 'High-Cash'] }
        ]
    },
    {
        id: 'chicago',
        name: 'Chicago Metro',
        portfolioValue: 290000000,
        clientCount: 142,
        revenue: 21750000,
        marketCount: 1,
        riskScore: 'Medium',

        avgClientRiskScore: 5.6,
        revenuePerRM: 5437500,
        clientGrowthRate: 7.9,
        transactionVolume: 5200000000,

        opportunityMetrics: {
            totalOpportunityValue: 5900000,
            clientsNeedingUpsell: 31,
            avgOpportunitySize: 190320,
            conversionRate: 26.4
        },

        productGaps: [
            { product: 'Agricultural Finance', clientsWithoutProduct: 21, potential: 2520000, priority: 'High' },
            { product: 'Equipment Financing', clientsWithoutProduct: 18, potential: 1800000, priority: 'Medium' },
            { product: 'Supply Chain Finance', clientsWithoutProduct: 15, potential: 1350000, priority: 'Medium' }
        ],

        unusedServices: [
            { service: 'Commodity Trading Finance', missedRevenue: 1450000, eligibleClients: 29 },
            { service: 'Manufacturing Finance', missedRevenue: 890000, eligibleClients: 19 },
            { service: 'Transportation Finance', missedRevenue: 670000, eligibleClients: 14 }
        ],

        highRiskClients: [
            { name: 'Commodity Exchange Inc', riskScore: 7.3, volume: 19000000, flags: ['Commodity', 'High-Volume'] },
            { name: 'Manufacturing Consortium', riskScore: 6.9, volume: 16000000, flags: ['Manufacturing', 'Cross-Border'] }
        ]
    }
]

// Markets data from CSV
export const markets = [
    {
        id: 'north-america-east',
        name: 'North America East',
        metroId: 'new-york',
        portfolioValue: 580000000,
        clientCount: 295,
        revenue: 43500000,
        regionCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'international-europe',
        name: 'International Europe',
        metroId: 'new-york',
        portfolioValue: 370000000,
        clientCount: 192,
        revenue: 27750000,
        regionCount: 2,
        riskScore: 'High'
    },
    {
        id: 'new-england',
        name: 'New England',
        metroId: 'boston',
        portfolioValue: 420000000,
        clientCount: 218,
        revenue: 31500000,
        regionCount: 2,
        riskScore: 'Low'
    },
    {
        id: 'mid-atlantic-south',
        name: 'Mid-Atlantic South',
        metroId: 'philadelphia',
        portfolioValue: 380000000,
        clientCount: 195,
        revenue: 28500000,
        regionCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'southeast',
        name: 'Southeast',
        metroId: 'atlanta',
        portfolioValue: 340000000,
        clientCount: 167,
        revenue: 25500000,
        regionCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'south-florida',
        name: 'South Florida',
        metroId: 'miami',
        portfolioValue: 185000000,
        clientCount: 92,
        revenue: 13875000,
        regionCount: 2,
        riskScore: 'High'
    },
    {
        id: 'latin-america',
        name: 'Latin America',
        metroId: 'miami',
        portfolioValue: 125000000,
        clientCount: 62,
        revenue: 9375000,
        regionCount: 2,
        riskScore: 'High'
    },
    {
        id: 'midwest',
        name: 'Midwest',
        metroId: 'chicago',
        portfolioValue: 290000000,
        clientCount: 142,
        revenue: 21750000,
        regionCount: 2,
        riskScore: 'Medium'
    }
]

// Regions data from CSV
export const regions = [
    {
        id: 'northeast-corridor',
        name: 'Northeast Corridor',
        vpName: 'James Mitchell',
        marketId: 'north-america-east',
        portfolioValue: 320000000,
        clientCount: 165,
        revenue: 24000000,
        rmCount: 3,
        riskScore: 'Medium'
    },
    {
        id: 'mid-atlantic',
        name: 'Mid-Atlantic',
        vpName: 'Sarah Thompson',
        marketId: 'north-america-east',
        portfolioValue: 260000000,
        clientCount: 130,
        revenue: 19500000,
        rmCount: 3,
        riskScore: 'Medium'
    },
    {
        id: 'uk-ireland',
        name: 'UK & Ireland',
        vpName: 'Michael O\'Brien',
        marketId: 'international-europe',
        portfolioValue: 200000000,
        clientCount: 105,
        revenue: 15000000,
        rmCount: 2,
        riskScore: 'High'
    },
    {
        id: 'continental-europe',
        name: 'Continental Europe',
        vpName: 'Elena Müller',
        marketId: 'international-europe',
        portfolioValue: 170000000,
        clientCount: 87,
        revenue: 12750000,
        rmCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'greater-boston',
        name: 'Greater Boston',
        vpName: 'Robert Chen',
        marketId: 'new-england',
        portfolioValue: 250000000,
        clientCount: 130,
        revenue: 18750000,
        rmCount: 3,
        riskScore: 'Low'
    },
    {
        id: 'northern-new-england',
        name: 'Northern New England',
        marketId: 'new-england',
        portfolioValue: 170000000,
        clientCount: 88,
        revenue: 12750000,
        rmCount: 2,
        riskScore: 'Low'
    },
    {
        id: 'philadelphia-metro',
        name: 'Philadelphia Metro Region',
        marketId: 'mid-atlantic-south',
        portfolioValue: 220000000,
        clientCount: 115,
        revenue: 16500000,
        rmCount: 3,
        riskScore: 'Medium'
    },
    {
        id: 'delaware-valley',
        name: 'Delaware Valley',
        vpName: 'Thomas Davis',
        marketId: 'mid-atlantic-south',
        portfolioValue: 160000000,
        clientCount: 80,
        revenue: 12000000,
        rmCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'georgia-metro',
        name: 'Georgia Metro',
        vpName: 'Marcus Johnson',
        marketId: 'southeast',
        portfolioValue: 200000000,
        clientCount: 98,
        revenue: 15000000,
        rmCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'carolinas',
        name: 'Carolinas',
        marketId: 'southeast',
        portfolioValue: 140000000,
        clientCount: 69,
        revenue: 10500000,
        rmCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'miami-dade',
        name: 'Miami-Dade',
        marketId: 'south-florida',
        portfolioValue: 110000000,
        clientCount: 55,
        revenue: 8250000,
        rmCount: 2,
        riskScore: 'High'
    },
    {
        id: 'broward-palm-beach',
        name: 'Broward-Palm Beach',
        marketId: 'south-florida',
        portfolioValue: 75000000,
        clientCount: 37,
        revenue: 5625000,
        rmCount: 1,
        riskScore: 'Medium'
    },
    {
        id: 'caribbean',
        name: 'Caribbean',
        marketId: 'latin-america',
        portfolioValue: 70000000,
        clientCount: 35,
        revenue: 5250000,
        rmCount: 1,
        riskScore: 'High'
    },
    {
        id: 'central-america',
        name: 'Central America',
        marketId: 'latin-america',
        portfolioValue: 55000000,
        clientCount: 27,
        revenue: 4125000,
        rmCount: 1,
        riskScore: 'High'
    },
    {
        id: 'illinois-metro',
        name: 'Illinois Metro',
        vpName: 'David Anderson',
        marketId: 'midwest',
        portfolioValue: 170000000,
        clientCount: 83,
        revenue: 12750000,
        rmCount: 2,
        riskScore: 'Medium'
    },
    {
        id: 'great-lakes',
        name: 'Great Lakes',
        marketId: 'midwest',
        portfolioValue: 120000000,
        clientCount: 59,
        revenue: 9000000,
        rmCount: 2,
        riskScore: 'Medium'
    }
]

// Relationship Managers - Updated for new CSV structure
export const relationshipManagers = [
    // Northeast Corridor
    {
        id: 'rm-001',
        name: 'Sarah Johnson',
        regionId: 'northeast-corridor',
        portfolioValue: 120000000,
        clientCount: 60,
        revenue: 9000000,
        riskScore: 'Low',
        clientIds: ['client-001', 'client-002', 'client-003', 'client-004']
    },
    {
        id: 'rm-002',
        name: 'Michael Chen',
        regionId: 'northeast-corridor',
        portfolioValue: 110000000,
        clientCount: 55,
        revenue: 8250000,
        riskScore: 'Medium',
        clientIds: ['client-005', 'client-006', 'client-007']
    },
    {
        id: 'rm-003',
        name: 'Emily Rodriguez',
        regionId: 'northeast-corridor',
        portfolioValue: 90000000,
        clientCount: 50,
        revenue: 6750000,
        riskScore: 'Medium',
        clientIds: ['client-008', 'client-009']
    },
    // Mid-Atlantic
    {
        id: 'rm-004',
        name: 'David Thompson',
        regionId: 'mid-atlantic',
        portfolioValue: 95000000,
        clientCount: 48,
        revenue: 7125000,
        riskScore: 'Medium',
        clientIds: ['client-010', 'client-011', 'client-012']
    },
    {
        id: 'rm-005',
        name: 'Lisa Wang',
        regionId: 'mid-atlantic',
        portfolioValue: 85000000,
        clientCount: 42,
        revenue: 6375000,
        riskScore: 'Low',
        clientIds: ['client-013', 'client-014']
    },
    {
        id: 'rm-006',
        name: 'Robert Martinez',
        regionId: 'mid-atlantic',
        portfolioValue: 80000000,
        clientCount: 40,
        revenue: 6000000,
        riskScore: 'Medium',
        clientIds: ['client-015', 'client-016']
    },
    // Greater Boston
    {
        id: 'rm-007',
        name: 'Jennifer Kim',
        regionId: 'greater-boston',
        portfolioValue: 90000000,
        clientCount: 45,
        revenue: 6750000,
        riskScore: 'Low',
        clientIds: ['client-017', 'client-018']
    },
    {
        id: 'rm-008',
        name: 'Christopher Lee',
        regionId: 'greater-boston',
        portfolioValue: 85000000,
        clientCount: 43,
        revenue: 6375000,
        riskScore: 'Low',
        clientIds: ['client-019', 'client-020']
    },
    {
        id: 'rm-009',
        name: 'Amanda Foster',
        regionId: 'greater-boston',
        portfolioValue: 75000000,
        clientCount: 42,
        revenue: 5625000,
        riskScore: 'Low',
        clientIds: ['client-021']
    },
    // UK & Ireland
    {
        id: 'rm-010',
        name: 'Oliver Schmidt',
        regionId: 'uk-ireland',
        portfolioValue: 110000000,
        clientCount: 55,
        revenue: 8250000,
        riskScore: 'High',
        clientIds: ['client-022', 'client-023']
    },
    {
        id: 'rm-011',
        name: 'Sophie Dubois',
        regionId: 'uk-ireland',
        portfolioValue: 90000000,
        clientCount: 50,
        revenue: 6750000,
        riskScore: 'High',
        clientIds: ['client-024', 'client-025']
    },
    // Continental Europe
    {
        id: 'rm-012',
        name: 'Hiroshi Tanaka',
        regionId: 'continental-europe',
        portfolioValue: 85000000,
        clientCount: 44,
        revenue: 6375000,
        riskScore: 'Medium',
        clientIds: ['client-026', 'client-027']
    },
    {
        id: 'rm-013',
        name: 'Maria Gonzalez',
        regionId: 'continental-europe',
        portfolioValue: 85000000,
        clientCount: 43,
        revenue: 6375000,
        riskScore: 'Medium',
        clientIds: ['client-028', 'client-029']
    },
    // Philadelphia Metro
    {
        id: 'rm-014',
        name: 'James Wilson',
        regionId: 'philadelphia-metro',
        portfolioValue: 80000000,
        clientCount: 40,
        revenue: 6000000,
        riskScore: 'Medium',
        clientIds: ['client-030', 'client-031']
    },
    {
        id: 'rm-015',
        name: 'Rachel Adams',
        regionId: 'philadelphia-metro',
        portfolioValue: 75000000,
        clientCount: 38,
        revenue: 5625000,
        riskScore: 'Medium',
        clientIds: ['client-032', 'client-033']
    },
    {
        id: 'rm-016',
        name: 'Kevin O\'Brien',
        regionId: 'philadelphia-metro',
        portfolioValue: 65000000,
        clientCount: 37,
        revenue: 4875000,
        riskScore: 'Low',
        clientIds: ['client-034']
    },
    // Miami-Dade
    {
        id: 'rm-017',
        name: 'Carlos Rodriguez',
        regionId: 'miami-dade',
        portfolioValue: 60000000,
        clientCount: 30,
        revenue: 4500000,
        riskScore: 'High',
        clientIds: ['client-035', 'client-036']
    },
    {
        id: 'rm-018',
        name: 'Ana Morales',
        regionId: 'miami-dade',
        portfolioValue: 50000000,
        clientCount: 25,
        revenue: 3750000,
        riskScore: 'High',
        clientIds: ['client-037']
    },
    // Ontario
    {
        id: 'rm-019',
        name: 'William Fraser',
        regionId: 'ontario',
        portfolioValue: 80000000,
        clientCount: 40,
        revenue: 6000000,
        riskScore: 'Medium',
        clientIds: ['client-038', 'client-039']
    },
    {
        id: 'rm-020',
        name: 'Marie Tremblay',
        regionId: 'ontario',
        portfolioValue: 70000000,
        clientCount: 35,
        revenue: 5250000,
        riskScore: 'Medium',
        clientIds: ['client-040']
    }
]

export const relationships = {
    'rm-001': [
        {
            id: 'rel-001',
            name: 'Johnson Holdings Group',
            industry: 'Manufacturing',
            totalValue: 49800000,
            clientCount: 10,
            revenue: 4063000,
            riskLevel: 'Medium',
            rmId: 'rm-001',
            tier: 'Platinum',
            lastReview: '2 weeks ago'
        },
        {
            id: 'rel-002',
            name: 'TechCorp Ventures',
            industry: 'Technology',
            totalValue: 32800000,
            clientCount: 5,
            revenue: 2100000,
            riskLevel: 'Low',
            rmId: 'rm-001',
            tier: 'Gold',
            lastReview: '1 month ago'
        },
        {
            id: 'rel-003',
            name: 'Atlantic Healthcare Network',
            industry: 'Healthcare',
            totalValue: 28500000,
            clientCount: 6,
            revenue: 1800000,
            riskLevel: 'Low',
            rmId: 'rm-001',
            tier: 'Gold',
            lastReview: '3 weeks ago'
        }
    ],
    'rm-002': [
        {
            id: 'rel-004',
            name: 'Global Energy Consortium',
            industry: 'Energy',
            totalValue: 67000000,
            clientCount: 12,
            revenue: 4200000,
            riskLevel: 'High',
            rmId: 'rm-002',
            tier: 'Platinum',
            lastReview: '1 week ago'
        },
        {
            id: 'rel-005',
            name: 'Northeast Construction Group',
            industry: 'Construction',
            totalValue: 38900000,
            clientCount: 9,
            revenue: 2650000,
            riskLevel: 'Medium',
            rmId: 'rm-002',
            tier: 'Gold',
            lastReview: '2 weeks ago'
        }
    ],
    'rm-003': [
        {
            id: 'rel-006',
            name: 'Pacific Aerospace Holdings',
            industry: 'Aerospace',
            totalValue: 89200000,
            clientCount: 15,
            revenue: 5800000,
            riskLevel: 'Medium',
            rmId: 'rm-003',
            tier: 'Platinum',
            lastReview: '1 week ago'
        }
    ],
    'rm-004': [
        {
            id: 'rel-007',
            name: 'Maritime Solutions Network',
            industry: 'Maritime',
            totalValue: 55700000,
            clientCount: 10,
            revenue: 3200000,
            riskLevel: 'High',
            rmId: 'rm-004',
            tier: 'Gold',
            lastReview: '5 days ago'
        },
        {
            id: 'rel-008',
            name: 'Tourism & Hospitality Group',
            industry: 'Tourism',
            totalValue: 34200000,
            clientCount: 7,
            revenue: 2100000,
            riskLevel: 'Medium',
            rmId: 'rm-004',
            tier: 'Silver',
            lastReview: '2 weeks ago'
        }
    ],
    'rm-005': [
        {
            id: 'rel-009',
            name: 'Real Estate Development Corp',
            industry: 'Real Estate',
            totalValue: 78400000,
            clientCount: 11,
            revenue: 4900000,
            riskLevel: 'Medium',
            rmId: 'rm-005',
            tier: 'Platinum',
            lastReview: '10 days ago'
        },
        {
            id: 'rel-010',
            name: 'Global Logistics Network',
            industry: 'Logistics',
            totalValue: 84800000,
            clientCount: 3,
            revenue: 5610000,
            riskLevel: 'High',
            rmId: 'rm-005',
            tier: 'Private',
            lastReview: '3 days ago'
        }
    ],
    'rm-006': [
        {
            id: 'rel-011',
            name: 'Education Services Consortium',
            industry: 'Education',
            totalValue: 77300000,
            clientCount: 3,
            revenue: 3820000,
            riskLevel: 'Low',
            rmId: 'rm-006',
            tier: 'Platinum',
            lastReview: '1 week ago'
        },
        {
            id: 'rel-012',
            name: 'Food & Beverage Holdings',
            industry: 'Food & Beverage',
            totalValue: 77300000,
            clientCount: 3,
            revenue: 5080000,
            riskLevel: 'Medium',
            rmId: 'rm-006',
            tier: 'Platinum',
            lastReview: '5 days ago'
        }
    ],
    'rm-007': [
        {
            id: 'rel-013',
            name: 'International Trade Group',
            industry: 'Import/Export',
            totalValue: 156200000,
            clientCount: 18,
            revenue: 12400000,
            riskLevel: 'High',
            rmId: 'rm-007',
            tier: 'Private',
            lastReview: '2 days ago'
        }
    ]
}

export const clients = {
    'client-001': {
        id: 'client-001',
        name: 'Johnson Manufacturing LLC',
        industry: 'Manufacturing',
        location: 'Chicago, IL',
        relationshipId: 'rel-001',
        portfolioValue: 28650000,
        annualRevenue: 1063000,
        relationshipYears: 8,
        productPenetration: 73,
        riskScore: 6.8,
        lastReview: '2024-11-15',
        nextReview: '2025-02-15',
        beneficialOwners: [
            { name: 'Robert Johnson', role: 'CEO & Founder', ownership: '65%', citizenshipCountry: 'USA' },
            { name: 'Maria Johnson', role: 'COO', ownership: '25%', citizenshipCountry: 'USA' },
            { name: 'Johnson Family Trust', role: 'Trust', ownership: '10%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Robert Johnson', title: 'CEO', signingAuthority: 'Unlimited' },
            { name: 'Maria Johnson', title: 'COO', signingAuthority: '$500,000' },
            { name: 'David Chen', title: 'CFO', signingAuthority: '$250,000' },
            { name: 'Sarah Williams', title: 'Treasury Manager', signingAuthority: '$100,000' }
        ],
        conductors: [
            { name: 'Robert Johnson', role: 'Primary Business Conductor', relationship: 'Owner' },
            { name: 'Maria Johnson', role: 'Operations Conductor', relationship: 'Owner' },
            { name: 'David Chen', role: 'Financial Conductor', relationship: 'Employee' }
        ],
        relatedEntities: [
            { name: 'Johnson Holdings Group', relationship: 'Parent Company', ownership: '100%' },
            { name: 'Johnson Logistics LLC', relationship: 'Subsidiary', ownership: '100%' },
            { name: 'Midwest Manufacturing Partners', relationship: 'Joint Venture', ownership: '40%' }
        ],
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 2 },
            { category: 'High Cash', severity: 'Critical', count: 5 },
            { category: 'High-Risk Industry', severity: 'Watch', count: 1 },
            { category: 'UTRs', severity: 'Review', count: 3 },
            { category: 'Luxury Spend', severity: 'Watch', count: 4 },
            { category: 'Crypto', severity: 'Critical', count: 2 },
            { category: 'Foreign ATM', severity: 'Review', count: 3 },
            { category: 'High-Risk Wires', severity: 'Review', count: 2 }
        ],
        productSummary: {
            deposit: { accounts: 4, balance: 12500000, revenue: 425000 },
            lending: { accounts: 3, balance: 8900000, revenue: 380000 },
            treasury: { accounts: 6, balance: 4200000, revenue: 156000 },
            merchant: { accounts: 3, balance: 2100000, revenue: 78000 },
            wealth: { accounts: 2, balance: 950000, revenue: 24000 }
        },
        productHoldings: {
            // Business Deposit Products
            'checking': { hasProduct: true, balance: 8500000, revenue: 285000, isRecommended: false },
            'debit-cards': { hasProduct: true, balance: 0, revenue: 25000, isRecommended: false },
            'cds': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Manufacturing needs liquidity mgmt
            'savings-money-market': { hasProduct: true, balance: 4000000, revenue: 115000, isRecommended: false },
            
            // Business Lending Products
            'credit-cards': { hasProduct: true, balance: 450000, revenue: 38000, isRecommended: false },
            'loans-lines-credit': { hasProduct: true, balance: 8450000, revenue: 342000, isRecommended: false },
            'securities-based-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Not applicable for manufacturing
            'real-estate-financing': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'ppp': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // PPP program ended
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Manufacturing inventory financing
            'commercial-lending': { hasProduct: true, balance: 5200000, revenue: 195000, isRecommended: false },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'equipment-finance': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Manufacturing equipment needs
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: true, balance: 2100000, revenue: 78000, isRecommended: false },
            'payables': { hasProduct: true, balance: 1800000, revenue: 65000, isRecommended: false },
            'receivables': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Manufacturing AR financing
            'fraud-control': { hasProduct: true, balance: 0, revenue: 8000, isRecommended: false },
            'information-services': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'treasury-overview': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            
            // Business Services & Support
            'online-banking': { hasProduct: true, balance: 0, revenue: 12000, isRecommended: false },
            'online-accounting': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - use own system
            'payroll': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Recommended for payroll automation
            'business-payment-suite': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'overdraft-services': { hasProduct: true, balance: 0, revenue: 5000, isRecommended: false },
            'merchant-solutions': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - B2B manufacturing
            'new-to-small-business': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - established business
            'healthcare-professionals': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - wrong industry
            
            // Wealth & Investment Services
            'investments': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Parent company handles investments
            'wealth-retirement-planning': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }
        },
        rankings: {
            risk: { rank: 15, percentile: 85 },
            revenue: { rank: 8, percentile: 92 },
            volume: { rank: 12, percentile: 88 },
            overall: { rank: 9, percentile: 91 }
        },
        keyInsights: [
            'Top 3% of clients in inbound transaction volume',
            'Enhanced monitoring required due to recent crypto activity spikes',
            'Opportunity for treasury management expansion (+$45K potential annual revenue)'
        ],
        lastContact: '2024-01-15'
    },
    'client-002': {
        id: 'client-002',
        name: 'Atlantic Healthcare Network - Main Campus',
        industry: 'Healthcare',
        location: 'Boston, MA',
        relationshipId: 'rel-003',
        portfolioValue: 15200000,
        annualRevenue: 780000,
        relationshipYears: 12,
        productPenetration: 89,
        riskScore: 3.2,
        lastReview: '2024-10-28',
        nextReview: '2025-01-28',
        riskFlags: [
            { category: 'High-Risk Industry', severity: 'Watch', count: 1 },
            { category: 'UTRs', severity: 'Review', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 4, balance: 8200000, revenue: 380000 },
            lending: { accounts: 2, balance: 4900000, revenue: 220000 },
            treasury: { accounts: 3, balance: 1800000, revenue: 120000 },
            merchant: { accounts: 2, balance: 280000, revenue: 45000 },
            wealth: { accounts: 1, balance: 20000, revenue: 15000 }
        },
        productHoldings: {
            // Business Deposit Products
            'business-checking': { hasProduct: true, balance: 5800000, revenue: 280000 },
            'debit-cards': { hasProduct: true, balance: 0, revenue: 18000 },
            'cds': { hasProduct: true, balance: 1500000, revenue: 45000 },
            'savings-money-market': { hasProduct: true, balance: 900000, revenue: 37000 },
            
            // Business Lending Products
            'credit-cards': { hasProduct: false, balance: 0, revenue: 0 },
            'loans-lines-credit': { hasProduct: true, balance: 4900000, revenue: 220000 },
            'equipment-finance': { hasProduct: true, balance: 1200000, revenue: 55000 },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'commercial-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'sba-loans': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: true, balance: 1200000, revenue: 72000 },
            'payables': { hasProduct: true, balance: 400000, revenue: 28000 },
            'receivables': { hasProduct: true, balance: 200000, revenue: 20000 },
            'fx-services': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Additional Products
            'new-to-small-business-checking': { hasProduct: false, balance: 0, revenue: 0 },
            'healthcare-professionals': { hasProduct: true, balance: 850000, revenue: 42000 },
            'investments': { hasProduct: true, balance: 1200000, revenue: 85000 },
            'wealth-retirement-planning': { hasProduct: false, balance: 0, revenue: 0 },
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 89, percentile: 11 },
            revenue: { rank: 3, percentile: 97 },
            volume: { rank: 6, percentile: 94 },
            overall: { rank: 4, percentile: 96 }
        },
        keyInsights: [
            'Excellent relationship with minimal risk profile',
            'Highest product penetration in portfolio (89%)',
            'Strong growth trajectory in treasury management services'
        ],
        lastContact: '2024-01-12'
    },
    'client-003': {
        id: 'client-003',
        name: 'Atlantic Healthcare Network - Outpatient Centers',
        industry: 'Healthcare',
        location: 'Cambridge, MA',
        relationshipId: 'rel-003',
        portfolioValue: 8900000,
        annualRevenue: 420000,
        relationshipYears: 8,
        productPenetration: 67,
        riskScore: 2.8,
        lastReview: '2024-11-05',
        nextReview: '2025-02-05',
        riskFlags: [
            { category: 'Foreign ATM', severity: 'Watch', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 3, balance: 5200000, revenue: 180000 },
            lending: { accounts: 1, balance: 2100000, revenue: 95000 },
            treasury: { accounts: 2, balance: 1400000, revenue: 85000 },
            merchant: { accounts: 2, balance: 180000, revenue: 45000 },
            wealth: { accounts: 1, balance: 20000, revenue: 15000 }
        },
        productHoldings: {
            // Business Deposit Products
            'business-checking': { hasProduct: true, balance: 4200000, revenue: 125000 },
            'debit-cards': { hasProduct: false, balance: 0, revenue: 0 },
            'cds': { hasProduct: false, balance: 0, revenue: 0 },
            'savings-money-market': { hasProduct: true, balance: 1000000, revenue: 55000 },
            
            // Business Lending Products
            'credit-cards': { hasProduct: false, balance: 0, revenue: 0 },
            'loans-lines-credit': { hasProduct: true, balance: 2100000, revenue: 95000 },
            'equipment-finance': { hasProduct: false, balance: 0, revenue: 0 },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'commercial-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'sba-loans': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: true, balance: 800000, revenue: 45000 },
            'payables': { hasProduct: true, balance: 600000, revenue: 40000 },
            'receivables': { hasProduct: false, balance: 0, revenue: 0 },
            'fx-services': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Additional Products
            'new-to-small-business-checking': { hasProduct: true, balance: 250000, revenue: 12000 },
            'healthcare-professionals': { hasProduct: false, balance: 0, revenue: 0 },
            'investments': { hasProduct: false, balance: 0, revenue: 0 },
            'wealth-retirement-planning': { hasProduct: false, balance: 0, revenue: 0 },
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 95, percentile: 5 },
            revenue: { rank: 12, percentile: 88 },
            volume: { rank: 18, percentile: 82 },
            overall: { rank: 15, percentile: 85 }
        },
        keyInsights: [
            'Low risk subsidiary with steady growth',
            'Opportunity for lending expansion',
            'Strong treasury management utilization'
        ],
        lastContact: '2024-01-08'
    },
    'client-004': {
        id: 'client-004',
        name: 'Atlantic Healthcare Network - Specialty Clinics',
        industry: 'Healthcare',
        location: 'Worcester, MA',
        relationshipId: 'rel-003',
        portfolioValue: 4400000,
        annualRevenue: 220000,
        relationshipYears: 5,
        productPenetration: 45,
        riskScore: 4.1,
        lastReview: '2024-10-15',
        nextReview: '2025-01-15',
        riskFlags: [
            { category: 'UTRs', severity: 'Review', count: 1 },
            { category: 'High Cash', severity: 'Watch', count: 2 }
        ],
        productSummary: {
            deposit: { accounts: 2, balance: 2800000, revenue: 95000 },
            lending: { accounts: 1, balance: 1200000, revenue: 78000 },
            treasury: { accounts: 1, balance: 350000, revenue: 35000 },
            merchant: { accounts: 1, balance: 50000, revenue: 12000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        productHoldings: {
            // Business Deposit Products
            'business-checking': { hasProduct: true, balance: 2800000, revenue: 95000 },
            'debit-cards': { hasProduct: false, balance: 0, revenue: 0 },
            'cds': { hasProduct: false, balance: 0, revenue: 0 },
            'savings-money-market': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Business Lending Products
            'credit-cards': { hasProduct: false, balance: 0, revenue: 0 },
            'loans-lines-credit': { hasProduct: true, balance: 1200000, revenue: 78000 },
            'equipment-finance': { hasProduct: false, balance: 0, revenue: 0 },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'commercial-lending': { hasProduct: false, balance: 0, revenue: 0 },
            'sba-loans': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: true, balance: 350000, revenue: 35000 },
            'payables': { hasProduct: false, balance: 0, revenue: 0 },
            'receivables': { hasProduct: false, balance: 0, revenue: 0 },
            'fx-services': { hasProduct: false, balance: 0, revenue: 0 },
            
            // Additional Products
            'new-to-small-business-checking': { hasProduct: false, balance: 0, revenue: 0 },
            'healthcare-professionals': { hasProduct: true, balance: 180000, revenue: 8500 },
            'investments': { hasProduct: false, balance: 0, revenue: 0 },
            'wealth-retirement-planning': { hasProduct: false, balance: 0, revenue: 0 },
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 45, percentile: 55 },
            revenue: { rank: 28, percentile: 72 },
            volume: { rank: 35, percentile: 65 },
            overall: { rank: 32, percentile: 68 }
        },
        keyInsights: [
            'Growing specialty practice with expansion potential',
            'Consider wealth management services introduction',
            'Monitor cash transaction patterns'
        ],
        lastContact: '2024-01-03'
    },
    'client-006': {
        id: 'client-006',
        name: 'Atlantic Healthcare Network - Laboratory Services',
        industry: 'Healthcare',
        location: 'Springfield, MA',
        relationshipId: 'rel-003',
        portfolioValue: 2800000,
        annualRevenue: 145000,
        relationshipYears: 4,
        productPenetration: 38,
        riskScore: 3.5,
        lastReview: '2024-09-20',
        nextReview: '2024-12-20',
        riskFlags: [],
        productSummary: {
            deposit: { accounts: 2, balance: 1800000, revenue: 68000 },
            lending: { accounts: 1, balance: 650000, revenue: 42000 },
            treasury: { accounts: 1, balance: 320000, revenue: 25000 },
            merchant: { accounts: 1, balance: 30000, revenue: 10000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 78, percentile: 22 },
            revenue: { rank: 42, percentile: 58 },
            volume: { rank: 48, percentile: 52 },
            overall: { rank: 45, percentile: 55 }
        },
        keyInsights: [
            'Stable laboratory services division',
            'Low risk profile with growth opportunity',
            'Consider expanding treasury services'
        ],
        lastContact: '2024-01-05'
    },
    'client-007': {
        id: 'client-007',
        name: 'Atlantic Healthcare Network - Pharmaceuticals',
        industry: 'Healthcare',
        location: 'Hartford, CT',
        relationshipId: 'rel-003',
        portfolioValue: 1900000,
        annualRevenue: 98000,
        relationshipYears: 3,
        productPenetration: 42,
        riskScore: 2.9,
        lastReview: '2024-11-10',
        nextReview: '2025-02-10',
        riskFlags: [
            { category: 'High-Risk Industry', severity: 'Watch', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 1, balance: 1200000, revenue: 45000 },
            lending: { accounts: 1, balance: 480000, revenue: 32000 },
            treasury: { accounts: 1, balance: 180000, revenue: 15000 },
            merchant: { accounts: 1, balance: 40000, revenue: 6000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 92, percentile: 8 },
            revenue: { rank: 55, percentile: 45 },
            volume: { rank: 62, percentile: 38 },
            overall: { rank: 58, percentile: 42 }
        },
        keyInsights: [
            'Pharmaceutical division with regulatory compliance focus',
            'Excellent risk profile despite industry classification',
            'Potential for wealth management services'
        ],
        lastContact: '2024-01-02'
    },
    'client-008': {
        id: 'client-008',
        name: 'Atlantic Healthcare Network - Home Care Services',
        industry: 'Healthcare',
        location: 'Providence, RI',
        relationshipId: 'rel-003',
        portfolioValue: 1600000,
        annualRevenue: 85000,
        relationshipYears: 2,
        productPenetration: 35,
        riskScore: 3.8,
        lastReview: '2024-10-05',
        nextReview: '2025-01-05',
        riskFlags: [
            { category: 'UTRs', severity: 'Watch', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 1, balance: 950000, revenue: 38000 },
            lending: { accounts: 1, balance: 420000, revenue: 28000 },
            treasury: { accounts: 1, balance: 200000, revenue: 15000 },
            merchant: { accounts: 1, balance: 30000, revenue: 4000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 68, percentile: 32 },
            revenue: { rank: 68, percentile: 32 },
            volume: { rank: 72, percentile: 28 },
            overall: { rank: 69, percentile: 31 }
        },
        keyInsights: [
            'Newer home care services division',
            'Growing market with expansion potential',
            'Monitor transaction patterns as business scales'
        ],
        lastContact: '2024-01-01'
    },
    'client-005': {
        id: 'client-005',
        name: 'TechCorp Ventures',
        industry: 'Technology',
        location: 'Hartford, CT',
        relationshipId: 'rel-001',
        portfolioValue: 92000000,
        annualRevenue: 6800000,
        relationshipYears: 5,
        productPenetration: 45,
        riskScore: 8.7,
        lastReview: '2024-12-01',
        nextReview: '2025-03-01',
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 4 },
            { category: 'High Cash', severity: 'Critical', count: 8 },
            { category: 'Crypto', severity: 'Critical', count: 6 },
            { category: 'High-Risk Wires', severity: 'Critical', count: 3 },
            { category: 'Foreign ATM', severity: 'Review', count: 5 },
            { category: 'UTRs', severity: 'Critical', count: 4 },
            { category: 'Luxury Spend', severity: 'Review', count: 7 }
        ],
        productSummary: {
            deposit: { accounts: 5, balance: 45600000, revenue: 2890000 },
            lending: { accounts: 2, balance: 28900000, revenue: 1890000 },
            treasury: { accounts: 4, balance: 12400000, revenue: 780000 },
            merchant: { accounts: 7, balance: 4200000, revenue: 890000 },
            wealth: { accounts: 1, balance: 900000, revenue: 350000 }
        },
        rankings: {
            risk: { rank: 2, percentile: 98 },
            revenue: { rank: 1, percentile: 99 },
            volume: { rank: 3, percentile: 97 },
            overall: { rank: 2, percentile: 98 }
        },
        keyInsights: [
            'Highest risk client in portfolio - requires enhanced monitoring',
            'Exceptional revenue generator despite risk profile',
            'Immediate review required for crypto transaction patterns'
        ],
        lastContact: '2024-01-18'
    },
    'client-003': {
        id: 'client-003',
        name: 'TechCorp Ventures',
        industry: 'Technology',
        location: 'Hartford, CT',
        portfolioValue: 92000000,
        annualRevenue: 6800000,
        relationshipYears: 5,
        productPenetration: 45,
        riskScore: 8.7,
        lastReview: '2024-12-01',
        nextReview: '2025-03-01',
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 4 },
            { category: 'High Cash', severity: 'Critical', count: 8 },
            { category: 'Crypto', severity: 'Critical', count: 6 },
            { category: 'High-Risk Wires', severity: 'Critical', count: 3 },
            { category: 'Foreign ATM', severity: 'Review', count: 5 },
            { category: 'UTRs', severity: 'Critical', count: 4 },
            { category: 'Luxury Spend', severity: 'Review', count: 7 }
        ],
        productSummary: {
            deposit: { accounts: 5, balance: 45600000, revenue: 2890000 },
            lending: { accounts: 2, balance: 28900000, revenue: 1890000 },
            treasury: { accounts: 4, balance: 12400000, revenue: 780000 },
            merchant: { accounts: 7, balance: 4200000, revenue: 890000 },
            wealth: { accounts: 1, balance: 900000, revenue: 350000 }
        },
        rankings: {
            risk: { rank: 2, percentile: 98 },
            revenue: { rank: 1, percentile: 99 },
            volume: { rank: 3, percentile: 97 },
            overall: { rank: 2, percentile: 98 }
        },
        keyInsights: [
            'Highest risk client in portfolio - requires enhanced monitoring',
            'Exceptional revenue generator despite risk profile',
            'Immediate review required for crypto transaction patterns'
        ],
        lastContact: '2024-01-18'
    },
    'client-004': {
        id: 'client-004',
        name: 'Healthcare Solutions Inc',
        industry: 'Healthcare',
        location: 'Philadelphia, PA',
        portfolioValue: 36000000,
        annualRevenue: 2400000,
        riskFlags: [],
        lastContact: '2024-01-10'
    },
    'client-005': {
        id: 'client-005',
        name: 'Energy Dynamics LLC',
        industry: 'Energy',
        location: 'Albany, NY',
        portfolioValue: 78000000,
        annualRevenue: 5800000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-16'
    },
    'client-006': {
        id: 'client-006',
        name: 'Retail Solutions Corp',
        industry: 'Retail',
        location: 'Burlington, VT',
        portfolioValue: 45000000,
        annualRevenue: 3200000,
        riskFlags: ['Crypto'],
        lastContact: '2024-01-14'
    },
    'client-007': {
        id: 'client-007',
        name: 'Construction Partners',
        industry: 'Construction',
        location: 'Providence, RI',
        portfolioValue: 117000000,
        annualRevenue: 8000000,
        riskFlags: ['High-Cash'],
        lastContact: '2024-01-13'
    },
    'client-008': {
        id: 'client-008',
        name: 'Aerospace Technologies',
        industry: 'Aerospace',
        location: 'Worcester, MA',
        portfolioValue: 134000000,
        annualRevenue: 9500000,
        riskFlags: ['Cross-Border', 'PEP'],
        lastContact: '2024-01-17'
    },
    'client-009': {
        id: 'client-009',
        name: 'Agricultural Holdings',
        industry: 'Agriculture',
        location: 'Manchester, NH',
        portfolioValue: 66000000,
        annualRevenue: 4500000,
        riskFlags: [],
        lastContact: '2024-01-11'
    },
    'client-010': {
        id: 'client-010',
        name: 'Logistics Network Inc',
        industry: 'Logistics',
        location: 'Miami, FL',
        portfolioValue: 89000000,
        annualRevenue: 6200000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-19'
    },
    'client-011': {
        id: 'client-011',
        name: 'Tourism Ventures',
        industry: 'Tourism',
        location: 'Orlando, FL',
        portfolioValue: 52000000,
        annualRevenue: 3800000,
        riskFlags: ['High-Cash'],
        lastContact: '2024-01-12'
    },
    'client-012': {
        id: 'client-012',
        name: 'Maritime Solutions',
        industry: 'Maritime',
        location: 'Jacksonville, FL',
        portfolioValue: 109000000,
        annualRevenue: 7750000,
        riskFlags: ['Cross-Border', 'MSB'],
        lastContact: '2024-01-15'
    },
    'client-013': {
        id: 'client-013',
        name: 'Real Estate Holdings',
        industry: 'Real Estate',
        location: 'Atlanta, GA',
        portfolioValue: 156000000,
        annualRevenue: 11200000,
        riskFlags: ['High-Cash', 'PEP'],
        lastContact: '2024-01-18'
    },
    'client-014': {
        id: 'client-014',
        name: 'Media Enterprises',
        industry: 'Media',
        location: 'Charlotte, NC',
        portfolioValue: 64000000,
        annualRevenue: 4300000,
        riskFlags: ['Crypto'],
        lastContact: '2024-01-13'
    },
    'client-015': {
        id: 'client-015',
        name: 'Chemical Industries',
        industry: 'Chemical',
        location: 'Charleston, SC',
        portfolioValue: 98000000,
        annualRevenue: 7000000,
        riskFlags: ['Cross-Border', 'Sanctions'],
        lastContact: '2024-01-16'
    },
    'client-016': {
        id: 'client-016',
        name: 'Pharmaceutical Corp',
        industry: 'Pharmaceutical',
        location: 'Nashville, TN',
        portfolioValue: 82000000,
        annualRevenue: 5500000,
        riskFlags: ['MSB', 'High-Cash'],
        lastContact: '2024-01-14'
    },
    'client-017': {
        id: 'client-017',
        name: 'Automotive Solutions',
        industry: 'Automotive',
        location: 'Detroit, MI',
        portfolioValue: 91000000,
        annualRevenue: 6300000,
        riskFlags: ['Cross-Border'],
        lastContact: '2024-01-17'
    },
    'client-018': {
        id: 'client-018',
        name: 'Food Processing Inc',
        industry: 'Food Processing',
        location: 'Chicago, IL',
        portfolioValue: 69000000,
        annualRevenue: 4700000,
        riskFlags: ['High-Cash'],
        lastContact: '2024-01-11'
    },
    'client-019': {
        id: 'client-019',
        name: 'Software Development',
        industry: 'Technology',
        location: 'Milwaukee, WI',
        portfolioValue: 75000000,
        annualRevenue: 5100000,
        riskFlags: ['Crypto', 'High-Cash'],
        lastContact: '2024-01-19'
    },
    'client-020': {
        id: 'client-020',
        name: 'Mining Operations',
        industry: 'Mining',
        location: 'Minneapolis, MN',
        portfolioValue: 65000000,
        annualRevenue: 4400000,
        riskFlags: [],
        lastContact: '2024-01-12'
    },
    'client-021': {
        id: 'client-021',
        name: 'Telecommunications Corp',
        industry: 'Telecommunications',
        location: 'Kansas City, MO',
        portfolioValue: 130000000,
        annualRevenue: 9750000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-18'
    },
    'client-022': {
        id: 'client-022',
        name: 'European Trading Ltd',
        industry: 'Trading',
        location: 'London, UK',
        portfolioValue: 112000000,
        annualRevenue: 8200000,
        riskFlags: ['Cross-Border', 'PEP', 'High-Cash'],
        lastContact: '2024-01-15'
    },
    'client-023': {
        id: 'client-023',
        name: 'Financial Services Europe',
        industry: 'Financial Services',
        location: 'Frankfurt, Germany',
        portfolioValue: 88000000,
        annualRevenue: 6800000,
        riskFlags: ['MSB', 'Cross-Border'],
        lastContact: '2024-01-13'
    },
    'client-024': {
        id: 'client-024',
        name: 'Luxury Goods SA',
        industry: 'Luxury Goods',
        location: 'Paris, France',
        portfolioValue: 95000000,
        annualRevenue: 7100000,
        riskFlags: ['High-Cash', 'PEP'],
        lastContact: '2024-01-16'
    },
    'client-025': {
        id: 'client-025',
        name: 'Investment Holdings',
        industry: 'Investment',
        location: 'Zurich, Switzerland',
        portfolioValue: 85000000,
        annualRevenue: 6400000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-14'
    },
    'client-026': {
        id: 'client-026',
        name: 'Asia Pacific Trading',
        industry: 'Trading',
        location: 'Tokyo, Japan',
        portfolioValue: 124000000,
        annualRevenue: 9200000,
        riskFlags: ['Cross-Border', 'High-Cash', 'MSB'],
        lastContact: '2024-01-17'
    },
    'client-027': {
        id: 'client-027',
        name: 'Technology Solutions Asia',
        industry: 'Technology',
        location: 'Singapore',
        portfolioValue: 96000000,
        annualRevenue: 7300000,
        riskFlags: ['Cross-Border', 'Crypto'],
        lastContact: '2024-01-12'
    },
    'client-028': {
        id: 'client-028',
        name: 'European Auto Group',
        industry: 'Automotive',
        location: 'Berlin, Germany',
        portfolioValue: 110000000,
        annualRevenue: 8500000,
        riskFlags: ['Cross-Border'],
        lastContact: '2024-01-20'
    },
    'client-029': {
        id: 'client-029',
        name: 'Pharma Research Inc',
        industry: 'Pharmaceuticals',
        location: 'Zurich, Switzerland',
        portfolioValue: 78000000,
        annualRevenue: 5900000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-18'
    },
    'client-030': {
        id: 'client-030',
        name: 'Northeast Banking Corp',
        industry: 'Financial Services',
        location: 'Philadelphia, PA',
        portfolioValue: 145000000,
        annualRevenue: 11200000,
        riskFlags: ['MSB', 'High-Cash'],
        lastContact: '2024-01-22'
    },
    'client-031': {
        id: 'client-031',
        name: 'Liberty Manufacturing',
        industry: 'Manufacturing',
        location: 'Philadelphia, PA',
        portfolioValue: 89000000,
        annualRevenue: 6700000,
        riskFlags: [],
        lastContact: '2024-01-19'
    },
    'client-032': {
        id: 'client-032',
        name: 'Philadelphia Tech Solutions',
        industry: 'Technology',
        location: 'Philadelphia, PA',
        portfolioValue: 92000000,
        annualRevenue: 7100000,
        riskFlags: ['Crypto'],
        lastContact: '2024-01-21'
    },
    'client-033': {
        id: 'client-033',
        name: 'Regional Healthcare Group',
        industry: 'Healthcare',
        location: 'Philadelphia, PA',
        portfolioValue: 67000000,
        annualRevenue: 5100000,
        riskFlags: ['High-Cash'],
        lastContact: '2024-01-17'
    },
    'client-034': {
        id: 'client-034',
        name: 'Metro Construction LLC',
        industry: 'Construction',
        location: 'Philadelphia, PA',
        portfolioValue: 54000000,
        annualRevenue: 4200000,
        riskFlags: ['High-Cash'],
        lastContact: '2024-01-15'
    },
    'client-035': {
        id: 'client-035',
        name: 'Miami Trading Partners',
        industry: 'Trading',
        location: 'Miami, FL',
        portfolioValue: 98000000,
        annualRevenue: 7600000,
        riskFlags: ['Cross-Border', 'MSB'],
        lastContact: '2024-01-23'
    },
    'client-036': {
        id: 'client-036',
        name: 'Latin America Holdings',
        industry: 'Investment',
        location: 'Miami, FL',
        portfolioValue: 134000000,
        annualRevenue: 10100000,
        riskFlags: ['Cross-Border', 'High-Cash', 'PEP'],
        lastContact: '2024-01-20'
    },
    'client-037': {
        id: 'client-037',
        name: 'Caribbean Logistics',
        industry: 'Logistics',
        location: 'Miami, FL',
        portfolioValue: 76000000,
        annualRevenue: 5800000,
        riskFlags: ['Cross-Border'],
        lastContact: '2024-01-18'
    },
    'client-038': {
        id: 'client-038',
        name: 'Ontario Manufacturing Corp',
        industry: 'Manufacturing',
        location: 'Toronto, ON',
        portfolioValue: 112000000,
        annualRevenue: 8400000,
        riskFlags: ['Cross-Border'],
        lastContact: '2024-01-24'
    },
    'client-039': {
        id: 'client-039',
        name: 'Canadian Energy Solutions',
        industry: 'Energy',
        location: 'Toronto, ON',
        portfolioValue: 156000000,
        annualRevenue: 11800000,
        riskFlags: ['Cross-Border', 'High-Cash'],
        lastContact: '2024-01-22'
    },
    'client-040': {
        id: 'client-040',
        name: 'Montreal Financial Group',
        industry: 'Financial Services',
        location: 'Montreal, QC',
        portfolioValue: 87000000,
        annualRevenue: 6500000,
        riskFlags: ['Cross-Border', 'MSB'],
        lastContact: '2024-01-21'
    },
    // Additional clients for existing relationships
    'client-008': {
        id: 'client-008',
        name: 'Johnson Holdings Group - Subsidiary A',
        industry: 'Manufacturing',
        location: 'Milwaukee, WI',
        relationshipId: 'rel-001',
        portfolioValue: 8900000,
        annualRevenue: 420000,
        relationshipYears: 6,
        productPenetration: 65,
        riskScore: 5.2,
        lastReview: '2024-11-08',
        nextReview: '2025-02-08',
        beneficialOwners: [
            { name: 'Johnson Holdings Group', role: 'Parent Company', ownership: '100%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Robert Johnson', title: 'CEO (Parent)', signingAuthority: 'Unlimited' },
            { name: 'Jennifer Martinez', title: 'Subsidiary GM', signingAuthority: '$300,000' },
            { name: 'Thomas Lee', title: 'Controller', signingAuthority: '$150,000' }
        ],
        conductors: [
            { name: 'Robert Johnson', role: 'Ultimate Business Conductor', relationship: 'Parent Owner' },
            { name: 'Jennifer Martinez', role: 'Subsidiary Conductor', relationship: 'Manager' }
        ],
        riskFlags: [
            { category: 'High Cash', severity: 'Watch', count: 2 },
            { category: 'UTRs', severity: 'Review', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 2, balance: 4200000, revenue: 180000 },
            lending: { accounts: 1, balance: 2800000, revenue: 120000 },
            treasury: { accounts: 2, balance: 1500000, revenue: 85000 },
            merchant: { accounts: 1, balance: 400000, revenue: 35000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 45, percentile: 55 },
            revenue: { rank: 28, percentile: 72 },
            volume: { rank: 35, percentile: 65 },
            overall: { rank: 32, percentile: 68 }
        },
        keyInsights: [
            'Steady growth in treasury management services',
            'Low risk profile with consistent cash flows'
        ],
        lastContact: '2024-11-20',
        productHoldings: {
            // Business Deposit Products
            'checking': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Logistics needs better cash mgmt
            'debit-cards': { hasProduct: true, balance: 0, revenue: 15000, isRecommended: false },
            'cds': { hasProduct: true, balance: 1200000, revenue: 35000, isRecommended: false },
            'savings-money-market': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            
            // Business Lending Products
            'credit-cards': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Logistics fuel/expense cards
            'loans-lines-credit': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'securities-based-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not applicable
            'real-estate-financing': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'ppp': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - PPP ended
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: true, balance: 1800000, revenue: 85000, isRecommended: false },
            'commercial-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'equipment-finance': { hasProduct: true, balance: 2800000, revenue: 120000, isRecommended: false }, // Truck financing
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Multi-location cash needs
            'payables': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Vendor payment automation
            'receivables': { hasProduct: true, balance: 1200000, revenue: 55000, isRecommended: false },
            'fraud-control': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - small subsidiary
            'information-services': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'treasury-overview': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            
            // Business Services & Support
            'online-banking': { hasProduct: true, balance: 0, revenue: 8000, isRecommended: false },
            'online-accounting': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - use parent system
            'payroll': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - handled by parent
            'business-payment-suite': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'overdraft-services': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Logistics cash flow needs
            'merchant-solutions': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - B2B logistics
            'new-to-small-business': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - established business
            'healthcare-professionals': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - wrong industry
            
            // Wealth & Investment Services
            'investments': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'wealth-retirement-planning': { hasProduct: true, balance: 850000, revenue: 28000, isRecommended: false },
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }
        }
    },
    'client-009': {
        id: 'client-009',
        name: 'Johnson Holdings Group - Subsidiary B',
        industry: 'Manufacturing',
        location: 'Detroit, MI',
        relationshipId: 'rel-001',
        portfolioValue: 12300000,
        annualRevenue: 580000,
        relationshipYears: 4,
        productPenetration: 58,
        riskScore: 4.8,
        lastReview: '2024-10-15',
        nextReview: '2025-01-15',
        beneficialOwners: [
            { name: 'Johnson Holdings Group', role: 'Parent Company', ownership: '85%', citizenshipCountry: 'USA' },
            { name: 'Detroit Manufacturing Partners', role: 'Local Partner', ownership: '15%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Robert Johnson', title: 'CEO (Parent)', signingAuthority: 'Unlimited' },
            { name: 'Michael Brown', title: 'Subsidiary President', signingAuthority: '$500,000' },
            { name: 'Lisa Wang', title: 'CFO', signingAuthority: '$200,000' }
        ],
        conductors: [
            { name: 'Robert Johnson', role: 'Ultimate Business Conductor', relationship: 'Parent Owner' },
            { name: 'Michael Brown', role: 'Subsidiary Conductor', relationship: 'Manager' },
            { name: 'Lisa Wang', role: 'Financial Conductor', relationship: 'Employee' }
        ],
        riskFlags: [
            { category: 'Foreign ATM', severity: 'Review', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 3, balance: 6800000, revenue: 280000 },
            lending: { accounts: 2, balance: 3200000, revenue: 180000 },
            treasury: { accounts: 1, balance: 1800000, revenue: 90000 },
            merchant: { accounts: 1, balance: 500000, revenue: 30000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 52, percentile: 48 },
            revenue: { rank: 22, percentile: 78 },
            volume: { rank: 29, percentile: 71 },
            overall: { rank: 27, percentile: 73 }
        },
        keyInsights: [
            'Rapid expansion requiring additional working capital',
            'Strong candidate for lending products expansion'
        ],
        lastContact: '2024-11-18',
        productHoldings: {
            // Business Deposit Products
            'checking': { hasProduct: true, balance: 3200000, revenue: 180000, isRecommended: false },
            'debit-cards': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Subsidiary B has different needs
            'cds': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'savings-money-market': { hasProduct: true, balance: 1800000, revenue: 90000, isRecommended: false },
            
            // Business Lending Products
            'credit-cards': { hasProduct: true, balance: 280000, revenue: 25000, isRecommended: false },
            'loans-lines-credit': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'securities-based-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Investment holding company
            'real-estate-financing': { hasProduct: true, balance: 3200000, revenue: 180000, isRecommended: false },
            'ppp': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - PPP ended
            
            // Commercial Lending Solutions
            'asset-based-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'commercial-lending': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'commercial-real-estate': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'equipment-finance': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            
            // Treasury & Cash Management
            'liquidity-management': { hasProduct: true, balance: 1800000, revenue: 90000, isRecommended: false },
            'payables': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'receivables': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false },
            'fraud-control': { hasProduct: true, balance: 0, revenue: 15000, isRecommended: false },
            'information-services': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'treasury-overview': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            
            // Business Services & Support
            'online-banking': { hasProduct: true, balance: 0, revenue: 10000, isRecommended: false },
            'online-accounting': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - enterprise system
            'payroll': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // International payroll needs
            'business-payment-suite': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - not needed
            'overdraft-services': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - well-capitalized
            'merchant-solutions': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - holding company
            'new-to-small-business': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - established business
            'healthcare-professionals': { hasProduct: false, balance: 0, revenue: 0, isRecommended: false }, // Gray - wrong industry
            
            // Wealth & Investment Services
            'investments': { hasProduct: true, balance: 650000, revenue: 22000, isRecommended: false },
            'wealth-retirement-planning': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true }, // Executive team retirement planning
            'private-client-banking': { hasProduct: false, balance: 0, revenue: 0, isRecommended: true } // High-net-worth executives
        }
    },
    // Global Logistics Network Clients (rel-010)
    'client-010': {
        id: 'client-010',
        name: 'Global Logistics Network - North America',
        industry: 'Logistics',
        location: 'Chicago, IL',
        relationshipId: 'rel-010',
        portfolioValue: 28500000,
        annualRevenue: 1850000,
        relationshipYears: 7,
        productPenetration: 85,
        riskScore: 7.2,
        lastReview: '2024-11-25',
        nextReview: '2025-02-25',
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 3 },
            { category: 'High Cash', severity: 'Critical', count: 4 },
            { category: 'High-Risk Wires', severity: 'Watch', count: 2 },
            { category: 'Foreign ATM', severity: 'Review', count: 5 }
        ],
        productSummary: {
            deposit: { accounts: 5, balance: 12800000, revenue: 680000 },
            lending: { accounts: 3, balance: 8900000, revenue: 520000 },
            treasury: { accounts: 4, balance: 4200000, revenue: 380000 },
            merchant: { accounts: 2, balance: 2100000, revenue: 180000 },
            wealth: { accounts: 1, balance: 500000, revenue: 90000 }
        },
        rankings: {
            risk: { rank: 8, percentile: 92 },
            revenue: { rank: 5, percentile: 95 },
            volume: { rank: 3, percentile: 97 },
            overall: { rank: 4, percentile: 96 }
        },
        keyInsights: [
            'Highest revenue generator in logistics sector',
            'Enhanced monitoring required for cross-border transactions',
            'Opportunity for FX hedging products expansion'
        ],
        lastContact: '2024-12-01'
    },
    'client-011': {
        id: 'client-011',
        name: 'Global Logistics Network - Europe',
        industry: 'Logistics',
        location: 'New York, NY',
        relationshipId: 'rel-010',
        portfolioValue: 22100000,
        annualRevenue: 1420000,
        relationshipYears: 5,
        productPenetration: 78,
        riskScore: 8.1,
        lastReview: '2024-11-20',
        nextReview: '2025-02-20',
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 2 },
            { category: 'High-Risk Wires', severity: 'Critical', count: 6 },
            { category: 'Foreign ATM', severity: 'Critical', count: 8 },
            { category: 'Crypto', severity: 'Watch', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 4, balance: 9800000, revenue: 520000 },
            lending: { accounts: 2, balance: 6700000, revenue: 420000 },
            treasury: { accounts: 3, balance: 3600000, revenue: 280000 },
            merchant: { accounts: 2, balance: 1500000, revenue: 150000 },
            wealth: { accounts: 1, balance: 500000, revenue: 50000 }
        },
        rankings: {
            risk: { rank: 3, percentile: 97 },
            revenue: { rank: 12, percentile: 88 },
            volume: { rank: 8, percentile: 92 },
            overall: { rank: 7, percentile: 93 }
        },
        keyInsights: [
            'High-risk profile due to international wire activity',
            'Strong revenue despite enhanced monitoring requirements',
            'Key client for trade finance products'
        ],
        lastContact: '2024-11-28'
    },
    // Education Services Consortium Clients (rel-011)
    'client-012': {
        id: 'client-012',
        name: 'Education Services Consortium - University Division',
        industry: 'Education',
        location: 'Boston, MA',
        relationshipId: 'rel-011',
        portfolioValue: 18700000,
        annualRevenue: 890000,
        relationshipYears: 15,
        productPenetration: 92,
        riskScore: 2.1,
        lastReview: '2024-10-30',
        nextReview: '2025-01-30',
        riskFlags: [],
        productSummary: {
            deposit: { accounts: 6, balance: 12200000, revenue: 480000 },
            lending: { accounts: 2, balance: 4800000, revenue: 280000 },
            treasury: { accounts: 3, balance: 1500000, revenue: 90000 },
            merchant: { accounts: 1, balance: 200000, revenue: 40000 },
            wealth: { accounts: 0, balance: 0, revenue: 0 }
        },
        rankings: {
            risk: { rank: 95, percentile: 5 },
            revenue: { rank: 18, percentile: 82 },
            volume: { rank: 25, percentile: 75 },
            overall: { rank: 22, percentile: 78 }
        },
        keyInsights: [
            'Excellent credit profile with zero risk flags',
            'Long-standing relationship with high loyalty',
            'Stable cash flows from tuition and endowment'
        ],
        lastContact: '2024-11-22'
    },
    // Food & Beverage Holdings Clients (rel-012)
    'client-013': {
        id: 'client-013',
        name: 'Food & Beverage Holdings - Restaurant Chain',
        industry: 'Food & Beverage',
        location: 'Atlanta, GA',
        relationshipId: 'rel-012',
        portfolioValue: 32800000,
        annualRevenue: 2150000,
        relationshipYears: 9,
        productPenetration: 88,
        riskScore: 5.8,
        lastReview: '2024-11-10',
        nextReview: '2025-02-10',
        riskFlags: [
            { category: 'High Cash', severity: 'Watch', count: 3 },
            { category: 'UTRs', severity: 'Review', count: 2 }
        ],
        productSummary: {
            deposit: { accounts: 8, balance: 18200000, revenue: 850000 },
            lending: { accounts: 4, balance: 9800000, revenue: 680000 },
            treasury: { accounts: 5, balance: 3200000, revenue: 380000 },
            merchant: { accounts: 6, balance: 1400000, revenue: 220000 },
            wealth: { accounts: 1, balance: 200000, revenue: 20000 }
        },
        rankings: {
            risk: { rank: 38, percentile: 62 },
            revenue: { rank: 6, percentile: 94 },
            volume: { rank: 11, percentile: 89 },
            overall: { rank: 8, percentile: 92 }
        },
        keyInsights: [
            'High-volume merchant processing needs',
            'Seasonal cash flow variations typical for restaurant industry',
            'Strong expansion potential in new markets'
        ],
        lastContact: '2024-11-25'
    },
    // International Trade Group Clients (rel-013)  
    'client-014': {
        id: 'client-014',
        name: 'International Trade Group - Import Division',
        industry: 'Import/Export',
        location: 'Los Angeles, CA',
        relationshipId: 'rel-013',
        portfolioValue: 45600000,
        annualRevenue: 3850000,
        relationshipYears: 12,
        productPenetration: 95,
        riskScore: 8.9,
        lastReview: '2024-11-28',
        nextReview: '2025-02-28',
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 5 },
            { category: 'High Cash', severity: 'Critical', count: 7 },
            { category: 'High-Risk Wires', severity: 'Critical', count: 12 },
            { category: 'Foreign ATM', severity: 'Critical', count: 15 },
            { category: 'High-Risk Industry', severity: 'Watch', count: 2 }
        ],
        productSummary: {
            deposit: { accounts: 8, balance: 25200000, revenue: 1580000 },
            lending: { accounts: 5, balance: 12800000, revenue: 1420000 },
            treasury: { accounts: 6, balance: 5200000, revenue: 580000 },
            merchant: { accounts: 3, balance: 2000000, revenue: 180000 },
            wealth: { accounts: 2, balance: 400000, revenue: 90000 }
        },
        rankings: {
            risk: { rank: 1, percentile: 99 },
            revenue: { rank: 1, percentile: 99 },
            volume: { rank: 1, percentile: 99 },
            overall: { rank: 1, percentile: 99 }
        },
        keyInsights: [
            'Highest risk and highest revenue client in portfolio',
            'Complex international trade finance needs',
            'Requires specialized compliance monitoring'
        ],
        lastContact: '2024-12-02'
    },
    // Additional clients for Food & Beverage Holdings (rel-012)
    'client-015': {
        id: 'client-015',
        name: 'Food & Beverage Holdings - Catering Division',
        industry: 'Food & Beverage',
        location: 'Miami, FL',
        relationshipId: 'rel-012',
        portfolioValue: 18900000,
        annualRevenue: 1250000,
        relationshipYears: 6,
        productPenetration: 82,
        riskScore: 4.5,
        lastReview: '2024-11-05',
        nextReview: '2025-02-05',
        beneficialOwners: [
            { name: 'Elena Rodriguez', role: 'Division Manager', ownership: '15%', citizenshipCountry: 'USA' },
            { name: 'Food & Beverage Holdings Inc', role: 'Parent Company', ownership: '85%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Elena Rodriguez', title: 'Division Manager', signingAuthority: '$200,000' },
            { name: 'Michael Thompson', title: 'Regional CFO', signingAuthority: '$100,000' },
            { name: 'Amy Foster', title: 'Operations Manager', signingAuthority: '$50,000' }
        ],
        conductors: [
            { name: 'Elena Rodriguez', role: 'Primary Business Conductor', relationship: 'Manager' },
            { name: 'Michael Thompson', role: 'Financial Conductor', relationship: 'Employee' }
        ],
        relatedEntities: [
            { name: 'Food & Beverage Holdings Inc', relationship: 'Parent Company', ownership: '85%' },
            { name: 'Premium Catering Services', relationship: 'Brand', ownership: '100%' }
        ],
        riskFlags: [
            { category: 'UTRs', severity: 'Review', count: 1 }
        ],
        productSummary: {
            deposit: { accounts: 4, balance: 9800000, revenue: 480000 },
            lending: { accounts: 2, balance: 5200000, revenue: 350000 },
            treasury: { accounts: 3, balance: 2800000, revenue: 260000 },
            merchant: { accounts: 4, balance: 1000000, revenue: 140000 },
            wealth: { accounts: 1, balance: 100000, revenue: 20000 }
        },
        rankings: {
            risk: { rank: 62, percentile: 38 },
            revenue: { rank: 15, percentile: 85 },
            volume: { rank: 18, percentile: 82 },
            overall: { rank: 19, percentile: 81 }
        },
        keyInsights: [
            'Strong growth in corporate catering market',
            'Opportunity for expanded merchant services',
            'Seasonal revenue fluctuations during holiday periods'
        ],
        lastContact: '2024-11-28'
    },
    'client-016': {
        id: 'client-016',
        name: 'Food & Beverage Holdings - Distribution Center',
        industry: 'Food & Beverage',
        location: 'Dallas, TX',
        relationshipId: 'rel-012',
        portfolioValue: 25600000,
        annualRevenue: 1680000,
        relationshipYears: 8,
        productPenetration: 91,
        riskScore: 3.8,
        lastReview: '2024-10-20',
        nextReview: '2025-01-20',
        beneficialOwners: [
            { name: 'Food & Beverage Holdings Inc', role: 'Parent Company', ownership: '100%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'James Patterson', title: 'Distribution Director', signingAuthority: '$300,000' },
            { name: 'Lisa Chang', title: 'Finance Director', signingAuthority: '$150,000' },
            { name: 'Robert Mills', title: 'Operations Manager', signingAuthority: '$75,000' }
        ],
        conductors: [
            { name: 'James Patterson', role: 'Primary Business Conductor', relationship: 'Manager' },
            { name: 'Lisa Chang', role: 'Financial Conductor', relationship: 'Employee' }
        ],
        relatedEntities: [
            { name: 'Food & Beverage Holdings Inc', relationship: 'Parent Company', ownership: '100%' },
            { name: 'Southwest Logistics Partners', relationship: 'Service Provider', ownership: '0%' }
        ],
        riskFlags: [],
        productSummary: {
            deposit: { accounts: 6, balance: 14200000, revenue: 680000 },
            lending: { accounts: 3, balance: 7800000, revenue: 520000 },
            treasury: { accounts: 4, balance: 2900000, revenue: 320000 },
            merchant: { accounts: 2, balance: 600000, revenue: 120000 },
            wealth: { accounts: 1, balance: 100000, revenue: 40000 }
        },
        rankings: {
            risk: { rank: 78, percentile: 22 },
            revenue: { rank: 11, percentile: 89 },
            volume: { rank: 14, percentile: 86 },
            overall: { rank: 13, percentile: 87 }
        },
        keyInsights: [
            'Excellent operational efficiency and low risk profile',
            'Key logistics hub for entire food distribution network',
            'Strong candidate for supply chain financing products'
        ],
        lastContact: '2024-11-30'
    },
    // Additional clients for Global Logistics Network (rel-010)
    'client-017': {
        id: 'client-017',
        name: 'Global Logistics Network - Asia Pacific',
        industry: 'Logistics',
        location: 'Seattle, WA',
        relationshipId: 'rel-010',
        portfolioValue: 34200000,
        annualRevenue: 2340000,
        relationshipYears: 4,
        productPenetration: 88,
        riskScore: 7.8,
        lastReview: '2024-11-15',
        nextReview: '2025-02-15',
        beneficialOwners: [
            { name: 'Global Logistics Holdings', role: 'Parent Company', ownership: '80%', citizenshipCountry: 'USA' },
            { name: 'Pacific Investment Group', role: 'Strategic Investor', ownership: '15%', citizenshipCountry: 'Singapore' },
            { name: 'Management Team', role: 'Employee Ownership', ownership: '5%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Kevin Zhang', title: 'Regional Director', signingAuthority: '$500,000' },
            { name: 'Sandra Kim', title: 'Finance Manager', signingAuthority: '$200,000' },
            { name: 'Tony Liu', title: 'Operations Head', signingAuthority: '$100,000' }
        ],
        conductors: [
            { name: 'Kevin Zhang', role: 'Primary Business Conductor', relationship: 'Manager' },
            { name: 'Sandra Kim', role: 'Financial Conductor', relationship: 'Employee' },
            { name: 'Tony Liu', role: 'Operations Conductor', relationship: 'Employee' }
        ],
        relatedEntities: [
            { name: 'Global Logistics Holdings', relationship: 'Parent Company', ownership: '80%' },
            { name: 'Pacific Shipping Lines', relationship: 'Service Partner', ownership: '0%' },
            { name: 'Trans-Pacific Trade Corp', relationship: 'Joint Venture', ownership: '30%' }
        ],
        riskFlags: [
            { category: 'MSB', severity: 'Critical', count: 2 },
            { category: 'High-Risk Wires', severity: 'Critical', count: 8 },
            { category: 'Foreign ATM', severity: 'Critical', count: 12 },
            { category: 'High Cash', severity: 'Watch', count: 3 }
        ],
        productSummary: {
            deposit: { accounts: 7, balance: 18600000, revenue: 920000 },
            lending: { accounts: 4, balance: 9200000, revenue: 680000 },
            treasury: { accounts: 5, balance: 4800000, revenue: 480000 },
            merchant: { accounts: 3, balance: 1400000, revenue: 200000 },
            wealth: { accounts: 1, balance: 200000, revenue: 60000 }
        },
        rankings: {
            risk: { rank: 5, percentile: 95 },
            revenue: { rank: 4, percentile: 96 },
            volume: { rank: 2, percentile: 98 },
            overall: { rank: 3, percentile: 97 }
        },
        keyInsights: [
            'Critical hub for trans-Pacific trade operations',
            'High risk due to complex international transactions',
            'Major revenue contributor with specialized trade finance needs'
        ],
        lastContact: '2024-12-03'
    },
    // Additional clients for Education Services Consortium (rel-011)
    'client-018': {
        id: 'client-018',
        name: 'Education Services Consortium - Research Foundation',
        industry: 'Education',
        location: 'Cambridge, MA',
        relationshipId: 'rel-011',
        portfolioValue: 42800000,
        annualRevenue: 1950000,
        relationshipYears: 18,
        productPenetration: 95,
        riskScore: 1.8,
        lastReview: '2024-09-15',
        nextReview: '2024-12-15',
        beneficialOwners: [
            { name: 'Education Services Consortium', role: 'Parent Organization', ownership: '100%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Dr. Patricia Adams', title: 'Foundation Director', signingAuthority: '$1,000,000' },
            { name: 'Thomas Miller', title: 'Chief Financial Officer', signingAuthority: '$500,000' },
            { name: 'Jennifer Walsh', title: 'Grants Manager', signingAuthority: '$250,000' },
            { name: 'Dr. Marcus Foster', title: 'Research Director', signingAuthority: '$100,000' }
        ],
        conductors: [
            { name: 'Dr. Patricia Adams', role: 'Primary Business Conductor', relationship: 'Director' },
            { name: 'Thomas Miller', role: 'Financial Conductor', relationship: 'Employee' }
        ],
        relatedEntities: [
            { name: 'Education Services Consortium', relationship: 'Parent Organization', ownership: '100%' },
            { name: 'National Science Foundation', relationship: 'Funding Partner', ownership: '0%' },
            { name: 'MIT Research Collaborative', relationship: 'Research Partner', ownership: '0%' }
        ],
        riskFlags: [],
        productSummary: {
            deposit: { accounts: 8, balance: 28500000, revenue: 1180000 },
            lending: { accounts: 1, balance: 8900000, revenue: 420000 },
            treasury: { accounts: 4, balance: 4200000, revenue: 280000 },
            merchant: { accounts: 1, balance: 1100000, revenue: 60000 },
            wealth: { accounts: 1, balance: 100000, revenue: 10000 }
        },
        rankings: {
            risk: { rank: 98, percentile: 2 },
            revenue: { rank: 7, percentile: 93 },
            volume: { rank: 9, percentile: 91 },
            overall: { rank: 11, percentile: 89 }
        },
        keyInsights: [
            'Exceptional credit profile with zero risk indicators',
            'Major endowment and grant management needs',
            'Long-term relationship with highest trust level'
        ],
        lastContact: '2024-11-25'
    },
    'client-019': {
        id: 'client-019',
        name: 'Education Services Consortium - Online Learning Platform',
        industry: 'Education',
        location: 'Austin, TX',
        relationshipId: 'rel-011',
        portfolioValue: 15800000,
        annualRevenue: 980000,
        relationshipYears: 3,
        productPenetration: 78,
        riskScore: 2.5,
        lastReview: '2024-10-10',
        nextReview: '2025-01-10',
        beneficialOwners: [
            { name: 'Education Services Consortium', role: 'Parent Organization', ownership: '75%', citizenshipCountry: 'USA' },
            { name: 'EdTech Innovations LLC', role: 'Technology Partner', ownership: '25%', citizenshipCountry: 'USA' }
        ],
        authorizedSigners: [
            { name: 'Rachel Green', title: 'Platform Director', signingAuthority: '$200,000' },
            { name: 'Mark Johnson', title: 'Technology Officer', signingAuthority: '$100,000' },
            { name: 'Amy Chen', title: 'Finance Manager', signingAuthority: '$50,000' }
        ],
        conductors: [
            { name: 'Rachel Green', role: 'Primary Business Conductor', relationship: 'Director' },
            { name: 'Mark Johnson', role: 'Technology Conductor', relationship: 'Officer' }
        ],
        relatedEntities: [
            { name: 'Education Services Consortium', relationship: 'Parent Organization', ownership: '75%' },
            { name: 'EdTech Innovations LLC', relationship: 'Technology Partner', ownership: '25%' },
            { name: 'Student Success Analytics', relationship: 'Software Platform', ownership: '100%' }
        ],
        riskFlags: [],
        productSummary: {
            deposit: { accounts: 5, balance: 8900000, revenue: 420000 },
            lending: { accounts: 2, balance: 4200000, revenue: 280000 },
            treasury: { accounts: 3, balance: 2100000, revenue: 180000 },
            merchant: { accounts: 2, balance: 500000, revenue: 80000 },
            wealth: { accounts: 1, balance: 100000, revenue: 20000 }
        },
        rankings: {
            risk: { rank: 92, percentile: 8 },
            revenue: { rank: 23, percentile: 77 },
            volume: { rank: 32, percentile: 68 },
            overall: { rank: 28, percentile: 72 }
        },
        keyInsights: [
            'Rapidly growing online education segment',
            'Strong technology infrastructure investment',
            'Excellent growth potential in digital learning market'
        ],
        lastContact: '2024-11-27'
    }
}

export const accounts = {
    'client1': [
        {
            id: 'acc1',
            type: 'Operating Account',
            number: '****1234',
            balance: 15.8e6,
            currency: 'USD',
            status: 'Active',
            clientId: 'client1',
            monthlyActivity: [
                { month: 'Jan', deposits: 8.5e6, withdrawals: 6.2e6, transactions: 145 },
                { month: 'Feb', deposits: 9.8e6, withdrawals: 7.1e6, transactions: 167 },
                { month: 'Mar', deposits: 12.1e6, withdrawals: 8.9e6, transactions: 189 },
                { month: 'Apr', deposits: 11.2e6, withdrawals: 8.3e6, transactions: 172 },
                { month: 'May', deposits: 14.7e6, withdrawals: 10.2e6, transactions: 201 },
                { month: 'Jun', deposits: 13.1e6, withdrawals: 9.6e6, transactions: 186 }
            ]
        },
        {
            id: 'acc2',
            type: 'Savings Account',
            number: '****5678',
            balance: 29.2e6,
            currency: 'USD',
            status: 'Active',
            clientId: 'client1',
            monthlyActivity: [
                { month: 'Jan', deposits: 4.0e6, withdrawals: 1.3e6, transactions: 25 },
                { month: 'Feb', deposits: 5.4e6, withdrawals: 2.1e6, transactions: 31 },
                { month: 'Mar', deposits: 6.0e6, withdrawals: 1.8e6, transactions: 28 },
                { month: 'Apr', deposits: 5.6e6, withdrawals: 2.5e6, transactions: 33 },
                { month: 'May', deposits: 7.6e6, withdrawals: 3.1e6, transactions: 39 },
                { month: 'Jun', deposits: 6.6e6, withdrawals: 2.7e6, transactions: 35 }
            ]
        }
    ]
}

export const transactions = {
    'acc1': [
        {
            id: 'txn1',
            date: '2024-01-15',
            type: 'Wire Transfer',
            amount: 2.5e6,
            direction: 'Inbound',
            counterparty: 'Global Tech Solutions',
            status: 'Completed',
            flags: ['Large Amount'],
            accountId: 'acc1'
        },
        {
            id: 'txn2',
            date: '2024-01-16',
            type: 'ACH Transfer',
            amount: 485000,
            direction: 'Outbound',
            counterparty: 'Vendor Services Inc',
            status: 'Completed',
            flags: [],
            accountId: 'acc1'
        },
        {
            id: 'txn3',
            date: '2024-01-17',
            type: 'Wire Transfer',
            amount: 1.8e6,
            direction: 'Outbound',
            counterparty: 'International Partners Ltd',
            status: 'Completed',
            flags: ['International', 'Large Amount'],
            accountId: 'acc1'
        }
    ]
}

// Helper functions
export const formatCurrency = (amount) => {
    // Handle null, undefined, or non-numeric values
    if (amount == null || isNaN(amount)) {
        return '$0'
    }

    const numAmount = Number(amount)

    if (numAmount >= 1e9) {
        return `$${(numAmount / 1e9).toFixed(1)}B`
    } else if (numAmount >= 1e6) {
        return `$${(numAmount / 1e6).toFixed(1)}M`
    } else if (numAmount >= 1e3) {
        return `$${(numAmount / 1e3).toFixed(1)}K`
    }
    return `$${numAmount.toLocaleString()}`
}

export const getRiskColor = (riskScore) => {
    switch (riskScore.toLowerCase()) {
        case 'low': return 'bg-green-100 text-green-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'high': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Navigation helpers
export const getMetroById = (metroId) => metros.find(m => m.id === metroId)
export const getMarketsByMetro = (metroId) => markets.filter(m => m.metroId === metroId)
export const getMarketById = (marketId) => markets.find(m => m.id === marketId)
export const getRegionById = (regionId) => regions.find(r => r.id === regionId)
export const getRMById = (rmId) => relationshipManagers.find(rm => rm.id === rmId)
export const getRegionsByMarket = (marketId) => regions.filter(r => r.marketId === marketId)
export const getRMsByRegion = (regionId) => relationshipManagers.filter(rm => rm.regionId === regionId)
export const getClientById = (clientId) => clients[clientId]

export const getClientsByRelationshipId = (relationshipId) => {
    return Object.values(clients).filter(client => client.relationshipId === relationshipId)
}