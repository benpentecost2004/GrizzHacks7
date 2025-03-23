from db import get_db_connection
from methods.user_login import get_user_id
from flask import jsonify
def add_remove_braincoins_to_user(request, action):
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.get_json()
    aura_points = data.get("amount")
    user_id = 2 # get_user_id(request)
    if action == "remove":
        coin_query = """
            UPDATE users
            SET brain_coins = brain_coins - %s
            WHERE id = %s
        """
    else:
        coin_query = """
            UPDATE users
            SET brain_coins = brain_coins + %s
            WHERE id = %s
        """
    # Execute the query with the user ID
    try:
        cur.execute(coin_query, (aura_points,user_id))

        # Commit the transaction
        conn.commit()

        if cur.rowcount > 0:
            if action == "remove":
                return jsonify({"message": "Braincoins removed successfully!"}), 200
            else:
                return jsonify({"message": "Braincoins added successfully!"}), 200
        else:
            return jsonify({"message": "User not found!"}), 404

    except Exception as e:
        # If there was an error, rollback and return an error message
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()

def get_user_coins(request):
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = 2 # get_user_id(request)
    query = "SELECT brain_coins FROM users WHERE id = %s;"
    cursor.execute(query, (user_id,))
    
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if result:
        return jsonify({"brain_coins": result[0]}), 200
    else:
        return jsonify({"error": "User not found"}), 404
