import assert from "node:assert/strict";
import test from "node:test";
import { hashSecret, normalizePhilippinePhone, secretMatches } from "../src/security.ts";

test("normalizes common Philippine mobile-number formats", () => {
  assert.equal(normalizePhilippinePhone("0917 123 4567"), "+639171234567");
  assert.equal(normalizePhilippinePhone("9171234567"), "+639171234567");
  assert.equal(normalizePhilippinePhone("+63 917 123 4567"), "+639171234567");
  assert.equal(normalizePhilippinePhone("12345"), null);
});

test("secret hashes are purpose-bound and compare safely", () => {
  const pepper = "a-secret-value-with-at-least-thirty-two-characters";
  const hash = hashSecret("123456", "otp", pepper);
  assert.equal(secretMatches("123456", hash, "otp", pepper), true);
  assert.equal(secretMatches("123456", hash, "session", pepper), false);
  assert.equal(secretMatches("123456", hash, "qr", pepper), false);
  assert.equal(secretMatches("654321", hash, "otp", pepper), false);
});
