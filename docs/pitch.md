# Abobi Legal — Pitch Document

## The Problem

Every year, **300 million+ people** navigate complex immigration systems with almost no support:

- **Language barrier**: Legal guidance is written in formal English or the destination country's language — inaccessible to billions of non-native speakers
- **Cost barrier**: Immigration lawyers charge $150–$500/hour, far beyond reach for the people who need help most
- **Information overload**: Visa rules, asylum processes, and document requirements change constantly and differ by country, nationality, and visa type
- **Document vulnerability**: Physical passports and certificates get lost, damaged, or rejected as unverified — with no tamper-proof backup
- **Exploitation**: Without trusted guidance, migrants fall prey to fraudulent agents who charge for bad or illegal advice

> **Who suffers most:** Asylum seekers, undocumented workers, students, domestic workers, and refugees — disproportionately from Africa, Latin America, South Asia, and MENA.

---

## Market Opportunity

| Segment | Size |
|---------|------|
| International migrants globally | 281 million (UN, 2023) |
| Asylum seekers (active cases) | 35 million |
| International students | 6 million+ |
| Work visa applicants (US alone, annual) | 700,000+ |
| Remittance-corridor workers needing status clarity | 200 million+ |

**Primary origin communities we serve:**
- Nigeria, Ghana, Kenya, Ethiopia, South Africa (ECOWAS + global diaspora)
- Mexico, Brazil, Colombia, Venezuela (MERCOSUR + US migration corridor)
- India, Philippines, Bangladesh, Indonesia (largest work visa populations)
- Egypt, Lebanon, Jordan, Syria (MENA refugee and worker corridors)

**Comparable products proving AI legal aid demand:**
- DoNotPay: valued at $200M+ on consumer legal automation
- Harvey AI: $100M raised for AI legal tooling (enterprise)
- Immigration.AI: $4M seed for US-only immigration bot

**Abobi Legal's advantage**: Multilingual, multicountry, mobile-first, decentralized, free at point of use.

---

## The Solution

**Abobi Legal** is a Web3-native AI immigration advisor — a trusted companion that speaks your language, knows your visa pathway, stores your documents securely on blockchain, and connects you to pro bono lawyers when AI is not enough.

### Five core pillars

**1. Multilingual AI Advisor**
Ask about any visa, asylum process, or immigration question in English, Spanish, French, Hausa, Yoruba, Igbo, Portuguese, or Arabic. The AI responds in the same language, with culturally aware, empathetic guidance grounded in official sources (USCIS, IRCC, UK Home Office, UNHCR, EU directives).

**2. Tamper-Proof Document Vault**
Drag-and-drop passports, IDs, police clearances, and academic credentials directly to 0G decentralized storage. Each file gets a unique Merkle root hash — lawyers and embassies can verify authenticity without touching the original. Documents survive server shutdowns, censorship, and physical loss.

**3. Eligibility Intelligence**
A 4-step interactive quiz assesses visa eligibility across 15+ countries and 40+ visa categories. Dynamic document checklists adapt to nationality, destination country, and specific visa type (US Green Card, UK Skilled Worker, Canada Express Entry, EU Blue Card, and more).

**4. Resources and Policy Tracking**
Country-specific immigration guides for the US, UK, Canada, EU, Australia, UAE, Japan, South Korea, Nigeria, Brazil, Portugal, and Latin America — with a live policy alerts strip surfacing recent rule changes and deadline warnings.

**5. Pro Bono Lawyer Matchmaking** *(V2)*
When situations require a human expert — asylum claims, detention risk, appeals — Abobi connects users to vetted free and low-cost legal aid organizations: UNHCR, ILRC, Law Centres Network, Pro Asyl, RACS, and Vera Institute.

---

## Why 0G Network

| Challenge | Traditional Approach | Abobi + 0G |
|-----------|---------------------|------------|
| Document security | Cloud storage (deletable, hackable) | Merkle-hashed, decentralized, permanent |
| AI censorship | Corporate API (geo-blocked, rate-limited) | 0G Compute — permissionless inference |
| User privacy | Email/password + PII collection | Wallet identity — zero personal data stored |
| AI cost at scale | $0.002/token x millions of queries | Server wallet pays; users get it free |
| Trust | "Trust us" | On-chain verifiable at every step |

