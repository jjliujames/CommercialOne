-- Banking 360 Mockup - Seed Data

-- Insert metros
INSERT INTO metros (id, name, region) VALUES 
('metro_1', 'New York Metro', 'Northeast'),
('metro_2', 'Los Angeles Metro', 'West'),
('metro_3', 'Chicago Metro', 'Midwest'),
('metro_4', 'Houston Metro', 'South'),
('metro_5', 'Phoenix Metro', 'Southwest');

-- Insert markets
INSERT INTO markets (id, metro_id, name) VALUES 
('market_1', 'metro_1', 'Manhattan'),
('market_2', 'metro_1', 'Brooklyn'),
('market_3', 'metro_2', 'Downtown LA'),
('market_4', 'metro_2', 'Beverly Hills'),
('market_5', 'metro_3', 'Loop'),
('market_6', 'metro_4', 'Energy Corridor'),
('market_7', 'metro_5', 'Scottsdale');

-- Insert regions
INSERT INTO regions (id, market_id, name) VALUES 
('region_1', 'market_1', 'Financial District'),
('region_2', 'market_1', 'Midtown'),
('region_3', 'market_2', 'DUMBO'),
('region_4', 'market_3', 'Arts District'),
('region_5', 'market_4', 'Rodeo Drive'),
('region_6', 'market_5', 'West Loop'),
('region_7', 'market_6', 'Westchase'),
('region_8', 'market_7', 'Old Town');

-- Insert relationship managers
INSERT INTO relationship_managers (id, name, region_id, email, phone, portfolio_value, client_count, risk_score) VALUES 
('rm_001', 'Sarah Chen', 'region_1', 'sarah.chen@bank.com', '555-0101', 125000000.00, 15, 3.2),
('rm_002', 'Michael Rodriguez', 'region_1', 'michael.rodriguez@bank.com', '555-0102', 98000000.00, 12, 2.8),
('rm_003', 'Jennifer Park', 'region_2', 'jennifer.park@bank.com', '555-0103', 156000000.00, 18, 3.5),
('rm_004', 'David Thompson', 'region_3', 'david.thompson@bank.com', '555-0104', 87000000.00, 10, 2.1),
('rm_005', 'Lisa Wang', 'region_4', 'lisa.wang@bank.com', '555-0105', 234000000.00, 22, 4.1);

-- Insert relationships
INSERT INTO relationships (id, rm_id, name, industry, portfolio_value, risk_level, last_review_date) VALUES 
('rel_001', 'rm_001', 'TechCorp Holdings', 'Technology', 45000000.00, 'Medium', '2024-01-15'),
('rel_002', 'rm_001', 'Global Manufacturing Inc', 'Manufacturing', 32000000.00, 'Low', '2024-02-01'),
('rel_003', 'rm_002', 'Energy Solutions LLC', 'Energy', 28000000.00, 'High', '2024-01-20'),
('rel_004', 'rm_003', 'Healthcare Partners', 'Healthcare', 67000000.00, 'Medium', '2024-01-10'),
('rel_005', 'rm_004', 'Real Estate Ventures', 'Real Estate', 52000000.00, 'Medium', '2024-02-05'),
('rel_006', 'rm_005', 'Financial Services Group', 'Financial Services', 89000000.00, 'Low', '2024-01-25');

