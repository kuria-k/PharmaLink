import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
import base64
import os

# Load credentials from environment variables or Django settings
CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY') or '5ADNiLZGUidxvm7AyVSdSVHiGN8lOGTNjE5A6TQjZ6r2cMkt'
CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET') or 'vO6bXEKc4SjRj4LmNAvmnbhNGrkLoASNYzuq2TGWa9K3GpjaCWAyisa3lVxdDnpp'
BUSINESS_SHORTCODE = os.getenv('MPESA_SHORTCODE') or 174379
PASSKEY = os.getenv('MPESA_PASSKEY') 
CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL')

def get_access_token():
    url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    response = requests.get(url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
    access_token = response.json().get('access_token')
    return access_token

def initiate_stk_push(phone_number, amount):
    access_token = get_access_token()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((BUSINESS_SHORTCODE + PASSKEY + timestamp).encode()).decode()

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    payload = {
        "BusinessShortCode": BUSINESS_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": BUSINESS_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "Pharmalink",
        "TransactionDesc": "Sale Payment"
    }

    url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
