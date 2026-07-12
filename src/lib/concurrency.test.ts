import { afterEach, describe, expect, it } from "vitest";
import { resetConcurrencyLimitsForTests, withConcurrencyLimit, WorkloadBusyError } from "./concurrency";

afterEach(resetConcurrencyLimitsForTests);

describe("withConcurrencyLimit", () => {
  it("rejects excess work without creating a waiting task", async () => {
    let release!: () => void;
    const pending = withConcurrencyLimit("images", 1, () => new Promise<void>(resolve => { release = resolve; }));
    await expect(withConcurrencyLimit("images", 1, async () => undefined)).rejects.toBeInstanceOf(WorkloadBusyError);
    release();
    await pending;
  });

  it("releases capacity after a task fails", async () => {
    await expect(withConcurrencyLimit("pdf", 1, async () => { throw new Error("failed"); })).rejects.toThrow("failed");
    await expect(withConcurrencyLimit("pdf", 1, async () => "ok")).resolves.toBe("ok");
  });
});
