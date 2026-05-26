/**
 * @jest-environment node
 */

import { POST } from "../app/api/summary/route";

describe("Summary API Route", () => {
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ANTHROPIC_API_KEY = originalEnv;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  it("should return the fallback templated summary if no API key is set", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const requestBody = {
      tools: [
        { id: "1", name: "Cursor", plan: "Business", monthlySpend: 120, seats: 3 },
      ],
      useCase: "coding"
    };

    const req = new Request("http://localhost:3000/api/summary", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("summary");
    expect(data.summary).toContain("AI Audit Executive Summary");
    expect(data.summary).toContain("Cursor");
    // Saving is (40 - 20) * 3 = $60/mo
    expect(data.summary).toContain("$60/month");
  });

  it("should return optimal stack fallback summary if no savings are detected", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const requestBody = {
      tools: [
        { id: "1", name: "Cursor", plan: "Pro", monthlySpend: 60, seats: 3 },
      ],
      useCase: "coding"
    };

    const req = new Request("http://localhost:3000/api/summary", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("summary");
    expect(data.summary).toContain("optimal efficiency");
  });

  it("should handle format where report is passed directly in the body", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const requestBody = {
      report: {
        totalMonthlySavings: 100,
        totalAnnualSavings: 1200,
        items: [
          {
            name: "Claude",
            recommendedAction: "Transition to individual Claude Pro plans",
            savings: 100,
            reason: "Under seat minimums."
          }
        ]
      }
    };

    const req = new Request("http://localhost:3000/api/summary", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("summary");
    expect(data.summary).toContain("$100/month");
    expect(data.summary).toContain("Claude");
  });
});
