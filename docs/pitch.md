# Abobi — Pitch Document

## Problem

1. **Cultural AI disconnect**: Existing AI assistants speak in formal English, missing the warmth and nuance of West African Pidgin. ~75M+ Pidgin speakers have no culturally native AI tool.
2. **Centralized AI privacy**: Users have no ownership of their chat history. Conversations are stored on corporate servers and used to train models without user consent.
3. **Underrepresentation**: African linguistic identity is absent from the AI landscape. No product celebrates Pidgin culture at the AI level.
4. **Web3 UX gap**: Crypto-native users have no beautiful, consumer-grade AI product designed for them.

## Market

- **Addressable**: ~75M active Pidgin speakers (Nigeria, Ghana, Sierra Leone, diaspora)
- **Target**: Crypto-native Nigerians aged 18-35 — early adopters comfortable with wallets
- **Comparable**: ChatGPT generates ~100M weekly users; Cultural AI is a proven growth wedge (Character.ai, Pi)
- **Web3 angle**: Growing appetite for privacy-preserving, user-owned AI applications

## Solution

**Abobi** is a decentralized, Pidgin-speaking AI companion built on 0G's infrastructure.

- Chat with Abobi in natural Naija Pidgin
- Your history lives on 0G Storage — not on any company's server
- Inference runs on 0G Compute — censorship-resistant AI
- Identity is your wallet — no sign-up friction
- Streak system makes daily use addictive

## Architecture Summary

```
User (Wallet) ──→ Next.js PWA
                      ├── /api/chat ──→ 0G Compute (inference)
                      ├── /api/history ──→ 0G Storage (JSONL history)
                      └── /api/profile ──→ 0G Storage (streak + profile)
                                   ↕
                            SQLite (root hash index)
```

- **Chain**: 0G Galileo Testnet (Chain ID 16602)
- **Inference**: `qwen-2.5-7b-instruct` via 0G Compute Network
- **Storage**: `@0glabs/0g-ts-sdk` — content-addressed JSONL
- **Auth**: Wallet-only (Wagmi + RainbowKit)
- **Frontend**: Next.js 16 + Tailwind v4 + Framer Motion

## Monetization

### V1 — Freemium

| Tier | Features |
|------|----------|
| Free | Standard memory (50 messages), 0G inference |
| Premium ($5/mo) | Unlimited memory, priority inference, encrypted history |

### V2+

- Per-message micro-payments (user wallet pays compute directly)
- DAO-governed slang database
- NFT memory NFT exports

## Roadmap

- **V1 (Now)**: Wallet login, Pidgin chat, 0G Storage history, streak, glassmorphic PWA
- **V2**: Streaming responses, AES-256 encryption, user-pays compute, voice input
- **V3**: DAO governance, cross-chain, NFT memory inheritance, marketplace
