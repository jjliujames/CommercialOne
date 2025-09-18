-- Banking 360 Mockup Database Schema

-- Core organizational structure
CREATE TABLE metros (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE markets (
    id TEXT PRIMARY KEY,
    metro_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (metro_id) REFERENCES metros(id)
);

CREATE TABLE regions (
    id TEXT PRIMARY KEY,
    market_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES markets(id)
);

-- Relationship managers
CREATE TABLE relationship_managers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region_id TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    portfolio_value DECIMAL(15,2) DEFAULT 0,
    client_count INTEGER DEFAULT 0,
    risk_score DECIMAL(3,1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Relationships (business relationships managed by RMs)
CREATE TABLE relationships (
    id TEXT PRIMARY KEY,
    rm_id TEXT NOT NULL,
    name TEXT NOT NULL,
    industry TEXT,
    portfolio_value DECIMAL(15,2) DEFAULT 0,
    risk_level TEXT DEFAULT 'Medium',
    last_review_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rm_id) REFERENCES relationship_managers(id)
);

-- Clients (individual entities within relationships)
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    name TEXT NOT NULL,
    industry TEXT,
    location TEXT,
    tin TEXT,
    portfolio_value DECIMAL(15,2) DEFAULT 0,
    annual_revenue DECIMAL(15,2) DEFAULT 0,
    relationship_years INTEGER DEFAULT 0,
    risk_score DECIMAL(3,1) DEFAULT 0,
    product_penetration DECIMAL(5,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (relationship_id) REFERENCES relationships(id)
);

-- Client accounts
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_type TEXT NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0,
    available_balance DECIMAL(15,2) DEFAULT 0,
    monthly_volume DECIMAL(15,2) DEFAULT 0,
    monthly_inflows DECIMAL(15,2) DEFAULT 0,
    monthly_outflows DECIMAL(15,2) DEFAULT 0,
    inflow_count INTEGER DEFAULT 0,
    outflow_count INTEGER DEFAULT 0,
    last_transaction DATETIME,
    risk_level TEXT DEFAULT 'Low',
    risk_score DECIMAL(3,1) DEFAULT 0,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Related parties
CREATE TABLE beneficial_owners (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    ownership_percentage DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE authorized_signers (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    authority_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE business_conductors (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE related_entities (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Risk management
CREATE TABLE risk_flags (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    description TEXT,
    flagged_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_date DATETIME,
    created_by TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE utr_events (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    event_date DATE NOT NULL,
    amount DECIMAL(15,2),
    description TEXT NOT NULL,
    officer_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Filed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Risk transactions
CREATE TABLE risk_transactions (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    location TEXT,
    merchant TEXT,
    category TEXT,
    bank TEXT,
    terminal TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Opportunities
CREATE TABLE opportunities (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    value DECIMAL(15,2) DEFAULT 0,
    probability DECIMAL(5,2) DEFAULT 0,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    target_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Product penetration tracking
CREATE TABLE product_penetration (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    product_category TEXT NOT NULL,
    product_name TEXT NOT NULL,
    has_product BOOLEAN DEFAULT FALSE,
    penetration_status TEXT, -- 'Active', 'Opportunity', 'Not Applicable'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Transactions for detailed analysis
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    transaction_date DATETIME NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    counterparty TEXT,
    channel TEXT,
    location TEXT,
    reference_number TEXT,
    status TEXT DEFAULT 'Completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- KRI (Key Risk Indicators) data
CREATE TABLE kri_metrics (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_date DATE NOT NULL,
    threshold_value DECIMAL(15,4),
    status TEXT DEFAULT 'Normal', -- 'Normal', 'Warning', 'Critical'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Create indexes for better performance
CREATE INDEX idx_clients_relationship_id ON clients(relationship_id);
CREATE INDEX idx_accounts_client_id ON accounts(client_id);
CREATE INDEX idx_risk_flags_client_id ON risk_flags(client_id);
CREATE INDEX idx_utr_events_client_id ON utr_events(client_id);
CREATE INDEX idx_risk_transactions_client_id ON risk_transactions(client_id);
CREATE INDEX idx_opportunities_client_id ON opportunities(client_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_kri_metrics_client_id ON kri_metrics(client_id);
CREATE INDEX idx_product_penetration_client_id ON product_penetration(client_id); 