-- Insert clients
INSERT INTO clients (id, relationship_id, name, industry, location, tin, portfolio_value, annual_revenue, relationship_years, risk_score, product_penetration) VALUES 
('client_001', 'rel_001', 'TechCorp Solutions', 'Software Development', 'San Francisco, CA', '12-3456789', 25300000.00, 1100000.00, 5, 3.4, 68.5),
('client_002', 'rel_001', 'TechCorp Innovations', 'Technology Consulting', 'Austin, TX', '12-3456790', 19700000.00, 850000.00, 3, 2.8, 72.3),
('client_003', 'rel_002', 'Global Manufacturing Corp', 'Industrial Manufacturing', 'Detroit, MI', '12-3456791', 32000000.00, 2500000.00, 8, 2.1, 85.2),
('client_004', 'rel_003', 'Energy Solutions Alpha', 'Oil & Gas', 'Houston, TX', '12-3456792', 18500000.00, 1800000.00, 4, 6.2, 45.8),
('client_005', 'rel_003', 'Energy Solutions Beta', 'Renewable Energy', 'Phoenix, AZ', '12-3456793', 9500000.00, 950000.00, 2, 4.1, 38.9),
('client_006', 'rel_004', 'Healthcare Partners Main', 'Hospital Management', 'Chicago, IL', '12-3456794', 45000000.00, 3200000.00, 12, 2.9, 91.4),
('client_007', 'rel_004', 'Healthcare Partners Clinic', 'Medical Services', 'Milwaukee, WI', '12-3456795', 22000000.00, 1600000.00, 7, 3.1, 76.8),
('client_008', 'rel_005', 'Real Estate Ventures LLC', 'Commercial Real Estate', 'Miami, FL', '12-3456796', 52000000.00, 4100000.00, 6, 3.8, 62.1),
('client_009', 'rel_006', 'Financial Services Alpha', 'Investment Management', 'New York, NY', '12-3456797', 67000000.00, 5200000.00, 15, 1.9, 94.7),
('client_010', 'rel_006', 'Financial Services Beta', 'Insurance', 'Boston, MA', '12-3456798', 22000000.00, 1800000.00, 9, 2.3, 83.5);

-- Insert accounts
INSERT INTO accounts (id, client_id, account_number, account_type, balance, available_balance, monthly_volume, monthly_inflows, monthly_outflows, inflow_count, outflow_count, last_transaction, risk_level, risk_score, status) VALUES 
('acc_001', 'client_001', 'CHK123456', 'Business Checking', 3795000.00, 3600000.00, 8500000.00, 4800000.00, 3700000.00, 45, 38, '2024-02-15 14:30:00', 'Medium', 3.2, 'Active'),
('acc_002', 'client_001', 'SAV789012', 'Business Savings', 6325000.00, 6325000.00, 1200000.00, 800000.00, 400000.00, 12, 8, '2024-02-14 09:15:00', 'Low', 1.8, 'Active'),
('acc_003', 'client_001', 'MM345678', 'Money Market', 7590000.00, 7590000.00, 2100000.00, 1300000.00, 800000.00, 18, 14, '2024-02-13 16:45:00', 'Low', 2.1, 'Active'),
('acc_004', 'client_001', 'LOC901234', 'Credit Line', 7590000.00, 6800000.00, 3200000.00, 1800000.00, 1400000.00, 22, 19, '2024-02-15 11:20:00', 'Medium', 3.5, 'Active'),
('acc_005', 'client_002', 'CHK567890', 'Business Checking', 2955000.00, 2800000.00, 6200000.00, 3500000.00, 2700000.00, 38, 32, '2024-02-15 13:10:00', 'Medium', 2.9, 'Active'),
('acc_006', 'client_002', 'SAV234567', 'Business Savings', 4925000.00, 4925000.00, 950000.00, 600000.00, 350000.00, 10, 7, '2024-02-14 15:30:00', 'Low', 1.5, 'Active'),
('acc_007', 'client_003', 'CHK890123', 'Business Checking', 4800000.00, 4600000.00, 12000000.00, 7200000.00, 4800000.00, 65, 52, '2024-02-15 16:00:00', 'Low', 2.0, 'Active'),
('acc_008', 'client_004', 'CHK456789', 'Business Checking', 2775000.00, 2650000.00, 8500000.00, 5100000.00, 3400000.00, 48, 41, '2024-02-15 12:45:00', 'High', 6.1, 'Active'),
('acc_009', 'client_005', 'CHK012345', 'Business Checking', 1425000.00, 1350000.00, 4200000.00, 2500000.00, 1700000.00, 28, 24, '2024-02-15 10:30:00', 'Medium', 4.2, 'Active'),
('acc_010', 'client_006', 'CHK678901', 'Business Checking', 6750000.00, 6400000.00, 18000000.00, 10800000.00, 7200000.00, 85, 68, '2024-02-15 17:15:00', 'Low', 2.8, 'Active');

