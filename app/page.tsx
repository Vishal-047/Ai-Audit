"use client";

import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/Button";

interface ToolEntry {
  id: string;
  name: string;
  plan: string;
  monthlySpend: number | "";
  seats: number | "";
}

interface FormState {
  step: number;
  teamSize: number | "";
  useCase: string;
  tools: ToolEntry[];
}

const USE_CASES = ["coding", "writing", "data", "research", "mixed"];
const TOOL_OPTIONS = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API Direct",
  "OpenAI API Direct",
  "Gemini",
  "Windsurf",
];

const DEFAULT_PLANS: Record<string, { plan: string; monthlySpend: number; seats: number }> = {
  "Cursor": { plan: "Pro", monthlySpend: 20, seats: 1 },
  "GitHub Copilot": { plan: "Individual", monthlySpend: 10, seats: 1 },
  "Claude": { plan: "Pro", monthlySpend: 20, seats: 1 },
  "ChatGPT": { plan: "Plus", monthlySpend: 20, seats: 1 },
  "Anthropic API Direct": { plan: "Pay-as-you-go", monthlySpend: 50, seats: 1 },
  "OpenAI API Direct": { plan: "Pay-as-you-go", monthlySpend: 50, seats: 1 },
  "Gemini": { plan: "Advanced", monthlySpend: 20, seats: 1 },
  "Windsurf": { plan: "Pro", monthlySpend: 15, seats: 1 },
};

const LOCAL_STORAGE_KEY = "ai_audit_form_state";

