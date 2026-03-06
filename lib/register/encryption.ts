import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || 'sunray-dev-key-2024';
  return crypto.pbkdf2Sync(key, 'sunray-salt', ITERATIONS, KEY_LENGTH, 'sha512');
}

export function encrypt(text: string): string {
  if (!text) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')]);
  return combined.toString('base64');
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedText, 'base64');
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function encryptObject(obj: Record<string, unknown>): string {
  return encrypt(JSON.stringify(obj));
}

export function decryptObject<T>(encryptedText: string): T | null {
  try {
    return JSON.parse(decrypt(encryptedText)) as T;
  } catch {
    return null;
  }
}

export const encryptAahaar = (aahaar: string) => encrypt(aahaar);
export const decryptAahaar = (encrypted: string) => decrypt(encrypted);
export const encryptPAN = (pan: string) => encrypt(pan);
export const decryptPAN = (encrypted: string) => decrypt(encrypted);
export const encrypBankAccount = (account: string) => encrypt(account);
export const decryptBankAccount = (encrypted: string) => decrypt(encrypted);
export const encryptSecurityAnswer = (answer: string) => encrypt(answer);
export const decryptSecurityAnswer = (encrypted: string) => decrypt(encrypted);