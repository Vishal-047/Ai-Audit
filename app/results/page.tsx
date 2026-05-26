import React from "react";

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 z-10 relative">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <a
              href="/"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all duration-300 group mb-2"
            >
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Back to Home
            </a>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Audit Logs & Analysis
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-semibold">
              Live Feed
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>

        {/* Audit Report Card Skeletons */}
        <div className="space-y-6">
          {[
            { id: "audit-01", name: "Model Endpoint Leakage Test", status: "Completed", score: "98/100" },
            { id: "audit-02", name: "Prompt Injection Defense Verification", status: "Warning", score: "74/100" },
            { id: "audit-03", name: "Toxic Content Filtering Sandbox Check", status: "Analyzing...", score: "--" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] backdrop-blur-md hover:border-white/10 transition-all duration-300 hover:bg-white/[0.02]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">{item.id}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        item.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.status === "Warning"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-200 text-lg">{item.name}</h3>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 font-medium">Safety Score</div>
                    <div className="text-xl font-mono font-bold text-zinc-200">{item.score}</div>
                  </div>
                  <a
                    href={`/audit/${item.id}`}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold tracking-wide transition-all duration-300"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
