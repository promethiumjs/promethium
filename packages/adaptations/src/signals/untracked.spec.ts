import { describe, it, vi, expect } from "vitest";
import { signal, computed, effect, untracked } from "./signals.js";

describe("untracked", () => {
  it("should block tracking inside effects", () => {
    const a = signal(1);
    const b = signal(2);
    const spy = vi.fn(() => {
      a.value + b.value;
    });
    effect(() => untracked(spy));
    expect(spy).toHaveBeenCalledOnce();

    a.value = 10;
    b.value = 20;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should block tracking even when run inside effect run inside untracked", () => {
    const s = signal(1);
    const spy = vi.fn(() => s.value);

    untracked(() =>
      effect(() => {
        untracked(spy);
      })
    );
    expect(spy).toHaveBeenCalledOnce();

    s.value = 2;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not cause signal assignments throw", () => {
    const a = signal(1);
    const aChangedTime = signal(0);

    const dispose = effect(() => {
      a.value;
      untracked(() => {
        aChangedTime.value = aChangedTime.value + 1;
      });
    });

    expect(() => (a.value = 2)).not.to.throw();
    expect(aChangedTime.value).to.equal(2);
    a.value = 3;
    expect(aChangedTime.value).to.equal(3);

    dispose();
  });

  it("should block tracking inside computed signals", () => {
    const a = signal(1);
    const b = signal(2);
    const spy = vi.fn(() => a.value + b.value);
    const c = computed(() => untracked(spy));

    expect(spy).not.toHaveBeenCalled();
    expect(c.value).to.equal(3);
    a.value = 10;
    c.value;
    b.value = 20;
    c.value;
    expect(spy).toHaveBeenCalledOnce();
    expect(c.value).to.equal(3);
  });
});
