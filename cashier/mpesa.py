import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
import base64
import os

# M-Pesa Daraja API Credentials (Sandbox)
CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', '5ADNiLZGUidxvm7AyVSdSVHiGN8lOGTNjE5A6TQjZ6r2cMkt')
CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', 'vO6bXEKc4SjRj4LmNAvmnbhNGrkLoASNYzuq2TGWa9K3GpjaCWAyisa3lVxdDnpp')

# Sandbox Test Credentials
BUSINESS_SHORTCODE = os.getenv('MPESA_SHORTCODE', '174379')  # Sandbox test shortcode
PASSKEY = os.getenv('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')  # Sandbox passkey

# Callback URL - use ngrok or a public URL for testing
CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'https://hypermodest-irena-washy.ngrok-free.dev/api/mpesa/callback/')


def get_access_token():
    """
    Generate M-Pesa access token using consumer key and secret
    """
    url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    
    try:
        response = requests.get(url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
        response.raise_for_status()
        access_token = response.json().get('access_token')
        return access_token
    except requests.exceptions.RequestException as e:
        print(f"Error getting access token: {e}")
        return None


def initiate_stk_push(phone_number, amount, account_reference="Pharmalink", transaction_desc="Sale Payment"):
    """
    Initiate M-Pesa STK Push to customer's phone
    
    Args:
        phone_number (str): Customer phone number in format 254XXXXXXXXX
        amount (int/float): Amount to charge
        account_reference (str): Reference for the transaction
        transaction_desc (str): Description of the transaction
    
    Returns:
        dict: Response from M-Pesa API
    """
    # Get access token
    access_token = get_access_token()
    if not access_token:
        return {"error": "Failed to get access token"}
    
    # Generate timestamp
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    
    # Generate password
    password_str = f"{BUSINESS_SHORTCODE}{PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode('utf-8')
    
    # Request headers
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Request payload
    payload = {
    "BusinessShortCode": BUSINESS_SHORTCODE,
    "Password": password,
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": int(amount),
    "PartyA": phone_number,
    "PartyB": BUSINESS_SHORTCODE,
    "PhoneNumber": phone_number,  # ✅ Use the parameter
    "CallBackURL": CALLBACK_URL,  # ✅ Use the variable
    "AccountReference": account_reference,
    "TransactionDesc": transaction_desc
}
    
    # M-Pesa STK Push URL
    url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error initiating STK push: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        return {"error": str(e)}


def query_stk_status(checkout_request_id):
    """
    Query the status of an STK push transaction
    
    Args:
        checkout_request_id (str): CheckoutRequestID from STK push response
    
    Returns:
        dict: Transaction status
    """
    access_token = get_access_token()
    if not access_token:
        return {"error": "Failed to get access token"}
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{BUSINESS_SHORTCODE}{PASSKEY}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode('utf-8')
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "BusinessShortCode": BUSINESS_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id
    }
    
    url = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error querying STK status: {e}")
        return {"error": str(e)}


# Test the STK Push
if __name__ == "__main__":
    # Test with Safaricom sandbox test number
    test_phone = "254708374149"  # Sandbox test number
    test_amount = 1  # Minimum amount for testing
    
    print("Initiating STK Push...")
    response = initiate_stk_push(test_phone, test_amount)
    print(f"Response: {response}")
    
    # If successful, you can query the status
    if response.get('CheckoutRequestID'):
        print("\nQuerying transaction status...")
        status = query_stk_status(response['CheckoutRequestID'])
        print(f"Status: {status}")
