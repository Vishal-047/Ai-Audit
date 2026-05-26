"use client";

import React, { useState, useEffect } from "react";
import { runAudit, AuditReport, ToolInput } from "@/lib/audit-engine";
import { Button } from "@/components/Button";

interface PageProps {
  params: {
    id: string;
  };
}

// Enterprise Demo Stack containing cases for all five financial rules
const DEMO_TOOLS: ToolInput[] = [
  { id: "demo-1", name: "Cursor", plan: "Business", monthlySpend: 120, seats: 3 },
  { id: "demo-2", name: "GitHub Copilot", plan: "Individual", monthlySpend: 30, seats: 3 },
  { id: "demo-3", name: "Claude", plan: "Team", monthlySpend: 150, seats: 3 },
  { id: "demo-4", name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 1 },
  { id: "demo-5", name: "OpenAI API Direct", plan: "Pay-as-you-go", monthlySpend: 350, seats: 1 },
];

export default function SharedAuditPage({ params }: PageProps) {
  const { id } = params;
  const [report, setReport] = useState<AuditReport | null>(null);
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [useCase, setUseCase] = useState<string>("coding");
  const [teamSize, setTeamSize] = useState<number>(10);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_audit_form_state");
      // If we are looking at the demo-share-id or if no local state is present, default to the demo stack
      if (id === "demo-share-id" || !saved) {
        setTools(DEMO_TOOLS);
        setUseCase("coding");
        setTeamSize(10);
        setReport(runAudit(DEMO_TOOLS, "coding"));
        setIsDemo(true);
      } else if (saved) {
        const parsed = JSON.parse(saved);
        const savedTools = Array.isArray(parsed.tools) ? parsed.tools : [];
        const uc = parsed.useCase || "coding";
        const ts = parsed.teamSize || 1;

        setTools(savedTools);
        setUseCase(uc);
        setTeamSize(ts);
        setReport(runAudit(savedTools, uc));
      }
    } catch (e) {
      console.error("Failed to compile shared report:", e);
    }
    setIsLoaded(true);
  }, [id]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error("Failed to copy URL:", e);
    }
  };

  if (!isLoaded || !report) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center font-sans">
        <div className="text-sm font-mono tracking-tight text-zinc-400 animate-pulse">
          Retrieving shared audit...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-zinc-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
            AI.AUDIT
          </a>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 border border-zinc-200 text-zinc-400 rounded">
            Public View
          </span>
        </div>
        <a href="/" className="text-xs font-mono text-zinc-600 hover:text-zinc-950 font-medium">
          Create My Audit
        </a>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto px-6 py-12 flex-grow space-y-8 animate-fadeIn">
        {/* Share Banner */}
        <div className="p-4 border border-zinc-200 bg-zinc-50 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="font-mono text-zinc-500">
            SHARED REPORT ID: <strong className="text-zinc-800">{id}</strong>
            {isDemo && <span className="ml-2 text-indigo-600 font-bold">(Enterprise Demo Stack)</span>}
          </div>
          <Button onClick={handleCopyLink} variant="secondary" className="py-1 px-3 text-xs">
            {copySuccess ? "Copied!" : "Copy Report Link"}
          </Button>
        </div>

        {/* Verdict and Overview */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-mono text-zinc-400 font-semibold uppercase">Shared Analysis</div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 mt-1">
                {report.status === "Already Optimal"
                  ? "SaaS Configuration Optimal"
                  : "Financial Adjustments Recommended"}
              </h1>
            </div>
            <span
              className={`text-xs uppercase font-mono font-bold tracking-wide px-3 py-1 border rounded ${
                report.status === "Already Optimal"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {report.status}
            </span>
          </div>

          <p className="text-sm text-zinc-500 leading-relaxed">
            This read-only report contains the verified licensing allocation audits for a team of <strong>{teamSize} seats</strong> optimizing for <strong>{useCase}</strong> workloads.
          </p>
        </div>

        {/* Financial metrics */}
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

        {/* Credex consolidation */}
        {report.surfaceCredex && (
          <div className="p-6 border border-black bg-black text-white rounded-md space-y-3">
            <div className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-bold">
              Credex Consolidation Approved
            </div>
            <h3 className="text-lg font-bold tracking-tight text-white">
              Enterprise Consolidation Pre-Approval
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your organization's optimization margin exceeds **$500/month** in direct licensing wastage. You qualify for high-priority contract grouping, letting you consolidate your billing into a single negotiated corporate account.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[10px] font-mono tracking-wider bg-zinc-800 px-3 py-1 rounded text-emerald-400 border border-zinc-700">
                CREDEX-ID: CDX-{teamSize}S-{Math.floor(report.totalMonthlySavings)}
              </span>
            </div>
          </div>
        )}

        {/* Recommendations list */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Actionable Optimization List
          </h2>

          <div className="space-y-4">
            {report.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 border border-zinc-200 rounded-md bg-white space-y-4"
              >
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

                <div className="p-3 bg-zinc-50 rounded border-l-2 border-zinc-900 text-xs text-zinc-600 leading-relaxed font-sans">
                  {item.reason}
                </div>

                <div className="text-[10px] font-mono text-zinc-400 flex gap-4 pt-1">
                  <span>Active Seats: {item.seats}</span>
                  <span>Current Spend: ${item.monthlySpend}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-zinc-100 text-center">
          <a href="/">
            <Button variant="primary" className="px-8 font-semibold">
              Analyze My Custom Stack
            </Button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 text-center text-xs font-mono text-zinc-400 bg-white">
        &copy; 2026 AI.AUDIT Inc. Immutable data verification system.
      </footer>
    </div>
  );
}
