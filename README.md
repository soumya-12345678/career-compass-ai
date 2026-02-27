# 🧭 Career Compass AI

**Intelligent Career Recommendation Platform using AI & Data Analytics**
> Built for WITCHAR-2026 |

Career Compass AI is an advanced, bias-free career guidance system. It goes beyond simple keyword matching by using Large Language Models (LLMs) to understand a candidate's context, evaluating their GitHub repositories for verifiable skills, and matching them with real-world, real-time job listings tailored to their exact seniority level.

---

## ✨ Key Features

* **📄 Smart Resume Parsing:** Upload PDF, DOC, or DOCX files. The system reads the unstructured text to understand projects, education, and experience.
* **🐙 GitHub Verification:** Connect a GitHub profile to analyze the user's latest repositories and extract the actual programming languages they use.
* **⚖️ Bias-Free AI Engine:** Engineered prompts force the AI to ignore demographic markers (name, gender, ethnicity) and evaluate purely on merit.
* **🎯 Role-Specific ATS Scoring:** Calculates Applicant Tracking System (ATS) match percentages tailored to *specific* roles, along with precise bullet points on how to improve the resume for that exact job.
* **📈 Experience Detection:** Dynamically detects whether the user is a Fresher or a Senior Professional and adjusts role recommendations accordingly.
* **🤖 AI Replacement Risk:** Predicts the likelihood of the recommended roles being automated by AI in the future.
* **💼 Real-Time Job Market Data:** Integrates with JSearch API to fetch active, live job and internship listings directly matching the AI's top recommended role.

---

## 🛠️ Technology Stack

### Frontend
* **Framework:** React.js (via Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React

### Backend
* **Framework:** Python Flask
* **AI Engine:** Google Gemini API (`gemini-1.5-flash`)
* **Data Parsing:** `PyPDF2`, `python-docx`
* **External APIs:** GitHub REST API, JSearch (RapidAPI)

---

## 🚀 Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js (v18+)
* Python (3.11+)
* API Keys for Google Gemini and RapidAPI (JSearch)

### 1. Backend Setup
Navigate to the `backend` directory and set up the Python environment:

```bash
# Navigate to backend folder
cd backend

# Create and activate a virtual environment (Windows)
py -3.11 -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
