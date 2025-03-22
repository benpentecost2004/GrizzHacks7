from flask import jsonify, request
from db import get_db_connection
from methods.user_login import get_user_id
from flask import jsonify, request
from psycopg2.extras import RealDictCursor

# store based on class 
"""
"11. Place each sequence in its classification region in the "Happy Land of Sequences" diagram. (\u03b3 is Euler's constant, f<sub>n</sub> is the Fibonacci sequence, and g<sub>n</sub> is the golden ratio sequence.)",
        "    (a) (n<sup>2</sup>)<sup>1/n</sup>   (b) ((-1)<sup>n</sup>)<sup>1/n</sup>   (c) (\u03b3<sup>n</sup>)<sup>1/n</sup>   (d) (n + 2(-1)<sup>n</sup>)   (e) ((-1)<sup>n</sup> f<sub>n</sub>)<sup>1/n</sup>   (f) (9<sup>n</sup>/n!)<sup>1/n</sup>   (g) ((-3)<sup>n</sup>/n!)<sup>1/n</sup>   (h) (2cos(n\u03c0))<sup>1/n</sup>   (i) (n + n(-1)<sup>n</sup>)<sup>1/n</sup>",
        "",
        "",
        "12. Show that ((1 + 1/n)<sup>n</sup>) is a monotone increasing sequence bounded below by 2 and above by 3. Explain why we can conclude that lim<sub>n\u2192\u221e</sub> (1 + 1/n)<sup>n</sup> exists and is a real number between 2 and 3 (which we call Euler number e).",
        "",
        "",
"""

def add_study_question(request):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        data = request.get_json()
        user_id = 2  # get_user_id(request) 
        difficulty = data.get("difficulty", 10)
        subject = data.get("subject", "General")  # Assuming a default subject if not provided
        tokens_for_completion = 0
        true_dif = difficulty
        # Ensure difficulty is within the range [1, 10]
        if difficulty < 1 or difficulty > 10:
            return jsonify({"message": "Difficulty must be between 1 and 10!"}), 400

        while difficulty >= 1:
            tokens_for_completion += 10 
            difficulty -= 1

        question = data.get("question")

        if not question:
            return jsonify({"message": "Question content is required!"}), 400

        query = """
            INSERT INTO study_qs (user_id, difficulty, tokens_for_completion, question, question_complete, subject) 
            VALUES (%s, %s, %s, %s, FALSE, %s) RETURNING id
        """

        cur.execute(query, (user_id, true_dif, tokens_for_completion, question, subject))
        question_id = cur.fetchone()[0]  # Get the inserted question ID

        conn.commit()

        return jsonify({"message": "Study question added successfully!", "question_id": question_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

def complete_q(request):
    conn = get_db_connection()
    cur = conn.cursor()
    question_id = 1 # get_user_id(request)
    problem_complete_query = """
        UPDATE study_qs
        SET question_complete = true
        WHERE id = %s
    """
    # Execute the query with the user ID
    try:
        cur.execute(problem_complete_query, (question_id,))
        # Commit the transaction
        conn.commit()

        if cur.rowcount > 0:
            return jsonify({"message": "Successfully Updated"}), 200
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

def retrieve_questions_by_user(request):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    user_id = 2 # get_user_id(request)
    query = "SELECT * FROM study_qs WHERE user_id = %s;"
    cursor.execute(query, (user_id,))
    
    questions = cursor.fetchone()  
    cursor.close()
    conn.close()
    
    return questions