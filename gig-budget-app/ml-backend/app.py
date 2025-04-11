from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os
import json
from datetime import datetime, timedelta
import random
import glob

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load sample data or pre-trained models if available
# For demo purposes, we'll generate synthetic data

def load_or_generate_models():
    """Load pre-trained models or generate new ones with sample data"""
    models = {}
    
    # Check if models exist
    if os.path.exists('models/income_forecaster.joblib'):
        models['income_forecaster'] = joblib.load('models/income_forecaster.joblib')
        models['expense_analyzer'] = joblib.load('models/expense_analyzer.joblib')
        print("Loaded pre-trained models")
    else:
        print("No pre-trained models found. Will train on request.")
    
    return models

# Initialize models
models = load_or_generate_models()

# Helper function to load category-specific test data
def load_category_test_data(category):
    """Load test data for a specific category"""
    category_map = {
        'Food Delivery': 'food_delivery',
        'Cab Driver': 'cab_driver', 
        'House Cleaner': 'house_cleaner'
    }
    
    internal_category = category_map.get(category, 'food_delivery')
    
    # Find user files matching this category
    matching_files = []
    for file_path in glob.glob("data/user_*_data.json"):
        with open(file_path, 'r') as f:
            try:
                data = json.load(f)
                income_sources = [item.get("category", "") for item in data.get("incomeData", [])]
                
                if category in income_sources:
                    matching_files.append(file_path)
            except Exception as e:
                print(f"Error loading file {file_path}: {e}")
    
    # Use the first matching file
    if matching_files:
        with open(matching_files[0], 'r') as f:
            return json.load(f)
    
    # Fallback: Generate simple mock data
    return {
        "incomeData": [
            {"amount": 1000, "date": "2024-01-01", "category": category},
            {"amount": 1200, "date": "2024-02-01", "category": category},
            {"amount": 1100, "date": "2024-03-01", "category": category},
        ],
        "expenseData": [
            {"amount": 500, "date": "2024-01-15", "category": "Housing"},
            {"amount": 500, "date": "2024-02-15", "category": "Housing"},
            {"amount": 200, "date": "2024-01-20", "category": "Food"},
            {"amount": 200, "date": "2024-02-20", "category": "Food"},
        ]
    }

# Add an endpoint to serve test data for a specific category
@app.route('/api/test-data', methods=['GET'])
def get_test_data():
    """Endpoint to get test data for a specific category"""
    category = request.args.get('category', 'Food Delivery')
    data = load_category_test_data(category)
    return jsonify(data)

# Helper functions for data processing
def preprocess_financial_data(data):
    """Convert incoming JSON data to pandas DataFrame and preprocess"""
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
    
    # Save model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/income_forecaster.joblib')
    
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
        
        # Save model
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, 'models/expense_analyzer.joblib')
        return model
    return None

@app.route('/api/forecast-income', methods=['POST'])
def forecast_income():
    """Endpoint to forecast income for upcoming months"""
    data = request.json
    income_data = data.get('incomeData', [])
    
    if not income_data:
        return jsonify({"error": "No income data provided"}), 400
    
    # Train or load model
    if 'income_forecaster' not in models:
        models['income_forecaster'] = train_income_forecast_model(income_data)
    
    # Generate forecast for next 3 months
    forecast_months = 3
    last_date = max([datetime.strptime(entry['date'], '%Y-%m-%d') for entry in income_data])
    
    forecasts = []
    for i in range(1, forecast_months * 30 + 1):
        forecast_date = last_date + timedelta(days=i)
        features = [[forecast_date.weekday(), forecast_date.day, forecast_date.month]]
        
        # Make prediction
        try:
            predicted_amount = models['income_forecaster'].predict(features)[0]
            
            # Only include if it's a work day (simplified)
            if forecast_date.weekday() < 5 and random.random() > 0.7:  # 30% chance of income on weekdays
                forecasts.append({
                    'date': forecast_date.strftime('%Y-%m-%d'),
                    'amount': round(max(0, predicted_amount), 2),
                    'source': 'Predicted Income'
                })
        except Exception as e:
            print(f"Prediction error: {e}")
    
    # Aggregate by month for summary
    monthly_forecast = {}
    for forecast in forecasts:
        month = forecast['date'][:7]  # Get YYYY-MM
        if month not in monthly_forecast:
            monthly_forecast[month] = 0
        monthly_forecast[month] += forecast['amount']
    
    # Format for response
    formatted_forecast = [{"month": k, "predicted_amount": round(v, 2)} for k, v in monthly_forecast.items()]
    
    return jsonify({
        "forecast": {
            "daily": forecasts,
            "monthly": formatted_forecast
        }
    })

