import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { adaptState } from "./adaptState.js";
import { adaptEffect } from "../adaptEffect/adaptEffect.js";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("adaptState", () => {
  const [count, setCount] = adaptState(0);
  const effectFn = vi.fn(() => {
    count();
  });

  test("state has right value", () => {
    expect(count()).toBe(0);
  });

  test("setState correctly changes state value", () => {
    setCount(1);
    expect(count()).toBe(1);
  });

  test("state change triggers effects", () => {
    adaptEffect(effectFn);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(1);
    setCount(2);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(2);
  });

  test("state doesn't trigger effects when its value hasn't changed", () => {
    setCount(2);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(0);
  });
});
