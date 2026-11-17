import { test } from "node:test";
import assert from "node:assert/strict";
import { localDate } from "./localDate";

test("localDate uses the device's calendar day, zero-padded, not UTC's", () => {
  assert.equal(localDate(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
  assert.equal(localDate(new Date(2026, 10, 15, 0, 1)), "2026-11-15");
});
