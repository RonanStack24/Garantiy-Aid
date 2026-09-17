import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export function normalizePhilippinePhone(input: string): string | null {
  const digits = input.replace(/[^0-9+]/g, "");
  if (/^09\d{9}$/.test(digits)) return `+63${digits.slice(1)}`;
  if (/^9\d{9}$/.test(digits)) return `+63${digits}`;
  if (/^\+639\d{9}$/.test(digits)) return digits;
  if (/^639\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

export function createOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function createQrToken(): string {
  return `GAI1.${randomBytes(32).toString("base64url")}`;
}

type SecretPurpose = "otp" | "session" | "qr";

export function hashSecret(value: string, purpose: SecretPurpose, pepper: string): string {
  return createHmac("sha256", pepper).update(`${purpose}:${value}`).digest("hex");
}

export function secretMatches(
  value: string,
  expectedHash: string,
  purpose: SecretPurpose,
  pepper: string,
): boolean {
  const actual = Buffer.from(hashSecret(value, purpose, pepper), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
