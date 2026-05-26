import type { Metadata } from "next";
import React from "react";
import { runAudit } from "@/lib/audit-engine";
import { Button } from "@/components/Button";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: {
    id: string;
  };
}

// Enterprise Demo Stack containing cases for all five financial rules (for demo/fallback use)
const DEMO_TOOLS = [
  { id: "demo-1", name: "Cursor", plan: "Business", monthlySpend: 120, seats: 3 },
  { id: "demo-2", name: "GitHub Copilot", plan: "Individual", monthlySpend: 30, seats: 3 },
  { id: "demo-3", name: "Claude", plan: "Team", monthlySpend: 150, seats: 3 },
  { id: "demo-4", name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 1 },
  { id: "demo-5", name: "OpenAI API Direct", plan: "Pay-as-you-go", monthlySpend: 350, seats: 1 },
];

// Async Metadata Generation for Open Graph & Twitter Card SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    // Demo-mode default fallback
    if (id === "demo-share-id") {
      const demoReport = runAudit(DEMO_TOOLS, "coding");
      const title = `AI Spend Audit — $${demoReport.totalMonthlySavings}/month in savings found`;
      const description = `We analyzed active subscriptions for Cursor, GitHub Copilot, Claude, ChatGPT, and OpenAI API and identified immediately actionable monthly savings.`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          images: [
            {
              url: "https://placeholder-url.supabase.co/placeholder-og.png",
              width: 1200,
              height: 630,
              alt: `AI Spend Audit report finding $${demoReport.totalMonthlySavings}/month in savings`,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["https://placeholder-url.supabase.co/placeholder-og.png"],
        },
      };
    }

    // Safe DB fetch for SEO tags
    const { data } = await supabase
      .from("audits")
      .select("total_savings, audit_data")
      .eq("public_id", id)
      .single();

    const savings = data?.total_savings ?? 0;
    const tools = data?.audit_data?.tools || [];
    const toolNames = tools.map((t: any) => t.name || t.toolName).join(", ");

    const title = `AI Spend Audit — $${savings}/month in savings found`;
    const description = toolNames
      ? `We analyzed active subscriptions for ${toolNames} and identified immediately actionable monthly savings.`
      : `Discover license wastage and consolidate subscriptions with our automated AI Spend Audits.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: "https://placeholder-url.supabase.co/placeholder-og.png",
            width: 1200,
            height: 630,
            alt: `AI Spend Audit report finding $${savings}/month in savings`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://placeholder-url.supabase.co/placeholder-og.png"],
      },
    };
  } catch (err) {
    const title = "AI Spend Audit Report";
    const description = "Discover license wastage and consolidate subscriptions with our automated AI Spend Audits.";
    return {
      title,
      description,
    };
  }
}

export default async function SharedAuditPage({ params }: PageProps) {
  const { id } = params;
  let tools: any[] = [];
  let useCase = "coding";
  let teamSize = 1;
  let isDemo = false;
  let data = null;
  let error = null;

  if (id === "demo-share-id") {
    tools = DEMO_TOOLS;
    useCase = "coding";
    teamSize = 10;
    isDemo = true;
  } else {
    try {
      // Retrieve row from Supabase - DO NOT SELECT EMAIL OR COMPANY TO SECURE DATA PRIVACY
      const res = await supabase
        .from("audits")
        .select("total_savings, audit_data")
        .eq("public_id", id)
        .single();
      data = res.data;
      error = res.error;
    } catch (e) {
      error = e;
    }
  }

  if (id !== "demo-share-id" && (!data || error)) {
    // If not found, show a beautiful professional 404 page
    return (
      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between">
        <header className="border-b border-zinc-100 py-4 px-6 md:px-12 bg-white">
          <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
            <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
              AI.AUDIT
            </a>
          </div>
        </header>

        <main className="max-w-md w-full mx-auto px-6 py-16 text-center space-y-6">
          <div className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
            Audit Not Found
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            This audit report does not exist or has expired.
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Please run a fresh scan of your team size, use case, and current active AI tool subscriptions to generate a verified share link.
          </p>
          <a href="/" className="inline-block w-full">
            <Button variant="primary" className="w-full py-3 font-semibold">
              Create New Audit
            </Button>
          </a>
        </main>

        <footer className="border-t border-zinc-100 py-6 text-center text-xs font-mono text-zinc-400 bg-white">
          &copy; 2026 AI.AUDIT Inc. Immutable data verification system.
        </footer>
      </div>
    );
  } else if (id !== "demo-share-id" && data) {
    const { audit_data } = data;
    tools = audit_data?.tools || [];
    useCase = audit_data?.useCase || "coding";
    teamSize = audit_data?.teamSize || 1;
  }

  // Re-run dynamic financial audit rules
  const report = runAudit(tools, useCase);

  // Map stack configuration
  const toolCards = tools.map((tool: any) => {
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

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-zinc-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white">
        <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
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
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-grow space-y-8 animate-fadeIn">
        {/* Share Banner */}
        <div className="p-4 border border-zinc-200 bg-zinc-50 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="font-mono text-zinc-500">
            SHARED REPORT ID: <strong className="text-zinc-800">{id}</strong>
            {isDemo && <span className="ml-2 text-indigo-600 font-bold">(Enterprise Demo Stack)</span>}
          </div>
          <CopyLinkButton />
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
            <p className="text-xs text-zinc-300 leading-relaxed leading-normal">
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
            {toolCards.map((item: any, idx: number) => (
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
                      {item.savings > 0 ? `-$${item.savings}/mo` : "$0/mo"}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 rounded border-l-2 border-zinc-900 text-xs text-zinc-600 leading-relaxed font-sans">
                  {item.reason}
                </div>

                <div className="text-[10px] font-mono text-zinc-400 flex gap-4 pt-1">
                  <span>Current Spend: ${item.monthlySpend}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-zinc-100 text-center">
          <a href="/">
            <Button variant="primary" className="px-8 font-semibold py-3 shadow-md hover:shadow-lg">
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
