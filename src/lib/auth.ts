import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'til_write_auth';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hmac(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string, expected: string): boolean {
  if (!input || !expected) return false;
  return safeEqual(input, expected);
}

export function checkCredentials(
  inputUsername: string,
  inputPassword: string,
  expectedUsername: string,
  expectedPassword: string
): boolean {
  return checkPassword(inputUsername, expectedUsername) && checkPassword(inputPassword, expectedPassword);
}

export function createSessionCookieValue(secret: string): string {
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  const sig = hmac(secret, expiresAt);
  return `${expiresAt}.${sig}`;
}

export function verifySessionCookieValue(value: string | undefined, secret: string): boolean {
  if (!value) return false;
  const [expiresAt, sig] = value.split('.');
  if (!expiresAt || !sig) return false;
  if (!Number.isFinite(Number(expiresAt)) || Date.now() > Number(expiresAt)) return false;
  return safeEqual(sig, hmac(secret, expiresAt));
}
