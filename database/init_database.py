#!/usr/bin/env python3
"""
Banking 360 Mockup Database Initialization Script
Creates the SQLite database with schema and seed data.
"""

import sqlite3
import os
import sys
from pathlib import Path

def run_sql_file(db_path, sql_file):
    """Execute SQL commands from a file."""
    try:
        with sqlite3.connect(db_path) as conn:
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # Execute the SQL content
            conn.executescript(sql_content)
            conn.commit()
            print(f"✅ Successfully executed {sql_file}")
            
    except sqlite3.Error as e:
        print(f"❌ SQLite error executing {sql_file}: {e}")
        raise
    except FileNotFoundError:
        print(f"❌ File not found: {sql_file}")
        raise
    except Exception as e:
        print(f"❌ Error executing {sql_file}: {e}")
        raise

def init_database():
    """Initialize the database with schema and seed data."""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    db_path = script_dir / 'banking_360.db'
    schema_file = script_dir / 'schema.sql'
    seed_file = script_dir / 'seed_data.sql'
    
    # Check if database already exists
    if db_path.exists():
        print(f"Database already exists at {db_path}")
        print("Use reset_database.py to recreate the database.")
        return
    
    print("Creating new SQLite database...")
    print(f"Database path: {db_path}")
    
    try:
        # Create schema
        print("\n📋 Creating database schema...")
        run_sql_file(db_path, schema_file)
        
        # Insert seed data
        print("\n🌱 Inserting seed data...")
        run_sql_file(db_path, seed_file)
        
        # Verify database creation
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            
            # Check number of tables
            cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
            table_count = cursor.fetchone()[0]
            
            # Check some sample data
            cursor.execute("SELECT COUNT(*) FROM clients")
            client_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM relationship_managers")
            rm_count = cursor.fetchone()[0]
            
            print(f"\n📊 Database Statistics:")
            print(f"   - Tables created: {table_count}")
            print(f"   - Clients: {client_count}")
            print(f"   - Relationship Managers: {rm_count}")
        
        print(f"\n🎉 Database initialized successfully!")
        print(f"   Location: {db_path}")
        print(f"   Size: {db_path.stat().st_size / 1024:.1f} KB")
        
    except Exception as e:
        print(f"\n💥 Failed to initialize database: {e}")
        # Clean up partial database file if it exists
        if db_path.exists():
            db_path.unlink()
            print("   Cleaned up partial database file.")
        sys.exit(1)

if __name__ == "__main__":
    init_database() 