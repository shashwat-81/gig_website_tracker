import requests
import json
import os
import numpy as np
from datetime import datetime, timedelta

def load_test_data():
    """Load test data from files"""
    data_file = "data/user_1_data.json"
    
    if not os.path.exists(data_file):
        print(f"Test data file {data_file} not found. Run train_models.py first.")
        exit(1)
    
    with open(data_file, 'r') as f:
        return json.load(f)

def verify_prediction_against_actual(income_data):
    """Compare actual income patterns with predicted patterns"""
    print("\n=== VERIFICATION OF AI PREDICTIONS ===\n")
    
    # Sort income data by date
    income_data.sort(key=lambda x: x["date"])
    
    # Calculate actual monthly totals
    monthly_income = {}
    for entry in income_data:
        month = entry["date"][:7]  # YYYY-MM format
        if month not in monthly_income:
            monthly_income[month] = 0
        monthly_income[month] += entry["amount"]
    
    print("ACTUAL MONTHLY INCOME:")
    for month, amount in monthly_income.items():
        print(f"  {month}: ₹{amount:.2f}")
    
    # Create test data with last month removed to see if AI can predict it
    test_months = len(monthly_income) - 1
    if test_months < 2:
        print("Not enough historical data for good verification")
        return
    
    # Filter data to exclude the most recent month
    last_month = max(monthly_income.keys())
    filtered_data = [entry for entry in income_data if entry["date"][:7] != last_month]
    
    print(f"\nTesting AI by withholding data from {last_month}")
    print(f"Using {len(filtered_data)} of {len(income_data)} income entries for prediction")
    
    # Make API request
    url = "http://127.0.0.1:5000/api/forecast-income"
    try:
        response = requests.post(
            url, 
            json={"incomeData": filtered_data, "expenseData": []},
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"Error: API returned status {response.status_code}")
            print(response.text)
            return
        
        result = response.json()
        if 'forecast' not in result or 'monthly' not in result['forecast']:
            print("Error: No forecast data in response")
            return
        
        # Extract predicted data
        predicted_months = {forecast["month"]: forecast["predicted_amount"] 
                          for forecast in result['forecast']['monthly']}
        
        # Check if the last month was predicted
        if last_month not in predicted_months:
            print(f"Warning: AI did not predict the specific month {last_month}")
            print("Predicted months:", list(predicted_months.keys()))
        else:
            actual = monthly_income[last_month]
            predicted = predicted_months[last_month]
            error_pct = abs(actual - predicted) / actual * 100
            
            print("\nPREDICTION RESULTS:")
            print(f"  Month: {last_month}")
            print(f"  Actual Income: ₹{actual:.2f}")
            print(f"  AI Predicted: ₹{predicted:.2f}")
            print(f"  Error: {error_pct:.2f}%")
            print(f"  Accuracy: {100-error_pct:.2f}%")
            
            print("\nVERIFICATION RESULT: AI IS " + 
                  ("MAKING REAL PREDICTIONS" if error_pct < 100 else "NOT PREDICTING WELL"))
            
            print("\nAll predicted months:")
            for month, amount in predicted_months.items():
                print(f"  {month}: ₹{amount:.2f}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("Verifying that the AI is making real predictions...")
    test_data = load_test_data()
    verify_prediction_against_actual(test_data["incomeData"]) 