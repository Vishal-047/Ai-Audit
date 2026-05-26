import React, { useState } from "react";
import { Button } from "./Button";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (publicId: string, email: string) => void;
  auditData: any;
  totalSavings: number;
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  auditData,
  totalSavings,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          company,
          role,
          audit_data: auditData,
          total_savings: totalSavings,
          honeypot,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report details.");
      }

      onSubmitSuccess(data.public_id, email);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Wrapper with Slide-Up Transition */}
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-white border border-zinc-100 shadow-2xl rounded-2xl animate-slideUp font-sans">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center pb-6">
          <div className="inline-block text-[10px] font-mono tracking-widest bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase font-bold">
            Secure Your Report
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            Save & Share Your AI Audit
          </h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Enter your details to generate your verified public share link and receive premium subscription alerts.
          </p>
        </div>

        {/* Submission Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md font-mono">
            ⚠ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field (hidden from real users, attractive to bots) */}
          <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="user_middle_name_verify">Please leave this field empty</label>
            <input
              id="user_middle_name_verify"
              type="text"
              name="user_middle_name_verify"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Email (Required) */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all font-medium text-zinc-900"
            />
          </div>

          {/* Company Name (Optional) */}
          <div className="space-y-1">
            <label htmlFor="company" className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Company Name <span className="text-zinc-300 font-normal">(Optional)</span>
            </label>
            <input
              id="company"
              type="text"
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all font-medium text-zinc-900"
            />
          </div>

          {/* Role (Optional) */}
          <div className="space-y-1">
            <label htmlFor="role" className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              Your Role <span className="text-zinc-300 font-normal">(Optional)</span>
            </label>
            <input
              id="role"
              type="text"
              placeholder="e.g. CTO, Finance Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all font-medium text-zinc-900"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="w-full py-3 mt-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Report...
              </span>
            ) : (
              "Generate Public Link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
