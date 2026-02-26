/**
 * GET  /api/documents?wallet=0x...   → list user's uploaded documents
 * DELETE /api/documents?id=...&wallet=0x... → remove a document record (not from 0G — content-addressed)
 */

import { NextRequest, NextResponse } from "next/server";
import { getDocuments, deleteDocument } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");

  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  const documents = getDocuments(wallet);
  return NextResponse.json({ documents });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const wallet = req.nextUrl.searchParams.get("wallet");

  if (!id || !wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: "Missing id or wallet" }, { status: 400 });
  }

  const deleted = deleteDocument(id, wallet);
  if (!deleted) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