The 0G architecture makes Abobi Legal **censorship-resistant by design** — critical for users in countries with restricted internet or authoritarian document control.

---

## Architecture

```
User (Wallet or Demo Mode)
         |
         v
  Next.js 15.5 PWA  --- Framer Motion animations
  Mobile-first PWA  --- Tailwind v4, 60/30/10 design system
         |
  +------+------------------+-------------------+
  |      |                  |                   |
  v      v                  v                   v
AI    Document            Resources          Dashboard
Chat  Vault               & Guides           & Activity

/api/chat             /api/upload --> 0G Storage (ZgFile SDK)
/api/history          /api/documents    (Merkle root hash)
/api/profile               |
                           v
                    SQLite (document metadata
                    + root-hash index)

        v
  0G Compute Network
  qwen/qwen-2.5-7b-instruct
  via @0glabs/0g-serving-broker
```

- **Chain**: 0G Galileo Testnet (Chain ID 16602)
- **AI Model**: `qwen/qwen-2.5-7b-instruct`
- **Storage SDK**: `@0glabs/0g-ts-sdk@0.3.3`
- **Compute SDK**: `@0glabs/0g-serving-broker@0.7.1`
- **Frontend**: Next.js 15.5 + Tailwind v4 + Framer Motion

---

## Business Model

### V1 — Free (Live Now)
All users get unlimited AI guidance, document vault, and resource access. Server wallet covers 0G compute + storage costs.

### V2 — Freemium
| Tier | Features | Price |
|------|----------|-------|
| Free | 50 AI messages/month, 5 document uploads, guides | $0 |
| Pro | Unlimited messages, 50 documents, priority inference | $8/month |
| NGO | White-label, bulk case management, API access | Custom |

### V3 — Protocol Revenue
- Per-message micro-payments from user wallet directly to 0G provider
- Lawyer referral fee sharing (NGO partnerships)
- Premium country guide subscriptions for law firms and employers

---

## Roadmap

### V1 — Live
- Multilingual AI advisor (8 languages, 15+ destination countries)
- 0G Compute inference (qwen-2.5-7b, 12-message context window)
- Document Vault: real 0G upload, Merkle hash, drag-drop UI, delete
- Eligibility Quiz modal (4-step, multi-visa-type)
- Document Checklist modal (US, UK, Canada, AU, DE, JP, UAE, Student)
- Resources hub (15+ countries, ProcessingTimes widget)
- Dashboard with activity graph + daily streak system
- Demo Mode — full app experience without a wallet
- Vercel production deployment

### V2 — Q2 2026
- Streaming AI responses (Server-Sent Events)
- Pro Bono Lawyer Directory with filtering and matching
- AES-256-GCM document encryption (wallet-derived key)
- 6-step Eligibility Wizard with multi-country comparison
- SIWE session authentication
- Mobile push notifications (streak reminders, policy alerts)
- Rate limiting + subscription tier enforcement

### V3 — Q4 2026
- User-pays compute (direct wallet to 0G provider micropayments)
- DAO-governed immigration resource database
- Cross-chain wallet support (Solana, Bitcoin L2)
- Lawyer marketplace with on-chain payment rails
- Multi-language voice input
- Partner API for NGOs, embassies, and immigration firms

---

## Why Now

1. **Record displacement**: 117 million forcibly displaced people globally (UNHCR 2024) — largest in recorded history
2. **AI legal aid is proven**: Courts accepting AI-assisted filings; legal AI investment hit $1.3B in 2024
3. **0G is production-ready**: Mainnet live, compute network operational, storage tested at scale
4. **Mobile penetration**: 85%+ smartphone ownership in target markets — PWA-first is the right distribution wedge
5. **Trust deficit**: Post-pandemic, migrants deeply distrust intermediaries — a transparent, blockchain-verifiable tool earns trust differently

---

## The Ask

We are seeking:
- **Infrastructure Grants**: 0G Foundation, UNHCR Innovation Fund, Mozilla Foundation, Ethereum Foundation
- **Seed Round**: $500K to fund server infrastructure, legal content partnerships, and V2 development
- **NGO Partnerships**: Legal aid organizations to co-brand, integrate, and distribute Abobi Legal to their client base

> *"Every person deserves to understand their rights — regardless of what language they speak or how much money they have."*
