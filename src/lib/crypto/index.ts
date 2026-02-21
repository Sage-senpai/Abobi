/**
 * Encryption abstraction layer.
 *
 * V1: PlaintextProvider — no-op, stores content as-is.
 * V2: AES-256-GCM provider with wallet-derived key.
 * V3: ZK-proven encryption.
 *
 * Swap the active provider here without touching any other code.
 */

export interface EncryptionProvider {
  encrypt(plaintext: string): Promise<string>;
  decrypt(ciphertext: string): Promise<string>;
  label: string;
}

/**
 * V1: No-op plaintext provider.
 * Data is stored as-is. ZK-ready interface preserved.
 */
export class PlaintextProvider implements EncryptionProvider {
  readonly label = "plaintext";

  async encrypt(plaintext: string): Promise<string> {
    return plaintext;
  }

  async decrypt(ciphertext: string): Promise<string> {
    return ciphertext;
  }
}

// Active provider for V1
export const cryptoProvider: EncryptionProvider = new PlaintextProvider();
