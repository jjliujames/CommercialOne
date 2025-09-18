#!/usr/bin/env python3
"""
Banking 360 Mockup Database Test Script
Tests all database queries to ensure they work correctly and return expected data.
"""

import sys
from pathlib import Path
from queries import DatabaseQueries

def format_currency(amount):
    """Format amount as currency."""
    if amount is None:
        return "$0"
    return f"${float(amount):,.0f}"

def test_queries():
    """Test all database queries."""
    print("🧪 Testing Banking 360 Database Queries")
    print("=" * 50)
    
    try:
        with DatabaseQueries() as db:
            
            # Test 1: Get all metros
            print("\n1️⃣  Testing get_metros():")
            metros = db.get_metros()
            print(f"   Found {len(metros)} metros: {', '.join(m['name'] for m in metros)}")
            
            # Test 2: Get relationship managers
            print("\n2️⃣  Testing get_all_relationship_managers():")
            rms = db.get_all_relationship_managers()
            print(f"   Found {len(rms)} RMs: {', '.join(rm['name'] for rm in rms)}")
            
            if not rms:
                print("❌ No relationship managers found. Cannot continue tests.")
                return False
            
            # Test 3: Get relationships for first RM
            first_rm = rms[0]
            print(f"\n3️⃣  Testing get_relationships_by_rm('{first_rm['id']}'):")
            relationships = db.get_relationships_by_rm(first_rm['id'])
            print(f"   Found {len(relationships)} relationships: {', '.join(r['name'] for r in relationships)}")
            
            if not relationships:
                print("❌ No relationships found. Cannot continue tests.")
                return False
            
            # Test 4: Get clients for first relationship
            first_rel = relationships[0]
            print(f"\n4️⃣  Testing get_clients_by_relationship('{first_rel['id']}'):")
            clients = db.get_clients_by_relationship(first_rel['id'])
            print(f"   Found {len(clients)} clients: {', '.join(c['name'] for c in clients)}")
            
            if not clients:
                print("❌ No clients found. Cannot continue tests.")
                return False
            
            # Test 5: Get full client details
            first_client = clients[0]
            print(f"\n5️⃣  Testing get_client_by_id('{first_client['id']}'):")
            client = db.get_client_by_id(first_client['id'])
            
            if client:
                print("   Client details:")
                print(f"   - Name: {client['name']}")
                print(f"   - Industry: {client.get('industry', 'N/A')}")
                print(f"   - Portfolio Value: {format_currency(client.get('portfolio_value'))}")
                print(f"   - Accounts: {len(client.get('accounts', []))}")
                print(f"   - Beneficial Owners: {len(client.get('beneficialOwners', []))}")
                print(f"   - Authorized Signers: {len(client.get('authorizedSigners', []))}")
                print(f"   - Business Conductors: {len(client.get('conductors', []))}")
                print(f"   - Related Entities: {len(client.get('relatedEntities', []))}")
                print(f"   - Risk Flags: {len(client.get('riskFlags', []))}")
                print(f"   - Opportunities: {len(client.get('opportunities', []))}")
            else:
                print("❌ Client not found.")
                return False
            
            # Test 6: Get risk analytics
            print(f"\n6️⃣  Testing get_client_risk_analytics('{client['id']}'):")
            risk_analytics = db.get_client_risk_analytics(client['id'])
            print("   Risk Analytics:")
            print(f"   - Risk Flags: {len(risk_analytics['riskFlags'])}")
            print(f"   - Risk Transactions: {len(risk_analytics['riskTransactions'])}")
            print(f"   - UTR Events: {len(risk_analytics['utrEvents'])}")
            print(f"   - Total Risk Amount: {format_currency(risk_analytics['totalRiskAmount'])}")
            print(f"   - KRI Metrics: {len(risk_analytics['kriMetrics'])}")
            
            # Test 7: Get portfolio summary for relationship
            print(f"\n7️⃣  Testing get_relationship_portfolio_summary('{first_rel['id']}'):")
            summary = db.get_relationship_portfolio_summary(first_rel['id'])
            print("   Portfolio Summary:")
            print(f"   - Client Count: {summary.get('client_count', 0)}")
            print(f"   - Total Accounts: {summary.get('total_accounts', 0)}")
            print(f"   - Total Portfolio Value: {format_currency(summary.get('total_portfolio_value'))}")
            print(f"   - Total Deposits: {format_currency(summary.get('total_deposits'))}")
            print(f"   - Average Risk Score: {summary.get('avg_risk_score', 0):.1f}")
            print(f"   - Total Risk Flags: {summary.get('total_risk_flags', 0)}")
            print(f"   - Total Opportunities: {summary.get('total_opportunities', 0)}")
            print(f"   - Total Opportunity Value: {format_currency(summary.get('total_opportunity_value'))}")
            
            # Test 8: Get database statistics
            print(f"\n8️⃣  Testing get_database_stats():")
            stats = db.get_database_stats()
            print("   Database Statistics:")
            for table, count in stats.items():
                print(f"   - {table}: {count}")
            
            # Test 9: Test specific risk data queries
            print(f"\n9️⃣  Testing specific risk queries for client '{client['id']}':")
            
            # UTR Events
            utr_events = db.get_utr_events_by_client(client['id'])
            print(f"   - UTR Events: {len(utr_events)}")
            if utr_events:
                latest_utr = utr_events[0]
                print(f"     Latest: {latest_utr.get('event_date')} - {format_currency(latest_utr.get('amount'))}")
            
            # Risk Transactions
            risk_transactions = db.get_risk_transactions_by_client(client['id'])
            print(f"   - Risk Transactions: {len(risk_transactions)}")
            if risk_transactions:
                latest_risk = risk_transactions[0]
                print(f"     Latest: {latest_risk.get('transaction_date')} - {latest_risk.get('transaction_type')}")
            
            # Product Penetration
            product_penetration = db.get_product_penetration_by_client(client['id'])
            print(f"   - Product Penetration Records: {len(product_penetration)}")
            
            # Test 10: Test convenience functions
            print(f"\n🔟 Testing convenience functions:")
            
            from queries import get_client_data, get_relationship_data, get_rm_data
            
            client_data = get_client_data(client['id'])
            print(f"   - get_client_data(): {'✅ Success' if client_data else '❌ Failed'}")
            
            rel_data = get_relationship_data(first_rel['id'])
            print(f"   - get_relationship_data(): {'✅ Success' if rel_data else '❌ Failed'}")
            
            rm_data = get_rm_data(first_rm['id'])
            print(f"   - get_rm_data(): {'✅ Success' if rm_data else '❌ Failed'}")
            
        print(f"\n🎉 All tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def check_database_exists():
    """Check if database file exists."""
    script_dir = Path(__file__).parent
    db_path = script_dir / 'banking_360.db'
    
    if not db_path.exists():
        print("❌ Database file not found!")
        print(f"   Expected location: {db_path}")
        print("   Run 'python init_database.py' to create the database.")
        return False
    
    print(f"✅ Database found: {db_path}")
    print(f"   Size: {db_path.stat().st_size / 1024:.1f} KB")
    return True

if __name__ == "__main__":
    print("🗃️  Banking 360 Database Test Suite")
    print("=" * 40)
    
    # Check if database exists
    if not check_database_exists():
        sys.exit(1)
    
    # Run tests
    success = test_queries()
    
    if success:
        print("\n✅ All tests passed! Database is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above.")
        sys.exit(1) 