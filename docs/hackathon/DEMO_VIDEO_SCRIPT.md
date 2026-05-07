# ZeroViza Demo Video — Shot List (3 min max)

> Hackathon judges watch this once. Track 3 (Agentic Economy & Autonomous
> Applications). The story to sell is **agents that act, on chain, with
> data the user owns**, not "another chatbot".

## Recording checklist before you hit record

- [ ] Chrome with a clean profile (no extensions in the tab bar)
- [ ] Resolution 1920×1080
- [ ] Close Slack, notifications, every other tab
- [ ] Wallet connected to **0G Aristotle Mainnet** (chain id 16661)
- [ ] Operator wallet has at least 1 0G for hire-receipt tx
- [ ] Two windows ready: **app** + **chainscan.0g.ai**
- [ ] Have one verified service-provider already registered with `acceptsHires: true` and a `flatRateUSD`
- [ ] One sample passport image ready (blurred sample)
- [ ] Mic test, no fans, no background
- [ ] One take if possible, cut later

---

## Story arc (3 minutes)

> **Hook → AI advisor with tools → Agent worked overnight → Agent hires on chain → Mint the agent as an INFT → On-chain proof → CTA**

The agentic angle is the spine. Every scene must tie back to "the agent did this for you" or "you own this on chain".

---

### Scene 1 — Hook (0:00 – 0:12)

**Visual**: Cold open on the ZeroViza landing page, logo prominent.

**Voiceover**:
> "My uncle once flew Lagos to Abuja for a US visa interview. Wrong appointment day. Came back with nothing but a flight receipt. Most immigrants can't afford a lawyer, and the apps that do help leak their case files to centralized servers. ZeroViza fixes both, with an AI agent the user actually owns."

**Action**: Hold on the landing page for the duration of the VO.

---

### Scene 2 — Connect wallet (0:12 – 0:22)

**Visual**: Click "Connect Wallet" → pick MetaMask → land on dashboard.

**Voiceover**:
> "Connect any EVM wallet. No password, no email. Your wallet is your identity, and from now on it's also the key to a personal AI agent."

**Action**: Cut wallet popup if it lingers. Land on the dashboard tiles fast.

---

### Scene 3 — Agent in action with tool calls (0:22 – 1:05) ← **HERO SHOT**

**Visual**: Click AI Advisor in sidebar. Type a question that triggers two tools.

**Suggested prompt**:
> *"I'm a Nigerian software engineer in Lagos with a Master's, English fluent, targeting a US H-1B. Where do I file in Lagos?"*

**Voiceover** (over the streaming response):
> "When I ask, the agent doesn't just generate text. It calls tools. Watch the chips. It's saving my profile facts to my 0G Storage blob. It's looking up the actual US Consulate in Lagos with the live phone and appointment URL. Then it answers grounded in the result, with citations to USCIS pulled from a thirty-plus article guide library."

**Action**:
1. Type the prompt, hit Enter
2. **Tool chips appear in real time** under the assistant bubble:
   - "Saving profile facts: citizenship, currentCountry, profession, …"
   - "Looking up embassy · Found 1 United States mission"
3. Final answer streams in below
4. Scroll the answer and **point at the bracketed citations [1] [2]**
5. Hover the **provider badge** showing "0G Compute" with the pulsing red dot

**What to emphasize in VO**: The agent took actions that changed state on 0G Storage. Not a stateless chatbot.

---

### Scene 4 — Agent inbox, the agent worked overnight (1:05 – 1:30)

**Visual**: Click Dashboard. Hit "Run agent now" on the Agent Inbox tile.

**Voiceover**:
> "The agent runs even when I'm not here. This is its inbox. One tap and it scans every open case, flags stale ones, and writes today's action item, all powered by 0G Compute. In production, a daily cron does this automatically."

**Action**:
1. Already on the dashboard
2. Click **Run agent now** on the Agent Inbox tile
3. Wait for the green "Agent ran. Analyzed N cases, added M items"
4. Inbox populates with the daily summary + flagged reminders
5. Hover one inbox item to show the timestamp

---

### Scene 5 — Hire a verified provider on chain (1:30 – 2:00) ← **AGENTIC ECONOMY MONEY SHOT**

**Visual**: Continue in chat. Type a request that triggers `find_service_provider` then `hire_provider`.

**Suggested prompt**:
> *"I need someone to translate my Yoruba transcript to English. Can you hire one?"*

**Voiceover**:
> "Watch what happens. The agent finds a verified translator from the on-chain registry, quotes the price, asks me to confirm. I say yes. The agent calls hire_provider, which records the hire on 0G chain — the operator wallet sends a tiny native transfer to the translator's wallet with the entire hire receipt, user wallet, task, and agreed fee, encoded in the tx calldata. The chain is the receipt."

**Action**:
1. Type the prompt
2. Tool chip: **Searching providers · Found 1 verified Translator**
3. Agent quotes the rate, asks "Confirm $X for Yoruba transcript translation?"
4. Type **"yes"**
5. Tool card appears: bordered red **"Agent hire receipt"** with tx hash and **"View on 0G Scan"** link
6. **Click the link** — chainscan opens in a new tab showing the tx
7. **Click the Input Data field on chainscan** — the JSON receipt is right there in the tx calldata
8. Cut back to the app

