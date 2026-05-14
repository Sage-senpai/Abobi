# Dress-rehearsal checklist — run once before recording

Live URL: `https://zeroviza.vercel.app` · Mainnet · Chain id 16661

Run this top-to-bottom in **one sitting**. Anything that breaks → fix
before you hit record. Each step is a real call against live mainnet —
no mocks.

---

## 0. Environment sanity (~5 min)

- [ ] Vercel env has these all set in **Production**:
  - `NEXT_PUBLIC_0G_CHAIN_ID=16661`
  - `NEXT_PUBLIC_0G_RPC_URL=https://evmrpc.0g.ai`
  - `NEXT_PUBLIC_STORAGE_INDEX_ADDRESS=0x486aFe3c1e3dE1253B31C82A30d5270e63403c27`
  - `NEXT_PUBLIC_LAWYER_REGISTRY_ADDRESS=0x93A931e8ec6193c2D9F4faf28e85AaBEd9601eEC`
  - `NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS=0xF89EC187E9062CDE86719273b85F3C6974A40829`
  - `OG_SERVER_PRIVATE_KEY` (operator)
  - `OG_INDEXER_RPC=https://indexer-storage-turbo.0g.ai`
  - `OG_COMPUTE_API_URL=https://compute-network-18.integratenetwork.work/v1/proxy`
  - `OG_COMPUTE_API_KEY=app-sk-…` (qwen3.6-plus key)
  - `OG_COMPUTE_MODEL_ID=qwen3.6-plus`
  - `GROQ_API_KEY` (fallback)
  - `ADMIN_SECRET` (only if you plan to call admin routes during demo)
- [ ] Operator wallet has ≥ 0.5 0G for hire receipts (check
  `chainscan.0g.ai/address/0xE5A747FA09271C8d479Cf718b205F8aADd6E4C30`).
- [ ] All three contracts return `operator()` correctly via chainscan.

---

## 1. Connect + dashboard (~1 min)

- [ ] Open the deployed URL in an Incognito Chrome window.
- [ ] Click **Connect Wallet** → MetaMask → confirm. Lands on dashboard.
- [ ] Dashboard tiles populated within a few seconds:
  - Consult Streak (number, never blank `—`)
  - Questions Asked (>= 0)
  - Total Exchanges (>= 0)
  - **Member Since** shows a real month/year (not blank)
- [ ] Refresh the page. **Member Since does NOT change.** This is the
  bug we explicitly fixed — confirm it's still fixed in production.
- [ ] Open the Cases tile. If empty, the "Track your first visa case"
  CTA shows.
- [ ] Open the Agent Inbox tile — there's a "Run agent now" button.

## 2. Agent loop with tool calls (~2 min) **← Scene 3 of the demo**

- [ ] Navigate to **AI Advisor**.
- [ ] Send prompt: *"I'm a Nigerian software engineer in Lagos with a
  Master's, English fluent, targeting a US H-1B. Where do I file in
  Lagos?"*
- [ ] Watch the tool chips appear in order:
  - `Saving profile facts: …`
  - `Looking up embassy · Found 1 United States mission`
- [ ] Final answer streams in token-by-token.
- [ ] Bracketed citations `[1]` `[2]` appear in the response body.
- [ ] **Sources panel** under the bubble shows clickable USCIS / DOL
  links.
- [ ] **Verified by 0G** badge is present. Click it → popover shows
  provider wallet (clickable), ZG-Res-Key, latency, model.

## 3. Persona memory smoke (~1 min)

- [ ] Hit "New chat" (history dropdown).
- [ ] Send a fresh question: *"What's the H-1B fee?"*
- [ ] The agent answers naturally — and references your earlier
  context (Nigerian, software engineer) without you re-stating it.
  If it doesn't, persona memory isn't loading; investigate.

## 4. Morning routine + agent inbox (~1 min)

- [ ] Go to **Dashboard**.
- [ ] Click **Run agent now** on the Agent Inbox tile.
- [ ] Green confirmation appears: `Agent ran. Analyzed N cases…`
- [ ] If you have any open cases, new inbox items appear (daily
  summary at top + per-case reminders if stale/upcoming).

