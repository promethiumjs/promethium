import { describe, it, expect, vi } from "vitest";
import { adaptState } from "./adaptState.js";

describe("adaptState", () => {
  it("should create a state with get/set/peek", () => {
    const state = adaptState(1);
    expect(state.get()).toBe(1);
    state.set(2);
    expect(state.get()).toBe(2);
    expect(state.peek()).toBe(2);
  });

  it("should support subscriptions", () => {
    const state = adaptState(1);
    const callback = vi.fn();
    const unsubscribe = state.subscribe(callback);

    expect(callback).toHaveBeenCalledWith(1);
    state.set(2);
    expect(callback).toHaveBeenCalledWith(2);

    callback.mockClear();
    unsubscribe();
    state.set(3);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should support signal options", () => {
    const watched = vi.fn();
    const unwatched = vi.fn();
    const state = adaptState(1, { watched, unwatched, name: "test-state" });

    expect(state.name).toBe("test-state");

    const unsubscribe = state.subscribe(() => {});
    expect(watched).toHaveBeenCalled();

    unsubscribe();
    expect(unwatched).toHaveBeenCalled();
  });

  it("should support mutate", () => {
    const state = adaptState({ count: 1 });
    const callback = vi.fn();
    state.subscribe(callback);

    expect(callback).toHaveBeenCalledTimes(1);

    state.mutate(() => {
      state.peek().count++;
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(state.get().count).toBe(2);
  });
});
