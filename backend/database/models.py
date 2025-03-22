from backend.db import get_db_connection
def fetch_users():
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM users;")
  users = cursor.fetchall()
  conn.close()
  return users

def fetch_questions():
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM study_qs;")
  study_qs = cursor.fetchall()
  conn.close()
  return study_qs

