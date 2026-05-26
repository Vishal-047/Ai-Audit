/**
 * @jest-environment node
 */

import { POST } from "../app/api/audit/route";

describe("Audit Storage API Route", () => {
  it("should successfully process normal submission and return public_id", async () => {
    const requestBody = {
      email: "test@example.com",
      company: "Acme",
      role: "CTO",
      audit_data: { tools: [] },
      total_savings: 120,
    };

    const req = new Request("http://localhost:3000/api/audit", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.public_id).toBeDefined();
    expect(data.public_id.length).toBe(10);
  });

  it("should silently reject bots if honeypot is filled", async () => {
    const requestBody = {
      email: "bot@spammer.com",
      company: "BotCorp",
      role: "Bot",
      audit_data: { tools: [] },
      total_savings: 9999,
      honeypot: "sneaky-bot-entry", // Honeypot filled!
    };

    const req = new Request("http://localhost:3000/api/audit", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.public_id).toContain("audit_bot_");
  });

  it("should reject invalid/missing emails", async () => {
    const requestBody = {
      email: "not-an-email",
      company: "NoEmailCorp",
    };

    const req = new Request("http://localhost:3000/api/audit", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Valid email is required");
  });
});
