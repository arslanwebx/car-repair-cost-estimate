import { afterEach, describe, expect, it } from "vitest";
import { resetRateLimitsForTests, takeRateLimit } from "./rate-limit";

afterEach(() => {
  delete process.env.RATE_LIMIT_REQUESTS;
  delete process.env.RATE_LIMIT_WINDOW_MINUTES;
  resetRateLimitsForTests();
});

describe("takeRateLimit", () => {
  it("uses safe defaults when environment values are invalid", () => {
    process.env.RATE_LIMIT_REQUESTS = "invalid";
    process.env.RATE_LIMIT_WINDOW_MINUTES = "-1";
    expect(takeRateLimit("client")).toEqual({ allowed: true, remaining: 4 });
  });

  it("limits repeated requests", () => {
    process.env.RATE_LIMIT_REQUESTS = "1";
    expect(takeRateLimit("client").allowed).toBe(true);
    expect(takeRateLimit("client").allowed).toBe(false);
  });
});
