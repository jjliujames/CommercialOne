from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import sqlite3
import json
from datetime import datetime, timedelta
import random
from pathlib import Path

app = FastAPI(title="Client 360 API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database path
DB_PATH = Path(__file__).parent / "database.db"

def get_db_connection():
    """Create a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def dict_from_row(row):
    """Convert sqlite3.Row to dictionary"""
    if row is None:
        return None
    return dict(zip(row.keys(), row))

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/clients/{client_id}")
def get_client(client_id: str):
    """Get complete client details"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get basic client info
    cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
    client = dict_from_row(cursor.fetchone())
    
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Parse JSON fields
    if client.get('beneficial_owners'):
        client['beneficialOwners'] = json.loads(client['beneficial_owners'])
        del client['beneficial_owners']
    
    if client.get('authorized_signers'):
        client['authorizedSigners'] = json.loads(client['authorized_signers'])
        del client['authorized_signers']
    
    if client.get('conductors'):
        client['conductors'] = json.loads(client['conductors'])
        del client['conductors']
    
    if client.get('related_entities'):
        client['relatedEntities'] = json.loads(client['related_entities'])
        del client['related_entities']
    
    if client.get('risk_flags'):
        client['riskFlags'] = json.loads(client['risk_flags'])
        del client['risk_flags']
    
    if client.get('product_summary'):
        client['productSummary'] = json.loads(client['product_summary'])
        del client['product_summary']
    
    if client.get('product_holdings'):
        client['productHoldings'] = json.loads(client['product_holdings'])
        del client['product_holdings']
    
    if client.get('rankings'):
        client['rankings'] = json.loads(client['rankings'])
        del client['rankings']
    
    if client.get('key_insights'):
        client['keyInsights'] = json.loads(client['key_insights'])
        del client['key_insights']
    
    # Convert snake_case to camelCase for remaining fields
    camel_case_client = {}
    for key, value in client.items():
        # Convert snake_case to camelCase
        camel_key = ''.join(word.capitalize() if i > 0 else word 
                           for i, word in enumerate(key.split('_')))
        camel_case_client[camel_key] = value
    
    conn.close()
    return camel_case_client

@app.get("/api/clients/{client_id}/accounts")
def get_client_accounts(client_id: str):
    """Generate client accounts dynamically based on portfolio value"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get client portfolio value
    cursor.execute("SELECT portfolio_value, name FROM clients WHERE id = ?", (client_id,))
    client = dict_from_row(cursor.fetchone())
    conn.close()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    portfolio_value = client['portfolio_value']
    client_name = client['name']
    
    # Determine number of accounts based on portfolio value
    if portfolio_value >= 100000000:
        num_accounts = random.randint(6, 13)
    elif portfolio_value >= 50000000:
        num_accounts = random.randint(4, 9)
    elif portfolio_value >= 10000000:
        num_accounts = random.randint(3, 6)
    else:
        num_accounts = random.randint(2, 4)
    
    # Account types with balance distribution
    account_types = [
        {"type": "Business Checking", "prefix": "CHK", "balance_pct": 0.15},
        {"type": "Business Savings", "prefix": "SAV", "balance_pct": 0.25},
        {"type": "Money Market", "prefix": "MM", "balance_pct": 0.30},
        {"type": "Investment Account", "prefix": "INV", "balance_pct": 0.20},
        {"type": "Credit Line", "prefix": "LOC", "balance_pct": 0.10}
    ]
    
    accounts = []
    for i in range(min(num_accounts, len(account_types))):
        account_type = account_types[i]
        base_balance = portfolio_value * account_type["balance_pct"]
        balance = base_balance + (random.random() - 0.5) * base_balance * 0.3
        balance = max(0, balance)
        
        account = {
            "id": f"acc_{i + 1}",
            "name": f"{account_type['type']} - {client_name}",
            "type": account_type["type"],
            "number": f"{account_type['prefix']}{random.randint(100000, 999999)}",
            "balance": round(balance, 2),
            "availableBalance": round(balance * (0.8 + random.random() * 0.2), 2),
            "monthlyVolume": round(balance * (0.1 + random.random() * 0.3), 2),
            "monthlyInflows": round(balance * (0.05 + random.random() * 0.15), 2),
            "monthlyOutflows": round(balance * (0.03 + random.random() * 0.12), 2),
            "inflowCount": random.randint(10, 40),
            "outflowCount": random.randint(8, 33),
            "lastTransaction": (datetime.now() - timedelta(days=random.randint(0, 7))).isoformat(),
            "riskLevel": random.choice(["Low", "Low", "Medium", "High"]),
            "riskScore": random.randint(30, 70),
            "recentTransactions": [],
            "riskFactors": []
        }
        accounts.append(account)
    
    return accounts

@app.get("/api/clients/{client_id}/transactions")
def get_client_transactions(
    client_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    transaction_type: Optional[str] = None,
    page: int = 1,
    per_page: int = 50
):
    """Generate mock transactions for a client"""
    
    # Transaction types and descriptions
    transaction_types = {
        "deposit": [
            "Customer Payment - Invoice #",
            "Wire Transfer - ",
            "Mobile Deposit - Check #",
            "ACH Credit - "
        ],
        "withdrawal": [
            "Vendor Payment - ",
            "Payroll Processing",
            "Tax Payment - ",
            "Utility Payment - "
        ],
        "wire": [
            "International Wire - ",
            "Domestic Wire Transfer - ",
            "SWIFT Transfer - "
        ],
        "ach": [
            "ACH Debit - ",
            "ACH Credit - ",
            "Direct Deposit - "
        ],
        "check": [
            "Check Payment #",
            "Cashier's Check - ",
            "Electronic Check - "
        ]
    }
    
    accounts = [
        "Checking - ****1234",
        "Savings - ****5678",
        "Money Market - ****9012"
    ]
    
    statuses = ["Completed", "Pending", "Processed", "Cleared"]
    risk_flags = ["High Cash", "Crypto Activity", "Cross-Border", "MSB Related", "Geographic Risk"]
    
    # Generate 300 transactions for the last 90 days
    transactions = []
    for i in range(300):
        tx_type = random.choice(list(transaction_types.keys()))
        descriptions = transaction_types[tx_type]
        
        is_inflow = tx_type == "deposit" or (tx_type in ["ach", "wire"] and random.random() > 0.3)
        amount = random.randint(1000, 50000) if is_inflow else -random.randint(500, 30000)
        
        date = datetime.now() - timedelta(days=random.randint(0, 90))
        
        # Assign risk flag to ~25% of transactions
        risk_flag = random.choice(risk_flags) if random.random() < 0.25 else None
        
        transaction = {
            "id": f"txn-{i + 1}",
            "date": date.strftime("%Y-%m-%d"),
            "type": tx_type.capitalize(),
            "description": f"{random.choice(descriptions)}{random.randint(10000, 99999)}",
            "account": random.choice(accounts),
            "amount": amount,
            "status": random.choice(statuses),
            "riskFlag": risk_flag
        }
        transactions.append(transaction)
    
    # Sort by date descending
    transactions.sort(key=lambda x: x["date"], reverse=True)
    
    # Apply filters if provided
    if start_date:
        transactions = [t for t in transactions if t["date"] >= start_date]
    if end_date:
        transactions = [t for t in transactions if t["date"] <= end_date]
    if transaction_type:
        transactions = [t for t in transactions if t["type"].lower() == transaction_type.lower()]
    
    # Pagination
    total = len(transactions)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "transactions": transactions[start:end],
        "total": total,
        "page": page,
        "perPage": per_page,
        "totalPages": (total + per_page - 1) // per_page
    }

@app.get("/api/relationship-managers/{rm_id}")
def get_relationship_manager(rm_id: str):
    """Get relationship manager details"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM relationship_managers WHERE id = ?", (rm_id,))
    rm = dict_from_row(cursor.fetchone())
    conn.close()
    
    if not rm:
        raise HTTPException(status_code=404, detail="Relationship Manager not found")
    
    return rm

