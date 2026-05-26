"use client";

import React, { useState, useEffect } from "react";
import { runAudit, AuditReport, ToolInput } from "@/lib/audit-engine";
import { Button } from "@/components/Button";

const LOCAL_STORAGE_KEY = "ai_audit_form_state";

export default function ResultsPage() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [rawTools, setRawTools] = useState<ToolInput[]>([]);
  const [useCase, setUseCase] = useState<string>("coding");
  const [teamSize, setTeamSize] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const tools: ToolInput[] = Array.isArray(parsed.tools) ? parsed.tools : [];
        const uc = parsed.useCase || "coding";
        const ts = parsed.teamSize || 1;

        setRawTools(tools);
        setUseCase(uc);
        setTeamSize(ts);

        // Run the logic-driven audit engine!
        const generatedReport = runAudit(tools, uc);
        setReport(generatedReport);
      }
    } catch (e) {
      console.error("Failed to load audit state:", e);
    }
    setIsLoaded(true);
  }, []);

  const handleShareReport = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error("Failed to copy URL:", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center font-sans">
        <div className="text-sm font-mono tracking-tight text-zinc-400 animate-pulse">
          Computing audit reports...
        </div>
      </div>
    );
  }

  // Handle empty state (no tools configured yet)
  if (!report || rawTools.length === 0) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between">
        <header className="border-b border-zinc-100 py-4 px-6 md:px-12 bg-white">
          <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
            AI.AUDIT
          </a>
        </header>

        <main className="max-w-md w-full mx-auto px-6 py-12 text-center space-y-6">
          <div className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
            No Data Configured
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            You haven't built your tool stack yet.
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Please navigate back to the home page to enter your team size, use case, and current active AI tool subscriptions.
          </p>
          <a href="/" className="inline-block w-full">
            <Button variant="primary" className="w-full">
              &larr; Configure Stack
            </Button>
          </a>
        </main>

        <footer className="border-t border-zinc-100 py-6 text-center text-xs font-mono text-zinc-400 bg-white">
          &copy; 2026 AI.AUDIT Inc. Immutable data verification system.
        </footer>
      </div>
    );
  }

  const optimalTools = rawTools.filter(
    (tool) => !report.items.some((item) => item.toolId === tool.id)
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-zinc-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
            AI.AUDIT
          </a>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 border border-zinc-200 text-zinc-400 rounded">
            Report
          </span>
        </div>
        <a href="/" className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Edit Stack
        </a>
      </header>

      {/* Main Core Report Layout */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 flex-grow space-y-8 animate-fadeIn">
        
        {/* Status Notification Banner */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-mono text-zinc-400">AUDIT VERDICT</div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
                {report.status === "Already Optimal"
                  ? "SaaS Configuration Optimal"
                  : "Financial Adjustments Recommended"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs uppercase font-mono font-bold tracking-wide px-3 py-1 border rounded ${
                  report.status === "Already Optimal"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700 animate-pulse"
                }`}
              >
                {report.status}
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-500 leading-relaxed">
            Based on a team size of <strong>{teamSize} seats</strong> for <strong>{useCase}</strong> use cases, we ran our certified subscription algorithms against your stack.
          </p>
        </div>

        {/* Financial Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 border border-zinc-200 rounded-md bg-white space-y-1">
            <span className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
              Total Monthly Savings
            </span>
            <span className="block text-3xl font-mono font-bold text-zinc-900">
              ${report.totalMonthlySavings.toLocaleString()}/mo
            </span>
          </div>

          <div className="p-5 border border-zinc-200 rounded-md bg-white space-y-1">
            <span className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
              Total Annualized Savings
            </span>
            <span className="block text-3xl font-mono font-bold text-emerald-600">
              ${report.totalAnnualSavings.toLocaleString()}/yr
            </span>
          </div>
        </div>

        {/* Credex Certificate Banner if monthly savings > 500 */}
        {report.surfaceCredex && (
          <div className="p-6 border border-black bg-black text-white rounded-md space-y-3 relative overflow-hidden animate-fadeIn">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-zinc-800 rounded-full opacity-30 blur-2xl pointer-events-none" />
            <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-bold">
              Credex Consolidation Approved
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Enterprise Consolidation Pre-Approval
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
              Your organization's optimization margin exceeds **$500/month** in direct licensing wastage. You qualify for high-priority contract grouping, letting you consolidate your billing into a single negotiated corporate account.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-mono tracking-wider bg-zinc-800 px-3 py-1 rounded text-emerald-400 border border-zinc-700">
                CREDEX-ID: CDX-{teamSize}S-{Math.floor(report.totalMonthlySavings)}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Action Items List */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Actionable Optimization List
          </h2>

          {report.items.length === 0 ? (
            <div className="border border-zinc-100 rounded-md p-6 text-center text-sm text-zinc-400">
              No recommendations generated. Your active subscriptions align completely with modern SaaS licensing efficiency.
            </div>
          ) : (
            <div className="space-y-4">
              {report.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-zinc-200 rounded-md bg-white space-y-4"
                >
                  {/* Action Item Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                        {item.name} &bull; {item.plan} plan
                      </div>
                      <h3 className="text-base font-bold text-zinc-950">
                        {item.recommendedAction}
                      </h3>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs text-zinc-400">Savings</div>
                      <div className="text-sm font-bold text-emerald-600">
                        -${item.savings}/mo
                      </div>
                    </div>
                  </div>

                  {/* Finance Reason */}
                  <div className="p-3 bg-zinc-50 rounded border-l-2 border-zinc-900 text-xs text-zinc-600 leading-relaxed font-sans">
                    {item.reason}
                  </div>

                  {/* Metadata */}
                  <div className="text-[10px] font-mono text-zinc-400 flex gap-4 pt-1">
                    <span>Active Seats: {item.seats}</span>
                    <span>Current Spend: ${item.monthlySpend}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Already Optimal List */}
        {optimalTools.length > 0 && (
          <div className="space-y-3 pt-4">
            <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
              Already Optimized Subscriptions
            </h2>
            <div className="border border-zinc-150 rounded-md divide-y divide-zinc-100 bg-white text-xs">
              {optimalTools.map((tool) => (
                <div key={tool.id} className="p-4 flex justify-between items-center text-zinc-500">
                  <div>
                    <span className="font-semibold text-zinc-700">{tool.name}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{tool.plan} plan</span>
                    <span className="mx-2">&bull;</span>
                    <span>{tool.seats} seats</span>
                  </div>
                  <div className="font-mono text-zinc-400">
                    ${tool.monthlySpend}/mo (Optimal)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Panel */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
          <a href="/" className="flex-grow">
            <Button variant="secondary" className="w-full">
              &larr; Configure Settings
            </Button>
          </a>
          <Button
            onClick={handleShareReport}
            variant="primary"
            className="flex-grow"
          >
            {copySuccess ? "Link Copied!" : "Share Public Report"}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 text-center text-xs font-mono text-zinc-400 bg-white">
        &copy; 2026 AI.AUDIT Inc. Immutable data verification system.
      </footer>
    </div>
  );
}
