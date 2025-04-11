import json
import random
import datetime
import numpy as np
import os

def generate_income_data(num_entries=50, months=3):
    """Generate synthetic income data for testing"""
    income_data = []
    
    # Define possible income sources and their parameters
    income_sources = [
        {"name": "Freelance Web Development", "min": 10000, "max": 50000, "frequency": 0.2},
        {"name": "Content Writing", "min": 5000, "max": 15000, "frequency": 0.3},
        {"name": "Graphic Design", "min": 8000, "max": 25000, "frequency": 0.15},
        {"name": "App Development", "min": 15000, "max": 60000, "frequency": 0.1},
        {"name": "Online Teaching", "min": 3000, "max": 12000, "frequency": 0.25},
    ]
    
    # Define time period
    end_date = datetime.datetime.now().date()
    start_date = end_date - datetime.timedelta(days=30*months)
    date_range = (end_date - start_date).days
    
    # Generate random income entries
    for i in range(num_entries):
        # Select random source
        source = random.choice(income_sources)
        
        # Generate random amount within source range
        amount = random.uniform(source["min"], source["max"])
        
        # Generate random date within the range
        days_offset = random.randint(0, date_range)
        entry_date = (start_date + datetime.timedelta(days=days_offset)).strftime('%Y-%m-%d')
        
        # Create entry
        income_data.append({
            "id": i + 1,
            "source": source["name"],
            "amount": round(amount, 2),
            "date": entry_date,
            "category": "Freelance" if "Freelance" in source["name"] else "Contract Work" if random.random() > 0.5 else "Gig Work",
            "description": f"Payment for {source['name']} project"
        })
    
    # Sort by date
    income_data.sort(key=lambda x: x["date"])
    
    return income_data

def generate_expense_data(num_entries=80, months=3):
    """Generate synthetic expense data for testing"""
    expense_data = []
    
    # Define expense categories and their parameters
    expense_categories = [
        {"name": "Housing", "min": 15000, "max": 25000, "frequency": 0.1, "essential": True},
        {"name": "Utilities", "min": 2000, "max": 5000, "frequency": 0.15, "essential": True},
        {"name": "Groceries", "min": 3000, "max": 8000, "frequency": 0.2, "essential": True},
        {"name": "Transportation", "min": 2000, "max": 6000, "frequency": 0.15, "essential": True},
        {"name": "Healthcare", "min": 1000, "max": 10000, "frequency": 0.05, "essential": True},
        {"name": "Entertainment", "min": 1000, "max": 5000, "frequency": 0.1, "essential": False},
        {"name": "Dining Out", "min": 500, "max": 3000, "frequency": 0.12, "essential": False},
        {"name": "Shopping", "min": 1000, "max": 8000, "frequency": 0.08, "essential": False},
        {"name": "Travel", "min": 5000, "max": 20000, "frequency": 0.02, "essential": False},
        {"name": "Education", "min": 2000, "max": 15000, "frequency": 0.03, "essential": True},
    ]
    
    # Define payment methods
    payment_methods = ["Credit Card", "Debit Card", "UPI", "Cash", "Net Banking"]
    
    # Define time period
    end_date = datetime.datetime.now().date()
    start_date = end_date - datetime.timedelta(days=30*months)
    date_range = (end_date - start_date).days
    
    # Generate random expense entries
    for i in range(num_entries):
        # Select random category
        category = random.choice(expense_categories)
        
        # Generate random amount within category range
        amount = random.uniform(category["min"], category["max"])
        
        # Generate random date within the range
        days_offset = random.randint(0, date_range)
        entry_date = (start_date + datetime.timedelta(days=days_offset)).strftime('%Y-%m-%d')
        
        # Create entry
        expense_data.append({
            "id": i + 1,
            "title": f"{category['name']} expense",
            "amount": round(amount, 2),
            "date": entry_date,
            "category": category["name"],
            "paymentMethod": random.choice(payment_methods),
            "recurring": category["essential"] and random.random() > 0.7,  # More likely to be recurring if essential
            "description": f"Payment for {category['name'].lower()}"
        })
    
    # Sort by date
    expense_data.sort(key=lambda x: x["date"])
    
    return expense_data

def save_data(income_data, expense_data, filename="test_data.json"):
    """Save generated data to JSON file"""
    combined_data = {
        "incomeData": income_data,
        "expenseData": expense_data
    }
    
    os.makedirs("data", exist_ok=True)
    filepath = os.path.join("data", filename)
    
    with open(filepath, 'w') as f:
        json.dump(combined_data, f, indent=2)
    
    print(f"Sample data saved to {filepath}")
    return filepath

if __name__ == "__main__":
    # Generate data
    income_data = generate_income_data()
    expense_data = generate_expense_data()
    
    # Save to file
    filepath = save_data(income_data, expense_data)
    
    # Print sample
    print(f"\nGenerated {len(income_data)} income entries and {len(expense_data)} expense entries.")
    print("\nSample income entry:")
    print(json.dumps(income_data[0], indent=2))
    
    print("\nSample expense entry:")
    print(json.dumps(expense_data[0], indent=2)) 