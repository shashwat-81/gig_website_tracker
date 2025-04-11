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
import shutil

# Update these values to focus on the three specific categories
# Based on actual market research for gig economy in India for 2024-2025
MONTHLY_INCOME_RANGES = {
    "food_delivery": {"min": 15000, "max": 25000},  # Swiggy, Zomato, etc.
    "cab_driver": {"min": 18000, "max": 32000},     # Ola, Uber, etc.
    "house_cleaner": {"min": 12000, "max": 22000},  # Urban Company, etc.
}

# User personality types with corresponding financial behaviors
USER_PERSONALITIES = [
    {
        "name": "Saver",
        "income_boost": 0.8,  # Works less than average
        "expense_reduction": 0.7,  # Spends less than average
        "savings_boost": 1.4,  # Saves more than average
        "description": "Frugal, minimizes expenses, prioritizes saving"
    },
    {
        "name": "Balanced",
        "income_boost": 1.0,  # Average income
        "expense_reduction": 1.0,  # Average expenses
        "savings_boost": 1.0,  # Average savings
        "description": "Maintains a healthy balance between income, expenses, and savings"
    },
    {
        "name": "Spender",
        "income_boost": 1.1,  # Works more than average
        "expense_reduction": 1.3,  # Spends more than average
        "savings_boost": 0.7,  # Saves less than average
        "description": "Works hard, enjoys spending, prioritizes lifestyle"
    },
    {
        "name": "Hustler",
        "income_boost": 1.3,  # Works significantly more than average
        "expense_reduction": 1.1,  # Spends a bit more than average
        "savings_boost": 1.2,  # Saves more than average
        "description": "Maximum work hours, high income, investing-oriented"
    },
    {
        "name": "Struggler",
        "income_boost": 0.7,  # Limited income opportunities
        "expense_reduction": 1.1,  # Slightly higher expenses due to inefficiencies
        "savings_boost": 0.5,  # Struggles to save
        "description": "Facing challenges, irregular income, difficulty saving"
    }
]

def get_user_personality(user_id):
    """Assign a consistent personality type to a specific user"""
    # Use the user_id to deterministically select a personality
    # This ensures the same user always gets the same personality
    personality_index = (user_id * 1237) % len(USER_PERSONALITIES)  # Prime number for good distribution
    return USER_PERSONALITIES[personality_index]

def get_user_specific_preferences(user_id, category):
    """Generate user-specific preferences that affect their financial patterns"""
    # Seed the random generator with user_id to ensure consistency
    random.seed(user_id)
    
    # User personality affects their broader financial patterns
    personality = get_user_personality(user_id)
    
    # User-specific preferences
    preferences = {
        "work_hours_per_week": random.randint(20, 60),  # Hours user works per week
        "preferred_areas": random.sample(["South Mumbai", "Andheri", "Bandra", "Powai", "Thane"], k=random.randint(1, 3)),
        "peak_hours_preference": random.choice([True, False]),  # Whether user prefers to work during peak hours
        "weekend_preference": random.choice([True, False]),  # Whether user prefers weekend work
        "spending_categories": {},  # Will be filled with category-specific spending preferences
        "saving_goal": random.randint(5000, 50000),  # Monthly saving goal
        "personality": personality
    }
    
    # Category-specific preferences
    if "food_delivery" in category:
        preferences["vehicle_type"] = random.choice(["Motorcycle", "Bicycle", "Scooter"])
        preferences["platform_preference"] = random.choice(["Swiggy", "Zomato", "Both"])
        preferences["fuel_efficiency"] = random.uniform(25, 45)  # km/l
        
        # Spending patterns for food delivery workers
        preferences["spending_categories"] = {
            "Fuel": random.uniform(0.08, 0.15),
            "Vehicle Maintenance": random.uniform(0.05, 0.10),
            "Mobile Data": random.uniform(0.02, 0.05),
            "Food": random.uniform(0.15, 0.25),
            "Housing": random.uniform(0.20, 0.35)
        }
    
    elif "cab_driver" in category:
        preferences["vehicle_type"] = random.choice(["Hatchback", "Sedan", "SUV"])
        preferences["platform_preference"] = random.choice(["Ola", "Uber", "Both"])
        preferences["fuel_efficiency"] = random.uniform(12, 25)  # km/l
        
        # Spending patterns for cab drivers
        preferences["spending_categories"] = {
            "Fuel": random.uniform(0.10, 0.20),
            "Vehicle Maintenance": random.uniform(0.08, 0.15),
            "Vehicle Loan": random.uniform(0.10, 0.20),
            "Food": random.uniform(0.10, 0.20),
            "Housing": random.uniform(0.20, 0.30)
        }
    
    elif "house_cleaner" in category:
        preferences["specialization"] = random.choice(["General Cleaning", "Deep Cleaning", "Both"])
        preferences["platform_preference"] = random.choice(["Urban Company", "Direct Clients", "Both"])
        preferences["cleaning_supplies_quality"] = random.choice(["Basic", "Premium"])
        
        # Spending patterns for house cleaners
        preferences["spending_categories"] = {
            "Transportation": random.uniform(0.10, 0.18),
            "Cleaning Supplies": random.uniform(0.03, 0.08),
            "Food": random.uniform(0.15, 0.25),
            "Housing": random.uniform(0.25, 0.35)
        }
    
    # Adjust preferences based on personality
    for category in preferences["spending_categories"]:
        preferences["spending_categories"][category] *= personality["expense_reduction"]
    
    # Reset random seed after generating preferences
    random.seed()
    
    return preferences

