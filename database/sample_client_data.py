#!/usr/bin/env python3
"""
Sample script showing how to get client data in mockData.js format
Returns client_001 data exactly as the frontend expects it.
"""

import json
from queries import get_client_data

def get_client_mockdata_format(client_id):
    """
    Get client data in the exact format that mockData.js provides.
    This matches what ClientDetailView expects.
    """
    # Get client data from database
    client = get_client_data(client_id)
    
    if not client:
        return None
    
    # The database already returns data in mockData.js format
    # No transformation needed - just return as-is
    return client

def format_for_json_response(client_data):
    """
    Format client data for JSON API response.
    Handles any data type conversions needed for JSON serialization.
    """
    if not client_data:
        return None
    
    # Convert any Decimal/float values to regular numbers for JSON
    def convert_values(obj):
        if isinstance(obj, dict):
            return {key: convert_values(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [convert_values(item) for item in obj]
        elif hasattr(obj, '__float__'):  # Handle Decimal types
            return float(obj)
        else:
            return obj
    
    return convert_values(client_data)

# Sample usage
if __name__ == "__main__":
    print("🏦 Banking 360 - Client Data Sample")
    print("=" * 40)
    
    # Get client_001 data
    client_id = "client_001"
    client_data = get_client_mockdata_format(client_id)
    
    if client_data:
        print(f"✅ Found client: {client_data['name']}")
        print(f"   Industry: {client_data['industry']}")
        print(f"   Portfolio Value: ${client_data['portfolio_value']:,}")
        print(f"   Risk Score: {client_data['risk_score']}")
        print(f"   Accounts: {len(client_data['accounts'])}")
        print(f"   Beneficial Owners: {len(client_data['beneficialOwners'])}")
        print(f"   Authorized Signers: {len(client_data['authorizedSigners'])}")
        print(f"   Risk Flags: {len(client_data['riskFlags'])}")
        print(f"   Opportunities: {len(client_data['opportunities'])}")
        
        print("\n📋 Sample Account Data:")
        for account in client_data['accounts'][:2]:  # Show first 2 accounts
            print(f"   - {account['account_type']}: ${account['balance']:,}")
        
        print("\n🚩 Sample Risk Flags:")
        for flag in client_data['riskFlags'][:2]:  # Show first 2 risk flags
            print(f"   - {flag['category']}: {flag['description']}")
        
        print("\n💼 Sample Opportunities:")
        for opp in client_data['opportunities'][:2]:  # Show first 2 opportunities
            print(f"   - {opp['type']}: ${opp['value']:,}")
        
        # Show JSON format (for API responses)
        print("\n🔧 JSON Format Sample (first 500 chars):")
        json_data = format_for_json_response(client_data)
        json_str = json.dumps(json_data, indent=2, default=str)
        print(json_str[:500] + "..." if len(json_str) > 500 else json_str)
        
    else:
        print(f"❌ Client {client_id} not found")

# For Flask/FastAPI integration
def create_flask_endpoint():
    """
    Sample Flask endpoint that returns client data.
    """
    from flask import Flask, jsonify
    
    app = Flask(__name__)
    
    @app.route('/api/client/<client_id>')
    def get_client(client_id):
        client_data = get_client_mockdata_format(client_id)
        if client_data:
            return jsonify(format_for_json_response(client_data))
        else:
            return jsonify({'error': 'Client not found'}), 404
    
    return app

def create_fastapi_endpoint():
    """
    Sample FastAPI endpoint that returns client data.
    """
    from fastapi import FastAPI, HTTPException
    
    app = FastAPI()
    
    @app.get("/api/client/{client_id}")
    async def get_client(client_id: str):
        client_data = get_client_mockdata_format(client_id)
        if client_data:
            return format_for_json_response(client_data)
        else:
            raise HTTPException(status_code=404, detail="Client not found")
    
    return app 