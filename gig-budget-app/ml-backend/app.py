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
    user_profile = data.get('userProfile', {})
    
    if not income_data or not expense_data:
        return jsonify({"error": "Insufficient data provided"}), 400
    
    # Calculate total income and expenses
    total_income = sum(income['amount'] for income in income_data)
    total_expenses = sum(expense['amount'] for expense in expense_data)
    
    # Calculate monthly averages (assuming data is for the last 3 months)
    months_of_data = 3
    monthly_income = total_income / months_of_data
    monthly_expenses = total_expenses / months_of_data
    
    # Calculate savings potential
    current_savings_rate = max(0, (monthly_income - monthly_expenses) / monthly_income) if monthly_income > 0 else 0
    target_savings_rate = min(0.3, current_savings_rate + 0.05)  # Aim for 5% increase, up to 30%
    
    # Emergency fund calculation (3-6 months of expenses)
    emergency_fund_min = monthly_expenses * 3
    emergency_fund_max = monthly_expenses * 6
    
    # Income volatility (simplified)
    income_amounts = [income['amount'] for income in income_data]
    income_volatility = np.std(income_amounts) / np.mean(income_amounts) if income_amounts else 0
    
    # Adjust emergency fund based on income volatility
    volatility_factor = min(1.5, 1 + income_volatility)
    recommended_emergency_fund = emergency_fund_min * volatility_factor
    
    # Generate savings plan
    monthly_savings_target = monthly_income * target_savings_rate
    
    # Calculate time to reach emergency fund
    time_to_emergency_fund = recommended_emergency_fund / monthly_savings_target if monthly_savings_target > 0 else float('inf')
    
    # Generate plan
    plan = {
        "monthly_income": round(monthly_income, 2),
        "monthly_expenses": round(monthly_expenses, 2),
        "current_savings_rate": round(current_savings_rate * 100, 1),
        "recommended_savings_rate": round(target_savings_rate * 100, 1),
        "monthly_savings_target": round(monthly_savings_target, 2),
        "emergency_fund": {
            "recommended_amount": round(recommended_emergency_fund, 2),
            "months_to_achieve": round(time_to_emergency_fund, 1) if time_to_emergency_fund != float('inf') else "N/A"
        },
        "income_volatility": round(income_volatility * 100, 1),
        "recommendations": []
    }
    
    # Add specific recommendations
    if current_savings_rate < 0.1:
        plan["recommendations"].append({
            "type": "urgent",
            "title": "Increase Your Savings Rate",
            "description": "Your current savings rate is less than 10%. Try to increase your savings by reducing non-essential expenses."
        })
    
    if income_volatility > 0.3:
        plan["recommendations"].append({
            "type": "important",
            "title": "Build a Larger Emergency Fund",
            "description": "Your income is highly variable. Aim for 6 months of expenses in your emergency fund."
        })
    
    if monthly_income - monthly_expenses < 5000:
        plan["recommendations"].append({
            "type": "consideration",
            "title": "Increase Income Sources",
            "description": "Your income barely covers expenses. Consider adding new income streams or gigs."
        })
    
    return jsonify({
        "savings_plan": plan
    })

@app.route('/api/tax-suggestions', methods=['POST'])
def tax_suggestions():
    """Generate tax-saving suggestions based on income profile"""
    data = request.json
    income_data = data.get('incomeData', [])
    user_profile = data.get('userProfile', {})
    
    if not income_data:
        return jsonify({"error": "No income data provided"}), 400
    
    # Calculate annual income (projected)
    monthly_income = sum(income['amount'] for income in income_data) / 3  # Assuming 3 months of data
    projected_annual_income = monthly_income * 12
    
    # Tax brackets for India (simplified)
    tax_brackets = [
        {"limit": 250000, "rate": 0},
        {"limit": 500000, "rate": 0.05},
        {"limit": 750000, "rate": 0.1},
        {"limit": 1000000, "rate": 0.15},
        {"limit": 1250000, "rate": 0.2},
        {"limit": 1500000, "rate": 0.25},
        {"limit": float('inf'), "rate": 0.3}
    ]
    
    # Calculate current tax estimate (very simplified)
    taxable_income = projected_annual_income
    estimated_tax = 0
    
    prev_limit = 0
    for bracket in tax_brackets:
        if taxable_income > prev_limit:
            tax_in_bracket = min(taxable_income - prev_limit, bracket["limit"] - prev_limit) * bracket["rate"]
            estimated_tax += tax_in_bracket
        prev_limit = bracket["limit"]
    
    # Generate suggestions
    suggestions = []
    
    # Section 80C
    if projected_annual_income > 300000:
        suggestions.append({
            "type": "tax_deduction",
            "title": "Section 80C Investments",
            "description": "Invest in PPF, ELSS, or insurance to avail tax deduction up to ₹1,50,000.",
            "potential_saving": min(150000 * 0.2, estimated_tax * 0.3)  # Assuming 20% tax rate, max 30% of current tax
        })
    
    # Health Insurance
    suggestions.append({
        "type": "tax_deduction",
        "title": "Health Insurance Premium (Section 80D)",
        "description": "Pay for health insurance to claim a deduction up to ₹25,000 (₹50,000 for senior citizens).",
        "potential_saving": min(25000 * 0.2, estimated_tax * 0.1)  # Assuming 20% tax rate, max 10% of current tax
    })
    
    # Home Loan Interest
    if projected_annual_income > 500000:
        suggestions.append({
            "type": "tax_deduction",
            "title": "Home Loan Interest (Section 24)",
            "description": "If you have a home loan, you can claim deduction on interest paid up to ₹2,00,000.",
            "potential_saving": min(200000 * 0.2, estimated_tax * 0.4)  # Assuming 20% tax rate, max 40% of current tax
        })
    
    # NPS
    if projected_annual_income > 800000:
        suggestions.append({
            "type": "tax_deduction",
            "title": "National Pension Scheme (Section 80CCD)",
            "description": "Invest in NPS to get an additional deduction of ₹50,000 over and above Section 80C limit.",
            "potential_saving": min(50000 * 0.2, estimated_tax * 0.15)  # Assuming 20% tax rate, max 15% of current tax
        })
    
    # GST Registration for freelancers
    if projected_annual_income > 2000000:
        suggestions.append({
            "type": "business_structure",
            "title": "Consider GST Registration",
            "description": "If your annual turnover is over ₹20 lakhs, GST registration allows you to claim input tax credits.",
            "potential_saving": "Variable based on business expenses"
        })
    
    return jsonify({
        "tax_analysis": {
            "projected_annual_income": round(projected_annual_income, 2),
            "estimated_tax": round(estimated_tax, 2),
            "effective_tax_rate": round((estimated_tax / projected_annual_income) * 100, 1) if projected_annual_income > 0 else 0,
            "suggestions": suggestions
        }
    })

