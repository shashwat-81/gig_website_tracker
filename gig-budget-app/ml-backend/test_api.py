import requests
import json
import os

def test_prediction_api():
    """Test the prediction endpoints of the Flask API"""
    base_url = "http://127.0.0.1:5000/api"
    
    # Load test data from one of our generated files
    data_file = "data/user_1_data.json"
    
    if not os.path.exists(data_file):
        print(f"Test data file {data_file} not found. Please run train_models.py first.")
        return
    
    with open(data_file, 'r') as f:
        test_data = json.load(f)
    
    # Test each endpoint
    endpoints = [
        "forecast-income",
        "analyze-expenses",
        "savings-plan",
        "tax-suggestions",
        "low-income-preparation"
    ]
    
    for endpoint in endpoints:
        print(f"\n--- Testing {endpoint} endpoint ---")
        try:
            response = requests.post(
                f"{base_url}/{endpoint}", 
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"Success! Status code: {response.status_code}")
                print("Response preview:")
                print(json.dumps(result, indent=2)[:500] + "...")  # Show truncated response
            else:
                print(f"Error! Status code: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error testing {endpoint}: {str(e)}")
    
    print("\nTesting complete!")

if __name__ == "__main__":
    test_prediction_api() 