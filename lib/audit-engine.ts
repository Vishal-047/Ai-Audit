export interface ToolInput {
  id: string;
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditItem {
  toolId: string;
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditReport {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  items: AuditItem[];
  surfaceCredex: boolean;
  status: "Optimal" | "Action Required" | "Already Optimal";
}

/**
 * Executes our financial audit logic against the user's active AI tool subscriptions.
 * 
 * @param tools List of tools provided in Step 2 of the form.
 * @param useCase The primary use case selected in Step 1 of the form.
 */
export function runAudit(tools: ToolInput[], useCase: string): AuditReport {
  const items: AuditItem[] = [];
  let totalMonthlySavings = 0;

  const hasCursor = tools.some(t => t.name.toLowerCase() === "cursor");
  const hasCopilot = tools.some(t => t.name.toLowerCase() === "github copilot");

  for (const tool of tools) {
    const nameLower = tool.name.toLowerCase();
    const planLower = tool.plan.toLowerCase();
    const seats = tool.seats || 0;
    const spend = tool.monthlySpend || 0;

    let recommendedAction = "Keep Current Plan";
    let savings = 0;
    let reason = "Your subscription configuration for this utility aligns with standard operational efficiency models.";

    // Rule 4: Redundancy (Cursor AND GitHub Copilot)
    if (nameLower === "github copilot" && hasCursor) {
      recommendedAction = "Cancel GitHub Copilot subscription";
      savings = spend;
      reason = "Operating both Cursor and GitHub Copilot results in redundant licensing, as Cursor natively integrates state-of-the-art coding autocompletion and agentic capabilities, rendering the standalone Copilot subscription unnecessary.";
    }
    // Rule 1: Cursor (Business and seats < 5)
    else if (nameLower === "cursor" && planLower === "business" && seats < 5) {
      recommendedAction = "Downgrade to Cursor Pro plan";
      // Business is $40/user, Pro is $20/user. Saving is $20/user.
      savings = Math.max(0, spend - (20 * seats));
      // Fallback calculation in case of irregular user input
      if (savings === 0) savings = 20 * seats;
      reason = "With fewer than 5 active seats, the enterprise administration overhead of the Business tier ($40/seat) is unwarranted, and transitioning to the Pro tier ($20/seat) yields identical core features at a 50% cost reduction.";
    }
    // Rule 2: Claude (Team and seats < 5)
    else if (nameLower === "claude" && planLower === "team" && seats < 5) {
      recommendedAction = "Transition to individual Claude Pro plans";
      // Team has a 5-seat minimum at $30/user/mo ($150 total minimum).
      // Downgrading to Pro is $20/user/mo. Cost is 20 * seats.
      // Expected spend was at least $150/mo.
      const currentSpend = spend || (30 * Math.max(5, seats));
      const targetSpend = 20 * seats;
      savings = Math.max(0, currentSpend - targetSpend);
      reason = "Since your team size is under the 5-seat minimum required for the Claude Team subscription, migrating to individual Claude Pro plans ($20/user) avoids paying for idle minimum quotas while retaining standard pro capabilities.";
    }
    // Rule 3: ChatGPT (Team and seats < 3)
    else if (nameLower === "chatgpt" && planLower === "team" && seats < 3) {
      recommendedAction = "Downgrade to ChatGPT Plus plans";
      // Team is $30/user, Plus is $20/user. Team has 2-seat minimum ($60/mo).
      const currentSpend = spend || (30 * Math.max(2, seats));
      const targetSpend = 20 * seats;
      savings = Math.max(0, currentSpend - targetSpend);
      reason = "With fewer than 3 seats, the collaborative workspaces of the ChatGPT Team plan ($30/seat, 2-seat minimum) offer limited return compared to individual ChatGPT Plus accounts ($20/user), allowing for immediate subscription rationalization.";
    }
    // Rule 5: API Usage (Spend > $100 and use case is coding/writing)
    else if (
      (nameLower.includes("api") || nameLower.includes("direct")) &&
      spend > 100 &&
      (useCase === "coding" || useCase === "writing")
    ) {
      recommendedAction = "Transition API token usage to flat-rate Pro subscription";
      // Recommend switching to flat-rate Pro plan ($20/user/month)
      const targetCost = 20 * seats;
      savings = Math.max(0, spend - targetCost);
      reason = "Your direct API platform billing exceeds $100/month for standard text generation and programming tasks; migrating to a flat-rate $20/user Pro client plan cap-limits transactional token costs.";
    }

    if (savings > 0) {
      totalMonthlySavings += savings;
      items.push({
        toolId: tool.id,
        name: tool.name,
        plan: tool.plan,
        monthlySpend: spend,
        seats,
        recommendedAction,
        savings,
        reason,
      });
    }
  }

  const totalAnnualSavings = totalMonthlySavings * 12;
  const surfaceCredex = totalMonthlySavings > 500;

  // Rule 10: If total annual savings are < $100, return 'Already Optimal'
  let status: "Optimal" | "Action Required" | "Already Optimal" = "Action Required";
  if (totalAnnualSavings < 100) {
    status = "Already Optimal";
  } else if (totalMonthlySavings > 0) {
    status = "Action Required";
  } else {
    status = "Optimal";
  }

  return {
    totalMonthlySavings,
    totalAnnualSavings,
    items,
    surfaceCredex,
    status,
  };
}
