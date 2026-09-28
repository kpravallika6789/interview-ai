import React from 'react';
import { ShieldCheck, Cpu, FileCheck2, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Interview AI
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Core Engine v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Assessment, Up-Skilling & 2-Layer Governance</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Layer 1: Bias & PII Shield Active</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Layer 2: Hallucination Checker Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