def generate_realistic_gig_income(months=6, user_id=1):
    """Generate realistic gig worker income data for 2024-2025 India with user-specific patterns"""
    
    income_data = []
    
    # Select 1-2 income sources for this user (some gig workers do multiple jobs)
    available_sources = list(MONTHLY_INCOME_RANGES.keys())
    num_sources = random.randint(1, 2)
    user_sources = random.sample(available_sources, num_sources)
    
    # Get user-specific preferences for each source
    user_preferences = {}
    for source in user_sources:
        user_preferences[source] = get_user_specific_preferences(user_id, source)
    
    # Get user personality
    personality = get_user_personality(user_id)
    income_boost = personality["income_boost"]
    
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
        
        # Weather factor for different job types
        weather_factor = {
            "food_delivery": 0.8 if month in [6, 7, 8] else 1.1,  # Rainy season affects delivery
            "cab_driver": 1.2 if month in [6, 7, 8] else 1.0,     # Rainy season increases cab demand
            "house_cleaner": 1.0  # Less affected by weather
        }
        
        # Weekend and weekday distribution based on user preference
        weekend_boost = {}
        for source in user_sources:
            prefs = user_preferences[source]
            weekend_boost[source] = 1.3 if prefs["weekend_preference"] else 0.9
        
        # Each income source generates 3-8 payments per month
        for source in user_sources:
            prefs = user_preferences[source]
            
            # Adjust number of payments based on work hours
            base_payments = int(prefs["work_hours_per_week"] / 10)  # More hours = more payments
            num_payments = max(3, min(15, base_payments + random.randint(-2, 2)))
            
            # Average payment amount based on user's efficiency
            source_range = MONTHLY_INCOME_RANGES[source]
            avg_payment = (source_range["min"] + source_range["max"]) / 2 / 5  # Average per payment
            
            for _ in range(num_payments):
                # Base amount adjusted by user's personality (income_boost)
                base_amount = avg_payment * income_boost
                
                # Apply seasonal, weather, and peak hour variations
                peak_hour_factor = 1.2 if prefs["peak_hours_preference"] else 1.0
                amount = base_amount * season_factor * weather_factor[source] * peak_hour_factor * random.uniform(0.8, 1.2)
                
                # Random day within the month
                day = random.randint(1, min(28, (end_date - current_date).days + 1))
                entry_date = current_date.replace(day=day)
                
                # Is it a weekend?
                is_weekend = entry_date.weekday() >= 5
                if is_weekend:
                    amount *= weekend_boost[source]
                
                # Source name mapping with user preferences included
                if source == "food_delivery":
                    if prefs["platform_preference"] == "Swiggy":
                        source_name = "Swiggy Delivery"
                    elif prefs["platform_preference"] == "Zomato":
                        source_name = "Zomato Delivery"
                    else:
                        source_name = random.choice(["Swiggy Delivery", "Zomato Delivery", "Blinkit Delivery"])
                elif source == "cab_driver":
                    if prefs["platform_preference"] == "Ola":
                        source_name = "Ola Rides"
                    elif prefs["platform_preference"] == "Uber":
                        source_name = "Uber Trips"
                    else:
                        source_name = random.choice(["Ola Rides", "Uber Trips", "Rapido Rides"])
                elif source == "house_cleaner":
                    if prefs["platform_preference"] == "Urban Company":
                        source_name = "Urban Company Cleaning"
                    elif prefs["platform_preference"] == "Direct Clients":
                        source_name = "Home Cleaning Service"
                    else:
                        source_name = random.choice(["Urban Company Cleaning", "Home Cleaning Service", "Household Maintenance"])
                
                income_data.append({
                    "id": entry_id,
                    "user_id": user_id,
                    "source": source_name,
                    "category": source.replace("_", " ").title(),
                    "amount": round(amount, 2),
                    "date": entry_date.strftime('%Y-%m-%d'),
                    "description": f"Payment for {source_name}" + (" (Weekend)" if is_weekend else "")
                })
                entry_id += 1
        
        # Move to next month
        current_date = (current_date.replace(day=1) + timedelta(days=32)).replace(day=1)
    
    # Sort by date
    income_data.sort(key=lambda x: x["date"])
    
    return income_data

