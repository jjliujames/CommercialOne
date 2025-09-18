#!/usr/bin/env python3
"""
Banking 360 Mockup Database Reset Script
Deletes the existing database and recreates it from scratch.
"""

import os
import sys
from pathlib import Path

def reset_database():
    """Reset the database by deleting and recreating it."""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    db_path = script_dir / 'banking_360.db'
    
    # Delete existing database if it exists
    if db_path.exists():
        try:
            db_path.unlink()
            print(f"✅ Existing database deleted: {db_path}")
        except OSError as e:
            print(f"❌ Error deleting database: {e}")
            sys.exit(1)
    else:
        print("ℹ️  No existing database found.")
    
    # Import and run initialization
    print("\n🔄 Recreating database...")
    try:
        from init_database import init_database
        init_database()
    except ImportError:
        print("❌ Could not import init_database module")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🗃️  Banking 360 Database Reset")
    print("=" * 40)
    
    # Ask for confirmation
    response = input("This will delete all existing data. Continue? (y/N): ").strip().lower()
    if response not in ['y', 'yes']:
        print("❌ Reset cancelled.")
        sys.exit(0)
    
    reset_database()
    print("\n🎉 Database reset completed successfully!") 