from db import get_db_connection

def reset_user_coins():
    user_id = 2
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Direct SQL to set coins to 0
    reset_query = "UPDATE users SET brain_coins = 0 WHERE id = %s"
    
    try:
        cur.execute(reset_query, (user_id,))
        conn.commit()
        
        if cur.rowcount > 0:
            print(f"Coins for user ID {user_id} have been reset to 0 successfully!")
        else:
            print(f"User with ID {user_id} not found!")
            
    except Exception as e:
        conn.rollback()
        print(f"Error resetting coins: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    reset_user_coins()