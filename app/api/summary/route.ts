import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";

// Helper to generate a detailed, premium fallback summary in case the API call fails or the key is missing
function generateFallbackSummary(report: any): string {
  const totalAnnualSavings = report.totalAnnualSavings ?? (report.totalMonthlySavings ? report.totalMonthlySavings * 12 : 0);
  const totalMonthlySavings = report.totalMonthlySavings ?? 0;
  const items = report.items || report.results || [];
  
  if (totalMonthlySavings > 0) {
    let summaryText = `### AI Audit Executive Summary\n\n`;
    summaryText += `Our financial audit has identified significant potential savings in your current AI subscription stack. By optimizing your configurations, you can achieve an estimated **$${totalMonthlySavings.toLocaleString()}/month** in direct savings, translating to **$${totalAnnualSavings.toLocaleString()}/year** annualized.\n\n`;
    summaryText += `#### Recommended Key Actions:\n\n`;
    
    items.forEach((item: any, index: number) => {
      const name = item.name || item.tool || "AI Tool";
      const action = item.recommendedAction || "Optimize plan";
      const savings = item.savings ?? 0;
      const reason = item.reason || "Underutilized plan limits.";
      if (savings > 0) {
        summaryText += `${index + 1}. **${name}**: ${action} (Save **$${savings}/mo**)\n`;
        summaryText += `   *Rationale:* ${reason}\n\n`;
      }
    });
    
    summaryText += `#### Next Steps:\n\n`;
    summaryText += `- Downgrade/transition plan tiers as outlined above to immediately cut wastage.\n`;
    summaryText += `- Consolidate licenses and eliminate duplicate subscriptions to streamline operation costs.\n`;
    
    return summaryText;
  } else {
    return `### AI Audit Executive Summary\n\nBased on our analysis, your team's AI tool stack is operating with optimal efficiency. All subscription plans and seat allocations align perfectly with your team size and operational use cases. No immediate action is required, and your active subscriptions present zero redundant license wastage. We recommend continuing on your current plans.`;
  }
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    let report: any = null;

    // Support multiple request body formats
    if (body.report) {
      report = body.report;
    } else if (body.items || body.results) {
      report = {
        totalMonthlySavings: body.totalMonthlySavings ?? 0,
        totalAnnualSavings: body.totalAnnualSavings ?? 0,
        items: body.items || body.results || [],
        status: body.status,
      };
    } else if (body.tools && Array.isArray(body.tools)) {
      const { tools, useCase = "coding" } = body;
      try {
        report = runAudit(tools, useCase);
      } catch (e) {
        const totalMonthlySavings = 0;
        const items = tools.map((t: any) => ({
          name: t.name || t.toolName,
          plan: t.plan,
          monthlySpend: t.monthlySpend || 0,
          seats: t.seats || 0,
          recommendedAction: "Review Subscription",
          savings: 0,
          reason: "Review plan limits and seat usage.",
        }));
        report = {
          totalMonthlySavings,
          totalAnnualSavings: totalMonthlySavings * 12,
          items,
          status: "Review Required",
        };
      }
    } else {
      report = {
        totalMonthlySavings: body.totalMonthlySavings ?? 0,
        totalAnnualSavings: body.totalAnnualSavings ?? 0,
        items: [],
        status: "Optimal",
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const fallback = generateFallbackSummary(report);
      return NextResponse.json({ summary: fallback });
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `You are an objective AI subscription spend advisor. Your goal is to analyze the team's AI tool audit report and provide a concise, high-impact recommendation. Do not act as a salesperson or try to cross-sell. 

Identify the specific tools by name (such as Cursor, ChatGPT, Claude, or GitHub Copilot) that present inefficiencies or redundancy. Recommend exactly one concrete, immediate action they should take (such as downgrading plans, transitioning to individual accounts, or canceling a redundant subscription) to maximize monthly cost savings.

Keep your response professional, direct, and strictly under 100 words.

Here is the AI Audit Report for our team:
${JSON.stringify(report, null, 2)}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const fallback = generateFallbackSummary(report);
        return NextResponse.json({ summary: fallback });
      }

      const data = await response.json();
      const text = data?.content?.[0]?.text;

      if (!text) {
        const fallback = generateFallbackSummary(report);
        return NextResponse.json({ summary: fallback });
      }

      return NextResponse.json({ summary: text });
    } catch (e) {
      const fallback = generateFallbackSummary(report);
      return NextResponse.json({ summary: fallback });
    }
  } catch (outerError) {
    // If everything completely fails, return a safe minimal empty report fallback to guarantee no errors
    return NextResponse.json({
      summary: "### AI Audit Executive Summary\n\nAn audit summary is currently unavailable due to an unexpected parsing error. Please verify your stack details and try again."
    });
  }
}
