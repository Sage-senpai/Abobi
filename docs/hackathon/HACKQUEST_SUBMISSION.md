# HackQuest submission — paste-ready blocks

Copy each block into the matching field on the HackQuest form. Edit the
`{video_link}`, `{loom_link}` placeholders once recording is uploaded.

---

## Project name
ZeroViza

## Tagline (≤ 80 chars)
An immigration AI agent the user owns on chain, end-to-end on 0G.

## Track
Track 3 — Agentic Economy & Autonomous Applications

## Short description (≤ 280 chars)
ZeroViza turns every user's immigration case into an ERC-7857 INFT.
Agent runs on 0G Compute, memory lives on 0G Storage, and the case
agent hires verified service providers on chain with the receipt
encoded directly into the transaction calldata.

---

## Long description (Markdown — paste into the long-form field)

ZeroViza is a decentralized AI immigration advisor that re-imagines the
"AI app" as an agent the user owns end-to-end.

**The problem.** 280 million people live outside their country of birth.
Most cannot afford an immigration lawyer. The apps that try to help leak
case files into centralized SaaS databases, charge in fiat the user does
not have, and disappear the moment the company pivots.

**What we built.**

1. **Tool-calling agent loop.** Every chat turn runs a function-calling
   loop on 0G Compute. The agent's tools include `lookup_embassy`,
   `find_service_provider`, `create_case`, `extract_profile_facts`, and
   `hire_provider`. Tool iterations are non-streamed; the final answer
   streams token-by-token via SSE.
2. **Persona memory.** The agent extracts structured facts from
   conversations (citizenship, target country, profession, English
   level, family situation) and persists them inside the user's 0G
   Storage profile blob. Reloaded into every future turn — the agent
   remembers across sessions.
3. **RAG with citations.** A 30+ article guide library covering 15
   countries is keyword-retrieved on every turn. Top three articles are
   injected into the system prompt with numbered citations. A Sources
   panel beneath each AI bubble links directly to USCIS, IRCC, gov.uk,
   BAMF — verifiable in one click.
4. **Proactive morning routine.** A daily routine scans active cases,
   flags stale ones (>14 days without a status event), warns about
   upcoming biometrics and interview dates, and generates a one-line
   action item via 0G Compute. Results are written to a per-user agent
   inbox stored on 0G.
5. **Agent-to-agent on-chain hire (Track 3 money shot).** The agent
   finds a verified service provider from the on-chain LawyerRegistry,
   quotes the rate, confirms with the user, and pays the provider on
   chain. The hire receipt — user wallet, task, agreed fee, case-agent
   token id — is encoded as UTF-8 JSON inside the tx calldata, viewable
   on chainscan.0g.ai. For demo personas (clearly badged "Demo · 0G
   Compute"), the persona's reply is generated immediately via 0G
   Compute using their persona prompt.
6. **ERC-7857 CaseAgentNFT.** The user's personal Case Agent is
   mintable as an INFT. Encrypted memory blob (persona + chat history +
   cases) lives on 0G Storage; the hash commitment lives on chain.
   Owner can transfer (oracle re-encryption), clone (sub-agent),
   `authorizeUsage` (delegate to a verified provider without giving up
   ownership), and `updateMetadata` (auto-fires after every chat
   persist so the chain commitment stays bound to the live blob).
7. **Verifiable inference.** Every assistant bubble carries a
   "Verified by 0G" badge that opens a receipt popover with the
   provider wallet (clickable to chainscan), the ZG-Res-Key from the
   compute response, the response ID, the model, and the inference
   latency.

**Three 0G pillars, all on Aristotle Mainnet (chain id 16661):**

| Pillar | Use |
|---|---|
| Compute | qwen3.6-plus via direct app-sk API. Inference + tool calls + persona replies. Groq is wired only as an emergency circuit-breaker if the 0G provider returns non-2xx. |
| Storage | Chat history, user profile (incl. persona + cases + agent inbox), documents, provider metadata, embassy directory snapshots. |
| Chain | StorageIndex (root pointers), LawyerRegistry (verified providers, 7 demo personas seeded on chain), CaseAgentNFT (ERC-7857 INFT). |

**The user holds no token.** An operator wallet pays gas on every
user-facing transaction (mint, hire, profile update, INFT metadata
refresh). The wallet is the user's identity, not their bill.

---

## 0G integration depth

### Smart contracts (live mainnet)

| Contract | Address |
|---|---|
| StorageIndex | `0x486aFe3c1e3dE1253B31C82A30d5270e63403c27` |
| LawyerRegistry | `0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC` |
| CaseAgentNFT (ERC-7857) | `0xF89EC187E9062CDE86719273b85F3C6974A40829` |

Operator / owner / oracle: `0xE5A747FA09271C8d479Cf718b205F8aADd6E4C30`.

39 Forge tests covering the registry and storage index. CaseAgentNFT
implements ERC-7857's mint / transfer (oracle-signed re-encryption
proof) / clone / authorizeUsage / updateMetadata surface.

### Compute integration

- OpenAI-compatible direct API
  (`https://compute-network-18.integratenetwork.work/v1/proxy`)
- App-secret key (`app-sk-…`) issued for provider
  `0x992e6396157Dc4f22E74F2231235D7DE62696db5` running qwen3.6-plus.
- Every response carries an attestation: provider wallet (HTTP `Provider`
  header), ZG-Res-Key, response ID, latency ms. All four are bound to
  the assistant `ChatMessage` and surfaced in the "Verified by 0G"
  badge.
- Streaming, tool calling, and non-streaming all supported.

### Storage integration

- `@0gfoundation/0g-ts-sdk` writes content-addressed blobs.
- Per-user blobs: history JSONL, profile JSON, documents.
- Per-app blobs: provider metadata, embassy directory snapshots.
- All blob root hashes are committed on chain in the StorageIndex or
  LawyerRegistry contract.

---

## Live demo
{video_link}

## GitHub
https://github.com/Sage-senpai/Abobi

## Architecture doc
[docs/hackathon/ARCHITECTURE.md](./ARCHITECTURE.md)

## Demo video script
[docs/hackathon/DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md)

---

## Tags / hashtags
`#0GHackathon` `#BuildOn0G` `agentic-economy` `erc-7857` `inft`
`immigration-tech` `legal-tech` `ai-agents` `web3-ai`

## Tagged accounts (for the X post)
@0G_labs @0g_CN @0g_Eco @HackQuest_

---

## Team
Divine (solo build)

## Time spent
~3 weeks. Began at hackathon kickoff.

## What's next post-hackathon
- Replace operator-paid hires with user-signed hires through
  wagmi's `useSendTransaction` (the receipt + permission model is
  already in place).
- Build an `AgentEscrow.sol` with timeouts and dispute resolution so
  service-provider hires settle on completion rather than on the click.
- Decode the calldata receipts in a public dashboard so anyone can
  audit the agent-economy flow without writing a script.
- Schedule the morning routine via on-chain user-discovery (index
  `StorageIndex.RootsUpdated` events) so the proactive loop runs
  daily without needing the user to open the app.
