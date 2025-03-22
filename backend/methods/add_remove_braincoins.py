from db import get_db_connection
from methods.user_login import get_user_id
from flask import jsonify
def add_remove_braincoins_to_user(request, action):
    conn = get_db_connection()
    cur = conn.cursor()
    user_id = 1 # get_user_id(request)
    if action == "remove":
        coin_query = """
            UPDATE users
            SET brain_coins = brain_coins - 10
            WHERE id = %s
        """
    else:
        coin_query = """
            UPDATE users
            SET brain_coins = brain_coins + 10
            WHERE id = %s
        """
    # Execute the query with the user ID
    try:
        cur.execute(coin_query, (user_id,))

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
