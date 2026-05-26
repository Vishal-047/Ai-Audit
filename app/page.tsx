import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 font-medium tracking-wide animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          AI Audit Skeleton
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-100">
          AI-Powered Security Auditing
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
          Verify and audit your intelligence layers with modern tools, rich metrics, and dynamic share reports.
        </p>

        {/* Actions Placeholder */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a
            href="/results"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            View Audit Results
          </a>
          <a
            href="/audit/demo-share-id"
            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            Demo Share Page
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {["Secure Integration", "Instant Feedback", "Immutable Records"].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex flex-col items-center text-center space-y-2 hover:border-indigo-500/30 transition-all duration-500 hover:bg-white/[0.04]"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-lg font-bold mb-2">
                0{i + 1}
              </div>
              <h3 className="font-semibold text-zinc-200">{feature}</h3>
              <p className="text-xs text-zinc-500 leading-normal">
                Standard Next.js 14 App Router layout utilizing local and global styling systems.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