@app.route('/api/analyze-expenses', methods=['POST'])
def analyze_expenses():
    """Endpoint to analyze expenses and provide reduction recommendations"""
    data = request.json
    expense_data = data.get('expenseData', [])
    
    if not expense_data:
        return jsonify({"error": "No expense data provided"}), 400
    
    # Group expenses by category
    expense_by_category = {}
    for expense in expense_data:
        category = expense.get('category', 'Uncategorized')
        if category not in expense_by_category:
            expense_by_category[category] = []
        expense_by_category[category].append(expense)
    
    # Calculate metrics by category
    category_metrics = {}
    for category, expenses in expense_by_category.items():
        total = sum(expense['amount'] for expense in expenses)
        avg = total / len(expenses)
        category_metrics[category] = {
            'total': round(total, 2),
            'average': round(avg, 2),
            'count': len(expenses)
        }
    
    # Identify top spending categories
    sorted_categories = sorted(category_metrics.items(), key=lambda x: x[1]['total'], reverse=True)
    top_categories = sorted_categories[:3]
    
    # Generate recommendations
    recommendations = []
    for category, metrics in top_categories:
        if metrics['total'] > 0:
            # Suggest 5-15% reduction for top categories
            reduction_percent = random.randint(5, 15)
            potential_savings = round(metrics['total'] * (reduction_percent / 100), 2)
            
            recommendations.append({
                'category': category,
                'current_spending': metrics['total'],
                'recommendation': f"Reduce {category} spending by {reduction_percent}%",
                'potential_savings': potential_savings,
                'details': f"You spent ₹{metrics['total']} on {category} recently. Cutting this by {reduction_percent}% would save ₹{potential_savings}."
            })
    
    return jsonify({
        "analysis": {
            "by_category": category_metrics,
            "recommendations": recommendations
        }
    })

@app.route('/api/savings-plan', methods=['POST'])
def savings_plan():
    """Generate a personalized savings plan based on income and expenses"""
    data = request.json
    income_data = data.get('incomeData', [])
    expense_data = data.get('expenseData', [])
    
    if not income_data or not expense_data:
        return jsonify({"error": "Both income and expense data are required"}), 400
    
    # Calculate total income and expenses
    total_income = sum(item['amount'] for item in income_data)
    total_expenses = sum(item['amount'] for item in expense_data)
    
    # Calculate current savings
    current_savings = total_income - total_expenses
    current_savings_percent = (current_savings / total_income) * 100 if total_income > 0 else 0
    
    # Calculate optimal savings (target 20-30% of income)
    target_percent = 25  # Target 25% savings
    target_savings = total_income * (target_percent / 100)
    savings_gap = target_savings - current_savings
    
    # Calculate months to achieve emergency fund (3 months of expenses)
    emergency_fund_target = total_expenses * 3
    months_to_emergency_fund = emergency_fund_target / current_savings if current_savings > 0 else float('inf')
    
    # Generate savings strategies
    strategies = []
    
    # Add category-specific strategies based on the profile (from job category)
    job_category = None
    for item in income_data:
        if 'category' in item:
            job_category = item['category']
            break
    
    # Basic strategy for everyone
    strategies.append({
        'name': 'Automate Savings',
        'description': 'Set up automatic transfers to a separate savings account on payday',
        'potential_impact': '₹' + str(round(total_income * 0.05, 2)) + ' per month',
        'difficulty': 'Easy'
    })
    
    # Strategy for irregular income
    strategies.append({
        'name': 'Income Smoothing',
        'description': 'During high-income periods, save extra to cover low-income months',
        'potential_impact': 'Reduced financial stress',
        'difficulty': 'Medium'
    })
    
    # Category-specific strategies
    if job_category == 'Food Delivery':
        strategies.append({
            'name': 'Vehicle Efficiency',
            'description': 'Optimize delivery routes and maintenance to reduce fuel costs',
            'potential_impact': '₹' + str(round(total_expenses * 0.03, 2)) + ' per month',
            'difficulty': 'Medium'
        })
    elif job_category == 'Cab Driver':
        strategies.append({
            'name': 'Strategic Driving Hours',
            'description': 'Focus on peak hours when fares are higher to maximize earnings',
            'potential_impact': '₹' + str(round(total_income * 0.08, 2)) + ' per month',
            'difficulty': 'Medium'
        })
    elif job_category == 'House Cleaner':
        strategies.append({
            'name': 'Bulk Supply Purchases',
            'description': 'Buy cleaning supplies in bulk to reduce costs',
            'potential_impact': '₹' + str(round(total_expenses * 0.02, 2)) + ' per month',
            'difficulty': 'Easy'
        })
    
    return jsonify({
        "plan": {
            "current_savings": round(current_savings, 2),
            "current_savings_percent": round(current_savings_percent, 2),
            "target_amount": round(target_savings, 2),
            "target_percent": target_percent,
            "savings_gap": round(savings_gap, 2),
            "emergency_fund_target": round(emergency_fund_target, 2),
            "months_to_emergency_fund": round(months_to_emergency_fund, 1),
            "strategies": strategies
        }
    })

