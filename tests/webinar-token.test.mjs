// Run with `npm test`.
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { openRegistrant, sealRegistrant } from "../src/lib/webinar-token.ts";

const person = { email: "info+2step-test@realization.co.il", name: "Test Person", ref: "test-2step" };
const now = 1_760_000_000_000;

beforeEach(() => {
  process.env.WEBINAR_SHEET_SECRET = "test-secret";
});
afterEach(() => {
  delete process.env.WEBINAR_SHEET_SECRET;
});

test("a sealed registrant opens to the same values, and the email is not readable in the token", () => {
  const token = sealRegistrant(person, now);
  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.ok(!Buffer.from(token, "base64url").toString("latin1").includes("realization"));
  assert.deepEqual(openRegistrant(token, now + 1000), person);
});

test("expired, future, tampered and foreign tokens open to null", () => {
  const token = sealRegistrant(person, now);
  assert.equal(openRegistrant(token, now + 49 * 60 * 60 * 1000), null);
  assert.equal(openRegistrant(sealRegistrant(person, now + 10 * 60 * 1000), now), null);
  const bytes = Buffer.from(token, "base64url");
  bytes[bytes.length - 1] ^= 1;
  assert.equal(openRegistrant(bytes.toString("base64url"), now), null);
  process.env.WEBINAR_SHEET_SECRET = "another-secret";
  assert.equal(openRegistrant(token, now), null);
});

test("junk input opens to null", () => {
  for (const value of [undefined, null, 42, "", "abc", "x".repeat(2000)]) assert.equal(openRegistrant(value, now), null);
});

test("without the secret there is no token and no step 2", () => {
  delete process.env.WEBINAR_SHEET_SECRET;
  assert.equal(sealRegistrant(person, now), "");
  assert.equal(openRegistrant("anything", now), null);
});
