import google.generativeai as genai
import json
import re

from apikey import apikey

genai.configure(api_key=apikey)
model = genai.GenerativeModel('gemini-2.0-flash')
response_filename = 'response.json'

def extract_problems_from_latex(response_data):
    """
    Extracts individual math problems from LaTeX-formatted responses.
    Looks for numbered problems (e.g., "1: ..." or "Problem 1: ..."),
    as well as standalone LaTeX equations that could be problems.
    """
    problems = []
    problem_number = 1 

    for file, contents in response_data.items():
        text = "\n".join(contents) 

        numbered_problems = re.findall(r'(\d+: .*?)(?=\n\d+: |\Z)', text, re.DOTALL)

        if numbered_problems:
            problems.extend(numbered_problems)
        else:
            latex_blocks = re.findall(r'\$\$.*?\$\$', text, re.DOTALL) 
            inline_latex = re.findall(r'\$.*?\$', text)

            if not latex_blocks and not inline_latex:
                potential_problems = text.split("\n")
                problems.extend(potential_problems)
            else:
                problems.extend(latex_blocks + inline_latex)

    problems = [p.strip() for p in problems if p.strip()]
    
    return problems

try:
    with open(response_filename, "r", encoding="utf-8") as json_file:
        response_data = json.load(json_file)
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error reading {response_filename}: {e}")
    response_data = None

if response_data:
    problems = extract_problems_from_latex(response_data)

    prompt = (
        "Rate the difficulty of each of the following problems on a scale of 1-10. "
        "The problems may include LaTeX math expressions. Assign a rating for each one separately. "
        "Format your output with each rating on a new line without commas:\n\n"
    )
    prompt += "\n".join(problems)

    response = model.generate_content(prompt)
    
    difficulty_ratings = response.text.strip().split("\n") 
    difficulty_ratings = [rating.strip() for rating in difficulty_ratings if rating.strip()]

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
        json.dump(data, json_file, indent=4, ensure_ascii=False)

    print(f"Difficulty ratings appended to {json_filename}")
else:
    print(f"Could not generate difficulty ratings because {response_filename} could not be read.")