-- Insert beneficial owners
INSERT INTO beneficial_owners (id, client_id, name, ownership_percentage) VALUES 
('bo_001', 'client_001', 'John Smith', 45.0),
('bo_002', 'client_001', 'Jane Doe', 35.0),
('bo_003', 'client_002', 'Robert Johnson', 60.0),
('bo_004', 'client_003', 'Michael Brown', 80.0),
('bo_005', 'client_004', 'Sarah Wilson', 55.0),
('bo_006', 'client_005', 'David Miller', 70.0),
('bo_007', 'client_006', 'Lisa Anderson', 40.0),
('bo_008', 'client_006', 'Mark Taylor', 35.0);

-- Insert authorized signers
INSERT INTO authorized_signers (id, client_id, name, authority_level) VALUES 
('as_001', 'client_001', 'Emily Chen', 'Primary'),
('as_002', 'client_001', 'Alex Rodriguez', 'Secondary'),
('as_003', 'client_002', 'Maria Garcia', 'Primary'),
('as_004', 'client_003', 'James Wilson', 'Primary'),
('as_005', 'client_004', 'Jennifer Davis', 'Primary'),
('as_006', 'client_005', 'Thomas Moore', 'Primary'),
('as_007', 'client_006', 'Amanda Clark', 'Primary'),
('as_008', 'client_006', 'Kevin Lewis', 'Secondary');

-- Insert business conductors
INSERT INTO business_conductors (id, client_id, name, role) VALUES 
('bc_001', 'client_001', 'Daniel Kim', 'CFO'),
('bc_002', 'client_001', 'Rachel Green', 'COO'),
('bc_003', 'client_002', 'Steven Martinez', 'CEO'),
('bc_004', 'client_003', 'Laura White', 'President'),
('bc_005', 'client_004', 'Christopher Lee', 'Managing Director'),
('bc_006', 'client_005', 'Nicole Harris', 'VP Operations'),
('bc_007', 'client_006', 'Brian Thompson', 'CEO'),
('bc_008', 'client_006', 'Stephanie Young', 'CFO');

-- Insert related entities
INSERT INTO related_entities (id, client_id, name, relationship_type) VALUES 
('re_001', 'client_001', 'TechCorp Subsidiary A', 'Subsidiary'),
('re_002', 'client_001', 'TechCorp Joint Venture', 'Joint Venture'),
('re_003', 'client_002', 'Innovation Labs LLC', 'Affiliate'),
('re_004', 'client_003', 'Global Supply Chain Inc', 'Subsidiary'),
('re_005', 'client_004', 'Energy Trading Partners', 'Partnership'),
('re_006', 'client_005', 'Green Energy Holdings', 'Parent Company'),
('re_007', 'client_006', 'Medical Equipment Leasing', 'Subsidiary'),
('re_008', 'client_008', 'Property Management LLC', 'Subsidiary');

-- Insert risk flags
INSERT INTO risk_flags (id, client_id, category, subcategory, severity, status, description, flagged_date, created_by) VALUES 
('rf_001', 'client_001', 'UTR Filed', 'Suspicious Activity', 'High', 'Active', 'Large cash deposits exceeding normal patterns', '2024-01-15', 'System'),
('rf_002', 'client_001', 'High Risk Industry', 'Technology Sector', 'Medium', 'Active', 'Operating in high-risk technology sector', '2024-01-10', 'Analyst'),
('rf_003', 'client_004', 'UTR Filed', 'Unusual Transactions', 'High', 'Active', 'Wire transfers to high-risk jurisdictions', '2024-01-20', 'System'),
('rf_004', 'client_004', 'High Cash Activities', 'Cash Deposits', 'High', 'Active', 'Frequent large cash deposits', '2024-01-18', 'System'),
('rf_005', 'client_005', 'Crypto Activity', 'Digital Assets', 'Medium', 'Active', 'Cryptocurrency exchange transactions', '2024-02-01', 'System'),
('rf_006', 'client_008', 'High-Risk Wires', 'International Transfers', 'Medium', 'Active', 'Large international wire transfers', '2024-01-25', 'System');

