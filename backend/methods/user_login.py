import os
import jwt
import traceback
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import jsonify, request
from database.queries import fetch_user_by_email


load_dotenv()
def login_user(request):
    
    """Handles user login and returns a JWT token."""
    try:
        data = request.get_json()
        secret_key = os.getenv('SECRET_KEY')
        print(secret_key)
        if not secret_key:
            return jsonify({"message": "SECRET_KEY is missing!"}), 500
        if not data:
            return jsonify({"message": "No data provided!"}), 400
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({"message": "Email and password are required!"}), 400
        
        # Fetch user from the database
        user = fetch_user_by_email(email)
        if not user or user['password'] != password:
            return jsonify({"message": "Invalid email or password!"}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(hours=2)  # Token expires in 2 hours
        }, secret_key, algorithm='HS256')

        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user_id': user['id'],
            'user': {
                'id': user['id'],
                'email': user['email'],
                'role': user['role'],
                'date_created': user['date_created']
            }
        }), 200
    except Exception as e:
        print(f"Error during login: {e}")
        print(traceback.format_exc()) 
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

def get_jwt_token(request):
    secret_key = os.getenv('SECRET_KEY')
    # Extract the JWT token from the Authorization header
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing!"}), 401
    
    # Decode the token to get the user_id
    try:
        token = token.split(" ")[1]  # Get the token from 'Bearer <token>'
        print(token)
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        user_id = decoded_token['user_id'] 
        return user_id
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"message": "Invalid or expired token!"}), 401

def get_user_id(request):
    user_id = get_jwt_token(request)
    return user_id