## 5. On-chain hire (~2 min) **← Scene 5 — money shot**

- [ ] Back to chat. Send: *"I need someone to translate my Yoruba
  transcript to English. Can you hire one?"*
- [ ] Tool chip: **Searching providers** — should return a verified
  Translator (Adaeze Okafor demo persona at minimum).
- [ ] Agent quotes the fee, asks for confirmation.
- [ ] Type **"yes"** (or whatever the agent specifically asked for).
- [ ] Bordered red **Agent hire receipt** card appears with tx hash
  and **View on 0G Scan** link.
- [ ] Click the link → chainscan.0g.ai opens to the transaction.
- [ ] On the chainscan tx detail page, click **Input Data** field →
  decode → the hire receipt JSON is visible (user wallet, provider,
  task, fee).
- [ ] Back in the app, the Agent Inbox now has BOTH a hire receipt
  item AND a follow-up "Reply from {provider}" item (demo persona's
  AI-generated acknowledgment).

## 6. INFT mint (~2 min) **← Scene 6**

- [ ] Dashboard → **Case Agent INFT** panel → **Mint Case Agent INFT**.
- [ ] Wait for "Minting…" → green "Minted: 0x…" with the token id.
- [ ] Tile shows Token #N · ERC-7857 · 0G Aristotle, with the encrypted
  memory rootHash and content hash visible.
- [ ] Click **View contract on 0G Scan** → chainscan opens to the
  CaseAgentNFT contract; verify the recent `AgentMinted` event shows
  your wallet.
- [ ] Send one more chat message (anything). Watch the server logs
  briefly — `[/api/chat/stream] INFT #N metadata refreshed` should log,
  confirming the auto-update wired in. (If you can't see logs, just
  trust the build.)

## 7. On-chain proof (~1 min) **← Scene 7**

- [ ] chainscan.0g.ai tabs ready:
  - StorageIndex contract — recent `RootsUpdated` events visible
  - LawyerRegistry contract — `LawyerVerified` events for the 7 demo
    personas should be present
  - CaseAgentNFT contract — `AgentMinted` event for your wallet
    (from step 6)

## 8. Failure-mode drills (5 min)

- [ ] **0G Compute drops to Groq fallback.** Temporarily change
  `OG_COMPUTE_API_URL` on Vercel to a bad URL, redeploy preview, send
  a chat. Provider badge should turn grey **"Groq fallback"**. Restore
  the real URL.
- [ ] **Profile load flake.** Open DevTools Network, block requests to
  `indexer-storage-turbo.0g.ai`, send a chat. Server should refuse to
  overwrite the profile (503), client retries. Unblock.

---

## If anything in this checklist breaks

| Symptom | Probable cause | Fix |
|---|---|---|
| Member Since shows "today" on refresh | `/api/profile` 503 chain → frontend regenerates default | Verify the GET route still has the `needsSeed` + 503 logic from commit `0b2d…` |
| Streak says 0 when it shouldn't | `getStreakData` thinks `lastActiveDate` is too stale | Send one chat → streak recomputes. If still 0, check date on operator wallet's host clock |
| Tool chips never appear | Agent loop fell through to non-tool path | Check Vercel logs for `chatWithTools failed:` — both 0G and Groq tool-calling must be working |
| Hire reverts | Provider not verified or `acceptsHires=false` | Run `scripts/seed-demo-lawyers.ts` once to (re-)verify the personas |
| Mint reverts with "TokenDoesNotExist" | Wrong contract address on Vercel | Match `NEXT_PUBLIC_CASE_AGENT_NFT_ADDRESS` to mainnet deploy |
| Verified-by-0G popover never appears | `attestation` event not in SSE payload | Vercel might be stripping the `Provider`/`ZG-Res-Key` headers — switch to `streamRawMessages`'s fallback path |
| chainscan slow during record | Public RPC congestion | Pre-load each contract page in dedicated tabs before hitting record |

---

## Once everything is green

You're cleared to record. Read `DEMO_VIDEO_SCRIPT.md` once more in full,
then start a clean Loom session.
