# Abobi Legal — Feature Specification

## V1 Core Features (Implemented)

### Platform & Auth
| Feature | Status | Description |
|---------|--------|-------------|
| Wallet Login | Done | MetaMask / WalletConnect via RainbowKit on 0G Galileo (Chain ID 16602) |
| Demo Mode | Done | Full app access without a wallet — Zustand-persisted demo flag |
| Split-screen Landing | Done | Dark navy hero + white sign-in panel, feature list, trust badges |

### AI Advisor
| Feature | Status | Description |
|---------|--------|-------------|
| Immigration AI Chat | Done | Multilingual advisor via 0G Compute (qwen-2.5-7b-instruct) |
| 12-message Context Window | Done | Recent history passed to inference for coherent multi-turn conversations |
| Quick Prompts | Done | 4 suggested questions surfaced from chat input bar |
| Multilingual Auto-Detect | Done | AI responds in the same language the user writes in |
| System Prompt | Done | Comprehensive immigration prompt: 15+ countries, 40+ visa types, free legal aid resources |
| Legal Disclaimer | Done | "Not legal advice" shown in chat input and greeting card |

### Document Vault
| Feature | Status | Description |
|---------|--------|-------------|
| Real 0G Upload | Done | POST /api/upload — multipart file to ZgFile SDK, returns Merkle root hash |
| Drag-and-Drop UI | Done | Animated drop zone with active/uploading states |
| File Browser | Done | Click-to-browse with multi-file select support |
| File Validation | Done | Type whitelist (PDF, JPG, PNG, WEBP, HEIC, DOC, DOCX), 25 MB limit |
| Document List | Done | Live-loading via TanStack Query, animated list with file type icons |
| Delete Document | Done | Removes SQLite record (0G content-addressed — hash persists) |
| Blockchain Hash Display | Done | Shortened root hash shown per document for verification |
| Verified Badge | Done | Green "Verified" badge on successfully uploaded documents |
| Wallet Gate | Done | Upload disabled for Demo Mode users; helpful amber notice shown |

### Eligibility & Checklists
| Feature | Status | Description |
|---------|--------|-------------|
| Eligibility Quiz Modal | Done | 4-step wizard: destination, visa type, education, employment |
| Document Checklist Modal | Done | Country + visa-type specific lists (US, UK, Canada, AU, DE, JP, UAE, Student) |
| Checklist Interaction | Done | Checkable items with completion counter and progress |

### Resources
| Feature | Status | Description |
|---------|--------|-------------|
| Country Guides | Done | US, UK, Canada, EU, Australia, UAE, Japan, Nigeria, Germany, Latin America |
| Processing Times Widget | Done | Estimated processing times for major visa categories by country |
| Policy Alerts Strip | Done | Horizontal scrolling strip of recent immigration updates |
| Resource Cards | Done | Expandable sections with official links and key requirements |

### Dashboard & Activity
| Feature | Status | Description |
|---------|--------|-------------|
| Activity Graph | Done | 7-day bar chart of chat activity from 0G history |
| Daily Streak | Done | Streak counter stored in user profile on 0G Storage |
| Memory Card | Done | Shows number of stored conversations |
| Stats Overview | Done | Message count, document count, streak summary |

### Design & UX
| Feature | Status | Description |
|---------|--------|-------------|
| 60-30-10 Design System | Done | 60% white/light, 30% dark navy (#0F172A), 10% red accent (#DC2626) |
| Framer Motion Animations | Done | Page transitions, card entrances, button feedback throughout |
| Mobile-first PWA | Done | Responsive with bottom nav (mobile) + sidebar (desktop) |
| Safe-area Notch Support | Done | `safe-bottom` padding on chat input and nav bar |
| Hover Tooltips | Done | Info icon tooltips on document category cards |
| Card Hover Effects | Done | Subtle lift + shadow + border-color transition on all cards |

---

## V2 Features (Planned — Q2 2026)

| Feature | Priority | Description |
|---------|----------|-------------|
| Streaming AI Responses | High | Server-Sent Events for real-time character streaming from 0G Compute |
| Pro Bono Lawyer Directory | High | Searchable list of vetted free/low-cost legal aid orgs by country |
| AES-256-GCM Encryption | High | Wallet-derived key encrypts documents before 0G upload |
| 6-step Eligibility Wizard | High | Multi-country comparison, points calculator (Canada CRS, Japan HSP) |
| SIWE Authentication | Medium | Sign-In With Ethereum for verifiable session proof |
| Subscription Tiers | High | Freemium: 50 msgs/5 docs free; Pro $8/month unlimited |
| Rate Limiting | High | Per-wallet Redis-backed request throttling |
| Push Notifications | Medium | PWA push for streak reminders and policy alert updates |
| Lawyer Matching | Medium | Filter by country, visa type, language, availability |
| Voice Input | Low | Browser Web Speech API for hands-free chat |
| Case Notes | Low | Private encrypted notes per immigration case |

---

## V3 Roadmap (Q4 2026)

| Feature | Description |
|---------|-------------|
| User-Pays Compute | User wallet funds inference directly via 0G micropayments |
| DAO Resource Governance | Community votes on country guides and resource accuracy |
| Cross-chain Auth | Solana, Bitcoin L2, and any EVM wallet |
| Lawyer Marketplace | Smart contract payments for legal consultations |
| Partner API | White-label API for NGOs, embassies, immigration firms |
| Analytics Dashboard | Deep case volume and language usage insights for NGO partners |
| Group Case Rooms | Multi-wallet shared case folders (family reunification use case) |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat` | Run inference on 0G Compute, save history to 0G Storage |
| GET | `/api/history` | Load chat history from 0G (by root hash) |
| GET | `/api/profile` | Load user profile + streak from 0G |
| GET/PUT | `/api/setup` | Initialize user account and server wallet |
| POST | `/api/upload` | Upload file to 0G Storage, store metadata in SQLite |
| GET | `/api/documents` | List user documents from SQLite |
| DELETE | `/api/documents` | Remove document record from SQLite |

---

## Technical Milestones

- [x] Next.js 15.5 App Router with route groups `(auth)` and `(app)`
- [x] Tailwind v4 with `@theme inline` design tokens and CSS nesting
- [x] Wagmi v2 + RainbowKit on 0G Galileo (Chain ID 16602)
- [x] `@0glabs/0g-ts-sdk@0.3.3` storage integration (require() for CJS compat)
- [x] `@0glabs/0g-serving-broker@0.7.1` compute integration (require() for CJS compat)
- [x] SQLite root-hash index + documents table (better-sqlite3)
- [x] Zustand stores: chatStore, userStore, demoStore
- [x] TanStack Query: useHistory, useProfile, document mutations
- [x] All 7 API routes implemented and type-safe
- [x] Real document upload: multipart form -> ZgFile -> SQLite index
- [x] Demo Mode: full app without wallet (Zustand-persisted)
- [x] Framer Motion animations on all pages and components
- [x] Mobile bottom nav + desktop sidebar
- [x] PWA manifest + safe-area mobile viewport
- [x] Vercel production deployment (ESLint bypassed, ESM/CJS fixed)
- [x] SQLite writes to /tmp on Vercel serverless
- [ ] AES-256-GCM encryption before upload
- [ ] Streaming inference (SSE)
- [ ] Pro bono lawyer directory data + matching
- [ ] Rate limiting (Redis)
- [ ] CI/CD pipeline
