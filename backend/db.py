#Query the moodle database from postgresql

import psycopg2
from dotenv import load_dotenv
from database.create_tables import create_tables_query
import os

#Load Enviornment variables
load_dotenv()

#Get the DATABASE_URL from the .env file
DATABASE_URL = os.getenv("DATABASE_URL")

# Debugging: Print the database URL to check if it's loading correctly
print(f"Loaded DATABASE_URL: {DATABASE_URL}")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL is not found. Make sure .env is in the correct location!")
else:
    try:
        # Connect to Railway PostgreSQL
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("Successfully connected to Railway PostgreSQL!")

        # Create tables in the database
        cursor.execute(create_tables_query)
        conn.commit()
        print("Tables created successfully in Railway PostgreSQL!")

        # Close the connection
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

def get_db_connection():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Failed to get database connection: {e}")
        return None