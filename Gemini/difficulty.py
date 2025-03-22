import google.generativeai as genai
import json

from apikey import apikey
genai.configure(api_key=apikey)  
model = genai.GenerativeModel('gemini-1.5-flash')
response_filename = 'response.json'

try:
    with open(response_filename, "r", encoding="utf-8") as json_file:
        response_data = json.load(json_file)
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error reading {response_filename}: {e}")
    response_data = None

if response_data:
    prompt = f"Generate a difficulty rating on a scale of 1-10 for each response question in this data. Whenever you read a number followed by a colon, that is a new problem that has to be rated. Output each rating on a new line without commas: {json.dumps(response_data)}"
    response = model.generate_content(prompt)
    
    difficulty_ratings = response.text.strip().split("\n")  # Split into separate lines
    difficulty_ratings = [rating.strip() for rating in difficulty_ratings if rating.strip()]  # Clean spaces

    json_filename = 'difficulty.json'

    try:
        with open(json_filename, "r", encoding="utf-8") as json_file:
            data = json.load(json_file)
            if not isinstance(data, list): 
                data = [data]
    except (FileNotFoundError, json.JSONDecodeError):
        data = []  

    new_entry = {"difficulty_ratings": difficulty_ratings}
    data.append(new_entry)

    with open(json_filename, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Difficulty ratings appended to {json_filename}")
else:
    print(f"Could not generate difficulty ratings because {response_filename} could not be read.")