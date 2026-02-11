import * as crypto from 'crypto';

/**
 * Encrypts a text string using SHA256 algorithm
 * @param text - The text to encrypt
 * @returns The encrypted hash in hexadecimal format
 */
export function encryptSHA256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}
