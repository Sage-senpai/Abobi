/**
 * POST /api/upload
 *
 * Accepts multipart/form-data with:
 *   - file: File (required) — document to store
 *   - wallet: string (required) — uploader's wallet address
 *
 * Uploads the file to 0G Storage (tamper-proof, content-addressed).
 * Stores document metadata in SQLite for fast retrieval.
 * Returns the document record including the 0G Merkle root hash.
 *
 * Size limit: 25 MB
 */

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { uploadToStorage } from "@/lib/0g/storage";
import { insertDocument } from "@/lib/db/client";
import type { UserDocument } from "@/types/storage";

const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const walletAddress = formData.get("wallet");
    const file = formData.get("file");

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Upload PDF, JPG, PNG, WEBP, or DOCX." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25 MB." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    // Convert to Buffer for 0G SDK
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 0G decentralized storage
    const { rootHash } = await uploadToStorage(buffer);

    // Persist metadata in SQLite
    const doc: UserDocument = {
      id: nanoid(),
      walletAddress,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      rootHash,
      uploadedAt: Date.now(),
      verified: true, // 0G upload succeeded → hash verified
    };

    insertDocument(doc);

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err) {
    console.error("[upload] Error:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
