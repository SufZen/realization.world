// Run with `npm test`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildChecklist, checklistText, checks } from "../src/components/deal-guide/content.ts";
import { buildLeadEvent } from "../src/lib/meta-capi.ts";

test("unanswered checks count as open; done and n.a. stay out of the list", () => {
  const list = buildChecklist({ net: "done", leverage: "na", photos: "open" }, "pt");
  assert.equal(list.openCount, checks.length - 2);
  assert.deepEqual(list.done, ["ברוטו מול נטו"]);
  assert.ok(!list.groups.some((group) => group.items.some((item) => item.id === "leverage")));
});

test("the checklist follows the market: shekels for Israel, euros elsewhere", () => {
  assert.match(checklistText(buildChecklist({}, "il"), "https://x"), /על כל שקל/);
  assert.match(checklistText(buildChecklist({}, "pt"), "https://x"), /על כל אירו/);
});

test("the guide's Meta lead carries its own content name; the webinar default is unchanged", () => {
  const base = { email: "a@b.co", phone: "", ref: "", fbclid: "", clientIp: "", userAgent: "", sourceUrl: "https://realization.world/deal-check-guide" };
  assert.equal(buildLeadEvent({ ...base, contentName: "deal-check-guide" }, "id").custom_data.content_name, "deal-check-guide");
  assert.equal(buildLeadEvent(base, "id").custom_data.content_name, "webinar-2026-10-20");
});
