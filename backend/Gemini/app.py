import google.generativeai as genai
import fitz, json, os
import requests
from PIL import Image
from Gemini.apikey import apikey

genai.configure(api_key=apikey)
model = genai.GenerativeModel('gemini-2.0-flash')

def extract_pdf(file_path):
    """Extract text from a PDF file."""
    try:
        doc = fitz.open(file_path)
        text = "\n".join(page.get_text("text") for page in doc)
        return text if text.strip() else "No readable text found in PDF."
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_text(file_path):
    """Extract text from supported file types."""
    try:
        file_extension = file_path.split('.')[-1].lower()

        if file_extension in ['txt', 'py', 'js', 'html', 'css', 'md', 'csv', 'xml', 'rtf']:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        elif file_extension == 'pdf':
            return extract_pdf(file_path)
        else:
            return None
    except Exception as e:
        return f"Error reading file: {str(e)}"

def load_existing_responses(file_name):
    """Load existing responses from a JSON file if it exists."""
    if os.path.exists(file_name):
        try:
            with open(file_name, "r", encoding="utf-8") as json_file:
                return json.load(json_file)
        except json.JSONDecodeError:
            return {}
    return {}

def save_responses(file_name, responses):
    """Save responses to a JSON file."""
    with open(file_name, "w", encoding="utf-8") as json_file:
        json.dump(responses, json_file, indent=4, ensure_ascii=False)

def process_files(file_paths, prompt_text):
    """Process multiple files and generate AI responses with LaTeX formatting."""
    responses = load_existing_responses("response.json")
    answers = load_existing_responses("answers.json")

    for file_path in file_paths:
        try:
            file_extension = file_path.split('.')[-1].lower()

            if file_extension in ['jpg', 'jpeg', 'png']:
                image = Image.open(file_path)
                contents = [prompt_text, image]
            else:
                file_content = extract_text(file_path)
                if file_content is None:
                    responses[file_path] = "Unsupported file type."
                    answers[file_path] = "Unable to generate answer (unsupported file)."
                    continue
                contents = [prompt_text, file_content]

            latex_prompt = (
                "Format all mathematical content using LaTeX syntax. "
                "Use '$$' for block equations and '$' for inline equations. "
                "Generate the exact questions in the images with no solutions. "
                "Also, create a set of similar but unique problems."
            )

            response = model.generate_content([latex_prompt] + contents)
            response_text = response.text

            responses[file_path] = response_text.split("\n")

            answer_prompt = f"Provide detailed solutions in LaTeX format for the following problems:\n{response_text}"
            answer_response = model.generate_content([answer_prompt])
            answer_text = answer_response.text
            answers[file_path] = answer_text.split("\n")

        except FileNotFoundError:
            responses[file_path] = "File not found."
            answers[file_path] = "No answer due to file not found."
        except Exception as e:
            responses[file_path] = f"An error occurred: {str(e)}"
            answers[file_path] = f"Error generating answer: {str(e)}"

    print("Responses and answers saved with LaTeX formatting.")
    return responses

def generate_response(file_paths, prompt_text):
    print("file_paths:", file_paths)
    print("prompt_text:", prompt_text)

    response = model.generate_content(extract_pdf(file_paths) + prompt_text)
    print(response.text)
    return response.text