@app.route('/api/tax-suggestions', methods=['POST'])
def tax_suggestions():
    """Provide personalized tax optimization suggestions"""
    data = request.json
    income_data = data.get('incomeData', [])
    
    if not income_data:
        return jsonify({"error": "Income data is required"}), 400
    
    # Calculate total income
    total_income = sum(item['amount'] for item in income_data)
    annual_income = total_income * (12 / len(income_data)) if len(income_data) > 0 else 0
    
    # Determine which tax bracket the user falls into (simplified for India 2024-25)
    tax_liability = 0
    if annual_income <= 300000:
        tax_bracket = "No tax up to ₹3,00,000"
        tax_liability = 0
    elif annual_income <= 600000:
        tax_bracket = "5% tax on income between ₹3,00,001 and ₹6,00,000"
        tax_liability = (annual_income - 300000) * 0.05
    elif annual_income <= 900000:
        tax_bracket = "10% tax on income between ₹6,00,001 and ₹9,00,000"
        tax_liability = 15000 + (annual_income - 600000) * 0.1
    elif annual_income <= 1200000:
        tax_bracket = "15% tax on income between ₹9,00,001 and ₹12,00,000"
        tax_liability = 45000 + (annual_income - 900000) * 0.15
    elif annual_income <= 1500000:
        tax_bracket = "20% tax on income between ₹12,00,001 and ₹15,00,000"
        tax_liability = 90000 + (annual_income - 1200000) * 0.2
    else:
        tax_bracket = "30% tax on income above ₹15,00,000"
        tax_liability = 150000 + (annual_income - 1500000) * 0.3
    
    # Generate tax optimization suggestions
    suggestions = []
    
    # Basic suggestions for everyone
    suggestions.append({
        'title': 'Track All Business Expenses',
        'description': 'Keep detailed records of work-related expenses like fuel, vehicle maintenance, and mobile phone bills',
        'potential_savings': round(annual_income * 0.02, 2)  # Estimate 2% savings
    })
    
    suggestions.append({
        'title': 'Invest in Tax-Saving Instruments',
        'description': 'Consider investments in PPF, ELSS, or NPS to reduce taxable income',
        'potential_savings': round(min(annual_income * 0.05, 150000), 2)  # Up to Section 80C limit
    })
    
    # Job-specific tax suggestions
    job_category = None
    for item in income_data:
        if 'category' in item:
            job_category = item['category']
            break
    
    if job_category == 'Food Delivery':
        suggestions.append({
            'title': 'Vehicle Depreciation',
            'description': 'Claim depreciation on your delivery vehicle to reduce taxable income',
            'potential_savings': round(annual_income * 0.015, 2)
        })
    elif job_category == 'Cab Driver':
        suggestions.append({
            'title': 'Fuel and Maintenance Deductions',
            'description': 'Keep all receipts for fuel, maintenance, and repairs to claim as business expenses',
            'potential_savings': round(annual_income * 0.03, 2)
        })
    elif job_category == 'House Cleaner':
        suggestions.append({
            'title': 'Equipment and Supply Deductions',
            'description': 'Deduct the cost of cleaning supplies and equipment used for work',
            'potential_savings': round(annual_income * 0.01, 2)
        })
    
    return jsonify({
        "tax_analysis": {
            "annual_income_estimate": round(annual_income, 2),
            "tax_bracket": tax_bracket,
            "estimated_tax_liability": round(tax_liability, 2)
        },
        "tax_suggestions": suggestions
    })