def generate_expenses(income_data, user_id=1):
    """Generate user-specific expenses based on income data and personality"""
    
    # Extract total income
    total_income = sum(item["amount"] for item in income_data)
    
    # Different expense patterns based on job category
    source_categories = set([item["category"] for item in income_data])
    
    # Get category from source_categories
    category = next(iter(source_categories)).lower().replace(" ", "_") if source_categories else "food_delivery"
    
    # Get user preferences
    user_preferences = get_user_specific_preferences(user_id, category)
    personality = user_preferences["personality"]
    expense_modifier = personality["expense_reduction"]
    
    # Base expense categories with percentage of income
    expense_categories = {
        "Housing": {"min": 0.25 * expense_modifier, "max": 0.35 * expense_modifier, "essential": True, "recurring": True},
        "Utilities": {"min": 0.05 * expense_modifier, "max": 0.08 * expense_modifier, "essential": True, "recurring": True},
        "Groceries": {"min": 0.10 * expense_modifier, "max": 0.15 * expense_modifier, "essential": True, "recurring": False},
        "Transportation": {"min": 0.05 * expense_modifier, "max": 0.10 * expense_modifier, "essential": True, "recurring": False},
        "Healthcare": {"min": 0.02 * expense_modifier, "max": 0.08 * expense_modifier, "essential": True, "recurring": False},
        "Entertainment": {"min": 0.03 * expense_modifier, "max": 0.08 * expense_modifier, "essential": False, "recurring": False},
        "Dining Out": {"min": 0.05 * expense_modifier, "max": 0.10 * expense_modifier, "essential": False, "recurring": False},
        "Shopping": {"min": 0.03 * expense_modifier, "max": 0.08 * expense_modifier, "essential": False, "recurring": False},
        "Education": {"min": 0.02 * expense_modifier, "max": 0.05 * expense_modifier, "essential": True, "recurring": False},
    }
    
    # Add savings based on personality's savings_boost
    savings_rate = 0.05 * personality["savings_boost"]
    expense_categories["Savings"] = {"min": savings_rate, "max": savings_rate * 1.5, "essential": True, "recurring": True}
    
    # Adjust expense patterns based on job category
    if "Food Delivery" in source_categories:
        vehicle_maintenance = 0.05 * expense_modifier
        fuel_rate = 0.08 * expense_modifier
        
        # Apply user-specific vehicle parameters
        if "vehicle_type" in user_preferences and user_preferences["vehicle_type"] == "Motorcycle":
            fuel_rate *= 1.2  # More fuel consumption
            vehicle_maintenance *= 1.1  # More maintenance
        elif "vehicle_type" in user_preferences and user_preferences["vehicle_type"] == "Bicycle":
            fuel_rate = 0  # No fuel
            vehicle_maintenance *= 0.5  # Less maintenance
        
        expense_categories["Vehicle Maintenance"] = {"min": vehicle_maintenance, "max": vehicle_maintenance * 1.5, "essential": True, "recurring": False}
        expense_categories["Fuel"] = {"min": fuel_rate, "max": fuel_rate * 1.5, "essential": True, "recurring": False}
        expense_categories["Transportation"]["min"] = 0.02 * expense_modifier  # Less public transport, more own vehicle
        
    if "Cab Driver" in source_categories:
        # Cab drivers have higher vehicle expenses
        vehicle_maintenance = 0.08 * expense_modifier
        fuel_rate = 0.10 * expense_modifier
        
        # Apply user-specific vehicle parameters
        if "vehicle_type" in user_preferences:
            if user_preferences["vehicle_type"] == "SUV":
                fuel_rate *= 1.4  # More fuel consumption
                vehicle_maintenance *= 1.3  # More maintenance
            elif user_preferences["vehicle_type"] == "Hatchback":
                fuel_rate *= 0.8  # Less fuel consumption
                vehicle_maintenance *= 0.9  # Less maintenance
        
        expense_categories["Vehicle Maintenance"] = {"min": vehicle_maintenance, "max": vehicle_maintenance * 1.5, "essential": True, "recurring": False}
        expense_categories["Fuel"] = {"min": fuel_rate, "max": fuel_rate * 1.5, "essential": True, "recurring": False}
        expense_categories["Transportation"]["min"] = 0.01 * expense_modifier  # Minimal public transport use
        
    if "House Cleaner" in source_categories:
        cleaning_supplies = 0.02 * expense_modifier
        
        # Apply user-specific parameters
        if "cleaning_supplies_quality" in user_preferences and user_preferences["cleaning_supplies_quality"] == "Premium":
            cleaning_supplies *= 1.5  # Premium supplies cost more
        
        expense_categories["Cleaning Supplies"] = {"min": cleaning_supplies, "max": cleaning_supplies * 1.5, "essential": True, "recurring": False}
        expense_categories["Transportation"]["min"] = 0.08 * expense_modifier  # More public transport
        expense_categories["Transportation"]["max"] = 0.15 * expense_modifier  # More public transport
    
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
    """Generate and save data for users with different categories, then train models on it"""
    # First, clean up old models and data
    print("Cleaning up old models and data...")
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Generate data for new users with different categories
    categories = [
        {"name": "food_delivery", "count": 3},
        {"name": "cab_driver", "count": 3},
        {"name": "house_cleaner", "count": 3}
    ]
    
    user_id = 3  # Start from user 3
    
    # First, create a random user with random income/expenses for testing
    income_data = generate_realistic_gig_income(months=12, user_id=1)
    expense_data = generate_expenses(income_data, user_id=1)
    
    # Save user data to JSON
    with open(f'data/user_1_data.json', 'w') as f:
        json.dump({
            "userData": {
                "id": 1,
                "name": "Test User",
                "email": "test@example.com"
            },
            "incomeData": income_data,
            "expenseData": expense_data
        }, f, indent=2)
    print(f"  Generated {len(income_data)} income entries and {len(expense_data)} expense entries.")
    
    # For each category, generate multiple users with different personalities
    for category in categories:
        for i in range(category["count"]):
            user_id += 1
            print(f"Generating data for {category['name']} worker (user {user_id})...")
            
            # Generate income data for 12 months
            income_data = generate_realistic_gig_income(months=12, user_id=user_id)
            expense_data = generate_expenses(income_data, user_id=user_id)
            
            # Get user personality
            personality = get_user_personality(user_id)
            
            # Save user data to JSON
            with open(f'data/user_{user_id}_data.json', 'w') as f:
                json.dump({
                    "userData": {
                        "id": user_id,
                        "name": f"User {user_id}",
                        "email": f"user{user_id}@example.com",
                        "personality": personality["name"],
                        "personality_description": personality["description"],
                        "category": category["name"].replace("_", " ").title()
                    },
                    "incomeData": income_data,
                    "expenseData": expense_data
                }, f, indent=2)
            
            # Train and save models for this user
            income_model = train_income_forecast_model(income_data)
            expense_model = train_expense_analyzer(expense_data)
            
            joblib.dump(income_model, f'models/income_forecaster_user_{user_id}.joblib')
            if expense_model:
                joblib.dump(expense_model, f'models/expense_analyzer_user_{user_id}.joblib')
            
            print(f"  Generated {len(income_data)} income entries and {len(expense_data)} expense entries.")
            print(f"  Trained and saved models for user {user_id}")
    
    # Train and save general models
    print("Training global models using all data...")
    # Combine all income and expense data
    all_income_data = []
    all_expense_data = []
    
    for file in os.listdir('data'):
        if file.startswith('user_') and file.endswith('_data.json'):
            with open(os.path.join('data', file), 'r') as f:
                user_data = json.load(f)
                all_income_data.extend(user_data['incomeData'])
                all_expense_data.extend(user_data['expenseData'])
    
    # Train and save general models
    income_model = train_income_forecast_model(all_income_data)
    expense_model = train_expense_analyzer(all_expense_data)
    
    joblib.dump(income_model, 'models/income_forecaster.joblib')
    joblib.dump(expense_model, 'models/expense_analyzer.joblib')
    
    print("\nGenerated all data and trained all models successfully!")
    print("New model focuses on three categories: Food Delivery Riders, Cab Drivers, and House Cleaners")

if __name__ == "__main__":
    save_data_and_train_models() 