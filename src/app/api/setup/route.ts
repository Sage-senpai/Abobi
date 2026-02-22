/**
 * One-time setup route.
 *
 * Purpose:    Deposit compute funds, acknowledge the 0G compute provider,
 *             and verify the inference connection.
 *             Call this once after deploying or changing OG_COMPUTE_PROVIDER_ADDRESS.
 *
 * The CLI's `acknowledge-provider` fails on 0G Galileo with "network does not
 * support ENS" — a known CLI bug. This route bypasses it entirely.
 *
 * Usage:
 *   GET  /api/setup           — check wallet balance + config status
 *   POST /api/setup           — ensure 1.0 0G in ledger + acknowledge provider
 *
 * Security: Requires x-setup-secret header matching SETUP_SECRET env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { acknowledgeProvider } from "@/lib/0g/compute";

function authorized(req: NextRequest): boolean {
  const secret = process.env.SETUP_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  return req.headers.get("x-setup-secret") === secret;
}

function getWallet() {
  const rpcUrl = process.env.NEXT_PUBLIC_0G_RPC_URL!;
  const privateKey = process.env.OG_SERVER_PRIVATE_KEY!;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
}

export async function GET() {
  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  const hasPrivateKey = !!process.env.OG_SERVER_PRIVATE_KEY;
  const hasIndexer = !!process.env.OG_INDEXER_RPC;

  let walletAddress: string | null = null;
  let balance: string | null = null;

  if (hasPrivateKey && process.env.NEXT_PUBLIC_0G_RPC_URL) {
    try {
      const wallet = getWallet();
      walletAddress = wallet.address;
      const raw = await wallet.provider!.getBalance(wallet.address);
      balance = `${ethers.formatEther(raw)} 0G`;
    } catch {
      balance = "error fetching";
    }
  }

  return NextResponse.json({
    status: "ok",
    config: {
      providerAddress: providerAddress ?? "NOT SET",
      walletAddress,
      balance,
      hasIndexer,
      rpcUrl: process.env.NEXT_PUBLIC_0G_RPC_URL ?? "NOT SET",
    },
    ready: !!providerAddress && hasPrivateKey && hasIndexer,
  });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providerAddress = process.env.OG_COMPUTE_PROVIDER_ADDRESS;
  if (!providerAddress) {
    return NextResponse.json(
      { error: "OG_COMPUTE_PROVIDER_ADDRESS not set in .env.local" },
      { status: 400 }
    );
  }

  const steps: Array<{ step: string; status: "ok" | "error" | "skipped"; detail?: string }> = [];

  // Step 1: Deposit funds into 0G compute ledger
  // acknowledgeProviderSigner requires at least 1.0 0G in the ledger.
  const TARGET_BALANCE = 1.0;
  try {
    const { createZGComputeNetworkBroker } = await import("@0glabs/0g-serving-broker");
    const wallet = getWallet() as unknown as Parameters<typeof createZGComputeNetworkBroker>[0];
    const broker = await createZGComputeNetworkBroker(wallet);

    let existingBalance = 0; // in 0G
    let ledgerExists = false;

    try {
      const ledger = await broker.ledger.getLedger();
      if (ledger) {
        ledgerExists = true;
        // availableBalance is in neuron (1e18), convert to 0G
        existingBalance = Number(ledger.availableBalance) / 1e18;
      }
    } catch {
      // No ledger yet
    }

    if (!ledgerExists) {
      await broker.ledger.addLedger(TARGET_BALANCE);
      steps.push({ step: "deposit", status: "ok", detail: `Created ledger with ${TARGET_BALANCE} 0G` });
    } else if (existingBalance < TARGET_BALANCE) {
      const topUp = Math.ceil((TARGET_BALANCE - existingBalance) * 1e4) / 1e4; // round up to 4dp
      await broker.ledger.depositFund(topUp);
      steps.push({
        step: "deposit",
        status: "ok",
        detail: `Topped up ledger by ${topUp} 0G (balance was ${existingBalance.toFixed(4)} 0G)`,
      });
    } else {
      steps.push({
        step: "deposit",
        status: "skipped",
        detail: `Ledger already has ${existingBalance.toFixed(4)} 0G (≥ ${TARGET_BALANCE} 0G required)`,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    steps.push({ step: "deposit", status: "error", detail: msg });
    // Don't abort — acknowledge might still work if ledger exists
  }

  // Step 2: Acknowledge provider signer
  try {
    await acknowledgeProvider();
    steps.push({
      step: "acknowledge",
      status: "ok",
      detail: `Provider ${providerAddress} acknowledged`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // "already acknowledged" is fine
    if (msg.toLowerCase().includes("already")) {
      steps.push({ step: "acknowledge", status: "skipped", detail: "Already acknowledged" });
    } else {
      steps.push({ step: "acknowledge", status: "error", detail: msg });
    }
  }

  const hasError = steps.some((s) => s.status === "error");

  return NextResponse.json(
    {
      success: !hasError,
      steps,
      message: hasError
        ? "Setup completed with errors — check steps above"
        : "Setup complete. Inference is ready.",
    },
    { status: hasError ? 500 : 200 }
  );
}
