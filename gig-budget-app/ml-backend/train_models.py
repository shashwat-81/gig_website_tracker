import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import random
import json

# Update these values with the latest data for 2024-2025 India gig worker income
# Based on actual market research for gig economy in India
MONTHLY_INCOME_RANGES = {
    "delivery": {"min": 15000, "max": 25000},  # Food delivery, package delivery
    "rideshare": {"min": 18000, "max": 30000},  # Cab/auto drivers
    "freelance_tech": {"min": 30000, "max": 70000},  # IT, programming, design
    "content_creation": {"min": 10000, "max": 40000},  # Writing, social media
    "home_services": {"min": 12000, "max": 25000},  # Repairs, housekeeping
    "microtasks": {"min": 5000, "max": 15000},  # Small online tasks
}

def generate_realistic_gig_income(months=6, user_id=1):
    """Generate realistic gig worker income data for 2024-2025 India"""
    
    income_data = []
    
    # Select 2-3 income sources for this user
    available_sources = list(MONTHLY_INCOME_RANGES.keys())
    num_sources = random.randint(2, 3)
    user_sources = random.sample(available_sources, num_sources)
    
    # Define time period - last 6 months
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=30*months)
    
    # Generate monthly income with fluctuation
    current_date = start_date
    entry_id = 1
    
    while current_date <= end_date:
        month = current_date.month
        
        # Seasonal factors (festivals, holidays affect gig work)
        season_factor = 1.0
        if month in [10, 11, 12]:  # Festival season in India
            season_factor = 1.2
        elif month in [4, 5]:  # Summer months (may reduce some gig work)
            season_factor = 0.9
        
        # Each income source generates 3-8 payments per month
        for source in user_sources:
            num_payments = random.randint(3, 8)
            
            for _ in range(num_payments):
                source_range = MONTHLY_INCOME_RANGES[source]
                base_amount = random.uniform(source_range["min"]/num_payments, source_range["max"]/num_payments)
                # Apply seasonal variation and random fluctuation
                amount = base_amount * season_factor * random.uniform(0.8, 1.2)
                
                # Random day within the month
                day = random.randint(1, min(28, (end_date - current_date).days + 1))
                entry_date = current_date.replace(day=day)
                
                # Source name mapping
                source_names = {
                    "delivery": random.choice(["Swiggy Delivery", "Zomato Delivery", "Delhivery", "Amazon Delivery"]),
                    "rideshare": random.choice(["Ola Rides", "Uber Trips", "Rapido Rides"]),
                    "freelance_tech": random.choice(["Web Development", "App Design", "Software Project", "UI/UX Work"]),
                    "content_creation": random.choice(["Content Writing", "Social Media Management", "Video Editing"]),
                    "home_services": random.choice(["Urban Company", "Home Repairs", "Cleaning Service"]),
                    "microtasks": random.choice(["Survey Completion", "Data Entry", "Online Tasks"])
                }
                
                income_data.append({
                    "id": entry_id,
                    "user_id": user_id,
                    "source": source_names[source],
                    "category": source.replace("_", " ").title(),
                    "amount": round(amount, 2),
                    "date": entry_date.strftime('%Y-%m-%d'),
                    "description": f"Payment for {source_names[source]}"
                })
                entry_id += 1
        
        # Move to next month
        current_date = (current_date.replace(day=1) + timedelta(days=32)).replace(day=1)
    
    # Sort by date
    income_data.sort(key=lambda x: x["date"])
    
    return income_data

