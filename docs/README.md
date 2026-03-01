# Abobi Legal — Technical Documentation

> AI-powered immigration legal guidance for underserved communities worldwide.
> Built on 0G decentralized compute + storage.

---

## Quick Start

### 1. Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10
- MetaMask or compatible EVM wallet (optional — Demo Mode works without one)
- Funded 0G Galileo testnet server wallet

### 2. Install Dependencies

```bash
pnpm install
pnpm rebuild better-sqlite3   # compile native SQLite bindings
```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_0G_RPC_URL` | Yes | `https://evmrpc-testnet.0g.ai` |
| `NEXT_PUBLIC_0G_CHAIN_ID` | Yes | `16602` |
| `OG_INDEXER_RPC` | Yes | `https://indexer-storage-testnet-standard.0g.ai` |
| `OG_SERVER_PRIVATE_KEY` | Yes | Funded testnet wallet — pays for all compute + storage |
| `OG_COMPUTE_PROVIDER_ADDRESS` | Yes | Discovered via CLI (see below) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | No | Enables QR code wallet connection on mobile |
| `NEXT_PUBLIC_APP_URL` | No | Production URL (e.g. `https://abobi.vercel.app`) |

> **Do NOT set `DATABASE_PATH`** on Vercel — SQLite auto-uses `/tmp/abobi.db`.

### 4. Discover a Compute Provider

```bash
# Fund your server account on 0G
npx @0glabs/0g-serving-broker setup-network
npx @0glabs/0g-serving-broker deposit --amount 10

# List available inference providers
npx @0glabs/0g-serving-broker inference list-providers

# Acknowledge provider (one-time, required before inference)
npx @0glabs/0g-serving-broker inference acknowledge-provider \
  --provider 0x_PROVIDER_ADDRESS
```

Copy the provider address into `OG_COMPUTE_PROVIDER_ADDRESS`.

### 5. Run

```bash
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve production
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── connect/page.tsx     # Split-screen landing (wallet or Demo Mode)
│   ├── (app)/                   # Auth-gated — wallet or demo required
│   │   ├── page.tsx             # Immigration Hub home
│   │   ├── chat/page.tsx        # AI Advisor chat interface
│   │   ├── documents/page.tsx   # Document Vault (0G upload)
│   │   ├── resources/page.tsx   # Country immigration guides
│   │   └── dashboard/page.tsx   # Activity graph + streak
│   ├── api/
│   │   ├── chat/route.ts        # POST: inference + save history to 0G
│   │   ├── history/route.ts     # GET: load history from 0G Storage
│   │   ├── profile/route.ts     # GET: user profile + streak
│   │   ├── setup/route.ts       # GET/PUT: account initialization
│   │   ├── upload/route.ts      # POST: multipart file upload to 0G
│   │   └── documents/route.ts   # GET/DELETE: document list management
│   ├── layout.tsx               # Root layout + Open Graph meta
│   └── providers.tsx            # Wagmi + RainbowKit + TanStack Query
├── components/
│   ├── chat/
│   │   ├── ChatBubble.tsx       # User/AI message bubble
│   │   ├── ChatInput.tsx        # Textarea + quick prompts + send button
│   │   └── ChatThread.tsx       # Scrollable message list
│   ├── home/
│   │   ├── GreetingCard.tsx     # AI avatar + greeting + status bar
│   │   ├── StreakCard.tsx       # Daily streak counter
│   │   ├── MemoryCard.tsx       # Conversation count
│   │   └── ActivityGraph.tsx    # 7-day bar chart of message activity
│   ├── immigration/
│   │   ├── QuickActions.tsx     # 4-card action grid (Chat, Documents, Resources, Checklist)
│   │   ├── PolicyAlertsStrip.tsx # Horizontal scrolling policy updates
│   │   ├── EligibilityQuiz.tsx  # 4-step eligibility quiz modal
│   │   └── DocumentChecklist.tsx # Country + visa-type document checklist modal
│   ├── layout/
│   │   ├── AppShell.tsx         # Root layout: sidebar + content + bottom nav
│   │   ├── Sidebar.tsx          # Desktop dark-navy sidebar (5 items)
│   │   └── BottomNav.tsx        # Mobile bottom navigation (5 items)
│   ├── wallet/
│   │   └── ConnectButton.tsx    # RainbowKit connect button (white/red styled)
│   └── ui/
│       ├── GlassCard.tsx        # White card with border + shadow (motion-ready)
│       ├── GradientButton.tsx   # Red primary action button
│       ├── WaveBackground.tsx   # SVG animated wave for connect page
│       └── LoadingDots.tsx      # Animated loading indicator
├── hooks/
│   ├── useWallet.ts             # address, isDemo, chain helpers
│   ├── useChat.ts               # send message, loading, error state
│   ├── useHistory.ts            # TanStack Query: load chat history
│   ├── useProfile.ts            # TanStack Query: load user profile
│   └── useStreak.ts             # Streak calculation helper
├── lib/
│   ├── 0g/
│   │   ├── compute.ts           # 0G Compute broker (require() for CJS compat)
│   │   └── storage.ts           # 0G Storage SDK (require() for CJS compat)
│   ├── db/
│   │   ├── client.ts            # SQLite: storage index + document CRUD
│   │   └── schema.ts            # Table definitions + TypeScript row types
│   └── abobi/
│       ├── prompt.ts            # Immigration AI system prompt + model config
│       └── streak.ts            # Streak calculation + profile helpers
├── store/
│   ├── chatStore.ts             # Zustand: in-memory message list
│   ├── userStore.ts             # Zustand: wallet address sync
│   └── demoStore.ts             # Zustand + persist: demo mode flag
└── types/
    ├── chat.ts                  # ChatMessage, InferenceMessage
    └── storage.ts               # StorageIndex, UploadResult, UserDocument
```

