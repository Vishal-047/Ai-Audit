import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AuditDetailPage({ params }: PageProps) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 z-10 relative">
        {/* Navigation & Title */}
        <div className="space-y-2">
          <a
            href="/results"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all duration-300 group"
          >
            <span className="inline-block transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Results
          </a>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-indigo-100">
                Audit Report Details
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-1">Resource ID: {id}</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-all duration-300">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.828-4.829m0 0a1.5 1.5 0 112.122 2.122l-4.5 4.5m-3.83-3.83l3.83-3.83M4 14a1 1 0 011-1h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20a1 1 0 011 1v4a1 1 0 01-1 1h-3.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293h-3.172a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H5a1 1 0 01-1-1v-4z" />
              </svg>
              Copy Public Share Link
            </button>
          </div>
        </div>

        {/* Detailed Info Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">Execution Parameters</h2>
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div className="p-4 rounded-xl bg-white/[0.02]">
                  <div className="text-zinc-500 text-xs">Model Version</div>
                  <div className="text-zinc-300 font-mono mt-1">GPT-4o / Claude 3.5</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02]">
                  <div className="text-zinc-500 text-xs">Runtime System</div>
                  <div className="text-zinc-300 font-mono mt-1">Audit-Sandbox-v2</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
              <h2 className="text-xl font-bold text-zinc-200">System Logs Skeleton</h2>
              <div className="font-mono text-xs text-zinc-400 bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 overflow-x-auto leading-relaxed">
                <div>[2026-05-26 20:30:15] <span className="text-indigo-400">INFO</span> Initializing sandbox environment for <span className="text-zinc-300">{id}</span></div>
                <div>[2026-05-26 20:30:16] <span className="text-indigo-400">INFO</span> Running boundary token tests (100% completed)</div>
                <div>[2026-05-26 20:30:17] <span className="text-emerald-400">SUCCESS</span> Boundary validation check passed.</div>
                <div className="animate-pulse">[2026-05-26 20:30:18] <span className="text-zinc-500">WAITING</span> Gathering downstream metrics...</div>
              </div>
            </div>
          </div>

          {/* Metric Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center space-y-4 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Overall Score</div>
              <div className="text-6xl font-extrabold tracking-tighter text-indigo-200">92</div>
              <div className="text-xs text-zinc-400">Very High Safety Rank</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4 text-xs text-zinc-400">
              <h3 className="font-semibold text-zinc-300 text-sm">Security Metadata</h3>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Verified Cryptographically</span>
                <span className="text-emerald-400 font-semibold font-mono">YES</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Database Synced</span>
                <span className="text-indigo-300 font-mono">supabase.io</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Created At</span>
                <span className="font-mono">2026-05-26 20:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
