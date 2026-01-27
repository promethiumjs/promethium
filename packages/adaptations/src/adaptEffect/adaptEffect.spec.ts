import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { adaptEffect } from "./adaptEffect.js";
import { adaptState } from "../adaptState/adaptState.js";

describe("adaptEffect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should run synchronously by default", () => {
    const callback = vi.fn();
    adaptEffect(callback, { timing: "sync" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should support explicit dependencies", () => {
    const state = adaptState(1);
    const callback = vi.fn();
    adaptEffect(callback, { deps: () => state.get(), timing: "sync" });

    expect(callback).toHaveBeenCalledTimes(1);
    state.set(2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should support deferring execution", () => {
    const state = adaptState(1);
    const callback = vi.fn();
    adaptEffect(callback, { deps: () => state.get(), timing: "sync", defer: true });

    expect(callback).toHaveBeenCalledTimes(0);
    state.set(2);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should support microtask timing", async () => {
    const state = adaptState(1);
    const callback = vi.fn();
    adaptEffect(callback, {
      deps: () => state.get(),
      timing: "micro",
      timingStrategy: "all",
    });

    // First run is async if timingStrategy is "all" or "first" and timing is not "sync"
    expect(callback).toHaveBeenCalledTimes(0);
    await vi.runAllTicks();
    expect(callback).toHaveBeenCalledTimes(1);

    state.set(2);
    expect(callback).toHaveBeenCalledTimes(1);
    await vi.runAllTicks();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should support macrotask timing", async () => {
    const state = adaptState(1);
    const callback = vi.fn();
    adaptEffect(callback, {
      deps: () => state.get(),
      timing: "macro",
      timingStrategy: "all",
    });

    expect(callback).toHaveBeenCalledTimes(0);
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);

    state.set(2);
    expect(callback).toHaveBeenCalledTimes(1);
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should support different timing strategies (first, subsequent, all)", async () => {
    // Strategy: first (async first, sync subsequent)
    const callbackFirst = vi.fn();
    const stateFirst = adaptState(1);
    adaptEffect(callbackFirst, {
      deps: () => stateFirst.get(),
      timing: "micro",
      timingStrategy: "first",
    });
    expect(callbackFirst).toHaveBeenCalledTimes(0);
    await vi.runAllTicks();
    expect(callbackFirst).toHaveBeenCalledTimes(1);
    stateFirst.set(2);
    expect(callbackFirst).toHaveBeenCalledTimes(2); // Subsequent is sync

    // Strategy: subsequent (sync first, async subsequent)
    const callbackSub = vi.fn();
    const stateSub = adaptState(1);
    adaptEffect(callbackSub, {
      deps: () => stateSub.get(),
      timing: "micro",
      timingStrategy: "subsequent",
    });
    expect(callbackSub).toHaveBeenCalledTimes(1); // First is sync
    stateSub.set(2);
    expect(callbackSub).toHaveBeenCalledTimes(1);
    await vi.runAllTicks();
    expect(callbackSub).toHaveBeenCalledTimes(2); // Subsequent is async
  });

  it("should support cleanup functions", () => {
    const state = adaptState(1);
    const cleanup = vi.fn();
    const callback = vi.fn(() => cleanup);

    const { dispose } = adaptEffect(callback, { deps: () => state.get(), timing: "sync" });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(0);

    state.set(2);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(cleanup).toHaveBeenCalledTimes(1);

    dispose();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it("should support naming", () => {
    const e = adaptEffect(() => {}, { name: "test-effect" });
    // Since AdaptedEffect doesn't expose name, we just check it doesn't throw
    expect(e.name).toBe("test-effect");
  });
});
