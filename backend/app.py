import os
from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta
import traceback
from flask_cors import CORS
from methods.add_remove_braincoins import *
from methods.questions import *
from methods.user_login import login_user, get_user_id, user_register


template_dir = os.path.abspath("frontend/JobManagement")

app = Flask(__name__, template_folder=template_dir)

CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    return login_user(request)

@app.route('/get_user', methods=['GET'])
def get_user():
    return get_user_id(request)

@app.route('/add_coins', methods=['POST'])
def add_coints():
    return add_remove_braincoins_to_user(request, "add")

@app.route('/remove_coins', methods=['POST'])
def remove_coints():
    return add_remove_braincoins_to_user(request, "remove")

@app.route('/get_coins', methods=['GET'])
def remove_coints():
    return get_user_coins(request)

@app.route('/register', methods=['POST'])
def register():
    return user_register(request)

@app.route('/store_question', methods=['POST'])
def store_q():
    return add_study_question(request)

@app.route('/complete_question', methods=['POST'])
def complete_question():
    return complete_q(request)

@app.route('/get_question_by_user', methods=['GET'])
def get_qs_by_user():
    return retrieve_questions_by_user(request)

@app.route('/get_subjects_by_user', methods=['GET'])
def get_subjects_by_user():
    return get_subs_by_user(request)

@app.route('/file_to_gemini', methods=['POST'])
def get_gemini_qs():
    return get_gem_qs(request)

@app.route('/check_answer', methods=['POST'])
def check_answer():
    return answer_check(request)

@app.route('/question_by_sub', methods=['POST'])
def question_by_sub():
    return retrieve_questions_by_subject(request)
if __name__ == '__main__':
    app.run(debug=True)

