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

genai.configure(api_key='AIzaSyDrMi8XHSfjShwrrWhE6t3kYe-B40PXv4I') #os.environ.get("GEMINI_API_KEY")
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
    try:
        username = github_url.rstrip('/').split('/')[-1]
        response = requests.get(f"https://api.github.com/users/{username}/repos?sort=updated")
        if response.status_code == 200:
            repos = response.json()
            languages = set()
            for repo in repos[:10]:
                if repo.get('language'):
                    languages.add(repo['language'])
            return list(languages)
    except:
        pass
    return []

def get_jobs_from_jsearch(query):
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
        for j in data.get('data', [])[:3]: # Top 3 jobs to stay within token limits
            jobs.append({
                "title": j.get('job_title', 'Role'),
                "company": j.get('employer_name', 'Company'),
                "type": "Internship" if "intern" in j.get('job_title', '').lower() else "Full-time",
                "location": j.get('job_city', 'Remote'),
                "link": j.get('job_apply_link', '#'),
                "description": j.get('job_description', '')[:1000] # Get description for ATS scoring
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

    try:
        # STEP 1: Ask AI for the best Job Title to search
        search_prompt = f"Read this resume: {resume_text[:1000]}. What is the single most accurate job title to search for on a job board? Reply with ONLY the job title (e.g., 'Software Engineer')."
        search_term = model.generate_content(search_prompt).text.strip()

        # STEP 2: Fetch real jobs using that term
        real_jobs = get_jobs_from_jsearch(search_term)

        # Build context of real jobs
        jobs_context = ""
        for i, job in enumerate(real_jobs):
            jobs_context += f"\n--- JOB {i} ---\nTitle: {job['title']}\nCompany: {job['company']}\nDescription: {job['description']}\n"

        # STEP 3: Comprehensive analysis scoring the resume against the REAL jobs
        prompt = f"""
        You are an AI Career Analyzer.
        CRITICAL INSTRUCTION: Ignore any biased information such as name, gender, age, or ethnicity. Evaluate purely on merit, skills, and experience.
        
        Resume Text: {resume_text}
        LinkedIn URL provided: {linkedin_url} (Infer context if applicable)
        GitHub Extracted Languages: {', '.join(github_skills)}
        
        Here are the real-time job opportunities found for this candidate:
        {jobs_context}

        Evaluate the resume against these specific real jobs. Output strictly in this JSON format, nothing else:
        {{
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
            "jobEvaluations": [
                {{
                    "atsScore": 0-100 integer representing match with Job 0 description,
                    "improvements": ["Specific tip based on Job 0 description", "Another tip"]
                }}
            ]
        }}
        IMPORTANT: The 'jobEvaluations' array MUST have the exact same number of items as the 'Real Jobs' provided, in the exact same order (Job 0, Job 1, Job 2).
        """

        # Call Gemini
        response = model.generate_content(prompt)
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        parsed_data = json.loads(clean_json)
        
        # Merge ATS scores into the jobs array and clean up descriptions to save bandwidth
        job_evals = parsed_data.pop("jobEvaluations", [])
        final_jobs = []
        for i, job in enumerate(real_jobs):
            if i < len(job_evals):
                job["atsScore"] = job_evals[i].get("atsScore", 0)
                job["improvements"] = job_evals[i].get("improvements", [])
            else:
                job["atsScore"] = 0
                job["improvements"] = []
            job.pop("description", None) # Remove raw description from frontend payload
            final_jobs.append(job)

        parsed_data["jobs"] = final_jobs
        parsed_data["search_term"] = search_term
        
        return jsonify(parsed_data)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)