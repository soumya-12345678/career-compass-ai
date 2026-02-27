from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
import requests
from dotenv import load_dotenv
import PyPDF2
from docx import Document
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key='AIzaSyCP5UH-OKL3GwxOy_KZIdrO3B1S-OKJIug') #os.environ.get("GEMINI_API_KEY")
model = genai.GenerativeModel('gemini-2.5-flash')

def extract_text_from_file(file):
    filename = file.filename.lower()
    text = ""
    try:
        if filename.endswith('.pdf'):
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            doc = Document(file)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            text = file.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"File extraction error: {e}")
    return text

def get_github_skills(github_url):
    # Extract username from url
    try:
        username = github_url.rstrip('/').split('/')[-1]
        response = requests.get(f"https://api.github.com/users/{username}/repos?sort=updated")
        if response.status_code == 200:
            repos = response.json()
            languages = set()
            for repo in repos[:10]: # Check last 10 repos
                if repo.get('language'):
                    languages.add(repo['language'])
            return list(languages)
    except:
        pass
    return []

def get_jobs_from_jsearch(query):
    #api_key = os.environ.get("RAPIDAPI_KEY")
    #if not api_key:
    #    return []
        
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": f"{query} in India", "page": "1", "num_pages": "1"}
    headers = {
        "X-RapidAPI-Key": 'cc1fed8c07msh3eb0fb18b08d20ep17bf02jsn3fd10bcc395e', #api_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()
        jobs = []
        for j in data.get('data', [])[:4]: # Top 4 jobs
            jobs.append({
                "title": j.get('job_title', 'Role'),
                "company": j.get('employer_name', 'Company'),
                "type": "Internship" if "intern" in j.get('job_title', '').lower() else "Full-time",
                "location": j.get('job_city', 'Remote'),
                "link": j.get('job_apply_link', '#')
            })
        return jobs
    except Exception as e:
        print(f"JSearch API error: {e}")
        return []

@app.route('/api/analyze', methods=['POST'])
def analyze_profile():
    resume_text = ""
    if 'resume' in request.files:
        resume_text = extract_text_from_file(request.files['resume'])
        
    linkedin_url = request.form.get('linkedin', '')
    github_url = request.form.get('github', '')
    
    github_skills = []
    if github_url:
        github_skills = get_github_skills(github_url)

    # Prompt engineered to ignore bias and enforce exact JSON schema
    prompt = f"""
    You are an AI Career Analyzer. Analyze the following candidate data.
    CRITICAL INSTRUCTION: Ignore any biased information such as name, gender, age, or ethnicity. Evaluate purely on merit, skills, and experience.
    
    Resume Text: {resume_text}
    LinkedIn URL provided: {linkedin_url} (Infer context if applicable)
    GitHub Extracted Languages: {', '.join(github_skills)}

    Output strictly in this JSON format, nothing else:
    {{
        "atsScore": 0-100 integer representing resume quality/formatting,
        "atsImprovements": ["Tip 1", "Tip 2", "Tip 3"],
        "careerPaths": [
            {{"title": "Role Name", "match": 85, "growth": "+15%"}}
        ],
        "skills": {{
            "strong": ["Skill 1", "Skill 2"],
            "missing": ["Missing Skill 1", "Missing Skill 2"]
        }},
        "rejectionReasons": [
            {{"reason": "Why they might fail an interview", "severity": "high/medium/low"}}
        ],
        "aiRisk": [
            {{"role": "Role Name", "risk": 10-90 integer, "label": "Low/Moderate/High"}}
        ],
        "primary_job_search_term": "A single best job title to search for (e.g. 'Software Engineer')"
    }}
    """

    try:
        # Call Gemini
        response = model.generate_content(prompt)
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        parsed_data = json.loads(clean_json)
        
        # Fetch Real Jobs from JSearch based on Gemini's primary role recommendation
        search_term = parsed_data.pop("primary_job_search_term", "Developer")
        real_jobs = get_jobs_from_jsearch(search_term)
        
        parsed_data["jobs"] = real_jobs
        
        return jsonify(parsed_data)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)