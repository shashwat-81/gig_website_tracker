import requests
import json
import os
import time

def test_all_endpoints():
    """Test all API endpoints to verify predictions"""
    base_url = "http://127.0.0.1:5000/api"
    
    # Load test data
    data_file = "data/user_1_data.json"
    if not os.path.exists(data_file):
        print(f"Test data file {data_file} not found. Run train_models.py first.")
        return
    
    with open(data_file, 'r') as f:
        test_data = json.load(f)
    
    # Endpoints to test
    endpoints = [
        "forecast-income",
        "analyze-expenses",
        "savings-plan",
        "tax-suggestions",
        "low-income-preparation"
    ]
    
    all_successful = True
    
    for endpoint in endpoints:
        print(f"\n\n{'='*20} Testing {endpoint} {'='*20}")
        
        try:
            # Send request to API
            url = f"{base_url}/{endpoint}"
            print(f"Sending POST request to {url}")
            
            start_time = time.time()
            response = requests.post(url, json=test_data, timeout=30)
            end_time = time.time()
            
            print(f"Response time: {end_time - start_time:.2f} seconds")
            print(f"Status code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                
                # Print summary based on endpoint
                if endpoint == "forecast-income":
                    if 'forecast' in result and 'monthly' in result['forecast']:
                        monthly = result['forecast']['monthly']
                        print(f"Success! Received {len(monthly)} months of income forecasts")
                        for forecast in monthly[:3]:  # Show first 3
                            print(f"  - {forecast['month']}: ₹{forecast['predicted_amount']}")
                        if len(monthly) > 3:
                            print(f"  - ...and {len(monthly)-3} more")
                    else:
                        print("Warning: Unexpected response format")
                        all_successful = False
                
                elif endpoint == "analyze-expenses":
                    if 'analysis' in result and 'recommendations' in result['analysis']:
                        recommendations = result['analysis']['recommendations']
                        print(f"Success! Received {len(recommendations)} expense recommendations")
                        for i, rec in enumerate(recommendations[:3], 1):  # Show first 3
                            print(f"  {i}. {rec['recommendation']} - Save ₹{rec['potential_savings']}")
                        if len(recommendations) > 3:
                            print(f"  ...and {len(recommendations)-3} more")
                    else:
                        print("Warning: Unexpected response format")
                        all_successful = False
                
                elif endpoint == "savings-plan":
                    if 'plan' in result:
                        plan = result['plan']
                        print(f"Success! Received savings plan with target: ₹{plan.get('target_amount', 'N/A')}")
                        if 'strategies' in plan:
                            print(f"  Strategies provided: {len(plan['strategies'])}")
                            for i, strategy in enumerate(plan['strategies'][:2], 1):
                                print(f"  {i}. {strategy['name']}: {strategy['description'][:50]}...")
                    else:
                        print("Warning: Unexpected response format")
                        all_successful = False
                
                elif endpoint == "tax-suggestions":
                    if 'tax_suggestions' in result:
                        suggestions = result['tax_suggestions']
                        print(f"Success! Received {len(suggestions)} tax optimization suggestions")
                        for i, suggestion in enumerate(suggestions[:2], 1):
                            print(f"  {i}. {suggestion['title']}")
                            print(f"     Potential savings: ₹{suggestion.get('potential_savings', 'N/A')}")
                    else:
                        print("Warning: Unexpected response format")
                        all_successful = False
                
                elif endpoint == "low-income-preparation":
                    if 'strategies' in result:
                        strategies = result['strategies']
                        print(f"Success! Received {len(strategies)} low-income preparation strategies")
                        for i, strategy in enumerate(strategies[:2], 1):
                            print(f"  {i}. {strategy['title']}")
                            print(f"     {strategy['description'][:50]}...")
                    else:
                        print("Warning: Unexpected response format")
                        all_successful = False
            else:
                print(f"Error response: {response.text}")
                all_successful = False
                
        except Exception as e:
            print(f"Error testing {endpoint}: {str(e)}")
            all_successful = False
    
    # Final summary
    print("\n" + "="*60)
    if all_successful:
        print("🎉 ALL API ENDPOINTS SUCCESSFULLY RETURNED PREDICTIONS! 🎉")
        print("✅ The AI models are working correctly and making predictions")
    else:
        print("⚠️ Some API endpoints had issues or returned unexpected formats")
        print("Please check the logs above for details")

if __name__ == "__main__":
    test_all_endpoints() 