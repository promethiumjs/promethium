import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { signal, computed, effect, batch } from "./signals.js";

describe("effect()", () => {
  it("should run the callback immediately", () => {
    const s = signal(123);
    const spy = vi.fn(() => {
      s.value;
    });
    effect(spy);
    expect(spy).toHaveBeenCalled();
  });

  it("should subscribe to signals", () => {
    const s = signal(123);
    const spy = vi.fn(() => {
      s.value;
    });
    effect(spy);
    spy.mockClear();

    s.value = 42;
    expect(spy).toHaveBeenCalled();
  });

  it("should subscribe to multiple signals", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value;
      b.value;
    });
    effect(spy);
    spy.mockClear();

    a.value = "aa";
    b.value = "bb";
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should dispose of subscriptions", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    const dispose = effect(spy);
    spy.mockClear();

    dispose();
    expect(spy).not.toHaveBeenCalled();

    a.value = "aa";
    b.value = "bb";
    expect(spy).not.toHaveBeenCalled();
  });

  it("should dispose of subscriptions", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    effect(function () {
      spy();
      if (a.value === "aa") {
        this.dispose();
      }
    });

    expect(spy).toHaveBeenCalled();

    a.value = "aa";
    expect(spy).toHaveBeenCalledTimes(2);

    a.value = "aaa";
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should dispose of subscriptions immediately", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    effect(function () {
      spy();
      this.dispose();
    });

    expect(spy).toHaveBeenCalledOnce();

    a.value = "aa";
    expect(spy).toHaveBeenCalledOnce();

    a.value = "aaa";
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should dispose of subscriptions when called twice", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    const dispose = effect(function () {
      spy();
      if (a.value === "aa") {
        this.dispose();
      }
    });

    expect(spy).toHaveBeenCalled();

    a.value = "aa";
    expect(spy).toHaveBeenCalledTimes(2);
    dispose();

    a.value = "aaa";
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should dispose of subscriptions immediately and signals are read after disposing", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    effect(function () {
      this.dispose();
      spy();
    });

    expect(spy).toHaveBeenCalledOnce();

    a.value = "aa";
    expect(spy).toHaveBeenCalledOnce();

    a.value = "aaa";
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should dispose of subscriptions immediately when called twice (deferred)", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    const dispose = effect(function () {
      spy();
      this.dispose();
    });

    expect(spy).toHaveBeenCalledOnce();

    a.value = "aa";
    expect(spy).toHaveBeenCalledOnce();
    dispose();

    a.value = "aaa";
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should conditionally unsubscribe from signals", () => {
    const a = signal("a");
    const b = signal("b");
    const cond = signal(true);

    const spy = vi.fn(() => {
      cond.value ? a.value : b.value;
    });

    effect(spy);
    expect(spy).toHaveBeenCalledOnce();

    b.value = "bb";
    expect(spy).toHaveBeenCalledOnce();

    cond.value = false;
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockClear();

    a.value = "aaa";
    expect(spy).not.toHaveBeenCalled();
  });

  it("should batch writes", () => {
    const a = signal("a");
    const spy = vi.fn(() => {
      a.value;
    });
    effect(spy);
    spy.mockClear();

    effect(() => {
      a.value = "aa";
      a.value = "aaa";
    });

    expect(spy).toHaveBeenCalledOnce();
  });

  it("should call the cleanup callback before the next run", () => {
    const a = signal(0);
    const spy = vi.fn();

    effect(() => {
      a.value;
      return spy;
    });
    expect(spy).not.toHaveBeenCalled();
    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    a.value = 2;
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should call only the callback from the previous run", () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    const a = signal(spy1);

    effect(() => {
      return a.value;
    });

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();

    a.value = spy2;
    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();

    a.value = spy3;
    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy3).not.toHaveBeenCalled();
  });

  it("should call the cleanup callback function when disposed", () => {
    const spy = vi.fn();

    const dispose = effect(() => {
      return spy;
    });
    expect(spy).not.toHaveBeenCalled();
    dispose();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not recompute if the effect has been notified about changes, but no direct dependency has actually changed", () => {
    const s = signal(0);
    const c = computed(() => {
      s.value;
      return 0;
    });
    const spy = vi.fn(() => {
      c.value;
    });
    effect(spy);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    s.value = 1;
    expect(spy).not.toHaveBeenCalled();
  });

  it("should not recompute dependencies unnecessarily", () => {
    const spy = vi.fn();
    const a = signal(0);
    const b = signal(0);
    const c = computed(() => {
      b.value;
      spy();
    });
    effect(() => {
      if (a.value === 0) {
        c.value;
      }
    });
    expect(spy).toHaveBeenCalledOnce();

    batch(() => {
      b.value = 1;
      a.value = 1;
    });
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not recompute dependencies out of order", () => {
    const a = signal(1);
    const b = signal(1);
    const c = signal(1);

    const spy = vi.fn(() => c.value);
    const d = computed(spy);

    effect(() => {
      if (a.value > 0) {
        b.value;
        d.value;
      } else {
        b.value;
      }
    });
    spy.mockClear();

    batch(() => {
      a.value = 2;
      b.value = 2;
      c.value = 2;
    });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    batch(() => {
      a.value = -1;
      b.value = -1;
      c.value = -1;
    });
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  });

  it("should recompute if a dependency changes during computation after becoming a dependency", () => {
    const a = signal(0);
    const spy = vi.fn(() => {
      if (a.value === 0) {
        a.value++;
      }
    });
    effect(spy);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should run the cleanup in an implicit batch", () => {
    const a = signal(0);
    const b = signal("a");
    const c = signal("b");
    const spy = vi.fn();

    effect(() => {
      b.value;
      c.value;
      spy(b.value + c.value);
    });

    effect(() => {
      a.value;
      return () => {
        b.value = "x";
        c.value = "y";
      };
    });

    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("xy");
  });

  it("should not retrigger the effect if the cleanup modifies one of the dependencies", () => {
    const a = signal(0);
    const spy = vi.fn();

    effect(() => {
      spy(a.value);
      return () => {
        a.value = 2;
      };
    });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it("should run the cleanup if the effect disposes itself", () => {
    const a = signal(0);
    const spy = vi.fn();

    const dispose = effect(() => {
      if (a.value > 0) {
        dispose();
        return spy;
      }
    });
    expect(spy).not.toHaveBeenCalled();
    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    a.value = 2;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not run the effect if the cleanup function disposes it", () => {
    const a = signal(0);
    const spy = vi.fn();

    const dispose = effect(() => {
      a.value;
      spy();
      return () => {
        dispose();
      };
    });
    expect(spy).toHaveBeenCalledOnce();
    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not subscribe to anything if first run throws", () => {
    const s = signal(0);
    const spy = vi.fn(() => {
      s.value;
      throw new Error("test");
    });
    expect(() => effect(spy)).to.throw("test");
    expect(spy).toHaveBeenCalledOnce();

    s.value++;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should reset the cleanup if the effect throws", () => {
    const a = signal(0);
    const spy = vi.fn();

    effect(() => {
      if (a.value === 0) {
        return spy;
      } else {
        throw new Error("hello");
      }
    });
    expect(spy).not.toHaveBeenCalled();
    expect(() => (a.value = 1)).to.throw("hello");
    expect(spy).toHaveBeenCalledOnce();
    a.value = 0;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should dispose the effect if the cleanup callback throws", () => {
    const a = signal(0);
    const spy = vi.fn();

    effect(() => {
      if (a.value === 0) {
        return () => {
          throw new Error("hello");
        };
      } else {
        spy();
      }
    });
    expect(spy).not.toHaveBeenCalled();
    expect(() => a.value++).to.throw("hello");
    expect(spy).not.toHaveBeenCalled();
    a.value++;
    expect(spy).not.toHaveBeenCalled();
  });

  it("should run cleanups outside any evaluation context", () => {
    const spy = vi.fn();
    const a = signal(0);
    const b = signal(0);
    const c = computed(() => {
      if (a.value === 0) {
        effect(() => {
          return () => {
            b.value;
          };
        });
      }
      return a.value;
    });

    effect(() => {
      spy();
      c.value;
    });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    b.value = 1;
    expect(spy).not.toHaveBeenCalled();
  });

  it("should throw on cycles", () => {
    const a = signal(0);
    let i = 0;

    const fn = () =>
      effect(() => {
        // Prevent test suite from spinning if limit is not hit
        if (i++ > 200) {
          throw new Error("test failed");
        }
        a.value;
        a.value = NaN;
      });

    expect(fn).to.throw(/Cycle detected/);
  });

  it("should throw on indirect cycles", () => {
    const a = signal(0);
    let i = 0;

    const c = computed(() => {
      a.value;
      a.value = NaN;
      return NaN;
    });

    const fn = () =>
      effect(() => {
        // Prevent test suite from spinning if limit is not hit
        if (i++ > 200) {
          throw new Error("test failed");
        }
        c.value;
      });

    expect(fn).to.throw(/Cycle detected/);
  });

  it("should allow disposing the effect multiple times", () => {
    const dispose = effect(() => undefined);
    dispose();
    expect(() => dispose()).not.to.throw();
  });

  it("should allow disposing a running effect", () => {
    const a = signal(0);
    const spy = vi.fn();
    const dispose = effect(() => {
      if (a.value === 1) {
        dispose();
        spy();
      }
    });
    expect(spy).not.toHaveBeenCalled();
    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
    a.value = 2;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not run if it's first been triggered and then disposed in a batch", () => {
    const a = signal(0);
    const spy = vi.fn(() => {
      a.value;
    });
    const dispose = effect(spy);
    spy.mockClear();

    batch(() => {
      a.value = 1;
      dispose();
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not run if it's been triggered, disposed and then triggered again in a batch", () => {
    const a = signal(0);
    const spy = vi.fn(() => {
      a.value;
    });
    const dispose = effect(spy);
    spy.mockClear();

    batch(() => {
      a.value = 1;
      dispose();
      a.value = 2;
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it("should not rerun parent effect if a nested child effect's signal's value changes", () => {
    const parentSignal = signal(0);
    const childSignal = signal(0);

    const parentEffect = vi.fn(() => {
      parentSignal.value;
    });
    const childEffect = vi.fn(() => {
      childSignal.value;
    });

    effect(() => {
      parentEffect();
      effect(childEffect);
    });

    expect(parentEffect).toHaveBeenCalledOnce();
    expect(childEffect).toHaveBeenCalledOnce();

    childSignal.value = 1;

    expect(parentEffect).toHaveBeenCalledOnce();
    expect(childEffect).toHaveBeenCalledTimes(2);

    parentSignal.value = 1;

    expect(parentEffect).toHaveBeenCalledTimes(2);
    expect(childEffect).toHaveBeenCalledTimes(3);
  });

  describe("scheduling", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should use custom scheduler when provided", () => {
      const s = signal(0);
      const spy = vi.fn();
      const scheduler = vi.fn((cb) => setTimeout(cb, 10));

      effect(
        () => {
          s.value;
          spy();
        },
        { scheduler }
      );

      expect(spy).toHaveBeenCalledTimes(1); // Initial run is sync
      spy.mockClear();

      s.value = 1;
      expect(scheduler).toHaveBeenCalledTimes(1);
      expect(spy).not.toHaveBeenCalled(); // Deferred

      vi.runAllTimers();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should respect notified flag for deduplication", () => {
      const s = signal(0);
      const spy = vi.fn();
      const scheduler = vi.fn((cb) => setTimeout(cb, 10));

      effect(
        () => {
          s.value;
          spy();
        },
        { scheduler }
      );

      spy.mockClear();

      s.value = 1;
      s.value = 2;
      s.value = 3;

      expect(scheduler).toHaveBeenCalledTimes(1); // Only scheduled once
      expect(spy).not.toHaveBeenCalled();

      vi.runAllTimers();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should not run if disposed before scheduler executes", () => {
      const s = signal(0);
      const spy = vi.fn();
      const scheduler = vi.fn((cb) => setTimeout(cb, 10));

      const dispose = effect(
        () => {
          s.value;
          spy();
        },
        { scheduler }
      );

      spy.mockClear();

      s.value = 1;
      expect(scheduler).toHaveBeenCalledTimes(1);

      dispose(); // Kill it before timer fires

      vi.runAllTimers();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("cascading disposal", () => {
    it("should automatically link nested effects to their parent", () => {
      const s = signal(0);
      const childSpy = vi.fn();
      const parentSpy = vi.fn();

      const disposeParent = effect(() => {
        parentSpy();
        effect(() => {
          s.value;
          childSpy();
        });
      });

      childSpy.mockClear();

      // Dispose parent -> should kill child
      disposeParent();

      s.value = 1;
      expect(childSpy).not.toHaveBeenCalled();
    });

    it("should dispose of all child effects when the parent is disposed", () => {
      const s = signal(0);
      const child1Spy = vi.fn();
      const child2Spy = vi.fn();

      const disposeParent = effect(() => {
        effect(() => {
          s.value;
          child1Spy();
        });
        effect(() => {
          s.value;
          child2Spy();
        });
      });

      child1Spy.mockClear();
      child2Spy.mockClear();

      disposeParent();
      s.value = 1;

      expect(child1Spy).not.toHaveBeenCalled();
      expect(child2Spy).not.toHaveBeenCalled();
    });

    it("should dispose of old child effects when the parent re-runs", () => {
      const trigger = signal(0);
      const data = signal(0);
      const childSpy = vi.fn();

      effect(() => {
        trigger.value; // Track trigger
        // Create a NEW child effect each time parent runs
        effect(() => {
          data.value; // Track data
          childSpy();
        });
      });

      childSpy.mockClear();

      // 1. Update parent -> Re-runs parent -> Kills old child -> Creates new child
      trigger.value++;

      childSpy.mockClear();

      // 2. Update data -> Should only trigger the NEW child (once)
      data.value++;

      expect(childSpy).toHaveBeenCalledTimes(1);
      // If zombie existed, this would be 2 (old child + new child)
    });

    it("should correctly unlink a child effect from its parent when disposed manually", () => {
      const s = signal(0);
      const childSpy = vi.fn();

      let disposeChild: () => void;

      const disposeParent = effect(() => {
        disposeChild = effect(() => {
          s.value;
          childSpy();
        });
      });

      // Manually dispose child
      disposeChild!();
      childSpy.mockClear();

      // Verify child is dead
      s.value++;
      expect(childSpy).not.toHaveBeenCalled();

      // Verify parent is fine (re-running parent shouldn't crash trying to kill a dead child)
      // Note: implementation needs to handle this gracefully
      disposeParent();
    });

    it("should handle multiple levels of nested effects", () => {
      const s = signal(0);
      const deepSpy = vi.fn();

      const disposeRoot = effect(() => {
        effect(() => {
          effect(() => {
            s.value;
            deepSpy();
          });
        });
      });

      deepSpy.mockClear();
      disposeRoot();

      s.value++;
      expect(deepSpy).not.toHaveBeenCalled();
    });
  });
});
