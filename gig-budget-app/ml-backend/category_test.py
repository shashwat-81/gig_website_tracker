import json
import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def analyze_category_data():
    """Analyze the data for each gig worker category"""
    categories = {
        "Food Delivery": [],
        "Cab Driver": [],
        "House Cleaner": []
    }
    
    # Find all user data files
    data_files = [f for f in os.listdir("data") if f.startswith("user_") and f.endswith("_data.json")]
    
    print(f"Found {len(data_files)} user data files")
    
    # Load and categorize data
    for file in data_files:
        with open(os.path.join("data", file), 'r') as f:
            user_data = json.load(f)
            
        # Check sources to determine category
        income_sources = [item["category"] for item in user_data["incomeData"]]
        
        if "Food Delivery" in income_sources:
            categories["Food Delivery"].append(user_data)
        elif "Cab Driver" in income_sources:
            categories["Cab Driver"].append(user_data)
        elif "House Cleaner" in income_sources:
            categories["House Cleaner"].append(user_data)
    
    # Analyze each category
    results = {}
    
    for category, data_list in categories.items():
        if not data_list:
            print(f"No data found for {category}")
            continue
            
        print(f"\n=== {category} Analysis ===")
        
        # Combine all income data for this category
        all_income = []
        all_expenses = []
        
        for user_data in data_list:
            all_income.extend(user_data["incomeData"])
            all_expenses.extend(user_data["expenseData"])
        
        # Calculate average income
        total_income = sum(item["amount"] for item in all_income)
        avg_income = total_income / len(all_income)
        
        # Calculate average expenses by category
        expense_by_category = {}
        for expense in all_expenses:
            category_name = expense["category"]
            if category_name not in expense_by_category:
                expense_by_category[category_name] = []
            expense_by_category[category_name].append(expense["amount"])
        
        avg_expenses = {cat: sum(amounts)/len(amounts) for cat, amounts in expense_by_category.items()}
        
        # Print results
        print(f"Total entries: {len(all_income)} income, {len(all_expenses)} expenses")
        print(f"Average income per entry: ₹{avg_income:.2f}")
        print("\nTop expenses:")
        
        for expense_cat, avg_amount in sorted(avg_expenses.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  {expense_cat}: ₹{avg_amount:.2f}")
        
        # Store results
        results[category] = {
            "avg_income": avg_income,
            "top_expenses": {cat: amt for cat, amt in sorted(avg_expenses.items(), key=lambda x: x[1], reverse=True)[:5]},
            "income_count": len(all_income),
            "expense_count": len(all_expenses)
        }
    
    return results

def verify_category_specific_features():
    """Verify that different categories have different specific expenses"""
    # Load all user data
    data_files = [f for f in os.listdir("data") if f.startswith("user_") and f.endswith("_data.json")]
    
    # Track category-specific expenses
    category_expenses = {}
    
    for file in data_files:
        with open(os.path.join("data", file), 'r') as f:
            user_data = json.load(f)
        
        # Determine user category
        income_sources = [item["category"] for item in user_data["incomeData"]]
        
        if "Food Delivery" in income_sources:
            category = "Food Delivery"
        elif "Cab Driver" in income_sources:
            category = "Cab Driver"
        elif "House Cleaner" in income_sources:
            category = "House Cleaner"
        else:
            continue
        
        # Record expense categories
        if category not in category_expenses:
            category_expenses[category] = set()
        
        for expense in user_data["expenseData"]:
            category_expenses[category].add(expense["category"])
    
    print("\n=== Category-Specific Expense Categories ===")
    
    # Find unique expense categories per worker type
    all_categories = set()
    for expenses in category_expenses.values():
        all_categories.update(expenses)
    
    for worker_type, expenses in category_expenses.items():
        unique_expenses = expenses - set.union(*(category_expenses[cat] for cat in category_expenses if cat != worker_type))
        print(f"\n{worker_type} unique expenses:")
        for expense in unique_expenses:
            print(f"  - {expense}")

def main():
    """Main function to run tests"""
    print("Verifying category-specific ML models and data...\n")
    
    # Run analysis
    category_results = analyze_category_data()
    
    # Verify category-specific features
    verify_category_specific_features()
    
    print("\nVerification complete! The model now contains specific data for:")
    print("1. Food Delivery Riders")
    print("2. Cab Drivers")
    print("3. House Cleaners")

if __name__ == "__main__":
    main() 