export default function HomePage() {
  const [state, setState] = useState<FormState>({
    step: 1,
    teamSize: 1,
    useCase: "coding",
    tools: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure steps and numbers are valid
        setState({
          step: typeof parsed.step === "number" ? parsed.step : 1,
          teamSize: typeof parsed.teamSize === "number" || parsed.teamSize === "" ? parsed.teamSize : 1,
          useCase: parsed.useCase || "coding",
          tools: Array.isArray(parsed.tools) ? parsed.tools : [],
        });
      }
    } catch (e) {
      console.error("Failed to parse localStorage state:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (state.step < 3) updateField("step", state.step + 1);
  };

  const prevStep = () => {
    if (state.step > 1) updateField("step", state.step - 1);
  };

  // Tools Actions
  const addTool = () => {
    const defaultTool = "Cursor";
    const defaults = DEFAULT_PLANS[defaultTool];
    const newTool: ToolEntry = {
      id: nanoid(),
      name: defaultTool,
      plan: defaults.plan,
      monthlySpend: defaults.monthlySpend,
      seats: defaults.seats,
    };
    updateField("tools", [...state.tools, newTool]);
  };

  const removeTool = (id: string) => {
    updateField("tools", state.tools.filter((t) => t.id !== id));
  };

  const updateTool = (id: string, updates: Partial<Omit<ToolEntry, "id">>) => {
    updateField(
      "tools",
      state.tools.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          // If the tool name itself is changing, auto-populate recommended defaults
          if (updates.name && updates.name !== t.name) {
            const defaults = DEFAULT_PLANS[updates.name];
            updated.plan = defaults.plan;
            updated.monthlySpend = defaults.monthlySpend;
            updated.seats = defaults.seats;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const calculateTotalSpend = () => {
    return state.tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0);
  };

  const calculateTotalSeats = () => {
    return state.tools.reduce((sum, t) => sum + (t.seats || 0), 0);
  };

  // Handle Form Submission / redirection
  const handleRunAudit = () => {
    // Navigate to results
    window.location.href = "/results";
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center font-sans">
        <div className="text-sm font-mono tracking-tight text-zinc-400 animate-pulse">
          Loading audit environment...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-zinc-100 py-4 px-6 md:px-12 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <a href="/" className="font-mono font-bold tracking-tight text-base hover:opacity-80">
            AI.AUDIT
          </a>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 border border-zinc-200 text-zinc-400 rounded">
            v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span>Persisting to LocalStorage</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="mb-10 flex justify-between items-center text-xs font-mono tracking-tight text-zinc-400 border-b border-zinc-100 pb-3">
          <span className={state.step === 1 ? "text-black font-semibold" : ""}>
            01. Core Metrics
          </span>
          <span className="text-zinc-200">/</span>
          <span className={state.step === 2 ? "text-black font-semibold" : ""}>
            02. AI Tool Stack
          </span>
          <span className="text-zinc-200">/</span>
          <span className={state.step === 3 ? "text-black font-semibold" : ""}>
            03. Review & Run
          </span>
        </div>

        {/* STEP 1: Core Metrics */}
        {state.step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Let's detail your team size & use case.
              </h1>
              <p className="text-sm text-zinc-500 leading-normal">
                This helps us customize benchmarks and compare your direct spending with standardized industry averages.
              </p>
            </div>

            <div className="space-y-6">
              {/* Team Size input */}
              <div className="space-y-2">
                <label htmlFor="teamSize" className="block text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500">
                  Total Team Size (Seats)
                </label>
                <input
                  id="teamSize"
                  type="number"
                  min="1"
                  max="10000"
                  value={state.teamSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField("teamSize", val === "" ? "" : parseInt(val) || 0);
                  }}
                  onBlur={() => {
                    if (state.teamSize === "" || state.teamSize < 1) {
                      updateField("teamSize", 1);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none transition duration-150"
                  placeholder="e.g. 10"
                />
              </div>

              {/* Use Case dropdown */}
              <div className="space-y-2">
                <label htmlFor="useCase" className="block text-xs uppercase font-mono tracking-wider font-semibold text-zinc-500">
                  Primary AI Use Case
                </label>
                <select
                  id="useCase"
                  value={state.useCase}
                  onChange={(e) => updateField("useCase", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none transition duration-150 cursor-pointer capitalize"
                >
                  {USE_CASES.map((useCase) => (
                    <option key={useCase} value={useCase}>
                      {useCase}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-4 flex justify-end">
              <Button onClick={nextStep} variant="primary" className="w-full sm:w-auto">
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: AI Tool Stack */}
        {state.step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Detail your active AI subscriptions.
              </h1>
              <p className="text-sm text-zinc-500 leading-normal">
                Add the tools and platforms your team currently uses, along with their specific license plans and costs.
              </p>
            </div>

            {/* Tools Entries */}
            <div className="space-y-6">
              {state.tools.length === 0 ? (
                <div className="border border-dashed border-zinc-200 rounded-md p-8 text-center space-y-4">
                  <p className="text-sm text-zinc-400">
                    No tools added yet. Add your first AI utility subscription to calculate spending metrics.
                  </p>
                  <Button onClick={addTool} variant="secondary" className="text-xs">
                    + Add Tool
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.tools.map((tool, idx) => (
                    <div
                      key={tool.id}
                      className="p-4 border border-zinc-200 rounded-md bg-white space-y-4 relative"
                    >
                      {/* Tool Entry Header */}
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <span className="text-xs font-mono font-semibold text-zinc-400">
                          TOOL #{idx + 1}
                        </span>
                        <Button
                          onClick={() => removeTool(tool.id)}
                          variant="danger"
                          className="px-2 py-1 text-xs font-mono rounded"
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Tool Form Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tool Name Dropdown */}
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                            Tool Name
                          </label>
                          <select
                            value={tool.name}
                            onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
                          >
                            {TOOL_OPTIONS.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* License Plan Input */}
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                            Subscription Plan / Tier
                          </label>
                          <input
                            type="text"
                            value={tool.plan}
                            onChange={(e) => updateTool(tool.id, { plan: e.target.value })}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
                            placeholder="e.g. Pro, Custom"
                          />
                        </div>

                        {/* Seats Input */}
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                            Seats / Licenses
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tool.seats}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateTool(tool.id, { seats: val === "" ? "" : parseInt(val) || 0 });
                            }}
                            onBlur={() => {
                              if (tool.seats === "" || tool.seats < 1) {
                                updateTool(tool.id, { seats: 1 });
                              }
                            }}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>

                        {/* Monthly Spend Input */}
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                            Monthly Spend ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={tool.monthlySpend}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateTool(tool.id, { monthlySpend: val === "" ? "" : parseFloat(val) || 0 });
                            }}
                            onBlur={() => {
                              if (tool.monthlySpend === "" || tool.monthlySpend < 0) {
                                updateTool(tool.id, { monthlySpend: 0 });
                              }
                            }}
                            className="w-full px-2 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Another Tool Button */}
                  <Button onClick={addTool} variant="secondary" className="w-full text-xs">
                    + Add Another Tool
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="pt-4 flex justify-between items-center gap-4">
              <Button onClick={prevStep} variant="secondary" className="flex-1 sm:flex-none">
                &larr; Back
              </Button>
              <Button
                onClick={nextStep}
                variant="primary"
                className="flex-1 sm:flex-none"
                disabled={state.tools.length === 0}
              >
                Review Stack &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Review Screen */}
        {state.step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Review your configuration.
              </h1>
              <p className="text-sm text-zinc-500 leading-normal">
                Double-check the metrics below. Pressing "Run My Audit" will immediately run optimization and leakage algorithms.
              </p>
            </div>

            {/* Summary Panel */}
            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white text-sm">
              {/* Header metrics */}
              <div className="p-4 bg-zinc-50/50 border-b border-zinc-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                    Team Size
                  </span>
                  <span className="text-lg font-mono font-bold text-zinc-800">
                    {state.teamSize} seats
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-mono tracking-wider font-semibold text-zinc-400">
                    Use Case
                  </span>
                  <span className="text-lg font-bold text-zinc-800 capitalize">
                    {state.useCase}
                  </span>
                </div>
              </div>

              {/* Tools list */}
              <div className="divide-y divide-zinc-100">
                {state.tools.map((tool) => (
                  <div key={tool.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-zinc-800">{tool.name}</div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        Plan: {tool.plan} &bull; {tool.seats} {tool.seats === 1 ? "seat" : "seats"}
                      </div>
                    </div>
                    <div className="text-right font-mono text-zinc-700">
                      ${tool.monthlySpend}/mo
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="p-4 bg-zinc-900 text-white flex justify-between items-center font-mono">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                    Aggregated Metrics
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">
                    Total active AI tool seats: <strong>{calculateTotalSeats()}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                    Total Spending
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${calculateTotalSpend()}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation and "Run My Audit" */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button onClick={prevStep} variant="secondary" className="w-full sm:w-auto">
                &larr; Back to Stack
              </Button>
              <Button
                onClick={handleRunAudit}
                variant="primary"
                className="w-full flex-grow text-center font-semibold bg-emerald-600 border-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 text-base py-3"
              >
                Run My Audit &rarr;
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 text-center text-xs font-mono text-zinc-400 bg-white">
        &copy; 2026 AI.AUDIT Inc. Immutable data verification system.
      </footer>
    </div>
  );
}
