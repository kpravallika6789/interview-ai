import React, { useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

const SAMPLE_SENSITIVE_RESUME = `JOHNATHAN DOE
Email: john.doe.privacy@example.com | Phone: +1 (555) 019-2834
Address: 742 Evergreen Terrace, Springfield, OR 97477
LinkedIn: https://linkedin.com/in/johnathan-doe-tech
Gender: Male (He/Him) | DOB: 14/05/1995 (Age: 29) | Native Place: Springfield, Oregon | Citizenship: US Citizen
Marital Status: Single | Religion: Non-denominational | Photo attached: Yes (Fair complexion, professional headshot)

SUMMARY
Experienced Full Stack Engineer (He/Him) with 5+ years of software development expertise. Born in Oregon, Johnathan specializes in building high-scale React web applications, Node.js backend microservices, PostgreSQL databases, Docker containers, and REST APIs.

PROFESSIONAL EXPERIENCE
Senior Software Developer | TechCorp Inc. (Springfield)
2021 - Present
- Led a team of 4 frontend engineers building React and TypeScript applications.
- Optimized PostgreSQL database query response times by 35%.
- Integrated Docker and CI/CD pipelines for automated cloud deployments.

Software Engineer | Innovate Software Ltd.
2019 - 2021
- Developed scalable Express.js and Node.js API endpoints.
- Designed responsive interfaces using Tailwind CSS and HTML5.

EDUCATION & CERTIFICATIONS
B.S. in Computer Science | Oregon State University (Graduated 2019)
Certifications: AWS Certified Developer (2022)`;

const SAMPLE_JOB_DESCRIPTION = `Senior Full Stack Developer Requirements:
- 4+ years of professional software engineering experience.
- Strong proficiency in React, TypeScript, Node.js, and Express.js.
- Expertise with PostgreSQL, Prisma ORM, and database architecture.
- Hands-on experience with Docker, CI/CD pipelines, and cloud services (AWS).
- Experience with AI / LLM APIs, Python, or Ollama is a strong plus.
- Excellent communication skills and system design experience.`;

export default function ResumeUploader({ onParse, isLoading }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setActiveTab('text');
    setResumeText(SAMPLE_SENSITIVE_RESUME);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'upload' && !file) {
      alert('Please select a PDF resume file or switch to Text input tab.');
      return;
    }
    if (activeTab === 'text' && !resumeText.trim()) {
      alert('Please enter or paste resume text.');
      return;
    }

    const formData = new FormData();
    if (activeTab === 'upload' && file) {
      formData.append('resumeFile', file);
    } else {
      formData.append('resumeText', resumeText);
    }
    formData.append('jobDescription', jobDescription);

    onParse(formData);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Resume Ingestion & Bias Shield Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload candidate PDF resume & target Job Description to redact PII and demographic bias triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Load Sample Unredacted Resume</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex space-x-2 p-1 bg-slate-950 rounded-xl border border-slate-800 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload PDF Resume
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Paste Resume Text
          </button>
        </div>

        {/* Upload / Text Area Input */}
        {activeTab === 'upload' ? (
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 text-center bg-slate-950/40 transition">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-pdf-input"
            />
            <label htmlFor="resume-pdf-input" className="cursor-pointer space-y-3 block">
              <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {file ? file.name : 'Click to select or drag & drop PDF resume'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF files up to 10MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Unredacted Candidate Resume Text
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume raw text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        )}

        {/* Target Job Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Job Description (for Delta & Skill Gap Analysis)
          </label>
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job requirements and tech stack here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Executing Layer 1 Governance & Redaction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Process Resume & Run Bias Shield</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