@app.route('/api/low-income-preparation', methods=['POST'])
def low_income_preparation():
    """Generate a plan for preparing for low-income periods"""
    data = request.json
    income_data = data.get('incomeData', [])
    expense_data = data.get('expenseData', [])
    
    if not income_data or not expense_data:
        return jsonify({"error": "Insufficient data provided"}), 400
    
    # Convert dates to datetime for analysis
    income_df = pd.DataFrame(income_data)
    income_df['date'] = pd.to_datetime(income_df['date'])
    income_df['month'] = income_df['date'].dt.strftime('%Y-%m')
    
    # Group by month
    monthly_income = income_df.groupby('month')['amount'].sum().to_dict()
    
    # Identify low income months (below 70% of average)
    months = list(monthly_income.keys())
    amounts = list(monthly_income.values())
    avg_monthly_income = sum(amounts) / len(amounts) if amounts else 0
    low_income_threshold = avg_monthly_income * 0.7
    
    low_income_months = [month for month, amount in monthly_income.items() if amount < low_income_threshold]
    
    # Calculate essential expenses
    essential_categories = ["Housing", "Utilities", "Groceries", "Transportation", "Healthcare"]
    
    expense_df = pd.DataFrame(expense_data)
    essential_expenses = 0
    if not expense_df.empty and 'category' in expense_df.columns and 'amount' in expense_df.columns:
        essential_expenses = expense_df[expense_df['category'].isin(essential_categories)]['amount'].sum() / 3  # Assuming 3 months data
    
    # Monthly buffer needed
    monthly_buffer = essential_expenses * 1.2  # 20% buffer on essentials
    
    # Generate recommendations
    low_month_preparation = {
        "average_monthly_income": round(avg_monthly_income, 2),
        "low_income_threshold": round(low_income_threshold, 2),
        "identified_low_months": low_income_months,
        "essential_monthly_expenses": round(essential_expenses, 2),
        "recommended_monthly_buffer": round(monthly_buffer, 2),
        "strategies": []
    }
    
    # Add strategies based on the data
    if avg_monthly_income > 0:
        save_percent = min(30, max(10, round(20 * (1 + len(low_income_months) / 12))))
        low_month_preparation["strategies"].append({
            "title": "Build a Seasonal Buffer",
            "description": f"Save {save_percent}% of income during high-earning months to cover low-income periods.",
            "action_items": [
                f"Set aside ₹{round(avg_monthly_income * save_percent / 100, 2)} monthly during normal/high income periods",
                "Keep this buffer in a separate high-interest savings account",
                "Use this buffer only during identified low-income months"
            ]
        })
    
    if len(low_income_months) > 0:
        low_month_preparation["strategies"].append({
            "title": "Diversify Income Sources",
            "description": "Add additional income streams that are counter-cyclical to your current work pattern.",
            "action_items": [
                "Look for gigs that are in high demand during your typical low-income months",
                "Develop skills that allow for remote work regardless of season",
                "Create passive income streams through investments or digital products"
            ]
        })
    
    low_month_preparation["strategies"].append({
        "title": "Expense Management Plan",
        "description": "Create a reduced expense budget for low-income months.",
        "action_items": [
            "Identify non-essential expenses that can be temporarily reduced",
            f"Plan for essential expenses of ₹{round(essential_expenses, 2)} monthly",
            "Prepay major bills during high-income months when possible"
        ]
    })
    
    return jsonify({
        "low_income_preparation": low_month_preparation
    })

if __name__ == '__main__':
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)
    app.run(debug=True, port=5000) 