# Abobi

> Your decentralized Pidgin AI bro, powered by 0G Network.

## Quick Start

### 1. Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10
- MetaMask or compatible EVM wallet
- Funded 0G testnet server wallet (see Environment Setup)

### 2. Install Dependencies

```bash
pnpm install
pnpm rebuild better-sqlite3
```

### 3. Environment Variables

Copy the example and fill in values:

```bash
cp .env.example .env.local
```

Required values:

```env
# 0G Galileo Testnet RPC
NEXT_PUBLIC_0G_RPC_URL=https://evmrpc-testnet.0g.ai
NEXT_PUBLIC_0G_CHAIN_ID=16602

# 0G Storage indexer
OG_INDEXER_RPC=https://indexer-storage-testnet-standard.0g.ai

# Server wallet private key — fund at https://faucet.0g.ai (0.1 0G/day)
OG_SERVER_PRIVATE_KEY=0x...

# 0G Compute provider address — discover via CLI below
OG_COMPUTE_PROVIDER_ADDRESS=0x...

# WalletConnect (optional, enables mobile QR)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### 4. Discover a Compute Provider

```bash
# Install CLI globally
pnpm add @0glabs/0g-serving-broker -g

# Setup network connection
0g-compute-cli setup-network

# Fund your account (uses OG_SERVER_PRIVATE_KEY)
0g-compute-cli deposit --amount 10

# List available inference providers
0g-compute-cli inference list-providers

# Pick a provider and acknowledge it (one-time)
0g-compute-cli inference acknowledge-provider --provider 0x_PROVIDER_ADDRESS
```

Copy the provider address into `OG_COMPUTE_PROVIDER_ADDRESS` in `.env.local`.

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) on mobile viewport (375px).

## Architecture

```
src/
├── app/
│   ├── (auth)/connect/      # Wallet connect landing
│   ├── (app)/               # Auth-gated app (wallet required)
│   │   ├── page.tsx         # Home screen
│   │   ├── chat/page.tsx    # Chat interface
│   │   └── dashboard/page.tsx # Analytics dashboard
│   ├── api/
│   │   ├── chat/route.ts    # POST: run inference + save history
│   │   ├── history/route.ts # GET: load chat history from 0G
│   │   └── profile/route.ts # GET: user profile + streak
│   └── providers.tsx        # Wagmi + RainbowKit + TanStack Query
├── components/
│   ├── chat/                # ChatBubble, ChatInput, ChatThread
│   ├── home/                # GreetingCard, StreakCard, MemoryCard, ActivityGraph
│   ├── layout/              # AppShell, BottomNav (mobile), Sidebar (desktop)
│   ├── wallet/              # ConnectButton, WalletGuard
│   └── ui/                  # GlassCard, GradientButton, WaveBackground, LoadingDots
├── hooks/                   # useChat, useHistory, useProfile, useStreak
├── lib/
│   ├── 0g/storage.ts        # 0G Storage SDK wrapper
│   ├── 0g/compute.ts        # 0G Compute broker wrapper
│   ├── db/client.ts         # SQLite root-hash index
│   ├── abobi/prompt.ts      # Abobi system prompt
│   ├── abobi/streak.ts      # Streak calculation logic
│   └── crypto/index.ts      # EncryptionProvider interface (V1: plaintext)
├── store/                   # Zustand (chatStore, userStore)
└── types/                   # TypeScript interfaces
```

## 0G Network Configuration

| Parameter | Value |
|-----------|-------|
| Chain ID | 16602 |
| RPC | https://evmrpc-testnet.0g.ai |
| Explorer | https://chainscan-galileo.0g.ai |
| Storage Explorer | https://storagescan-galileo.0g.ai |
| Faucet | https://faucet.0g.ai (0.1 0G/day) |
| Inference Model | qwen-2.5-7b-instruct |

## Storage Strategy

Chat history is stored as JSONL on 0G decentralized storage. A local SQLite database
acts as a root-hash index (wallet_address → root_hash mapping). This means:

- History survives server restarts
- Content is fully portable — any node can serve it by root hash
- V2 will add AES-256-GCM encryption before upload

## Deployment

### Vercel

```bash
pnpm build
vercel --prod
```

Set all env vars in Vercel dashboard. Note: `better-sqlite3` requires a Linux build environment — this works on Vercel's Node.js runtime.

### Docker (Self-hosted)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Known Trade-offs (V1)

| Trade-off | Decision | Future |
|-----------|----------|--------|
| Storage index | SQLite (centralized) | On-chain mapping (V2) |
| Inference payment | Server wallet pays | User wallet pays (V2) |
| Encryption | Plaintext | AES-256-GCM (V2) |
| Response format | Batch | SSE streaming (V2) |
