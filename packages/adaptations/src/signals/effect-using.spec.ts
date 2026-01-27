import { describe, it, vi, expect } from "vitest";
import { signal, effect } from "./signals.js";

// Created to test the `using` keyword independent of other `effect` tests
// This is because prettier doesn't recognize the `using` keyword and so fails
// to format the file properly
// Delete that section to format the file and then put it back afterwards if
// any changes are made here
describe("effect disposal - `using`", () => {
  it("should support resource management disposal", () => {
    const a = signal(0);
    const spy = vi.fn();
    {
      using _dispose = effect(() => {
        a.value;
        return spy;
      });
    }
    expect(spy).toHaveBeenCalledOnce();
  });
});