**This is the scene judges will replay. Make it crisp.**

---

### Scene 6 — Mint the agent as an INFT (2:00 – 2:30)

**Visual**: Back to dashboard. Find the **Case Agent INFT panel**. Click **Mint Case Agent INFT**.

**Voiceover**:
> "Now I tokenize the agent itself. ZeroViza implements ERC-7857, the INFT standard 0G is championing. The agent's encrypted memory, persona facts, chat history, every case I just created, lives on 0G Storage. The hash commitment is bound on chain. I own this token. I can transfer it. I can clone it. I can authorize a verified lawyer to use it without giving up ownership."

**Action**:
1. Click **Mint Case Agent INFT**
2. Wait for "Minting on 0G mainnet…" → green "Minted: 0xabc…"
3. Tile flips to the active state showing **Token #N · ERC-7857 · 0G Aristotle**
4. Show the encrypted memory rootHash + content hash on the tile
5. Click **View contract on 0G Scan** — chainscan opens to the CaseAgentNFT contract page
6. Show the AgentMinted event in the transactions list

---

### Scene 7 — On-chain proof (2:30 – 2:50)

**Visual**: chainscan.0g.ai with three tabs ready.

**Voiceover**:
> "Three contracts on 0G Aristotle mainnet do all the work. StorageIndex maps every wallet to its encrypted blobs. LawyerRegistry verifies service providers. CaseAgentNFT is the INFT we just minted. Every upload, every hire, every mint is a real transaction on a public ledger."

**Action**:
1. Tab to **StorageIndex** contract — show recent RootsUpdated events
2. Tab to **LawyerRegistry** — show LawyerVerified events
3. Tab to **CaseAgentNFT** — show AgentMinted events
4. Cut back to the app

---

### Scene 8 — Close (2:50 – 3:00)

**Visual**: Back to the dashboard, all tiles populated (case agent active, inbox with items, fresh case in cases tile).

**Voiceover**:
> "ZeroViza. An immigration agent the user owns, that acts on its own, settles work on chain, and runs entirely on 0G. Try it at zeroviza.vercel.app."

**Action**: One clean shot of the dashboard. Cut.

---

## Post-production

- **Captions** — APAC track, non-native English judges. Caption every word.
- **Lower-third callouts**: when chips appear in Scene 3, overlay the tool name in a lower-third for 1.5 seconds each
- **Highlight ring** on the tx-hash link in Scene 5 so judges can see exactly where to click
- **Frozen frame at 2:25** showing the minted INFT tile while the VO finishes the sentence — gives the eye time to read the rootHash
- **Watermark** with GitHub URL + the three contract addresses in a corner of every scene (so anyone pausing can copy them)
- **Export 1080p 30fps**, not 4K
- **Upload to YouTube + Loom**. YouTube is the official submission link.

---

## YouTube description template

**Title**: `ZeroViza — On-chain AI Immigration Agent (ERC-7857) | 0G APAC Hackathon | Track 3`

**Body**:
```
ZeroViza is an AI immigration agent that the user owns end-to-end on 0G.

What you just watched:
1. Tool-calling agent that updates 0G Storage from the chat (profile,
   embassy lookup, RAG-grounded answers with USCIS citations)
2. Proactive morning routine that wakes up to flag stale cases and
   draft action items — runs on 0G Compute
3. Agent-to-agent on-chain hire: the agent finds a verified translator
   from the on-chain registry and pays them via a native 0G transfer
   with the hire receipt encoded in the tx calldata
4. ERC-7857 INFT mint: the agent's encrypted memory blob lives on 0G
   Storage, the hash commitment is bound on chain, the user owns the
   token

Built on three 0G pillars: Compute (GLM-5 inference), Storage
(content-addressed encrypted blobs), Chain (three smart contracts on
Aristotle mainnet, chain id 16661).

Contracts (verifiable on https://chainscan.0g.ai):
• StorageIndex   : 0x486aFe3c1e3dE1253B31C82A30d5270e63403c27
• LawyerRegistry : 0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC
• CaseAgentNFT   : 0xF89EC187E9062CDE86719273b85F3C6974A40829

Live: https://zeroviza.vercel.app
Source: https://github.com/Sage-senpai/Abobi
Architecture: docs/hackathon/ARCHITECTURE.md

Track: 3 — Agentic Economy & Autonomous Applications
Tags: #0GHackathon #BuildOn0G
```

---

## If something breaks during recording

1. **0G Compute slow** → the Groq emergency fallback will kick in automatically. Say "0G Compute with a Groq circuit-breaker for demo reliability" and keep going. The provider badge will show grey but the demo continues.
2. **Hire tx pending too long** → cut to a pre-recorded successful hire scene from your local archive. Don't wait on screen.
3. **Mint fails because no profile yet** → send any message in chat first to seed the profile blob, then return to dashboard and mint.
4. **chainscan.0g.ai returns slow** → keep the explorer tabs pre-loaded before recording, just refresh.

Honesty beats polish — if the broker isn't up and you fall back to Groq, say so. Judges respect that more than fake screenshots.