---

## 0G Network Reference

| Parameter | Value |
|-----------|-------|
| Chain ID | 16602 |
| Network Name | 0G Galileo Testnet |
| RPC | `https://evmrpc-testnet.0g.ai` |
| Explorer | `https://chainscan-galileo.0g.ai` |
| Storage Explorer | `https://storagescan-galileo.0g.ai` |
| Faucet | `https://faucet.0g.ai` (0.1 0G/day) |
| Inference Model | `qwen/qwen-2.5-7b-instruct` |
| Context Window | 12 recent messages |
| Max Tokens | 800 per response |
| Temperature | 0.65 |

---

## Storage Architecture

### Chat History
Chat messages are serialised as JSONL and uploaded to 0G Storage via `ZgFile`. The Merkle root hash is stored in SQLite (`storage_index` table). On each new message, the full updated history is re-uploaded and the root hash updated.

### Document Vault
Each uploaded file is sent to 0G via `ZgFile`. The resulting root hash plus metadata (name, size, MIME type, timestamp) is stored in the `documents` SQLite table. The 0G content is permanent — deleting a record only removes the metadata index entry.

### SQLite Tables

```sql
-- Root hash index for chat history + profile
CREATE TABLE storage_index (
  wallet_address    TEXT PRIMARY KEY,
  history_root_hash TEXT,
  profile_root_hash TEXT,
  updated_at        INTEGER NOT NULL
);

-- Document metadata index
CREATE TABLE documents (
  id             TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  name           TEXT NOT NULL,
  size           INTEGER NOT NULL,
  mime_type      TEXT NOT NULL,
  root_hash      TEXT NOT NULL UNIQUE,
  uploaded_at    INTEGER NOT NULL,
  verified       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_documents_wallet ON documents(wallet_address);
```

---

## Key Implementation Notes

### ESM/CJS Interop
`@0glabs/0g-ts-sdk` and `@0glabs/0g-serving-broker` ship CJS bundles but expose ESM entry points. Dynamic `import()` triggers Node.js ESM loader which cannot resolve named exports from CJS. Both SDKs must be loaded with `require()`:

```ts
const { ZgFile, Indexer } = require("@0glabs/0g-ts-sdk") as typeof import("@0glabs/0g-ts-sdk");
const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker") as typeof import("@0glabs/0g-serving-broker");
```

Both packages are listed in `serverExternalPackages` in `next.config.ts` to prevent webpack bundling.

### SQLite on Vercel
Vercel serverless functions can only write to `/tmp`. `client.ts` auto-detects the `VERCEL` environment variable:

```ts
const defaultPath = process.env.VERCEL ? "/tmp/abobi.db" : "./data/abobi.db";
```

Do not set `DATABASE_PATH` in the Vercel dashboard — it will override this logic.

### Broker Pattern
The 0G Compute broker is initialized lazily and cached:

```ts
// broker.inference.getRequestHeaders(providerAddress, body)
// broker.inference.processResponse(providerAddress, chatId, content)
// broker.ledger.depositFund(amount)
```

The `ServingRequestHeaders` type must be cast as `unknown as Record<string, string>` when used as fetch headers.

---

## Deployment

### Vercel (Recommended)

```bash
pnpm build
vercel --prod
```

Required Vercel settings:
- Framework: Next.js
- Node version: 22.x
- Build command: `pnpm build`
- Do NOT set `DATABASE_PATH`

### Docker (Self-hosted)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm rebuild better-sqlite3
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

Mount a persistent volume at `/app/data` for SQLite persistence across container restarts.

---

## Known Trade-offs (V1)

| Trade-off | Current Decision | V2 Plan |
|-----------|-----------------|---------|
| Storage index | SQLite (centralized, ephemeral on Vercel) | Persistent volume or on-chain mapping |
| Inference payment | Server wallet pays for all users | User wallet pays via micropayments |
| Document encryption | Plaintext on 0G | AES-256-GCM with wallet-derived key |
| AI responses | Batch (full response at once) | SSE streaming |
| Document content on delete | Hash persists on 0G (content-addressed) | Acceptable — only metadata index removed |