-- Insert UTR events
INSERT INTO utr_events (id, client_id, event_date, amount, description, officer_name, notes, status) VALUES 
('utr_001', 'client_001', '2024-01-15', 25000.00, 'Cash deposit exceeds threshold', 'Officer Johnson', 'Pattern of deposits under $10,000 over 3 days', 'Filed'),
('utr_002', 'client_001', '2024-01-20', 45000.00, 'Wire to Coinbase Pro for cryptocurrency purchase', 'Officer Smith', 'Large crypto wire transfer flagged for review', 'Filed'),
('utr_003', 'client_004', '2024-01-18', 75000.00, 'Structured cash deposits', 'Officer Davis', 'Multiple deposits just under reporting threshold', 'Filed'),
('utr_004', 'client_004', '2024-01-22', 32000.00, 'Wire to high-risk jurisdiction', 'Officer Wilson', 'Transfer to country with high money laundering risk', 'Filed'),
('utr_005', 'client_005', '2024-02-01', 18500.00, 'Cryptocurrency exchange activity', 'Officer Brown', 'Large volume crypto transactions', 'Filed');

-- Insert risk transactions
INSERT INTO risk_transactions (id, client_id, transaction_date, amount, transaction_type, description, location, merchant, category, bank, terminal, status) VALUES 
('rt_001', 'client_001', '2024-02-15', 45000.00, 'High Cash Deposit', 'Cash deposit - retail sales revenue', 'New York, NY', 'Main St Branch', 'Cash', 'Chase Bank', 'Teller #3', 'Completed'),
('rt_002', 'client_001', '2024-02-12', 65000.00, 'Crypto Trx', 'Bitcoin purchase via Coinbase Pro', 'Online', 'Coinbase Pro', 'Cryptocurrency', 'Digital Exchange', 'Online', 'Completed'),
('rt_003', 'client_004', '2024-02-10', 25000.00, 'HRJ Trx Wire Out', 'Wire transfer to Iran', 'Houston, TX', 'Bank Melli Iran', 'International Wire', 'Wells Fargo', 'Wire Dept', 'Completed'),
('rt_004', 'client_004', '2024-02-08', 52000.00, 'High Cash Deposit', 'Large cash deposit from oil sales', 'Houston, TX', 'Energy Corridor Branch', 'Cash', 'JPMorgan Chase', 'Teller #1', 'Completed'),
('rt_005', 'client_005', '2024-02-05', 28500.00, 'Crypto Trx', 'Ethereum sale on Binance US', 'Online', 'Binance US', 'Cryptocurrency', 'Digital Exchange', 'Online', 'Completed'),
('rt_006', 'client_008', '2024-02-03', 85000.00, 'Third Party Check Deposit', 'Real estate transaction check', 'Miami, FL', 'ABC Real Estate LLC', 'Check', 'Bank of America', 'Branch Teller', 'Completed');

-- Insert opportunities
INSERT INTO opportunities (id, client_id, type, description, value, probability, priority, status, target_date) VALUES 
('opp_001', 'client_001', 'Credit Products', 'Equipment financing for new server infrastructure', 2500000.00, 75.0, 'High', 'Open', '2024-04-15'),
('opp_002', 'client_001', 'Treasury Services', 'Cash management optimization', 150000.00, 85.0, 'Medium', 'Open', '2024-03-30'),
('opp_003', 'client_002', 'Investment Services', 'Portfolio management for excess cash', 800000.00, 60.0, 'Medium', 'Open', '2024-05-01'),
('opp_004', 'client_003', 'Trade Finance', 'Letter of credit facility for international trade', 5000000.00, 90.0, 'High', 'Open', '2024-03-15'),
('opp_005', 'client_004', 'Energy Lending', 'Project financing for oil drilling equipment', 12000000.00, 70.0, 'High', 'Open', '2024-06-01'),
('opp_006', 'client_006', 'Healthcare Finance', 'Medical equipment leasing program', 3200000.00, 80.0, 'High', 'Open', '2024-04-01'),
('opp_007', 'client_008', 'Real Estate Finance', 'Commercial mortgage for property acquisition', 8500000.00, 65.0, 'High', 'Open', '2024-07-01'),
('opp_008', 'client_009', 'Wealth Management', 'Private banking services expansion', 1200000.00, 95.0, 'Medium', 'Open', '2024-03-20');

