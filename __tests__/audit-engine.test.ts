import { runAudit, ToolInput } from "../lib/audit-engine";

describe("AI Audit Engine Financial Rules", () => {
  // Rule 1: Cursor Business plan seats < 5
  it("should recommend downgrading Cursor Business to Pro if seats < 5", () => {
    const tools: ToolInput[] = [
      { id: "1", name: "Cursor", plan: "Business", monthlySpend: 120, seats: 3 },
    ];
    const report = runAudit(tools, "mixed");

    expect(report.items).toHaveLength(1);
    expect(report.items[0].recommendedAction).toBe("Downgrade to Cursor Pro plan");
    expect(report.items[0].savings).toBe(60); // (40 - 20) * 3 = 60
    expect(report.items[0].reason).toContain("transitioning to the Pro tier ($20/seat) yields identical core features");
    expect(report.totalAnnualSavings).toBe(720); // 60 * 12
    expect(report.status).toBe("Action Required");
  });

  // Rule 2: Claude Team plan seats < 5
  it("should recommend individual Claude Pro plans if Team seats < 5", () => {
    const tools: ToolInput[] = [
      { id: "2", name: "Claude", plan: "Team", monthlySpend: 150, seats: 3 },
    ];
    const report = runAudit(tools, "mixed");

    expect(report.items).toHaveLength(1);
    expect(report.items[0].recommendedAction).toBe("Transition to individual Claude Pro plans");
    expect(report.items[0].savings).toBe(90); // 150 - (20 * 3) = 90
    expect(report.items[0].reason).toContain(" Claude Team subscription, migrating to individual Claude Pro plans ($20/user) avoids paying for idle minimum quotas");
    expect(report.totalAnnualSavings).toBe(1080);
  });

  // Rule 3: ChatGPT Team plan seats < 3
  it("should recommend ChatGPT Plus if Team seats < 3", () => {
    const tools: ToolInput[] = [
      { id: "3", name: "ChatGPT", plan: "Team", monthlySpend: 60, seats: 1 },
    ];
    const report = runAudit(tools, "mixed");

    expect(report.items).toHaveLength(1);
    expect(report.items[0].recommendedAction).toBe("Downgrade to ChatGPT Plus plans");
    expect(report.items[0].savings).toBe(40); // 60 - (20 * 1) = 40
    expect(report.items[0].reason).toContain("ChatGPT Team plan ($30/seat, 2-seat minimum) offer limited return compared to individual ChatGPT Plus accounts ($20/user)");
  });

  // Rule 4: Redundancy (Cursor AND GitHub Copilot)
  it("should recommend canceling GitHub Copilot if Cursor is active", () => {
    const tools: ToolInput[] = [
      { id: "1", name: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      { id: "4", name: "GitHub Copilot", plan: "Individual", monthlySpend: 10, seats: 1 },
    ];
    const report = runAudit(tools, "coding");

    expect(report.items).toHaveLength(1);
    expect(report.items[0].name).toBe("GitHub Copilot");
    expect(report.items[0].recommendedAction).toBe("Cancel GitHub Copilot subscription");
    expect(report.items[0].savings).toBe(10);
    expect(report.items[0].reason).toContain("Operating both Cursor and GitHub Copilot results in redundant licensing");
  });

  // Rule 5: API Usage spend > 100 with coding/writing use case
  it("should recommend flat-rate Pro plan if API spend > 100 for coding/writing", () => {
    const tools: ToolInput[] = [
      { id: "5", name: "OpenAI API Direct", plan: "Pay-as-you-go", monthlySpend: 150, seats: 1 },
    ];
    const report = runAudit(tools, "coding");

    expect(report.items).toHaveLength(1);
    expect(report.items[0].recommendedAction).toBe("Transition API token usage to flat-rate Pro subscription");
    expect(report.items[0].savings).toBe(130); // 150 - (20 * 1) = 130
    expect(report.items[0].reason).toContain("migrating to a flat-rate $20/user Pro client plan");
  });

  // Rule 10: Savings < $100 annually returns 'Already Optimal'
  it("should return 'Already Optimal' status if annual savings are < $100", () => {
    const tools: ToolInput[] = [
      { id: "1", name: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      { id: "4", name: "GitHub Copilot", plan: "Individual", monthlySpend: 5, seats: 1 }, // low spend
    ];
    const report = runAudit(tools, "coding");

    expect(report.totalMonthlySavings).toBe(5);
    expect(report.totalAnnualSavings).toBe(60); // 60 < 100
    expect(report.status).toBe("Already Optimal");
  });

  // Rule 9: surfaceCredex flag is true only if monthly savings > 500
  it("should set surfaceCredex to true if monthly savings > 500", () => {
    const tools: ToolInput[] = [
      { id: "5", name: "OpenAI API Direct", plan: "Pay-as-you-go", monthlySpend: 600, seats: 1 },
    ];
    const report = runAudit(tools, "coding");

    expect(report.totalMonthlySavings).toBe(580); // 600 - 20 = 580
    expect(report.surfaceCredex).toBe(true);
  });
});
