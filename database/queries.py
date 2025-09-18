#!/usr/bin/env python3
"""
Banking 360 Mockup Database Queries
Python module for querying the SQLite database with methods that match the current mockData.js structure.
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Optional, Any
from datetime import datetime

class DatabaseQueries:
    """Database query helper class for Banking 360 Mockup."""
    
    def __init__(self, db_path: Optional[str] = None):
        """Initialize database connection."""
        if db_path is None:
            script_dir = Path(__file__).parent
            db_path = script_dir / 'banking_360.db'
        
        self.db_path = str(db_path)
        self._connection = None
    
    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection with row factory."""
        if self._connection is None:
            self._connection = sqlite3.connect(self.db_path)
            self._connection.row_factory = sqlite3.Row  # Enable dict-like access
        return self._connection
    
    def _query(self, sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Execute query and return results as list of dictionaries."""
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    
    def _query_one(self, sql: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        """Execute query and return single result as dictionary."""
        results = self._query(sql, params)
        return results[0] if results else None
    
    # Organizational Structure Methods
    
    def get_metros(self) -> List[Dict[str, Any]]:
        """Get all metros."""
        return self._query('SELECT * FROM metros ORDER BY name')
    
    def get_markets_by_metro(self, metro_id: str) -> List[Dict[str, Any]]:
        """Get markets by metro."""
        return self._query('SELECT * FROM markets WHERE metro_id = ? ORDER BY name', (metro_id,))
    
    def get_regions_by_market(self, market_id: str) -> List[Dict[str, Any]]:
        """Get regions by market."""
        return self._query('SELECT * FROM regions WHERE market_id = ? ORDER BY name', (market_id,))
    
    def get_relationship_managers_by_region(self, region_id: str) -> List[Dict[str, Any]]:
        """Get relationship managers by region."""
        return self._query('SELECT * FROM relationship_managers WHERE region_id = ? ORDER BY name', (region_id,))
    
    def get_all_relationship_managers(self) -> List[Dict[str, Any]]:
        """Get all relationship managers."""
        return self._query('SELECT * FROM relationship_managers ORDER BY name')
    
    # Relationship Management Methods
    
    def get_relationships_by_rm(self, rm_id: str) -> List[Dict[str, Any]]:
        """Get relationships by RM."""
        return self._query('SELECT * FROM relationships WHERE rm_id = ? ORDER BY name', (rm_id,))
    
    def get_relationship_by_id(self, relationship_id: str) -> Optional[Dict[str, Any]]:
        """Get relationship by ID."""
        return self._query_one('SELECT * FROM relationships WHERE id = ?', (relationship_id,))
    
    def get_clients_by_relationship(self, relationship_id: str) -> List[Dict[str, Any]]:
        """Get clients by relationship."""
        sql = """
        SELECT c.*, 
               COUNT(a.id) as account_count,
               COALESCE(SUM(a.balance), 0) as total_balance
        FROM clients c
        LEFT JOIN accounts a ON c.id = a.client_id
        WHERE c.relationship_id = ?
        GROUP BY c.id
        ORDER BY c.name
        """
        return self._query(sql, (relationship_id,))
    
    # Client Data Methods
    
    def get_client_by_id(self, client_id: str) -> Optional[Dict[str, Any]]:
        """Get client by ID with full details."""
        client = self._query_one('SELECT * FROM clients WHERE id = ?', (client_id,))
        if not client:
            return None
        
        # Get related data
        client['accounts'] = self._query('SELECT * FROM accounts WHERE client_id = ?', (client_id,))
        client['beneficialOwners'] = self._query('SELECT * FROM beneficial_owners WHERE client_id = ?', (client_id,))
        client['authorizedSigners'] = self._query('SELECT * FROM authorized_signers WHERE client_id = ?', (client_id,))
        client['conductors'] = self._query('SELECT * FROM business_conductors WHERE client_id = ?', (client_id,))
        client['relatedEntities'] = self._query('SELECT * FROM related_entities WHERE client_id = ?', (client_id,))
        client['riskFlags'] = self._query('SELECT * FROM risk_flags WHERE client_id = ? AND status = "Active"', (client_id,))
        client['opportunities'] = self._query('SELECT * FROM opportunities WHERE client_id = ? AND status = "Open"', (client_id,))
        
        return client
    
    def get_accounts_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get accounts by client."""
        return self._query('SELECT * FROM accounts WHERE client_id = ? ORDER BY account_type', (client_id,))
    
    def get_opportunities_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get opportunities by client."""
        return self._query('SELECT * FROM opportunities WHERE client_id = ? AND status = "Open" ORDER BY value DESC', (client_id,))
    
    def get_product_penetration_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get product penetration by client."""
        return self._query('SELECT * FROM product_penetration WHERE client_id = ? ORDER BY product_category, product_name', (client_id,))
    
    # Risk Management Methods
    
    def get_risk_flags_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get risk flags by client."""
        return self._query('SELECT * FROM risk_flags WHERE client_id = ? AND status = "Active" ORDER BY flagged_date DESC', (client_id,))
    
    def get_utr_events_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get UTR events by client."""
        return self._query('SELECT * FROM utr_events WHERE client_id = ? ORDER BY event_date DESC', (client_id,))
    
    def get_risk_transactions_by_client(self, client_id: str, transaction_types: List[str] = None) -> List[Dict[str, Any]]:
        """Get risk transactions by client."""
        sql = 'SELECT * FROM risk_transactions WHERE client_id = ?'
        params = [client_id]
        
        if transaction_types:
            placeholders = ','.join(['?' for _ in transaction_types])
            sql += f' AND transaction_type IN ({placeholders})'
            params.extend(transaction_types)
        
        sql += ' ORDER BY transaction_date DESC'
        return self._query(sql, tuple(params))
    
    def get_client_risk_analytics(self, client_id: str, timeframe: str = '6M') -> Dict[str, Any]:
        """Get comprehensive risk analytics for client."""
        risk_flags = self.get_risk_flags_by_client(client_id)
        risk_transactions = self.get_risk_transactions_by_client(client_id)
        utr_events = self.get_utr_events_by_client(client_id)
        kri_metrics = self.get_kri_metrics_by_client(client_id)
        
        total_risk_amount = sum(float(t.get('amount', 0)) for t in risk_transactions)
        
        return {
            'riskFlags': risk_flags,
            'riskTransactions': risk_transactions,
            'utrEvents': utr_events,
            'kriMetrics': kri_metrics,
            'totalRiskAmount': total_risk_amount,
            'totalRiskCount': len(risk_transactions),
            'totalUTRFiled': len(utr_events)
        }
    
    # Portfolio Analysis Methods
    
    def get_relationship_portfolio_summary(self, relationship_id: str) -> Dict[str, Any]:
        """Get portfolio summary for relationship."""
        sql = """
        SELECT 
            COUNT(DISTINCT c.id) as client_count,
            COUNT(DISTINCT a.id) as total_accounts,
            COALESCE(SUM(c.portfolio_value), 0) as total_portfolio_value,
            COALESCE(SUM(a.balance), 0) as total_deposits,
            COALESCE(AVG(c.risk_score), 0) as avg_risk_score,
            COUNT(DISTINCT rf.id) as total_risk_flags,
            COUNT(DISTINCT o.id) as total_opportunities,
            COALESCE(SUM(o.value), 0) as total_opportunity_value
        FROM clients c
        LEFT JOIN accounts a ON c.id = a.client_id
        LEFT JOIN risk_flags rf ON c.id = rf.client_id AND rf.status = 'Active'
        LEFT JOIN opportunities o ON c.id = o.client_id AND o.status = 'Open'
        WHERE c.relationship_id = ?
        """
        result = self._query_one(sql, (relationship_id,))
        return result if result else {}
    
    def get_kri_metrics_by_client(self, client_id: str) -> List[Dict[str, Any]]:
        """Get KRI metrics by client."""
        return self._query('SELECT * FROM kri_metrics WHERE client_id = ? ORDER BY metric_date DESC', (client_id,))
    
    def get_transactions_by_account(self, account_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get transactions by account."""
        return self._query('SELECT * FROM transactions WHERE account_id = ? ORDER BY transaction_date DESC LIMIT ?', (account_id, limit))
    
    # Utility Methods
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics."""
        stats = {}
        
        # Count records in each main table
        tables = ['metros', 'markets', 'regions', 'relationship_managers', 'relationships', 
                 'clients', 'accounts', 'risk_flags', 'opportunities', 'utr_events', 'risk_transactions']
        
        for table in tables:
            result = self._query_one(f'SELECT COUNT(*) as count FROM {table}')
            stats[table] = result['count'] if result else 0
        
        return stats
    
    def close(self):
        """Close database connection."""
        if self._connection:
            self._connection.close()
            self._connection = None
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()

# Convenience functions for common operations
def get_client_data(client_id: str) -> Optional[Dict[str, Any]]:
    """Get complete client data (convenience function)."""
    with DatabaseQueries() as db:
        return db.get_client_by_id(client_id)

def get_relationship_data(relationship_id: str) -> Optional[Dict[str, Any]]:
    """Get complete relationship data (convenience function)."""
    with DatabaseQueries() as db:
        relationship = db.get_relationship_by_id(relationship_id)
        if relationship:
            relationship['clients'] = db.get_clients_by_relationship(relationship_id)
            relationship['summary'] = db.get_relationship_portfolio_summary(relationship_id)
        return relationship

def get_rm_data(rm_id: str) -> Optional[Dict[str, Any]]:
    """Get complete RM data (convenience function)."""
    with DatabaseQueries() as db:
        rms = db._query('SELECT * FROM relationship_managers WHERE id = ?', (rm_id,))
        if not rms:
            return None
        
        rm = rms[0]
        rm['relationships'] = db.get_relationships_by_rm(rm_id)
        return rm

if __name__ == "__main__":
    # Quick test
    with DatabaseQueries() as db:
        stats = db.get_database_stats()
        print("Database Statistics:")
        for table, count in stats.items():
            print(f"  {table}: {count}") 