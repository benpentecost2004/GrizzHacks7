import os
from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta
import traceback
from methods.add_remove_braincoins import add_remove_braincoins_to_user
from methods.user_login import login_user, get_user_id


template_dir = os.path.abspath("frontend/JobManagement")

app = Flask(__name__, template_folder=template_dir)

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
if __name__ == '__main__':
    app.run(debug=True)