@app.get("/api/breadcrumb/{metro_id}/{market_id}/{region_id}/{rm_id}/{relationship_id}")
def get_breadcrumb_data(
    metro_id: str,
    market_id: str, 
    region_id: str,
    rm_id: str,
    relationship_id: str
):
    """Get breadcrumb navigation data"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get metro
    cursor.execute("SELECT name FROM metros WHERE id = ?", (metro_id,))
    metro = dict_from_row(cursor.fetchone())
    
    # Get market
    cursor.execute("SELECT name FROM markets WHERE id = ?", (market_id,))
    market = dict_from_row(cursor.fetchone())
    
    # Get region
    cursor.execute("SELECT name FROM regions WHERE id = ?", (region_id,))
    region = dict_from_row(cursor.fetchone())
    
    # Get RM
    cursor.execute("SELECT name FROM relationship_managers WHERE id = ?", (rm_id,))
    rm = dict_from_row(cursor.fetchone())
    
    # Get relationship
    cursor.execute("SELECT name FROM relationships WHERE id = ?", (relationship_id,))
    relationship = dict_from_row(cursor.fetchone())
    
    conn.close()
    
    breadcrumb = {
        "metro": metro["name"] if metro else "Metro",
        "market": market["name"] if market else "Market",
        "region": region["name"] if region else "Region",
        "rm": rm["name"] if rm else "RM",
        "relationship": relationship["name"] if relationship else "Relationship"
    }
    
    return breadcrumb

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)