# SpendWise AI — Campus Financial Command

An intelligent, full-stack campus expense and budgeting platform built for university students. SpendWise combines real-time cash flow monitoring, semester goal tracking, multimodal receipt scanning via Gemini Vision, and an AI-driven financial advisor.

---

## Features

* **Live Financial Command Dashboard:** Real-time metrics for net available balance, total monthly inflow, mess and campus expenses, and active semester savings goals.
* **Smart Receipt Scanner:** Multimodal AI extraction powered by Gemini Vision. Upload or snap photos of canteen slips, store receipts, and grocery bills to automatically extract vendor details, totals, and budget categories.
* **Interactive AI Advisor:** Context-aware campus financial assistant powered by Google Gemini and the Vercel AI SDK, providing real-time streaming advice on burn rates and student budgeting strategies.
* **Monthly Burn Rate & Budget Alerts:** Visual meter tracking current expenditures against monthly allowance targets with dynamic over-budget warnings.
* **Semester Savings Milestones:** Target cards with visual completion trackers for hardware, trips, and semester goals.
* **Audit Ledger & CSV Export:** Filterable campus transaction history with row deletion actions and one-click monthly CSV report downloads.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router, Node.js Runtime) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons, Shadcn UI |
| **Backend & Auth** | Supabase (PostgreSQL, Row Level Security, Auth) |
| **AI & Vision** | Google Gemini (`gemini-3.6-flash`), Vercel AI SDK |
| **Deployment** | Vercel |

---

## Architecture Overview

```text
spendwise/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-chat/          # Streaming Gemini AI advisor route
│   │   │   └── scan-receipt/     # Multimodal Gemini receipt extraction
│   │   ├── dashboard/            # Protected financial dashboard
│   │   ├── login/                # Supabase authentication interface
│   │   └── layout.tsx            # Root glassmorphic layout & providers
│   ├── components/
│   │   ├── dashboard/            # Ledger rows, CSV export, dialogs, charts
│   │   └── ui/                   # Reusable base components
│   └── lib/
│       └── supabase/             # Client and server-side Supabase clients