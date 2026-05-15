# ZeroViza

> **One-sentence pitch (30 words):** ZeroViza is a decentralized AI immigration advisor built on 0G — free multilingual legal guidance, tamper-proof document storage, and on-chain lawyer verification for the world's 280 million migrants.

**Submission:** 0G APAC Hackathon 2026 · **Track 3** — Agentic Economy & Autonomous Applications
**Live demo:** [zeroviza.vercel.app](https://zeroviza.vercel.app)
**Team:** Divine (solo)

---

**ZeroViza** is a multilingual AI immigration advisor built entirely on **0G decentralized infrastructure**. It gives immigrants, refugees, and international professionals free, confidential AI guidance on visas, asylum, work permits, family reunification, and more — in 30+ languages, with tamper-proof document storage and on-chain verified lawyer credentials.

**No centralized database. No centralized AI. No centralized storage. Everything runs on 0G.**

![ZeroViza Architecture](public/architecture.svg)

---

## The problem

**280 million people live outside their country of birth, most cannot afford an immigration lawyer, and the SaaS apps that try to help leak their case files into centralized databases.** ZeroViza is the first immigration AI agent the user actually *owns* — agent memory lives encrypted on 0G Storage, the agent itself is a transferable ERC-7857 INFT on 0G Chain, and inference runs on 0G Compute with on-chain attestation receipts attached to every reply.

---

## Traction

This is a hackathon submission first — these are the real, on-chain numbers as of the submission cut-off. All verifiable on [chainscan.0g.ai](https://chainscan.0g.ai).

| Signal | Number | Where to verify |
|---|---|---|
| Mainnet contracts live | **3 / 3** | StorageIndex, LawyerRegistry, CaseAgentNFT — all listed in the Smart Contracts table |
| Verified service providers on chain | **7** | `LawyerRegistry.verifiedCount()` reads 7 on mainnet (the seeded demo personas, badged "Demo · 0G Compute" in the UI) |
| 0G integrations end-to-end | **Compute + Storage + Chain** | every chat message touches all three pillars (inference + history blob + StorageIndex pointer) |
| Forge tests passing | **39** | `cd contracts && forge test -vvv` |
| Agent tools wired | **5** | lookup_embassy, find_service_provider, create_case, extract_profile_facts, hire_provider — all callable in production |
| Resource articles RAG-indexed | **30+** across **15 countries** | grounded citations in every AI response |

**Real on-chain transactions you can paste into chainscan:**
- CaseAgentNFT deploy (Block tx with operator-signed init): `0xF89EC187E9062CDE86719273b85F3C6974A40829`
- Demo persona verifications (LawyerVerified events): visit the LawyerRegistry contract page → Events tab → filter `LawyerVerified` (7 entries)
- Latest agent-to-agent hire receipts: query operator wallet `0xE5A747FA09271C8d479Cf718b205F8aADd6E4C30` → tx with native value `0.0001 0G` to a registry wallet → "Input Data" field decodes to the hire receipt JSON

> **Honesty note:** ZeroViza was built end-to-end during the hackathon window. Real-user numbers (DAU, retention, waitlist) are intentionally not claimed — every figure above is a deterministic on-chain or repo measurement a judge can independently reproduce.

---

## 0G Integration Proof

ZeroViza integrates **three core 0G pillars** — every piece of data, every AI response, and every agent action flows through 0G:

| 0G Component | How ZeroViza Uses It | Evidence |
|---|---|---|
| **0G Compute** | AI immigration agent runs inference via 0G Compute's OpenAI-compatible API (GLM-5 FP8 744B). Server wallet funds compute so users pay nothing. Tool-calling iterations use the same provider; the final answer streams token-by-token via SSE. Groq is wired only as an emergency circuit-breaker. | [`src/lib/0g/compute.ts`](src/lib/0g/compute.ts) |
| **0G Storage** | All user data is content-addressed on 0G Storage via `@0glabs/0g-ts-sdk` — chat history (JSONL), user profiles + extracted persona facts + cases + agent inbox (JSON), uploaded documents, lawyer metadata, embassy directory snapshots. | [`src/lib/0g/storage.ts`](src/lib/0g/storage.ts) |
| **0G Chain** | Three smart contracts on 0G Aristotle mainnet (chain id 16661): `StorageIndex.sol`, `LawyerRegistry.sol`, and `CaseAgentNFT.sol` — an ERC-7857 INFT for the user's personal AI agent. Operator wallet pays gas. 39 Forge tests pass. Agent-to-agent hires record full receipts in tx calldata, viewable on chainscan. | [`contracts/src/`](contracts/src/) |

### Architecture

```
User (wallet) ──> Next.js App ──> 0G Compute (AI inference)
                       │
                       ├──> 0G Storage (documents, history, profiles)
                       │
                       └──> 0G Chain (StorageIndex + LawyerRegistry contracts)
```

The **operator pattern** lets a server wallet pay for storage and compute on behalf of users — users only need a wallet for identity, not gas. Smart contracts serve as mutable pointers to immutable 0G Storage content. No SQLite, no Postgres, no centralized DB.

### Smart Contracts

**0G Aristotle Mainnet** — chain id 16661, hackathon submission, all live

| Contract | Address | Purpose |
|----------|---------|---------|
| `StorageIndex` | [`0x486aFe3c1e3dE1253B31C82A30d5270e63403c27`](https://chainscan.0g.ai/address/0x486aFe3c1e3dE1253B31C82A30d5270e63403c27) | Maps wallet → 0G root hashes (history, profile, documents) |
| `LawyerRegistry` | [`0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC`](https://chainscan.0g.ai/address/0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC) | On-chain verified service-provider registry (lawyers, RCICs, OISC advisers, MARA agents, translators, evaluators, notaries) |
| `CaseAgentNFT` | [`0xF89EC187E9062CDE86719273b85F3C6974A40829`](https://chainscan.0g.ai/address/0xF89EC187E9062CDE86719273b85F3C6974A40829) | ERC-7857 INFT — the user's personal AI agent as a transferable, cloneable, authorizable token |

Operator wallet `0xE5A747FA09271C8d479Cf718b205F8aADd6E4C30` pays gas on every user-facing tx, so users never need to hold native 0G.

Deploy scripts: [`contracts/script/DeployMainnet.s.sol`](contracts/script/DeployMainnet.s.sol), [`contracts/script/DeployCaseAgent.s.sol`](contracts/script/DeployCaseAgent.s.sol).

---

## Features

### Agentic stack

| Feature | What the agent actually does |
|---|---|
| **Tool-calling agent loop** | Function-calling iterations on every chat turn. Tools: `lookup_embassy`, `find_service_provider`, `create_case`, `extract_profile_facts`, `hire_provider`. Tool calls are non-streamed; the final answer streams token-by-token via SSE. |
| **Persona memory** | The agent extracts structured facts (citizenship, target countries, profession, English level, family, prior visa history) and persists them to the user's 0G profile blob. Reloaded into the system prompt on every future turn. |
| **Proactive morning routine** | Scans active cases for staleness, upcoming biometrics, and upcoming interviews; calls 0G Compute for a one-line action item; appends to the user's agent inbox. Manual "Run agent now" button + cron-ready endpoint. |
| **On-chain agent-to-agent hires** | The agent finds a verified provider, quotes the rate, asks for confirmation, then sends a tiny native 0G transfer to the provider's wallet with the full hire receipt encoded in the tx calldata. The chain is the receipt — viewable on chainscan.0g.ai. |
| **ERC-7857 INFT minting** | The user's personal Case Agent is mintable as an INFT (`CaseAgentNFT.sol`). Encrypted memory blob lives on 0G Storage, hash commitment on 0G Chain. Owner can transfer (oracle re-encryption), clone, or `authorizeUsage` to a verified provider without giving up ownership. |
| **INFT auto-refresh** | After every chat persist, the contract's metadataURI + contentHash are updated to bind the chain commitment to the freshly uploaded encrypted blob. |

### User-facing surfaces

| Feature | Description |
|---|---|
| AI Immigration Advisor | Multilingual AI grounded by USCIS, IRCC, UK Home Office, UNHCR, BAMF + a 30+ article guide library covering 15 countries. RAG: top-3 articles retrieved per turn, injected into the prompt with bracketed citations and a clickable Sources panel under each bubble. |
| Document Vault | Drag-drop upload to 0G Storage — tamper-proof, content-addressed, verifiable. |
| Embassy & Consulate Directory | 22 missions across Nigeria, Ghana, Kenya, the US, UK, Canada, Germany. Phone, email, hours, jurisdiction notes, direct appointment-portal links. Live snapshot can be served from 0G Storage via an admin endpoint, no redeploy required. |
| Verified Service-Provider Marketplace | 8 categories: lawyers, Canadian RCICs, UK OISC advisers, Australian MARA agents, court-certified translators, credential evaluators, notaries, document specialists. Optional agent-hireable opt-in with flat rate. |
| Visa Case Tracker | 8 statuses, full timeline of every state change. Local-first with Zustand + localStorage; auto-syncs to the user's 0G profile on every mutation. |
| Resources Hub | 30+ articles across 15 countries (US, UK, Canada, EU, Germany, Australia, NL, NZ, Japan, Singapore, UAE, Brazil, Mexico, South Korea, Saudi Arabia, India, Nigeria). |
| Dashboard | Agent inbox tile, INFT panel, case summary, activity graph, daily streak. |
| Multilingual | 30+ languages auto-detected by the AI: English, Spanish, French, Arabic, Hindi, Yoruba, Igbo, Hausa, Swahili, Amharic, Tagalog, Farsi, Ukrainian, more. |
| 10+ Wallet Options | MetaMask, OKX, Phantom, Trust, Coinbase, Brave, Rabby, SubWallet, WalletConnect. |

---

## Tech Stack

- **Framework**: Next.js 15.5 (App Router), React 19
- **CSS**: Tailwind v4 with `@theme inline` design tokens
- **Auth**: Wagmi v2 + RainbowKit v2 — 0G Galileo (Chain ID 16602)
- **AI**: 0G Compute Network (configurable model — DeepSeek Chat v3 / qwen-2.5-7b)
- **Storage**: `@0glabs/0g-ts-sdk` — content-addressed decentralized file storage
- **Data Layer**: `StorageIndex.sol` + `LawyerRegistry.sol` on 0G Galileo (zero centralized DB)
- **Contracts**: Foundry (Solidity 0.8.24), ethers.js 6.16 integration
- **State**: Zustand + TanStack Query
- **Animation**: Framer Motion

---

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10
- MetaMask or compatible EVM wallet (or use Demo Mode)
- Funded 0G Galileo testnet wallet ([faucet](https://faucet.0g.ai))
- [Foundry](https://book.getfoundry.sh/) (for contract deployment)

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example .env.local
```

Required env vars (0G Aristotle Mainnet, chain id 16661):

```env
# ── Chain ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_0G_RPC_URL=https://evmrpc.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16661

# Deployed contracts (live, see "Smart Contracts" table above)
NEXT_PUBLIC_STORAGE_INDEX_ADDRESS=0x486aFe3c1e3dE1253B31C82A30d5270e63403c27
NEXT_PUBLIC_LAWYER_REGISTRY_ADDRESS=0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC
NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS=0xF89EC187E9062CDE86719273b85F3C6974A40829

# ── Storage ───────────────────────────────────────────────────────────────
OG_INDEXER_RPC=https://indexer-storage-turbo.0g.ai

# ── Compute (direct app-sk API — preferred) ───────────────────────────────
# Resolve the proxy URL for your provider via the broker SDK once,
# then hardcode it here. Example below is the qwen3.6-plus provider used
# for the hackathon submission.
OG_COMPUTE_API_URL=https://compute-network-18.integratenetwork.work/v1/proxy
OG_COMPUTE_API_KEY=app-sk-...
OG_COMPUTE_MODEL_ID=qwen3.6-plus

# Broker SDK mode (used as second-tier fallback when app-sk fails)
OG_COMPUTE_PROVIDER_ADDRESS=0x992e6396157Dc4f22E74F2231235D7DE62696db5

# ── Operator wallet ───────────────────────────────────────────────────────
# Pays gas on every user tx (mint, hire, profile update, INFT refresh).
# Users never need to hold native 0G to use the app.
OG_SERVER_PRIVATE_KEY=0x...

# ── Emergency fallback inference ──────────────────────────────────────────
# Triggers ONLY if both 0G direct + broker return non-2xx. Provider badge
# flips to grey "Groq fallback" so the UI never gives a false 0G signal.
GROQ_API_KEY=gsk_...

# ── Admin + WalletConnect ─────────────────────────────────────────────────
ADMIN_SECRET=your-admin-secret
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### Deploy Contracts

```bash
cd contracts
forge test -vvv          # 39 tests pass

forge script script/Deploy.s.sol \
  --rpc-url og_galileo --broadcast \
  --legacy --gas-price 3000000000 \
  --private-key $OG_SERVER_PRIVATE_KEY
```

Add the output addresses to `.env.local`.

### Run

```bash
pnpm dev       # development server (localhost:3000)
pnpm build     # production build
pnpm start     # serve production build
```

### One-Time AI Setup

After first deploy, acknowledge the 0G Compute provider:

```bash
curl -X POST http://localhost:3000/api/setup
```

---

## API Routes (22 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/setup` | GET/POST | Check config + acknowledge 0G compute provider |
| `/api/chat` | POST | AI inference via 0G Compute |
| `/api/history` | GET | Chat history from 0G Storage |
| `/api/profile` | GET/POST | User profile from 0G Storage |
| `/api/upload` | POST | Document upload to 0G Storage |
| `/api/documents` | GET/DELETE | Document management |
| `/api/lawyers` | GET | Verified lawyer list |
| `/api/lawyers/apply` | POST | Submit lawyer application |
| `/api/lawyers/status` | GET | Check application status |
| `/api/lawyers/verify` | POST | Admin approve/reject |

---

## Project Structure

```
zeroviza/
├── contracts/                  # Foundry smart contracts
│   ├── src/
│   │   ├── StorageIndex.sol    # Wallet → 0G root hash mapping
│   │   └── LawyerRegistry.sol  # On-chain lawyer verification
│   ├── test/                   # 39 Forge tests
│   └── script/Deploy.s.sol     # Deployment script
├── src/
│   ├── app/
│   │   ├── (auth)/connect/     # Wallet connection landing page
│   │   ├── (app)/              # Main app routes (guarded)
│   │   │   ├── chat/           # AI advisor chat
│   │   │   ├── documents/      # Document vault
│   │   │   ├── resources/      # Immigration guides
│   │   │   ├── lawyers/        # Lawyer directory + apply
│   │   │   └── dashboard/      # Activity stats
│   │   └── api/                # 22 API routes
│   ├── lib/
│   │   ├── 0g/                 # 0G Compute + Storage wrappers
│   │   ├── contracts/          # ethers.js contract integrations
│   │   ├── wallet/             # Chain config + RainbowKit setup
│   │   ├── zeroviza/           # AI system prompt + streak logic
│   │   └── db/client.ts        # Data layer (contract + 0G calls)
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks (useChat, useWallet)
│   └── store/                  # Zustand stores
└── public/                     # Static assets, PWA manifest
```

---

## Deployment (Vercel)

```bash
pnpm build && vercel --prod
```

Set all env vars in Vercel dashboard. ZeroViza has **zero filesystem dependencies** — fully serverless compatible.

---

## For Hackathon Judges

> **TL;DR for judges**: this is not a UI demo. Three 0G pillars are wired end-to-end in production.
> Verify with the steps below, or read [`docs/hackathon/ARCHITECTURE.md`](docs/hackathon/ARCHITECTURE.md) for the full technical breakdown.

### 0G Integration Proof (required by hackathon rules)

| Requirement | Where to find it |
|---|---|
| **Mainnet contract address** | See "Smart Contracts" table above — mainnet addresses live in [`docs/hackathon/ARCHITECTURE.md`](docs/hackathon/ARCHITECTURE.md#contract-addresses) |
| **0G Explorer link** | [chainscan.0g.ai](https://chainscan.0g.ai) (mainnet) · [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) (testnet) |
| **0G component in use** | All three: Compute + Storage + Chain |
| **Source files proving integration** | [`src/lib/0g/compute.ts`](src/lib/0g/compute.ts) · [`src/lib/0g/storage.ts`](src/lib/0g/storage.ts) · [`contracts/src/`](contracts/src/) |
| **Demo video (3 min)** | See `docs/hackathon/DEMO_VIDEO_SCRIPT.md` for shot list (video link in submission) |

### Test it yourself (2 minutes)

1. **Option A — Real wallet**:
   - Install MetaMask / OKX / any EVM wallet
   - Get mainnet 0G (or testnet from [faucet.0g.ai](https://faucet.0g.ai))
   - Visit [zeroviza.vercel.app](https://zeroviza.vercel.app) → Connect → ask any immigration question
2. **Option B — Zero friction demo mode**:
   - Visit [zeroviza.vercel.app/connect](https://zeroviza.vercel.app/connect)
   - Click **"Try Demo"** — no wallet needed, full app access

### What to verify on-chain

1. **`StorageIndex.sol`** — Open the contract on 0G Explorer → Transactions tab → you will see `RootsUpdated` events for every user message, document upload, and profile change
2. **`LawyerRegistry.sol`** — Same explorer → you will see `ApplicationSubmitted` and `LawyerVerified` events for every lawyer onboarded
3. **0G Storage roots** — Every `historyRoot` / `profileRoot` / `documentsRoot` string in the contract state is a **live, retrievable Merkle root hash** on the 0G Storage indexer
4. **0G Compute fee settlement** — Watch the server wallet balance on 0G Explorer while chatting — you'll see compute fees deducted per inference

### Run it locally (for reproduction)

```bash
git clone https://github.com/Sage-senpai/Abobi.git zeroviza
cd zeroviza
pnpm install
cp .env.example .env.local
# Fill in OG_SERVER_PRIVATE_KEY with a funded mainnet wallet
# (or testnet + OG_COMPUTE_PROVIDER_ADDRESS for Galileo)
pnpm dev
```

Contract tests: `cd contracts && forge test -vvv` → **39 tests pass**.

---

## Docs

**Hackathon submission materials**
- [Architecture Deep-Dive](docs/hackathon/ARCHITECTURE.md) — system design, data flow, 0G pillars
- [Grant Request](docs/hackathon/GRANT_REQUEST.md) — mainnet token ask to 0G team
- [Demo Video Script](docs/hackathon/DEMO_VIDEO_SCRIPT.md) — 3-minute shot list for submission

**Project documentation**
- [Development Roadmap](docs/ROADMAP.md) — milestone plan through V3.0
- [V2.5 Release Notes](docs/V2.5.md) — architecture changes, contract details
- [Technical Documentation](docs/README.md) — full project structure, API reference
- [Feature Specification](docs/features.md) — complete feature list with status
- [Pitch Document](docs/pitch.md) — problem, market, solution, roadmap
