import sqlite3
import json
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent / "database.db"

def init_database():
    """Initialize database with schema and seed data"""
    
    # Remove existing database if it exists
    if DB_PATH.exists():
        DB_PATH.unlink()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metros (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            region TEXT NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS markets (
            id TEXT PRIMARY KEY,
            metro_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (metro_id) REFERENCES metros(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS regions (
            id TEXT PRIMARY KEY,
            market_id TEXT NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (market_id) REFERENCES markets(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS relationship_managers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            region_id TEXT NOT NULL,
            portfolio_value REAL,
            client_count INTEGER,
            revenue REAL,
            risk_score TEXT,
            FOREIGN KEY (region_id) REFERENCES regions(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS relationships (
            id TEXT PRIMARY KEY,
            rm_id TEXT NOT NULL,
            name TEXT NOT NULL,
            industry TEXT,
            portfolio_value REAL,
            risk_level TEXT,
            FOREIGN KEY (rm_id) REFERENCES relationship_managers(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            industry TEXT,
            location TEXT,
            relationship_id TEXT,
            portfolio_value REAL,
            annual_revenue REAL,
            relationship_years INTEGER,
            product_penetration REAL,
            risk_score REAL,
            last_review TEXT,
            next_review TEXT,
            beneficial_owners TEXT,
            authorized_signers TEXT,
            conductors TEXT,
            related_entities TEXT,
            risk_flags TEXT,
            product_summary TEXT,
            product_holdings TEXT,
            rankings TEXT,
            key_insights TEXT,
            last_contact TEXT,
            FOREIGN KEY (relationship_id) REFERENCES relationships(id)
        )
    """)
    
    # Insert seed data
    
    # Metros
    metros = [
        ('ny-metro', 'New York Metro', 'Northeast'),
        ('london-metro', 'London Metro', 'Europe'),
        ('philadelphia-metro', 'Philadelphia Metro', 'Northeast'),
        ('miami-metro', 'Miami Metro', 'Southeast'),
        ('toronto-metro', 'Toronto Metro', 'Canada'),
        ('boston-metro', 'Boston Metro', 'Northeast')
    ]
    cursor.executemany("INSERT INTO metros (id, name, region) VALUES (?, ?, ?)", metros)
    
    # Markets
    markets = [
        ('manhattan', 'ny-metro', 'Manhattan'),
        ('brooklyn', 'ny-metro', 'Brooklyn'),
        ('city-of-london', 'london-metro', 'City of London'),
        ('canary-wharf', 'london-metro', 'Canary Wharf'),
        ('center-city', 'philadelphia-metro', 'Center City'),
        ('miami-downtown', 'miami-metro', 'Downtown Miami'),
        ('toronto-financial', 'toronto-metro', 'Financial District'),
        ('boston-financial', 'boston-metro', 'Financial District')
    ]
    cursor.executemany("INSERT INTO markets (id, metro_id, name) VALUES (?, ?, ?)", markets)
    
    # Regions
    regions = [
        ('northeast-corridor', 'manhattan', 'Northeast Corridor'),
        ('mid-atlantic', 'manhattan', 'Mid-Atlantic'),
        ('greater-boston', 'boston-financial', 'Greater Boston'),
        ('uk-ireland', 'city-of-london', 'UK & Ireland'),
        ('continental-europe', 'city-of-london', 'Continental Europe'),
        ('philadelphia-metro', 'center-city', 'Philadelphia Metro'),
        ('miami-dade', 'miami-downtown', 'Miami-Dade'),
        ('ontario', 'toronto-financial', 'Ontario')
    ]
    cursor.executemany("INSERT INTO regions (id, market_id, name) VALUES (?, ?, ?)", regions)
    
    # Relationship Managers
    rms = [
        ('rm-001', 'Sarah Johnson', 'northeast-corridor', 120000000, 60, 9000000, 'Low'),
        ('rm-002', 'Michael Chen', 'northeast-corridor', 110000000, 55, 8250000, 'Medium'),
        ('rm-003', 'Emily Rodriguez', 'northeast-corridor', 90000000, 50, 6750000, 'Medium')
    ]
    cursor.executemany("""
        INSERT INTO relationship_managers 
        (id, name, region_id, portfolio_value, client_count, revenue, risk_score) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, rms)
    
    # Relationships
    relationships = [
        ('rel-001', 'rm-001', 'Johnson Holdings Group', 'Manufacturing', 45500000, 'High'),
        ('rel-002', 'rm-001', 'TechStart Ventures', 'Technology', 32000000, 'Medium'),
        ('rel-003', 'rm-001', 'Atlantic Healthcare Network', 'Healthcare', 28100000, 'Low')
    ]
    cursor.executemany("""
        INSERT INTO relationships 
        (id, rm_id, name, industry, portfolio_value, risk_level) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, relationships)
    
    # Client - Johnson Manufacturing LLC
    client_data = {
        'id': 'client-001',
        'name': 'Johnson Manufacturing LLC',
        'industry': 'Manufacturing',
        'location': 'Chicago, IL',
        'relationship_id': 'rel-001',
        'portfolio_value': 28650000,
        'annual_revenue': 1063000,
        'relationship_years': 8,
        'product_penetration': 73,
        'risk_score': 6.8,
        'last_review': '2024-11-15',
        'next_review': '2025-02-15',
        'beneficial_owners': json.dumps([
            {'name': 'Robert Johnson', 'role': 'CEO & Founder', 'ownership': '65%', 'citizenshipCountry': 'USA'},
            {'name': 'Maria Johnson', 'role': 'COO', 'ownership': '25%', 'citizenshipCountry': 'USA'},
            {'name': 'Johnson Family Trust', 'role': 'Trust', 'ownership': '10%', 'citizenshipCountry': 'USA'}
        ]),
        'authorized_signers': json.dumps([
            {'name': 'Robert Johnson', 'title': 'CEO', 'signingAuthority': 'Unlimited'},
            {'name': 'Maria Johnson', 'title': 'COO', 'signingAuthority': '$500,000'},
            {'name': 'David Chen', 'title': 'CFO', 'signingAuthority': '$250,000'},
            {'name': 'Sarah Williams', 'title': 'Treasury Manager', 'signingAuthority': '$100,000'}
        ]),
        'conductors': json.dumps([
            {'name': 'Robert Johnson', 'role': 'Primary Business Conductor', 'relationship': 'Owner'},
            {'name': 'Maria Johnson', 'role': 'Operations Conductor', 'relationship': 'Owner'},
            {'name': 'David Chen', 'role': 'Financial Conductor', 'relationship': 'Employee'}
        ]),
        'related_entities': json.dumps([
            {'name': 'Johnson Holdings Group', 'relationship': 'Parent Company', 'ownership': '100%'},
            {'name': 'Johnson Logistics LLC', 'relationship': 'Subsidiary', 'ownership': '100%'},
            {'name': 'Midwest Manufacturing Partners', 'relationship': 'Joint Venture', 'ownership': '40%'}
        ]),
        'risk_flags': json.dumps([
            {'category': 'MSB', 'severity': 'Critical', 'count': 2},
            {'category': 'High Cash', 'severity': 'Critical', 'count': 5},
            {'category': 'High-Risk Industry', 'severity': 'Watch', 'count': 1},
            {'category': 'UTRs', 'severity': 'Review', 'count': 3},
            {'category': 'Luxury Spend', 'severity': 'Watch', 'count': 4},
            {'category': 'Crypto', 'severity': 'Critical', 'count': 2},
            {'category': 'Foreign ATM', 'severity': 'Review', 'count': 3},
            {'category': 'High-Risk Wires', 'severity': 'Review', 'count': 2}
        ]),
        'product_summary': json.dumps({
            'deposit': {'accounts': 4, 'balance': 12500000, 'revenue': 425000},
            'lending': {'accounts': 3, 'balance': 8900000, 'revenue': 380000},
            'treasury': {'accounts': 6, 'balance': 4200000, 'revenue': 156000},
            'merchant': {'accounts': 3, 'balance': 2100000, 'revenue': 78000},
            'wealth': {'accounts': 2, 'balance': 950000, 'revenue': 24000}
        }),
        'product_holdings': json.dumps({
            'checking': {'hasProduct': True, 'balance': 8500000, 'revenue': 285000, 'isRecommended': False},
            'debit-cards': {'hasProduct': True, 'balance': 0, 'revenue': 25000, 'isRecommended': False},
            'cds': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': True},
            'savings-money-market': {'hasProduct': True, 'balance': 4000000, 'revenue': 115000, 'isRecommended': False},
            'credit-cards': {'hasProduct': True, 'balance': 450000, 'revenue': 38000, 'isRecommended': False},
            'loans-lines-credit': {'hasProduct': True, 'balance': 8450000, 'revenue': 342000, 'isRecommended': False},
            'securities-based-lending': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'real-estate-financing': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'ppp': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'asset-based-lending': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': True},
            'commercial-lending': {'hasProduct': True, 'balance': 5200000, 'revenue': 195000, 'isRecommended': False},
            'commercial-real-estate': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'equipment-finance': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': True},
            'liquidity-management': {'hasProduct': True, 'balance': 2100000, 'revenue': 78000, 'isRecommended': False},
            'payables': {'hasProduct': True, 'balance': 1800000, 'revenue': 65000, 'isRecommended': False},
            'receivables': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': True},
            'fraud-control': {'hasProduct': True, 'balance': 0, 'revenue': 8000, 'isRecommended': False},
            'information-services': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'treasury-overview': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'online-banking': {'hasProduct': True, 'balance': 0, 'revenue': 12000, 'isRecommended': False},
            'online-accounting': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'payroll': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': True},
            'business-payment-suite': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'overdraft-services': {'hasProduct': True, 'balance': 0, 'revenue': 5000, 'isRecommended': False},
            'merchant-solutions': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'new-to-small-business': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'healthcare-professionals': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'investments': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'wealth-retirement-planning': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False},
            'private-client-banking': {'hasProduct': False, 'balance': 0, 'revenue': 0, 'isRecommended': False}
        }),
        'rankings': json.dumps({
            'risk': {'rank': 15, 'percentile': 85},
            'revenue': {'rank': 8, 'percentile': 92},
            'volume': {'rank': 12, 'percentile': 88},
            'overall': {'rank': 9, 'percentile': 91}
        }),
        'key_insights': json.dumps([
            'Top 3% of clients in inbound transaction volume',
            'Enhanced monitoring required due to recent crypto activity spikes',
            'Opportunity for treasury management expansion (+$45K potential annual revenue)'
        ]),
        'last_contact': '2024-01-15'
    }
    
    cursor.execute("""
        INSERT INTO clients 
        (id, name, industry, location, relationship_id, portfolio_value, annual_revenue,
         relationship_years, product_penetration, risk_score, last_review, next_review,
         beneficial_owners, authorized_signers, conductors, related_entities, risk_flags,
         product_summary, product_holdings, rankings, key_insights, last_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, tuple(client_data.values()))
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()