def generate_expenses(income_data, user_id=1):
    """Generate realistic expenses based on income data"""
    
    # Extract total income
    total_income = sum(item["amount"] for item in income_data)
    
    # Typical expense categories with percentage of income
    expense_categories = {
        "Housing": {"min": 0.25, "max": 0.35, "essential": True, "recurring": True},
        "Utilities": {"min": 0.05, "max": 0.08, "essential": True, "recurring": True},
        "Groceries": {"min": 0.10, "max": 0.15, "essential": True, "recurring": False},
        "Transportation": {"min": 0.05, "max": 0.10, "essential": True, "recurring": False},
        "Healthcare": {"min": 0.02, "max": 0.08, "essential": True, "recurring": False},
        "Entertainment": {"min": 0.03, "max": 0.08, "essential": False, "recurring": False},
        "Dining Out": {"min": 0.05, "max": 0.10, "essential": False, "recurring": False},
        "Shopping": {"min": 0.03, "max": 0.08, "essential": False, "recurring": False},
        "Education": {"min": 0.02, "max": 0.05, "essential": True, "recurring": False},
        "Savings": {"min": 0.05, "max": 0.10, "essential": True, "recurring": True}
    }
    
    # Payment methods
    payment_methods = ["UPI", "Credit Card", "Debit Card", "Cash", "Net Banking"]
    
    # Get date range from income data
    start_date = datetime.strptime(min(item["date"] for item in income_data), '%Y-%m-%d').date()
    end_date = datetime.strptime(max(item["date"] for item in income_data), '%Y-%m-%d').date()
    
    expense_data = []
    entry_id = 1
    
    # Generate monthly recurring expenses
    current_date = start_date
    recurring_expenses = {}
    
    # Initialize recurring expenses
    for category, props in expense_categories.items():
        if props["recurring"]:
            # Monthly fixed amount
            monthly_amount = total_income / ((end_date - start_date).days / 30) * random.uniform(props["min"], props["max"])
            recurring_expenses[category] = round(monthly_amount, 2)
    
    # Generate all expenses
    while current_date <= end_date:
        month_start = current_date.replace(day=1)
        days_in_month = 28 if current_date.month == 2 else 30
        month_end = current_date.replace(day=days_in_month)
        
        # Add recurring expenses for this month
        for category, amount in recurring_expenses.items():
            # Slight variation in recurring expenses
            actual_amount = amount * random.uniform(0.95, 1.05)
            
            expense_data.append({
                "id": entry_id,
                "user_id": user_id,
                "title": f"{category} expense",
                "amount": round(actual_amount, 2),
                "date": current_date.replace(day=random.randint(1, 10)).strftime('%Y-%m-%d'),
                "category": category,
                "paymentMethod": random.choice(payment_methods),
                "recurring": True,
                "description": f"Monthly {category.lower()}"
            })
            entry_id += 1
        
        # Add non-recurring expenses
        for category, props in expense_categories.items():
            if not props["recurring"]:
                # Number of transactions per month for this category
                num_transactions = random.randint(1, 5) if category != "Healthcare" else random.randint(0, 2)
                
                for _ in range(num_transactions):
                    # Expense amount based on percentage of monthly income
                    monthly_income = total_income / ((end_date - start_date).days / 30)
                    amount = monthly_income * random.uniform(props["min"], props["max"]) / num_transactions
                    
                    expense_date = current_date.replace(day=random.randint(1, days_in_month))
                    if expense_date <= end_date:
                        expense_data.append({
                            "id": entry_id,
                            "user_id": user_id,
                            "title": f"{category} expense",
                            "amount": round(amount, 2),
                            "date": expense_date.strftime('%Y-%m-%d'),
                            "category": category,
                            "paymentMethod": random.choice(payment_methods),
                            "recurring": False,
                            "description": f"Payment for {category.lower()}"
                        })
                        entry_id += 1
        
        # Move to next month
        current_date = (month_start + timedelta(days=32)).replace(day=1)
    
    # Sort by date
    expense_data.sort(key=lambda x: x["date"])
    
    return expense_data

def preprocess_financial_data(data):
    """Convert JSON data to pandas DataFrame and preprocess"""
    df = pd.DataFrame(data)
    
    # Handle dates
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df['day_of_week'] = df['date'].dt.dayofweek
        df['day_of_month'] = df['date'].dt.day
        df['month'] = df['date'].dt.month
    
    return df

def train_income_forecast_model(data):
    """Train a model to forecast future income based on historical data"""
    df = preprocess_financial_data(data)
    
    # Basic features
    features = df[['day_of_week', 'day_of_month', 'month']].values
    target = df['amount'].values
    
    # Train model
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(features, target)
    
    return model

def train_expense_analyzer(data):
    """Train a model to analyze expense patterns and identify areas for reduction"""
    df = preprocess_financial_data(data)
    
    # We'll use a simple clustering approach for expense categories
    if len(df) > 5:  # Need some minimum amount of data
        scaler = StandardScaler()
        # Assume we have amount and category information
        X = scaler.fit_transform(df[['amount']].values)
        
        # Create clusters of expenses
        model = KMeans(n_clusters=min(3, len(df)), random_state=42)
        model.fit(X)
        return model
    return None

def save_data_and_train_models():
    """Generate test data, train models, and save everything to disk"""
    # Generate for 3 test users
    for user_id in range(1, 4):
        print(f"Generating data for user {user_id}...")
        
        # Generate income and expense data
        income_data = generate_realistic_gig_income(months=6, user_id=user_id)
        expense_data = generate_expenses(income_data, user_id=user_id)
        
        # Save raw data
        os.makedirs("data", exist_ok=True)
        with open(f"data/user_{user_id}_data.json", 'w') as f:
            json.dump({
                "incomeData": income_data,
                "expenseData": expense_data
            }, f, indent=2)
        
        print(f"  Generated {len(income_data)} income entries and {len(expense_data)} expense entries.")
        
        # Train models
        income_model = train_income_forecast_model(income_data)
        expense_model = train_expense_analyzer(expense_data)
        
        # Save models for each user
        os.makedirs("models", exist_ok=True)
        joblib.dump(income_model, f"models/income_forecaster_user_{user_id}.joblib")
        if expense_model is not None:
            joblib.dump(expense_model, f"models/expense_analyzer_user_{user_id}.joblib")
        
        print(f"  Trained and saved models for user {user_id}")
    
    # Also save generic models for demo purposes
    income_model = train_income_forecast_model(income_data)  # Using last user's data
    expense_model = train_expense_analyzer(expense_data)
    
    joblib.dump(income_model, "models/income_forecaster.joblib")
    if expense_model is not None:
        joblib.dump(expense_model, "models/expense_analyzer.joblib")
    
    print("Generated all data and trained all models successfully!")

if __name__ == "__main__":
    save_data_and_train_models() 