# AI.AUDIT — AI Subscription Spend Auditing Platform

AI.AUDIT is an automated, finance-defensible AI subscription scanning and optimization platform built for modern teams and enterprise organizations. It scans active software seat allocations, automatically uncovers duplicate capabilities (such as Cursor vs. GitHub Copilot), identifies idle seat tiers beneath vendor pricing quotas, and delivers immediate cost-saving recommendations. By providing instant verified reports and enterprise pre-approvals, it enables financial managers to eliminate SaaS license waste without impacting developer productivity.

Deployed URL: [Insert Deployed URL Placeholder Here]

---

## Screenshots

* **Scan Configuration View**  
  ![Stack Scanner Configuration Interface](https://via.placeholder.com/800x450.png?text=1.+Scan+Configuration+Interface)
  
* **Interactive Savings Dashboard**  
  ![Detailed Savings Dashboard and Hero Banner](https://via.placeholder.com/800x450.png?text=2.+Detailed+Savings+Dashboard)
  
* **Tool-by-Tool Optimization Breakdowns**  
  ![Actionable Optimization List](https://via.placeholder.com/800x450.png?text=3.+Actionable+Optimization+List)

---

## Quick Start

### 1. Install Dependencies

Clone the repository and install packages using your package manager:
```bash
npm install
```

### 2. Run Locally

Set up your local environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

Then start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the scanner locally.

### 3. Run Test Suite

Run the full automated Jest test suite covering our financial audit rules, route handlers, and SEO rendering:
```bash
npm test
```

### 4. Deploy

Build the production-ready package:
```bash
npm run build
```

This project can be easily deployed to **Vercel** or any cloud platform supporting Next.js server actions and API routes.

---

## Decisions

* **[Decision 1 - Fill in here]**
* **[Decision 2 - Fill in here]**
* **[Decision 3 - Fill in here]**
* **[Decision 4 - Fill in here]**
* **[Decision 5 - Fill in here]**
