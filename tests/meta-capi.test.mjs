// Run with `npm test` (Node 22.18+ strips the TypeScript types itself).
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { buildLeadEvent, cleanFbclid, isTestRef, fbcFrom, metaConfigured, normalizeEmail, normalizePhone, sendLeadEvent, sha256 } from "../src/lib/meta-capi.ts";

const input = {
  email: "  Info+CAPI-Test@Realization.co.il ",
  phone: "054-123 4567",
  ref: "meta-ads",
  fbclid: "IwAR0abc_DEF-123",
  clientIp: "203.0.113.7",
  userAgent: "Mozilla/5.0 test",
  sourceUrl: "https://realization.world/webinar?ref=meta-ads",
};

afterEach(() => {
  delete process.env.META_DATASET_ID;
  delete process.env.META_CAPI_TOKEN;
  delete process.env.META_TEST_EVENT_CODE;
});

test("email is trimmed and lowercased before hashing", () => {
  assert.equal(normalizeEmail(input.email), "info+capi-test@realization.co.il");
  // Known SHA-256 of "test@example.com".
  assert.equal(sha256("test@example.com"), "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b");
});

test("phone becomes E.164 digits", () => {
  assert.equal(normalizePhone("054-123 4567"), "972541234567");
  assert.equal(normalizePhone("+972 54 123 4567"), "972541234567");
  assert.equal(normalizePhone("00972541234567"), "972541234567");
  assert.equal(normalizePhone("+351 912 345 678"), "351912345678");
  assert.equal(normalizePhone("(+1) 415-555-0100"), "14155550100");
  assert.equal(normalizePhone(""), "");
  assert.equal(normalizePhone("12"), "");
});

test("fbclid is cleaned and turned into fbc", () => {
  assert.equal(cleanFbclid(" IwAR0abc_DEF-123<script> "), "IwAR0abc_DEF-123script");
  assert.equal(cleanFbclid(null), "");
  assert.equal(fbcFrom("abc", 1760000000000), "fb.1.1760000000000.abc");
  assert.equal(fbcFrom("", 1760000000000), "");
});

test("Lead event carries hashed data and no plain email or phone", () => {
  const event = buildLeadEvent(input, "evt-1", 1760000000123);
  assert.equal(event.event_name, "Lead");
  assert.equal(event.event_time, 1760000000);
  assert.equal(event.event_id, "evt-1");
  assert.equal(event.action_source, "website");
  assert.equal(event.event_source_url, input.sourceUrl);
  assert.deepEqual(event.user_data, {
    em: [sha256("info+capi-test@realization.co.il")],
    ph: [sha256("972541234567")],
    client_ip_address: "203.0.113.7",
    client_user_agent: "Mozilla/5.0 test",
    fbc: "fb.1.1760000000123.IwAR0abc_DEF-123",
  });
  assert.deepEqual(event.custom_data, { content_name: "webinar-2026-10-20", ref: "meta-ads" });
  const text = JSON.stringify(event);
  assert.ok(!text.includes("realization.co.il") && !text.includes("4567"));
});

test("optional fields are left out when empty", () => {
  const event = buildLeadEvent({ ...input, phone: "", fbclid: "", ref: "", clientIp: "", userAgent: "" }, "evt-2");
  assert.deepEqual(Object.keys(event.user_data), ["em"]);
  assert.deepEqual(event.custom_data, { content_name: "webinar-2026-10-20" });
});

test("unconfigured: nothing is sent", async () => {
  let calls = 0;
  const sent = await sendLeadEvent(input, async () => {
    calls += 1;
    return new Response("{}");
  });
  assert.equal(metaConfigured(), false);
  assert.equal(sent, false);
  assert.equal(calls, 0);
});

test("configured: posts to the dataset with the test code; the token is never in the URL", async () => {
  process.env.META_DATASET_ID = "123";
  process.env.META_CAPI_TOKEN = "secret-token";
  process.env.META_TEST_EVENT_CODE = "TEST1";
  let url = "";
  let body = {};
  const sent = await sendLeadEvent(input, async (target, init) => {
    url = String(target);
    body = JSON.parse(String(init.body));
    return new Response('{"events_received":1}');
  });
  assert.equal(sent, true);
  assert.match(url, /^https:\/\/graph\.facebook\.com\/v\d+\.\d+\/123\/events$/);
  assert.equal(body.test_event_code, "TEST1");
  assert.equal(body.access_token, "secret-token");
  assert.equal(body.data.length, 1);
  assert.match(body.data[0].event_id, /^[0-9a-f-]{36}$/);
});

test("a Meta failure or timeout never throws and never logs the token", async () => {
  process.env.META_DATASET_ID = "123";
  process.env.META_CAPI_TOKEN = "secret-token";
  const logged = [];
  const original = console.error;
  console.error = (...args) => logged.push(args.join(" "));
  try {
    assert.equal(await sendLeadEvent(input, async () => new Response('{"error":{"code":190}}', { status: 400 })), false);
    assert.equal(await sendLeadEvent(input, async () => { throw new DOMException("timed out", "TimeoutError"); }), false);
  } finally {
    console.error = original;
  }
  assert.equal(logged.length, 2);
  assert.ok(logged.every((line) => !line.includes("secret-token") && !line.includes("realization.co.il")));
});

test("test registrations (ref test-…) send nothing", async () => {
  process.env.META_DATASET_ID = "123";
  process.env.META_CAPI_TOKEN = "secret-token";
  assert.equal(isTestRef("test-2step"), true);
  assert.equal(isTestRef(" TEST-capi"), true);
  assert.equal(isTestRef("meta-ads"), false);
  assert.equal(isTestRef(""), false);
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return new Response("{}");
  };
  assert.equal(await sendLeadEvent({ ...input, ref: "Test-2step" }, fetcher), false);
  assert.equal(calls, 0);
});