-- Insert product penetration data
INSERT INTO product_penetration (id, client_id, product_category, product_name, has_product, penetration_status) VALUES 
-- TechCorp Solutions
('pp_001', 'client_001', 'Business Deposit Product', 'Checking', TRUE, 'Active'),
('pp_002', 'client_001', 'Business Deposit Product', 'Debit Cards', TRUE, 'Active'),
('pp_003', 'client_001', 'Business Deposit Product', 'CDs', FALSE, 'Opportunity'),
('pp_004', 'client_001', 'Business Deposit Product', 'Savings and Money Market', TRUE, 'Active'),
('pp_005', 'client_001', 'Business Lending Product', 'Credit Cards', TRUE, 'Active'),
('pp_006', 'client_001', 'Business Lending Product', 'Loans and Lines of Credit', TRUE, 'Active'),
('pp_007', 'client_001', 'Business Lending Product', 'Securities-Based Lending', FALSE, 'Opportunity'),
('pp_008', 'client_001', 'Commercial Lending Solutions', 'Equipment Finance', TRUE, 'Active'),
('pp_009', 'client_001', 'Treasury & Cash Management', 'Liquidity Management', TRUE, 'Active'),
('pp_010', 'client_001', 'Treasury & Cash Management', 'Payables', TRUE, 'Active'),
-- Add more product penetration data for other clients...
('pp_011', 'client_004', 'Business Deposit Product', 'Checking', TRUE, 'Active'),
('pp_012', 'client_004', 'Business Lending Product', 'Loans and Lines of Credit', TRUE, 'Active'),
('pp_013', 'client_004', 'Commercial Lending Solutions', 'Asset Based Lending', FALSE, 'Opportunity'),
('pp_014', 'client_006', 'Business Deposit Product', 'Checking', TRUE, 'Active'),
('pp_015', 'client_006', 'Treasury & Cash Management', 'Payables', TRUE, 'Active'),
('pp_016', 'client_006', 'Treasury & Cash Management', 'Receivables', TRUE, 'Active');

-- Insert sample transactions
INSERT INTO transactions (id, account_id, transaction_date, amount, transaction_type, description, counterparty, channel, location, reference_number, status) VALUES 
('txn_001', 'acc_001', '2024-02-15 14:30:00', 125000.00, 'Wire In', 'Customer payment received', 'ABC Corp', 'Wire Transfer', 'New York, NY', 'WIR240215001', 'Completed'),
('txn_002', 'acc_001', '2024-02-15 10:15:00', -45000.00, 'Wire Out', 'Vendor payment', 'XYZ Suppliers', 'Wire Transfer', 'New York, NY', 'WIR240215002', 'Completed'),
('txn_003', 'acc_001', '2024-02-14 16:45:00', 75000.00, 'Deposit', 'Cash deposit from sales', 'Branch Deposit', 'Branch', 'New York, NY', 'DEP240214001', 'Completed'),
('txn_004', 'acc_004', '2024-02-13 09:30:00', -25000.00, 'Check', 'Equipment purchase', 'Tech Equipment Co', 'Check', 'New York, NY', 'CHK240213001', 'Completed'),
('txn_005', 'acc_008', '2024-02-15 12:45:00', 85000.00, 'Wire In', 'Oil sales revenue', 'Energy Buyer LLC', 'Wire Transfer', 'Houston, TX', 'WIR240215003', 'Completed');

-- Insert KRI metrics
INSERT INTO kri_metrics (id, client_id, metric_name, metric_value, metric_date, threshold_value, status) VALUES 
('kri_001', 'client_001', 'Cash Transaction Ratio', 0.15, '2024-02-01', 0.20, 'Normal'),
('kri_002', 'client_001', 'Wire Transfer Volume', 2500000.00, '2024-02-01', 3000000.00, 'Normal'),
('kri_003', 'client_004', 'Cash Transaction Ratio', 0.35, '2024-02-01', 0.20, 'Critical'),
('kri_004', 'client_004', 'High Risk Jurisdiction Ratio', 0.12, '2024-02-01', 0.05, 'Warning'),
('kri_005', 'client_005', 'Crypto Transaction Volume', 185000.00, '2024-02-01', 100000.00, 'Warning'),
('kri_006', 'client_006', 'Transaction Velocity', 1.25, '2024-02-01', 1.50, 'Normal'),
('kri_007', 'client_008', 'Large Transaction Frequency', 0.08, '2024-02-01', 0.10, 'Normal'); 