@app.route('/api/low-income-preparation', methods=['POST'])
def low_income_preparation():
    """Provide strategies for handling seasonal low-income periods"""
    data = request.json
    income_data = data.get('incomeData', [])
    expense_data = data.get('expenseData', [])
    
    if not income_data or not expense_data:
        return jsonify({"error": "Both income and expense data are required"}), 400
    
    # Calculate monthly income to identify low periods
    monthly_income = {}
    for item in income_data:
        month = item['date'][:7]  # Get YYYY-MM
        if month not in monthly_income:
            monthly_income[month] = 0
        monthly_income[month] += item['amount']
    
    # Calculate average monthly income
    avg_monthly_income = sum(monthly_income.values()) / len(monthly_income) if monthly_income else 0
    
    # Identify low-income months (below 80% of average)
    low_income_months = []
    for month, income in monthly_income.items():
        if income < (avg_monthly_income * 0.8):
            low_income_months.append(month)
    
    # Calculate monthly expenses
    monthly_expenses = {}
    for item in expense_data:
        month = item['date'][:7]  # Get YYYY-MM
        if month not in monthly_expenses:
            monthly_expenses[month] = 0
        monthly_expenses[month] += item['amount']
    
    # Calculate average monthly expenses
    avg_monthly_expenses = sum(monthly_expenses.values()) / len(monthly_expenses) if monthly_expenses else 0
    
    # Calculate recommended emergency fund (3 months of expenses)
    emergency_fund_target = avg_monthly_expenses * 3
    
    # Generate strategies
    strategies = []
    
    # Basic strategies for everyone
    strategies.append({
        'title': 'Build an Emergency Fund',
        'description': f'Save at least ₹{round(emergency_fund_target, 2)} (3 months of expenses) for low-income periods',
        'impact': 'High',
        'timeline': 'Medium-term'
    })
    
    strategies.append({
        'title': 'Identify Essential vs. Non-Essential Expenses',
        'description': 'Categorize your expenses and have a plan to quickly cut non-essentials during low periods',
        'impact': 'Medium',
        'timeline': 'Short-term'
    })
    
    # Job-specific strategies
    job_category = None
    for item in income_data:
        if 'category' in item:
            job_category = item['category']
            break
    
    if job_category == 'Food Delivery':
        strategies.append({
            'title': 'Multi-platform Strategy',
            'description': 'Sign up for multiple delivery platforms to diversify income sources',
            'impact': 'Medium',
            'timeline': 'Short-term'
        })
        strategies.append({
            'title': 'Peak Hours Focus',
            'description': 'Concentrate work during meal times when orders are highest',
            'impact': 'Medium',
            'timeline': 'Immediate'
        })
    elif job_category == 'Cab Driver':
        strategies.append({
            'title': 'Event Calendar Tracking',
            'description': 'Track local events to anticipate high-demand periods',
            'impact': 'Medium',
            'timeline': 'Short-term'
        })
        strategies.append({
            'title': 'Airport and Business District Focus',
            'description': 'Focus on high-fare areas during business hours',
            'impact': 'High',
            'timeline': 'Immediate'
        })
    elif job_category == 'House Cleaner':
        strategies.append({
            'title': 'Service Expansion',
            'description': 'Offer additional services like deep cleaning or organizing',
            'impact': 'High',
            'timeline': 'Medium-term'
        })
        strategies.append({
            'title': 'Maintenance Contracts',
            'description': 'Secure long-term contracts with businesses or regular clients',
            'impact': 'High',
            'timeline': 'Medium-term'
        })
    
    # Pattern-based strategies
    if low_income_months:
        # Check if low-income months follow a seasonal pattern
        low_income_month_numbers = [int(month.split('-')[1]) for month in low_income_months]
        if set(low_income_month_numbers) & {5, 6, 7}:  # Summer months
            strategies.append({
                'title': 'Summer Income Planning',
                'description': 'Your income tends to drop during summer months. Plan additional work or savings for May-July',
                'impact': 'High',
                'timeline': 'Annual'
            })
        elif set(low_income_month_numbers) & {1, 2}:  # Winter months
            strategies.append({
                'title': 'Winter Income Planning',
                'description': 'Your income tends to drop during winter months. Plan additional work or savings for January-February',
                'impact': 'High',
                'timeline': 'Annual'
            })
    
    return jsonify({
        "income_analysis": {
            "average_monthly_income": round(avg_monthly_income, 2),
            "average_monthly_expenses": round(avg_monthly_expenses, 2),
            "low_income_months": low_income_months,
            "emergency_fund_target": round(emergency_fund_target, 2)
        },
        "strategies": strategies
    })

if __name__ == '__main__':
    app.run(debug=True) 