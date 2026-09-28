import React, { useState } from 'react';
import Header from './components/Header';
import ResumeUploader from './components/ResumeUploader';
import RedactionViewer from './components/RedactionViewer';
import SkillParserView from './components/SkillParserView';
import { ShieldAlert, Award, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [parseResult, setParseResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('redaction'); // 'redaction' | 'skills'

  const handleParseResume = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resume/parse-and-redact', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setParseResult(data);
        setActiveTab('redaction');
      } else {
        alert('Parsing failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error executing resume redaction:', error);
      alert('Failed to connect to backend server: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Step 1: Resume Ingestion & Upload */}
        <ResumeUploader onParse={handleParseResume} isLoading={isLoading} />

        {/* Step 2 & 3: Results Dashboard (Redaction + Skills & Governance) */}
        {parseResult && (
          <div className="space-y-6">
            {/* Navigation Tabs for Results */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('redaction')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'redaction'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Layer 1: Bias Redaction & Privacy Shield</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-950 text-indigo-300 text-[10px]">
                  {parseResult.stats.totalRedactions} Redacted
                </span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'skills'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Skill Parsing, Delta & Layer 2 Governance</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-950 text-emerald-300 text-[10px]">
                  {parseResult.deltaAnalysis.matchPercentage}% Match
                </span>
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'redaction' && (
              <RedactionViewer result={parseResult} />
            )}

            {activeTab === 'skills' && (
              <SkillParserView
                candidateProfile={parseResult.candidateProfile}
                deltaAnalysis={parseResult.deltaAnalysis}
                studyPlan={parseResult.studyPlan}
                redactedResumeText={parseResult.redactedText}
              />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Interview AI Assessment Engine • Layer 1 Unbiased Hiring Governance & Privacy Shield
      </footer>
    </div>
  );
}
