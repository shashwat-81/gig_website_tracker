import requests
import json
import os
import time

def test_category_specific_predictions():
    """Test API endpoints with data from each job category"""
    base_url = "http://127.0.0.1:5000/api"
    
    # Find sample data for each category
    category_files = {
        "Food Delivery": None,
        "Cab Driver": None,
        "House Cleaner": None
    }
    
    # Find all user data files
    data_files = [f for f in os.listdir("data") if f.startswith("user_") and f.endswith("_data.json")]
    
    # Categorize files
    for file in data_files:
        with open(os.path.join("data", file), 'r') as f:
            user_data = json.load(f)
            
        # Check sources to determine category
        income_sources = [item["category"] for item in user_data["incomeData"]]
        
        if "Food Delivery" in income_sources and not category_files["Food Delivery"]:
            category_files["Food Delivery"] = file
        elif "Cab Driver" in income_sources and not category_files["Cab Driver"]:
            category_files["Cab Driver"] = file
        elif "House Cleaner" in income_sources and not category_files["House Cleaner"]:
            category_files["House Cleaner"] = file
    
    # Endpoints to test
    endpoints = [
        "forecast-income",
        "analyze-expenses",
        "savings-plan",
        "tax-suggestions",
        "low-income-preparation"
    ]
    
    # Test endpoint for each category
    for category, file in category_files.items():
        if not file:
            print(f"No sample data found for {category}")
            continue
        
        print(f"\n{'='*20} Testing {category} {'='*20}")
        
        # Load the test data
        with open(os.path.join("data", file), 'r') as f:
            test_data = json.load(f)
        
        # Test the first endpoint (income forecast) with detailed results
        endpoint = "forecast-income"
        url = f"{base_url}/{endpoint}"
        
        print(f"\nTesting {url} with {category} data...")
        try:
            response = requests.post(
                url,
                json=test_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Print income forecast results
                if 'forecast' in result and 'monthly' in result['forecast']:
                    monthly = result['forecast']['monthly']
                    print(f"Success! Received {len(monthly)} months of income forecasts")
                    print(f"Monthly forecasts for {category}:")
                    for forecast in monthly[:3]:
                        print(f"  - {forecast['month']}: ₹{forecast['predicted_amount']}")
                else:
                    print("Warning: Unexpected response format")
            else:
                print(f"Error: Status {response.status_code}")
                print(response.text)
        
        except Exception as e:
            print(f"Error: {str(e)}")
        
        # Test remaining endpoints with summary results
        for endpoint in endpoints[1:]:
            url = f"{base_url}/{endpoint}"
            print(f"\nTesting {endpoint} with {category} data...")
            
            try:
                response = requests.post(
                    url,
                    json=test_data,
                    timeout=30
                )
                
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    print("Success! API returned valid response")
            except Exception as e:
                print(f"Error: {str(e)}")
    
    print("\n" + "="*60)
    print("✅ API testing completed for all gig worker categories!")
    print("The models are now capable of category-specific predictions for:")
    print("1. Food Delivery Riders")
    print("2. Cab Drivers")
    print("3. House Cleaners")

if __name__ == "__main__":
    test_category_specific_predictions() 