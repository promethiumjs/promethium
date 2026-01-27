import { describe, it, expect, vi } from "vitest";
import { adaptMemo } from "./adaptMemo.js";
import { adaptState } from "../adaptState/adaptState.js";

describe("adaptMemo", () => {
  it("should create a memo with get/peek", () => {
    const state = adaptState(1);
    const memo = adaptMemo(() => state.get() * 2);

    expect(memo.get()).toBe(2);
    state.set(2);
    expect(memo.get()).toBe(4);
    expect(memo.peek()).toBe(4);
  });

  it("should support subscriptions", () => {
    const state = adaptState(1);
    const memo = adaptMemo(() => state.get() * 2);
    const callback = vi.fn();
    const unsubscribe = memo.subscribe(callback);

    expect(callback).toHaveBeenCalledWith(2);
    state.set(2);
    expect(callback).toHaveBeenCalledWith(4);

    callback.mockClear()
    unsubscribe();
    state.set(3);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should support signal options", () => {
    const watched = vi.fn();
    const unwatched = vi.fn();
    const state = adaptState(1);
    const memo = adaptMemo(() => state.get() * 2, {
      watched,
      unwatched,
      name: "test-memo",
    });

    expect(memo.name).toBe("test-memo");

    const unsubscribe = memo.subscribe(() => {});
    expect(watched).toHaveBeenCalled();

    unsubscribe();
    expect(unwatched).toHaveBeenCalled();
  });
});
