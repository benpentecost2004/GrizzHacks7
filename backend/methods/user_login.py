import os
import jwt
import traceback
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import jsonify, request
from db import get_db_connection
from database.queries import fetch_user_by_email
from werkzeug.security import generate_password_hash

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


def user_register(request):
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data:
            return jsonify({"message": "No data provided"}), 400

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')

        if not first_name or not last_name or not email or not password:
            return jsonify({"message": "First name, last name, email, and password are required!"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"message": "Email already taken!"}), 400

        # Hash the password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        # Default brain_coins value (assumed to start at 0)
        brain_coins = 0  

        # Insert new user
        cursor.execute(
            """
            INSERT INTO users (first_name, last_name, email, password, brain_coins, role) 
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
            """,
            (first_name, last_name, email, hashed_password, brain_coins, 1)
        )
        user_id = cursor.fetchone()[0]  

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully!", "user_id": user_id}), 201

    except Exception as e:
        print(f"Error during registration: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500