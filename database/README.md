# Banking 360 Mockup Database

A comprehensive SQLite database with dummy data that mirrors the structure and relationships needed for the Banking 360 client relationship management application.

## Overview

This database provides realistic banking data including:
- **Organizational Structure**: Metros → Markets → Regions → Relationship Managers
- **Client Relationships**: Business relationships with multiple clients and accounts
- **Risk Management**: UTR events, risk transactions, compliance flags, and KRI metrics
- **Business Development**: Opportunities and product penetration analysis
- **Portfolio Analytics**: Comprehensive client and relationship portfolio data

## Quick Start

### Prerequisites
- Python 3.6 or later (no external dependencies required)

### Initialize Database
```bash
cd database
python init_database.py
```

### Test Database
```bash
python test_queries.py
```

### Reset Database (if needed)
```bash
python reset_database.py
```

## Python Scripts

### `init_database.py`
Creates the SQLite database with schema and seed data.
- Executes `schema.sql` to create tables
- Executes `seed_data.sql` to populate with dummy data
- Provides verification and statistics

### `queries.py`
Main query interface with comprehensive methods:
- **DatabaseQueries class**: Full-featured query helper
- **Context manager support**: Automatic connection management
- **Type hints**: Full typing support for better IDE integration
- **Convenience functions**: Quick access to common operations

### `test_queries.py`
Comprehensive test suite that verifies:
- All query methods work correctly
- Data relationships are properly maintained
- Risk analytics calculations are accurate
- Portfolio summaries are computed correctly

### `reset_database.py`
Safely deletes and recreates the database:
- Prompts for confirmation before deletion
- Automatically reinitializes with fresh data

## Usage Examples

### Basic Usage
```python
from queries import DatabaseQueries

# Using context manager (recommended)
with DatabaseQueries() as db:
    clients = db.get_clients_by_relationship('rel_001')
    for client in clients:
        print(f"{client['name']}: {client['portfolio_value']}")

# Using convenience functions
from queries import get_client_data
client = get_client_data('client_001')
print(f"Risk Score: {client['risk_score']}")
```

### Advanced Queries
```python
with DatabaseQueries() as db:
    # Get comprehensive risk analysis
    risk_data = db.get_client_risk_analytics('client_001')
    
    # Get portfolio summary for relationship
    summary = db.get_relationship_portfolio_summary('rel_001')
    
    # Get specific risk transactions
    crypto_transactions = db.get_risk_transactions_by_client(
        'client_001', 
        ['Cryptocurrency', 'High-Risk Jurisdiction']
    )
```

## Database Schema

### Core Tables
- **metros**: Geographic metro areas (5 records)
- **markets**: Markets within metros (7 records)
- **regions**: Regions within markets (8 records)
- **relationship_managers**: RMs managing client relationships (5 records)
- **relationships**: Business relationships (6 records)
- **clients**: Individual clients (10 records)
- **accounts**: Client accounts (10+ records)

### Supporting Tables
- **beneficial_owners**: Ownership structures
- **authorized_signers**: Account signatories
- **business_conductors**: Business operations personnel
- **related_entities**: Connected business entities

### Risk Management Tables
- **risk_flags**: Compliance and risk indicators
- **utr_events**: Unusual Transaction Reports
- **risk_transactions**: High-risk transaction patterns
- **kri_metrics**: Key Risk Indicators over time

### Business Development Tables
- **opportunities**: Sales and business development prospects
- **product_penetration**: Cross-selling analysis
- **transactions**: Account transaction history

## Data Characteristics

### Industries Represented
- Technology (TechFlow Solutions, DataSync Corp)
- Manufacturing (Global Manufacturing Inc)
- Energy (Energy Partners LLC)
- Healthcare (MedTech Innovations)
- Real Estate (Prestige Properties)
- Financial Services (Various entities)

### Portfolio Values
- Range: $9.5M to $67M per client
- Total portfolio value: ~$300M across all clients
- Realistic account balances and transaction volumes

### Risk Scenarios
- **Cash Patterns**: Unusual cash transaction behaviors
- **Cryptocurrency**: Digital asset exposures
- **High-Risk Jurisdictions**: International compliance concerns
- **UTR Filings**: Regulatory reporting events
- **KRI Monitoring**: Ongoing risk metric tracking

### Geographic Distribution
- **New York Metro**: Manhattan, Brooklyn markets
- **Los Angeles Metro**: Downtown LA, Beverly Hills markets
- **Chicago Metro**: Downtown Chicago market
- **Houston Metro**: Downtown Houston market
- **Phoenix Metro**: Downtown Phoenix market

## Query Methods Available

### Organizational Structure
- `get_metros()` - All metro areas
- `get_markets_by_metro(metro_id)` - Markets in metro
- `get_regions_by_market(market_id)` - Regions in market
- `get_relationship_managers_by_region(region_id)` - RMs in region

### Relationship Management
- `get_all_relationship_managers()` - All RMs
- `get_relationships_by_rm(rm_id)` - Relationships per RM
- `get_clients_by_relationship(relationship_id)` - Clients per relationship

### Client Data
- `get_client_by_id(client_id)` - Full client details with related data
- `get_accounts_by_client(client_id)` - Client accounts
- `get_opportunities_by_client(client_id)` - Business opportunities
- `get_product_penetration_by_client(client_id)` - Cross-selling data

### Risk Management
- `get_risk_flags_by_client(client_id)` - Active risk flags
- `get_utr_events_by_client(client_id)` - UTR filing history
- `get_risk_transactions_by_client(client_id)` - Risk transaction patterns
- `get_client_risk_analytics(client_id)` - Comprehensive risk analysis
- `get_kri_metrics_by_client(client_id)` - Key Risk Indicators

### Portfolio Analysis
- `get_relationship_portfolio_summary(relationship_id)` - Portfolio aggregates
- `get_transactions_by_account(account_id)` - Transaction history

### Utilities
- `get_database_stats()` - Record counts and database health

## File Structure
```
database/
├── banking_360.db          # SQLite database file (created by init_database.py)
├── schema.sql              # Database schema definition
├── seed_data.sql           # Dummy data for all tables
├── init_database.py        # Database initialization script
├── queries.py              # Main query interface module
├── test_queries.py         # Comprehensive test suite
├── reset_database.py       # Database reset utility
├── requirements.txt        # Python dependencies (none needed!)
└── README.md              # This documentation
```

## Integration with Frontend

The database structure exactly matches the `mockData.js` format used in the Vue.js frontend. All field names, data types, and relationships are designed to be drop-in compatible.

Example integration:
```python
# Replace mockData calls with database queries
from queries import get_client_data, get_relationship_data

# Instead of mockData.getClientById(id)
client = get_client_data(client_id)

# Instead of mockData.getRelationshipData(id)  
relationship = get_relationship_data(relationship_id)
```

## Performance Notes

- **Indexes**: Created on all foreign keys and commonly queried fields
- **Connection Management**: Context managers ensure proper cleanup
- **Query Optimization**: Efficient JOINs and aggregations
- **Memory Usage**: Row factory enables dict-like access without overhead

## Development

To modify the database:
1. Edit `schema.sql` for structure changes
2. Edit `seed_data.sql` for data changes  
3. Run `python reset_database.py` to apply changes
4. Run `python test_queries.py` to verify functionality

The Python implementation provides better error handling, type safety, and cross-platform compatibility compared to the original JavaScript version. 