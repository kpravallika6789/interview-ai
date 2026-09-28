import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, UserX, AlertTriangle } from 'lucide-react';

export default function RedactionViewer({ result }) {
  const [showOriginal, setShowOriginal] = useState(true);

  if (!result) return null;

  const { originalText, redactedText, auditLog, stats } = result;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Layer 1 Compliance</p>
            <p className="text-xl font-bold text-white">{stats.layer1ComplianceScore}% Safe</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Redactions</p>
            <p className="text-xl font-bold text-white">{stats.totalRedactions} Items</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Bias Triggers Neutralized</p>
            <p className="text-xl font-bold text-white">
              {(stats.entityCounts.gender || 0) + (stats.entityCounts.appearancePhoto || 0) + (stats.entityCounts.locationNative || 0)} Triggers
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">PII Privacy Sanitized</p>
            <p className="text-xl font-bold text-white">
              {(stats.entityCounts.name || 0) + (stats.entityCounts.email || 0) + (stats.entityCounts.phone || 0) + (stats.entityCounts.address || 0)} Fields
            </p>
          </div>
        </div>
      </div>

      {/* Redaction Side-by-Side Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            Layer 1 Bias Mitigation & PII Redaction View
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showOriginal ? 'Hide Original Comparison' : 'Show Original Comparison'}</span>
            </button>
          </div>
        </div>

        <div className={`grid ${showOriginal ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Left: Original Unredacted */}
          {showOriginal && (
            <div>
              <div className="flex items-center justify-between bg-rose-950/40 border border-rose-500/30 px-4 py-2.5 rounded-t-xl">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Original Unredacted Resume (Contains PII & Bias Risks)
                </span>
              </div>
              <pre className="w-full h-96 bg-slate-950 border-x border-b border-slate-800 rounded-b-xl p-4 text-xs font-mono text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {originalText}
              </pre>
            </div>
          )}

          {/* Right: Anonymized & Redacted Text */}
          <div>
            <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-t-xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Sanitized & Anonymized Resume (Layer 1 Unbiased & Private)
              </span>
            </div>
            <pre className="w-full h-96 bg-slate-950 border-x border-b border-slate-800 rounded-b-xl p-4 text-xs font-mono text-emerald-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {redactedText}
            </pre>
          </div>
        </div>

        {/* Audit Log Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Redaction Audit Trail ({auditLog.length} Audit Entries)
          </h4>
          <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
            {auditLog.map((item, idx) => (
              <div
                key={idx}
                className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono ${
                  item.category === 'Discrimination Mitigation'
                    ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                    : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                }`}
              >
                <span className="font-bold">{item.type}</span>
                <span className="opacity-75">[{item.value}]</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
