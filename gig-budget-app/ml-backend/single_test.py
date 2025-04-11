import requests
import json
import os

# Load test data
data_file = "data/user_1_data.json"

if not os.path.exists(data_file):
    print(f"Test data file {data_file} not found. Please run train_models.py first.")
    exit(1)

with open(data_file, 'r') as f:
    test_data = json.load(f)

# Test the income prediction endpoint
endpoint = "forecast-income"
url = f"http://127.0.0.1:5000/api/{endpoint}"

print(f"Testing {url}...")
print(f"Request data: {len(test_data['incomeData'])} income records, {len(test_data['expenseData'])} expense records")

try:
    response = requests.post(
        url, 
        json=test_data,
        timeout=30
    )
    
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\nSUCCESS: Received prediction results!")
        print("\nPrediction Output:")
        print(json.dumps(result, indent=2))
        
        # Count predictions
        if 'forecast' in result and 'monthly' in result['forecast']:
            print(f"\nMonthly forecasts: {len(result['forecast']['monthly'])}")
            for forecast in result['forecast']['monthly']:
                print(f"  - {forecast['month']}: ₹{forecast['predicted_amount']}")
    else:
        print(f"Error response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}") 