import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "../src/errors.ts";
import { parseRegistration } from "../src/validation.ts";

const validRegistration = {
  firstName: "Juan",
  middleName: "Santos",
  lastName: "Dela Cruz",
  birthDate: "1990-04-23",
  sex: "Prefer not to say",
  address: "123 Example Street",
  barangayId: "62f95c7d-68e7-4c3a-9ced-7fef670b8a3a",
  contactNumber: "0917 123 4567",
};

test("registration input is normalized for storage", () => {
  const result = parseRegistration(validRegistration);
  assert.equal(result.contactNumber, "+639171234567");
  assert.equal(result.sex, "prefer_not_to_say");
  assert.equal(result.birthDate.toISOString(), "1990-04-23T00:00:00.000Z");
});

test("impossible calendar dates are rejected", () => {
  assert.throws(
    () => parseRegistration({ ...validRegistration, birthDate: "2026-02-31" }),
    (error) => error instanceof ApiError && error.code === "VALIDATION_ERROR",
  );
});
