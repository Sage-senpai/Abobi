# Abobi Legal

> AI-powered immigration legal guidance for underserved communities worldwide.

**Abobi Legal** is a multilingual immigration legal aid platform built on 0G decentralized infrastructure. It gives immigrants, refugees, and international professionals free, confidential AI guidance — covering visas, asylum, work permits, family reunification, and more — in 7+ languages, with tamper-proof blockchain document storage.

---

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10
- MetaMask or compatible EVM wallet (or use Demo Mode — no wallet needed)
- Funded 0G Galileo testnet server wallet

### Install

```bash
pnpm install
pnpm rebuild better-sqlite3
```

### Environment

```bash
cp .env.example .env.local
```

Required env vars:

```env
# 0G Galileo Testnet
NEXT_PUBLIC_0G_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602

# 0G Storage indexer
OG_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai

# Server wallet private key (pays compute + storage on behalf of users)
OG_SERVER_PRIVATE_KEY=0x...

# 0G Compute provider address
OG_COMPUTE_PROVIDER_ADDRESS=0x...

# WalletConnect (optional — enables QR code on mobile)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### Run

```bash
pnpm dev       # development server (localhost:3000)
pnpm build     # production build
pnpm start     # serve production build
```

---

## Features

| Feature | Description |
|---------|-------------|
| AI Immigration Advisor | Multilingual AI guided by USCIS, IRCC, UK Home Office, UNHCR |
| Document Vault | Drag-drop upload to 0G blockchain — tamper-proof, verifiable by lawyers |
| Eligibility Quiz | 4-step interactive quiz for instant visa eligibility assessment |
| Document Checklists | Country + visa-type specific document requirement lists |
| Policy Alerts | Strip of recent immigration policy changes and deadlines |
| Resources Hub | Country guides: US, UK, Canada, EU, Australia, UAE, Japan, Nigeria + more |
| Dashboard | Activity graph, daily streak, session stats |
| Demo Mode | Full app preview without a wallet — zero friction onboarding |
| Multilingual | English, Spanish, French, Hausa, Yoruba, Igbo, Portuguese + auto-detect |

---

## Stack

- **Framework**: Next.js 15.5 (App Router), React 19
- **CSS**: Tailwind v4 with `@theme inline` design tokens
- **Auth**: Wagmi v2 + RainbowKit v2 — 0G Galileo (Chain ID 16602)
- **AI**: `qwen/qwen-2.5-7b-instruct` via 0G Compute Network
- **Storage**: `@0glabs/0g-ts-sdk` — content-addressed decentralized file storage
- **DB**: better-sqlite3 — root-hash index + document metadata
- **State**: Zustand + TanStack Query
- **Animation**: Framer Motion

---

## Deployment (Vercel)

```bash
pnpm build
vercel --prod
```

Set all env vars in Vercel dashboard. Do **not** set `DATABASE_PATH` — SQLite automatically uses `/tmp` on Vercel serverless.

See [docs/README.md](docs/README.md) for full architecture, API reference, and deployment details.
