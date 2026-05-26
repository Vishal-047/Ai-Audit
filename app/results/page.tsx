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
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [consultationBooked, setConsultationBooked] = useState(false);
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

        // Run audit calculation
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
    }
  };

  const handleBookConsultation = () => {
    setConsultationBooked(true);
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

  // Handle empty state
  if (!report || rawTools.length === 0) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between">
        <header className="border-b border-zinc-100 py-4 px-6 md:px-12 bg-white">
          <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
            AI.AUDIT
          </a>
        </header>

        <main className="max-w-md w-full mx-auto px-6 py-16 text-center space-y-6">
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

  // Map ALL tools to either their specific audit recommendation or a muted Optimal state
  const toolCards = rawTools.map((tool) => {
    const auditItem = report.items.find((item) => item.toolId === tool.id);
    if (auditItem) {
      return {
        id: tool.id,
        name: tool.name,
        plan: tool.plan,
        monthlySpend: tool.monthlySpend || 0,
        recommendedAction: auditItem.recommendedAction,
        savings: auditItem.savings,
        reason: auditItem.reason,
      };
    } else {
      return {
        id: tool.id,
        name: tool.name,
        plan: tool.plan,
        monthlySpend: tool.monthlySpend || 0,
        recommendedAction: "Already optimised",
        savings: 0,
        reason: "This tool subscription is operating at optimized vendor limits with zero excess redundancy.",
      };
    }
  });

  // Calculate if total annual savings are below $100
  const isSavingsLow = report.totalAnnualSavings < 100;

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
        <a href="/" className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Adjust Config
        </a>
      </header>

      {/* Main Core Report Layout */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-grow space-y-12 animate-fadeIn">
        
        {/* Prominent High-Savings Banner (Monthly Savings > $500) */}
        {report.totalMonthlySavings > 500 && (
          <div className="p-6 border border-zinc-950 bg-zinc-950 text-white rounded-md space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <span className="inline-block text-[10px] font-mono tracking-wider bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-zinc-700">
                PROVEN CREDEX METRIC ELIGIBILITY
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                You could save even more — Credex sells discounted AI credits
              </h2>
            </div>
            {consultationBooked ? (
              <div className="text-xs text-emerald-400 font-mono">
                ✓ Thank you. An enterprise advisor will reach out to schedule your free consultation within 24 hours.
              </div>
            ) : (
              <Button
                onClick={handleBookConsultation}
                variant="secondary"
                className="w-full sm:w-auto text-xs py-2 bg-white text-zinc-900 hover:bg-zinc-100 border-white"
              >
                Book a Free Consultation
              </Button>
            )}
          </div>
        )}

        {/* Hero Section - The absolute most important numbers */}
        <div className="text-center space-y-3 py-6 border-b border-zinc-100">
          <div className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
            Total Combined AI Spend Wastage
          </div>
          <div className="space-y-1">
            <div className="text-5xl md:text-6xl font-mono font-black tracking-tighter text-zinc-950">
              ${report.totalMonthlySavings.toLocaleString()}/mo
            </div>
            <div className="text-lg font-mono font-semibold text-emerald-600">
              ${report.totalAnnualSavings.toLocaleString()}/yr annualized savings
            </div>
          </div>
          <div className="text-xs text-zinc-500 max-w-sm mx-auto pt-2">
            Analysis conducted for a team size of <strong>{teamSize} seats</strong> for <strong>{useCase}</strong> workflows.
          </div>
        </div>

        {/* Low-Savings Gentle Message Banner (< $100 Annualized Savings) */}
        {isSavingsLow && (
          <div className="p-6 border border-zinc-200 rounded-md bg-zinc-50 space-y-4 text-center">
            <p className="text-sm text-zinc-600 leading-normal max-w-md mx-auto">
              You're spending efficiently. We'll notify you when better options appear for your stack.
            </p>
            {emailSubmitted ? (
              <div className="text-xs text-zinc-800 font-mono">
                ✓ Success! Your email is registered for smart price notifications.
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <Button type="submit" variant="primary" className="py-1.5 px-4 text-xs font-semibold">
                  Notify Me
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Dynamic Tool Recommendation Cards */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Tool-by-Tool Optimization Audit
          </h2>

          <div className="space-y-4">
            {toolCards.map((card) => {
              const hasSavings = card.savings > 0;
              return (
                <div
                  key={card.id}
                  className={`p-6 border rounded-md bg-white transition-all duration-200 ${
                    hasSavings ? "border-zinc-300" : "border-zinc-100 opacity-70"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4 pb-4 border-b border-zinc-100">
                    <div className="space-y-0.5">
                      <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                        {card.name} &bull; {card.plan}
                      </div>
                      <h3 className={`text-base font-bold ${hasSavings ? "text-zinc-950" : "text-zinc-500"}`}>
                        {card.recommendedAction}
                      </h3>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                        {hasSavings ? "Savings" : "Status"}
                      </div>
                      {hasSavings ? (
                        <div className="text-sm font-bold text-emerald-600">
                          -${card.savings}/mo
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-zinc-400">
                          Already optimised
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Defensible Explanation Block */}
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                      {card.reason}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1">
                      <span>Monthly Allocation Cost: ${card.monthlySpend}/mo</span>
                      {hasSavings && (
                        <span className="text-emerald-600 font-semibold">
                          Save {Math.round((card.savings / card.monthlySpend) * 100)}% on this tool
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
          <a href="/" className="flex-grow">
            <Button variant="secondary" className="w-full py-3">
              &larr; Configure Settings
            </Button>
          </a>
          <Button
            onClick={handleShareReport}
            variant="primary"
            className="flex-grow py-3"
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
