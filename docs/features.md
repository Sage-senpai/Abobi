# Abobi — Feature Specification

## V1 Core Features (Implemented)

| Feature | Status | Description |
|---------|--------|-------------|
| Wallet Login | ✅ | MetaMask / WalletConnect via RainbowKit on 0G Galileo |
| Text Chat | ✅ | Pidgin responses from Abobi via 0G Compute |
| 0G Inference | ✅ | `qwen-2.5-7b-instruct` on 0G Compute Network |
| 0G Storage | ✅ | JSONL chat history stored on-chain, keyed by wallet |
| Streak System | ✅ | Daily streak tracking stored in user profile on 0G |
| Glassmorphic UI | ✅ | Aura-style purple gradient + glass cards |
| Mobile-first PWA | ✅ | Installable on mobile, safe-area notch support |
| Encrypted Architecture | ✅ | PlaintextProvider (V1), ZK-ready interface scaffolded |
| Docs Auto-Maintained | ✅ | pitch.md, features.md, README.md |

## V2 Features (Planned)

| Feature | Priority | Description |
|---------|----------|-------------|
| Streaming Responses | High | Real-time character streaming from 0G Compute |
| AES-256 Encryption | High | Wallet-derived key encrypts history before storage |
| Voice Input | Medium | Browser Web Speech API for hands-free chat |
| SIWE Auth | Medium | Sign In With Ethereum for stronger session proof |
| User-Pays Compute | Medium | User wallet funds their own inference |
| Subscription Tiers | High | Freemium → Premium upgrade flow |
| Rate Limiting | High | Per-wallet message limits, Redis-backed |
| Push Notifications | Low | PWA push for streak reminders |

## V3 Roadmap

| Feature | Description |
|---------|-------------|
| DAO Slang Governance | Community votes on new Pidgin expressions |
| NFT Memory Inheritance | Export chat memories as transferable NFTs |
| Cross-chain Auth | Connect from any EVM wallet |
| Marketplace | Sell/share Abobi personas |
| Group Chat | Multi-wallet Pidgin rooms |
| Analytics Dashboard | Deep insights into language patterns |

## Technical Milestones

- [x] Next.js 16 App Router scaffold
- [x] Tailwind v4 with custom Abobi design tokens
- [x] Wagmi v2 + RainbowKit on 0G Galileo chain
- [x] `@0glabs/0g-ts-sdk` storage integration
- [x] `@0glabs/0g-serving-broker` compute integration
- [x] SQLite root-hash index (better-sqlite3)
- [x] Zustand + TanStack Query state layer
- [x] All API routes (chat, history, profile)
- [x] PWA manifest + mobile viewport
- [ ] Production deployment (Vercel / self-hosted)
- [ ] Server wallet funding (testnet faucet)
- [ ] CI/CD pipeline
