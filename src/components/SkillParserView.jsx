import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle, AlertTriangle, Sparkles, FileSearch, ShieldCheck } from 'lucide-react';

export default function SkillParserView({ candidateProfile, deltaAnalysis, studyPlan, redactedResumeText }) {
  const [claimText, setClaimText] = useState('Candidate led a team of 4 frontend engineers and optimized PostgreSQL queries.');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!candidateProfile || !deltaAnalysis) return null;

  const handleVerifyClaim = async (e) => {
    e.preventDefault();
    if (!claimText.trim()) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/resume/verify-factuality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimText, redactedResumeText })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.verification);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Profile & Delta Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Extracted Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Parsed Candidate Skills</h3>
                <p className="text-xs text-slate-400">{candidateProfile.domainCategory}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {candidateProfile.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Est. Industry Experience:</span>
            <span className="font-bold text-white text-sm">{candidateProfile.estimatedExperienceYears}+ Years</span>
          </div>
        </div>

        {/* Delta Analysis & Job Alignment */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-emerald-400" />
              Job Match & Skill Gap Delta Analysis
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
              {deltaAnalysis.matchPercentage}% Match Score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Matching Skills */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4" />
                Matching Requirements ({deltaAnalysis.matchingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {deltaAnalysis.matchingSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills / Gaps */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Identified Skill Gaps ({deltaAnalysis.missingSkills.length})
              </span>
              {deltaAnalysis.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {deltaAnalysis.missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No missing technical requirements detected!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Up-Skilling Study Plan Roadmap */}
      {studyPlan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Personalized Up-Skilling & Preparation Study Plan
              </h3>
              <p className="text-xs text-slate-400 mt-1">{studyPlan.summary}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-300">
              {studyPlan.targetMatchScore}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyPlan.recommendedModules.map((module, idx) => (
              <div key={idx} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    {module.week}
                  </span>
                  <span className="text-xs text-slate-400">{module.estimatedHours} hrs/week</span>
                </div>
                <h4 className="text-base font-bold text-white">{module.topic}</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {module.focusAreas.map((area, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 2 Governance: Hallucination & Factuality Verification Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Layer 2 Governance System: Resume Hallucination & Factuality Checker
            </h3>
            <p className="text-xs text-slate-400">
              Cross-references candidate claims against uploaded PDF resume to ensure absolute factuality and prevent fabrication.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyClaim} className="flex gap-3">
          <input
            type="text"
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Test a candidate claim or AI summary assertion..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none font-mono"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow disabled:opacity-50 transition"
          >
            {isVerifying ? 'Verifying Claim...' : 'Verify Factuality'}
          </button>
        </form>

        {verificationResult && (
          <div className={`p-4 rounded-xl border ${
            verificationResult.isVerified
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          } text-xs flex justify-between items-center`}>
            <div>
              <p className="font-bold">{verificationResult.status} ({verificationResult.factualityScore}% Match Score)</p>
              <p className="mt-1">{verificationResult.note}</p>
            </div>
            <span className="font-bold text-sm px-3 py-1 rounded bg-slate-900 border border-slate-800">
              {verificationResult.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
