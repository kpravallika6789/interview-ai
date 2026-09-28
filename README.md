# Interview AI - Core Assessment & Up-skilling Engine

**Interview AI** is an intelligent, automated mock interview and skill assessment platform with a **2-Layer Governance Architecture** to guarantee unbiased, privacy-compliant, and fact-verified hiring evaluations.

---

## 🛡️ 2-Layer Governance Architecture

### Layer 1: Bias Filter & Privacy Shield (Demographic & PII Redaction)
Automatically redacts any information that could lead to non-merit discrimination or invasion of candidate privacy:
- **Demographic & Bias Factors Redacted**:
  - Skin colour / Physical appearance / Photo headshot references (`[REDACTED_PHOTO_REF]`)
  - Age / Date of Birth / Graduation years (`[REDACTED_AGE]`)
  - Gender & pronouns (*he, she, him, her, Mr., Ms., male, female*) (`[REDACTED_GENDER]`)
  - Native place / Hometown / Place of birth / Nationality / Citizenship (`[REDACTED_NATIVE_INFO]`)
  - Religion, Caste, Marital Status (`[REDACTED_NATIVE_INFO]`)
- **Invasion of Privacy / PII Redacted**:
  - Candidate Full Name (`[REDACTED_CANDIDATE_NAME]`)
  - Email Address (`[REDACTED_EMAIL]`)
  - Phone Number (`[REDACTED_PHONE]`)
  - Physical Street Address (`[REDACTED_ADDRESS]`)
  - LinkedIn / Social Profile URLs (`[REDACTED_PROFILE_URL]`)

### Layer 2: Hallucination & Factuality Checker
Cross-references all candidate claims and AI assertions against the uploaded PDF resume text to verify authenticity and prevent fabrication.

---

## 🚀 Key Modules Built

1. **Resume Ingestion & PDF Parser**: Converts PDF resumes or text input into structured tokens while stripping away sensitive metadata.
2. **Deterministic & NLP Redaction Engine**: Hybrid regex and heuristic filter ensuring 100% compliance before resume reaches evaluation stages.
3. **Skill Parsing & Job Delta Matrix**: Extracts candidate tech stack (React, Node, Python, Docker, PostgreSQL, etc.) and compares against target Job Description requirements to highlight matching vs missing skills.
4. **Personalized Up-Skilling Study Plan**: Automatically creates a week-by-week study roadmap targeting identified skill gaps before mock interview sessions.
5. **Interactive React Dashboard**: Side-by-side comparison of original resume vs. sanitized resume, with real-time audit logs and factuality verification tools.

---

## 💻 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js API, Multer, `pdf-parse`
- **Governance**: Rule-Based & NLP Layer 1 Redaction, Layer 2 Factuality Verification

---

## 🛠️ How to Run

### Recommended Workspace Setting
Please set the workspace directory in your editor to:
`C:\Users\mp\.gemini\antigravity\scratch\interview-ai`

### 1. Start the Backend API
```bash
cd C:\Users\mp\.gemini\antigravity\scratch\interview-ai\server
npm install
npm start
# Backend runs on http://localhost:5000
```

### 2. Start the Frontend UI
```bash
cd C:\Users\mp\.gemini\antigravity\scratch\interview-ai\client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🧪 Testing the Redaction & Bias Shield

1. Open `http://localhost:3000` in your browser.
2. Click **"Load Sample Unredacted Resume"** to automatically load a test resume containing sensitive fields (Name, Gender, Age, DOB, Native Place, Photo reference, Phone, Address).
3. Click **"Process Resume & Run Bias Shield"**.
4. Observe the side-by-side comparison in the **Layer 1: Bias Redaction & Privacy Shield** tab, showing 100% anonymization.
5. Switch to the **Skill Parsing, Delta & Layer 2 Governance** tab to view parsed skills, job match delta %, personalized study plan, and run factuality claim checks!
