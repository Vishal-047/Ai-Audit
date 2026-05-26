/**
 * @jest-environment node
 */

import { generateMetadata } from "../app/audit/[id]/page";
import SharedAuditPage from "../app/audit/[id]/page";

describe("Shared Audit Page SEO & Database Fetching", () => {
  it("should generate proper SEO metadata for demo-share-id", async () => {
    const metadata = await generateMetadata({ params: { id: "demo-share-id" } });
    expect(metadata.title).toContain("AI Spend Audit — $550/month in savings found");
    expect(metadata.description).toContain("Cursor, GitHub Copilot, Claude, ChatGPT, and OpenAI API");
    expect(metadata.openGraph?.title).toContain("AI Spend Audit — $550/month in savings found");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("should render demo-share-id page successfully without crashing", async () => {
    const pageElement = await SharedAuditPage({ params: { id: "demo-share-id" } });
    expect(pageElement).toBeDefined();
    
    // Check that the returned React Element represents the page layout
    expect(pageElement.type).toBe("div");
    expect(pageElement.props.className).toContain("min-h-screen");
  });
});
