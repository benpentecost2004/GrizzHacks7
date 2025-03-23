from flask import jsonify, request
from db import get_db_connection
from methods.user_login import get_user_id
from flask import jsonify, request
from psycopg2.extras import RealDictCursor
import tempfile
import json
import os
from Gemini.app import generate_response, load_existing_responses
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

def add_study_set(data):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        print("hello from add study set")
        print(data)
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


def add_study_question(request):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        print("hello from add study questions")
        data = request.get_json()

        print(data)
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

def retrieve_questions_by_subject(request):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    user_id = 2 # get_user_id(request)
    data = request.get_json()
    subject = data.get("subject")
    query = "SELECT * FROM study_qs WHERE user_id = %s AND WHERE subject = %s;"
    cursor.execute(query, (user_id,subject,))
    
    questions = cursor.fetchone()  
    cursor.close()
    conn.close()
    
    return questions
def get_subs_by_user(request):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    user_id = 2  # get_user_id(request)
    query = "SELECT * FROM study_qs WHERE user_id = %s"
    cursor.execute(query, (user_id,))

    # Fetch all questions
    questions = cursor.fetchall()  

    # Extract all subjects from the questions
    subjects = [question['subject'] for question in questions]

    cursor.close()
    conn.close()

    return subjects


def get_gem_qs(request):
    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    subject = request.form.get('subject')  # Assuming subject comes from form data or as part of the request

    # Check if the file has no filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Ensure the file is a PDF, JPG, or JPEG
    if not (file.filename.endswith('.pdf') or file.filename.endswith('.jpg') or file.filename.endswith('.jpeg')):
        return jsonify({'error': 'File type not supported'}), 400

    # Set the suffix based on the file extension
    if file.filename.endswith('.pdf'):
        suffix = ".pdf"
    elif file.filename.endswith('.jpg'):
        suffix = ".jpg"
    elif file.filename.endswith('.jpeg'):
        suffix = ".jpeg"

    try:
        # Save the uploaded file temporarily with the appropriate suffix
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            file_path = temp_file.name
            file.save(file_path)

        # Process the file and generate questions
        prompt_text = "Generate the exact questions in the file with no solutions. Also, create a set of similar but unique problems. Format the questions and answers in json"

        questions = generate_response(file_path, prompt_text)

        # Create the data object
        data = {
            'question': questions,
            'difficulty': 5,          # Set difficulty level to 5
            'subject': subject        # Set subject from the request
        }

        # Add study question
        add_study_set(data)

        # Return success message
        return jsonify({'message': 'File processed successfully!'}), 200

    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

def answer_check(request):
    try:
        data = request.get_json()  # Extract JSON data
        question = data.get("question")  # Get question from JSON
        answer_input = data.get("answer")  # Get answer from JSON
        print("question: ", question)
        print("answer: ", answer_input)

        if not question or not answer_input:
            return jsonify({"error": "Missing question or answer"}), 400

        prompt = "Does the answer correctly answer the question. Return true if yes and false if no. Only respond with true or false nothing else. If it is a math question make sure to turn the answer into a number"
        string = f"Question: {question} Answer: {answer_input}"
        
        response = generate_response(string, prompt)
        
        return jsonify({"result": response})  # Return response in JSON format

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
