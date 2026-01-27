import { describe, it, vi, expect } from "vitest";
import {
  signal,
  computed,
  effect,
  batch,
  Signal,
  ReadonlySignal,
} from "./signals.js";

// To make typescript shut up about `gc` potentially not being available
declare const gc: (() => void) | undefined;

describe("computed()", () => {
  it("should return value", () => {
    const a = signal("a");
    const b = signal("b");

    const c = computed(() => a.value + b.value);
    expect(c.value).to.equal("ab");
  });

  it("should be identified with a symbol", () => {
    const a = computed(() => {});
    expect(a.brand).to.equal(Symbol.for("promethium-signals"));
  });

  it("should inherit from Signal", () => {
    expect(computed(() => 0)).to.be.instanceOf(Signal);
  });

  it("should return updated value", () => {
    const a = signal("a");
    const b = signal("b");

    const c = computed(() => a.value + b.value);
    expect(c.value).to.equal("ab");

    a.value = "aa";
    expect(c.value).to.equal("aab");
  });

  it("should be lazily computed on demand", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => a.value + b.value);
    const c = computed(spy);
    expect(spy).not.toHaveBeenCalled();
    c.value;
    expect(spy).toHaveBeenCalledOnce();
    a.value = "x";
    b.value = "y";
    expect(spy).toHaveBeenCalledOnce();
    c.value;
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should be computed only when a dependency has changed at some point", () => {
    const a = signal("a");
    const spy = vi.fn(() => {
      return a.value;
    });
    const c = computed(spy);
    c.value;
    expect(spy).toHaveBeenCalledOnce();
    a.value = "a";
    c.value;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should recompute if a dependency changes during computation after becoming a dependency", () => {
    const a = signal(0);
    const spy = vi.fn(() => {
      a.value++;
    });
    const c = computed(spy);
    c.value;
    expect(spy).toHaveBeenCalledOnce();
    c.value;
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should detect simple dependency cycles", () => {
    const a: ReadonlySignal = computed(() => a.value);
    expect(() => a.value).to.throw(/Cycle detected/);
  });

  it("should detect deep dependency cycles", () => {
    const a: ReadonlySignal = computed(() => b.value);
    const b: ReadonlySignal = computed(() => c.value);
    const c: ReadonlySignal = computed(() => d.value);
    const d: ReadonlySignal = computed(() => a.value);
    expect(() => a.value).to.throw(/Cycle detected/);
  });

  it("should not allow a computed signal to become a direct dependency of itself", () => {
    const spy = vi.fn(() => {
      try {
        a.value;
      } catch {
        // pass
      }
    });
    const a = computed(spy);
    a.value;
    expect(() => effect(() => a.value)).to.not.throw();
  });

  it("should store thrown errors and recompute only after a dependency changes", () => {
    const a = signal(0);
    const spy = vi.fn(() => {
      a.value;
      throw new Error();
    });
    const c = computed(spy);
    expect(() => c.value).to.throw();
    expect(() => c.value).to.throw();
    expect(spy).toHaveBeenCalledOnce();
    a.value = 1;
    expect(() => c.value).to.throw();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should store thrown non-errors and recompute only after a dependency changes", () => {
    const a = signal(0);
    const spy = vi.fn();
    const c = computed(() => {
      a.value;
      spy();
      throw undefined;
    });

    try {
      c.value;
      expect.fail();
    } catch (err) {
      expect(err).to.be.undefined;
    }
    try {
      c.value;
      expect.fail();
    } catch (err) {
      expect(err).to.be.undefined;
    }
    expect(spy).toHaveBeenCalledOnce();

    a.value = 1;
    try {
      c.value;
      expect.fail();
    } catch (err) {
      expect(err).to.be.undefined;
    }
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should conditionally unsubscribe from signals", () => {
    const a = signal("a");
    const b = signal("b");
    const cond = signal(true);

    const spy = vi.fn(() => {
      return cond.value ? a.value : b.value;
    });

    const c = computed(spy);
    expect(c.value).to.equal("a");
    expect(spy).toHaveBeenCalledOnce();

    b.value = "bb";
    expect(c.value).to.equal("a");
    expect(spy).toHaveBeenCalledOnce();

    cond.value = false;
    expect(c.value).to.equal("bb");
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockClear();

    a.value = "aaa";
    expect(c.value).to.equal("bb");
    expect(spy).not.toHaveBeenCalled();
  });

  describe(".(un)watched()", () => {
    it("should call watched when first subscription occurs", () => {
      const watched = vi.fn();
      const unwatched = vi.fn();
      const s = computed(() => 1, { watched, unwatched });
      expect(watched).not.toHaveBeenCalled();
      const unsubscribe = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledOnce();
      const unsubscribe2 = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledOnce();
      unsubscribe();
      unsubscribe2();
      expect(unwatched).toHaveBeenCalledOnce();
    });

    it("should call watched when first subscription occurs w/ nested signal", () => {
      const watched = vi.fn();
      const unwatched = vi.fn();
      const s = signal(1, { watched, unwatched });
      const c = computed(() => s.value + 1, { watched, unwatched });
      expect(watched).not.toHaveBeenCalled();
      const unsubscribe = c.subscribe(() => {});
      expect(watched).toHaveBeenCalledTimes(2);
      const unsubscribe2 = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledTimes(2);
      unsubscribe2();
      unsubscribe();
      expect(unwatched).toHaveBeenCalledTimes(2);
    });
  });

  it("should consider undefined value separate from uninitialized value", () => {
    const a = signal(0);
    const spy = vi.fn(() => undefined);
    const c = computed(spy);

    expect(c.value).to.be.undefined;
    a.value = 1;
    expect(c.value).to.be.undefined;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not leak errors raised by dependencies", () => {
    const a = signal(0);
    const b = computed(() => {
      a.value;
      throw new Error("error");
    });
    const c = computed(() => {
      try {
        b.value;
      } catch {
        return "ok";
      }
    });
    expect(c.value).to.equal("ok");
    a.value = 1;
    expect(c.value).to.equal("ok");
  });

  it("should propagate notifications even right after first subscription", () => {
    const a = signal(0);
    const b = computed(() => a.value);
    const c = computed(() => b.value);
    c.value;

    const spy = vi.fn(() => {
      c.value;
    });

    effect(spy);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    a.value = 1;
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should get marked as outdated right after first subscription", () => {
    const s = signal(0);
    const c = computed(() => s.value);
    c.value;

    s.value = 1;
    effect(() => {
      c.value;
    });
    expect(c.value).to.equal(1);
  });

  it("should propagate notification to other listeners after one listener is disposed", () => {
    const s = signal(0);
    const c = computed(() => s.value);

    const spy1 = vi.fn(() => {
      c.value;
    });
    const spy2 = vi.fn(() => {
      c.value;
    });
    const spy3 = vi.fn(() => {
      c.value;
    });

    effect(spy1);
    const dispose = effect(spy2);
    effect(spy3);

    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy3).toHaveBeenCalledOnce();

    dispose();

    s.value = 1;
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledOnce();
    expect(spy3).toHaveBeenCalledTimes(2);
  });

  it("should not recompute dependencies out of order", () => {
    const a = signal(1);
    const b = signal(1);
    const c = signal(1);

    const spy = vi.fn(() => c.value);
    const d = computed(spy);

    const e = computed(() => {
      if (a.value > 0) {
        b.value;
        d.value;
      } else {
        b.value;
      }
    });

    e.value;
    spy.mockClear();

    a.value = 2;
    b.value = 2;
    c.value = 2;
    e.value;
    expect(spy).toHaveBeenCalledOnce();
    spy.mockClear();

    a.value = -1;
    b.value = -1;
    c.value = -1;
    e.value;
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  });

  it("should not recompute dependencies unnecessarily", () => {
    const spy = vi.fn();
    const a = signal(0);
    const b = signal(0);
    const c = computed(() => {
      b.value;
      spy();
    });
    const d = computed(() => {
      if (a.value === 0) {
        c.value;
      }
    });
    d.value;
    expect(spy).toHaveBeenCalledOnce();

    batch(() => {
      b.value = 1;
      a.value = 1;
    });
    d.value;
    expect(spy).toHaveBeenCalledOnce();
  });

  describe(".peek()", () => {
    it("should get value", () => {
      const s = signal(1);
      const c = computed(() => s.value);
      expect(c.peek()).equal(1);
    });

    it("should throw when evaluation throws", () => {
      const c = computed(() => {
        throw Error("test");
      });
      expect(() => c.peek()).to.throw("test");
    });

    it("should throw when previous evaluation threw and dependencies haven't changed", () => {
      const c = computed(() => {
        throw Error("test");
      });
      expect(() => c.value).to.throw("test");
      expect(() => c.peek()).to.throw("test");
    });

    it("should refresh value if stale", () => {
      const a = signal(1);
      const b = computed(() => a.value);
      expect(b.peek()).to.equal(1);

      a.value = 2;
      expect(b.peek()).to.equal(2);
    });

    it("should detect simple dependency cycles", () => {
      const a: ReadonlySignal = computed(() => a.peek());
      expect(() => a.peek()).to.throw(/Cycle detected/);
    });

    it("should detect deep dependency cycles", () => {
      const a: ReadonlySignal = computed(() => b.value);
      const b: ReadonlySignal = computed(() => c.value);
      const c: ReadonlySignal = computed(() => d.value);
      const d: ReadonlySignal = computed(() => a.peek());
      expect(() => a.peek()).to.throw(/Cycle detected/);
    });

    it("should not make surrounding effect depend on the computed", () => {
      const s = signal(1);
      const c = computed(() => s.value);
      const spy = vi.fn(() => {
        c.peek();
      });

      effect(spy);
      expect(spy).toHaveBeenCalledOnce();

      s.value = 2;
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should not make surrounding computed depend on the computed", () => {
      const s = signal(1);
      const c = computed(() => s.value);

      const spy = vi.fn(() => {
        c.peek();
      });

      const d = computed(spy);
      d.value;
      expect(spy).toHaveBeenCalledOnce();

      s.value = 2;
      d.value;
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should not make surrounding effect depend on the peeked computed's dependencies", () => {
      const a = signal(1);
      const b = computed(() => a.value);
      const spy = vi.fn();
      effect(() => {
        spy();
        b.peek();
      });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockClear();

      a.value = 1;
      expect(spy).not.toHaveBeenCalled();
    });

    it("should not make surrounding computed depend on peeked computed's dependencies", () => {
      const a = signal(1);
      const b = computed(() => a.value);
      const spy = vi.fn();
      const d = computed(() => {
        spy();
        b.peek();
      });
      d.value;
      expect(spy).toHaveBeenCalledOnce();
      spy.mockClear();

      a.value = 1;
      d.value;
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe.runIf(typeof gc !== "undefined")("garbage collection", function () {
    it("should be garbage collectable if nothing is listening to its changes", async () => {
      const s = signal(0);
      const ref = new WeakRef(computed(() => s.value));

      (gc as () => void)();
      await new Promise((resolve) => setTimeout(resolve, 0));
      (gc as () => void)();
      expect(ref.deref()).to.be.undefined;
    });

    it("should be garbage collectable after it has lost all of its listeners", async () => {
      const s = signal(0);

      let ref: WeakRef<ReadonlySignal>;
      let dispose: () => void;
      (function () {
        const c = computed(() => s.value);
        ref = new WeakRef(c);
        dispose = effect(() => {
          c.value;
        });
      })();

      dispose();
      (gc as () => void)();
      await new Promise((resolve) => setTimeout(resolve, 0));
      (gc as () => void)();
      expect(ref.deref()).to.be.undefined;
    });
  });

  describe("graph updates", () => {
    it("should run computeds once for multiple dep changes", async () => {
      const a = signal("a");
      const b = signal("b");

      const compute = vi.fn(() => {
        // debugger;
        return a.value + b.value;
      });
      const c = computed(compute);

      expect(c.value).to.equal("ab");
      expect(compute).toHaveBeenCalledOnce();
      compute.mockClear();

      a.value = "aa";
      b.value = "bb";
      c.value;
      expect(compute).toHaveBeenCalledOnce();
    });

    it("should drop A->B->A updates", async () => {
      //     A
      //   / |
      //  B  | <- Looks like a flag doesn't it? :D
      //   \ |
      //     C
      //     |
      //     D
      const a = signal(2);

      const b = computed(() => a.value - 1);
      const c = computed(() => a.value + b.value);

      const compute = vi.fn(() => "d: " + c.value);
      const d = computed(compute);

      // Trigger read
      expect(d.value).to.equal("d: 3");
      expect(compute).toHaveBeenCalledOnce();
      compute.mockClear();

      a.value = 4;
      d.value;
      expect(compute).toHaveBeenCalledOnce();
    });

    it("should only update every signal once (diamond graph)", () => {
      // In this scenario "D" should only update once when "A" receives
      // an update. This is sometimes referred to as the "diamond" scenario.
      //     A
      //   /   \
      //  B     C
      //   \   /
      //     D
      const a = signal("a");
      const b = computed(() => a.value);
      const c = computed(() => a.value);

      const spy = vi.fn(() => b.value + " " + c.value);
      const d = computed(spy);

      expect(d.value).to.equal("a a");
      expect(spy).toHaveBeenCalledOnce();

      a.value = "aa";
      expect(d.value).to.equal("aa aa");
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should only update every signal once (diamond graph + tail)", () => {
      // "E" will be likely updated twice if our mark+sweep logic is buggy.
      //     A
      //   /   \
      //  B     C
      //   \   /
      //     D
      //     |
      //     E
      const a = signal("a");
      const b = computed(() => a.value);
      const c = computed(() => a.value);

      const d = computed(() => b.value + " " + c.value);

      const spy = vi.fn(() => d.value);
      const e = computed(spy);

      expect(e.value).to.equal("a a");
      expect(spy).toHaveBeenCalledOnce();

      a.value = "aa";
      expect(e.value).to.equal("aa aa");
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should bail out if result is the same", () => {
      // Bail out if value of "B" never changes
      // A->B->C
      const a = signal("a");
      const b = computed(() => {
        a.value;
        return "foo";
      });

      const spy = vi.fn(() => b.value);
      const c = computed(spy);

      expect(c.value).to.equal("foo");
      expect(spy).toHaveBeenCalledOnce();

      a.value = "aa";
      expect(c.value).to.equal("foo");
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should only update every signal once (jagged diamond graph + tails)", () => {
      // "F" and "G" will be likely updated twice if our mark+sweep logic is buggy.
      //     A
      //   /   \
      //  B     C
      //  |     |
      //  |     D
      //   \   /
      //     E
      //   /   \
      //  F     G
      const a = signal("a");

      const b = computed(() => a.value);
      const c = computed(() => a.value);

      const d = computed(() => c.value);

      const eSpy = vi.fn(() => b.value + " " + d.value);
      const e = computed(eSpy);

      const fSpy = vi.fn(() => e.value);
      const f = computed(fSpy);
      const gSpy = vi.fn(() => e.value);
      const g = computed(gSpy);

      expect(f.value).to.equal("a a");
      expect(fSpy).toHaveBeenCalledOnce();

      expect(g.value).to.equal("a a");
      expect(gSpy).toHaveBeenCalledOnce();

      eSpy.mockClear();
      fSpy.mockClear();
      gSpy.mockClear();

      a.value = "b";

      expect(e.value).to.equal("b b");
      expect(eSpy).toHaveBeenCalledOnce();

      expect(f.value).to.equal("b b");
      expect(fSpy).toHaveBeenCalledOnce();

      expect(g.value).to.equal("b b");
      expect(gSpy).toHaveBeenCalledOnce();

      eSpy.mockClear();
      fSpy.mockClear();
      gSpy.mockClear();

      a.value = "c";

      expect(e.value).to.equal("c c");
      expect(eSpy).toHaveBeenCalledOnce();

      expect(f.value).to.equal("c c");
      expect(fSpy).toHaveBeenCalledOnce();

      expect(g.value).to.equal("c c");
      expect(gSpy).toHaveBeenCalledOnce();

      // top to bottom
      expect(eSpy).toHaveBeenCalledBefore(fSpy);
      // left to right
      expect(fSpy).toHaveBeenCalledBefore(gSpy);
    });

    it("should only subscribe to signals listened to", () => {
      //    *A
      //   /   \
      // *B     C <- we don't listen to C
      const a = signal("a");

      const b = computed(() => a.value);
      const spy = vi.fn(() => a.value);
      computed(spy);

      expect(b.value).to.equal("a");
      expect(spy).not.toHaveBeenCalled();

      a.value = "aa";
      expect(b.value).to.equal("aa");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should only subscribe to signals listened to", () => {
      // Here both "B" and "C" are active in the beginning, but
      // "B" becomes inactive later. At that point it should
      // not receive any updates anymore.
      //    *A
      //   /   \
      // *B     D <- we don't listen to C
      //  |
      // *C
      const a = signal("a");
      const spyB = vi.fn(() => a.value);
      const b = computed(spyB);

      const spyC = vi.fn(() => b.value);
      const c = computed(spyC);

      const d = computed(() => a.value);

      let result = "";
      const unsub = effect(() => {
        result = c.value;
      });

      expect(result).to.equal("a");
      expect(d.value).to.equal("a");

      spyB.mockClear();
      spyC.mockClear();
      unsub();

      a.value = "aa";

      expect(spyB).not.toHaveBeenCalled();
      expect(spyC).not.toHaveBeenCalled();
      expect(d.value).to.equal("aa");
    });

    it("should ensure subs update even if one dep unmarks it", () => {
      // In this scenario "C" always returns the same value. When "A"
      // changes, "B" will update, then "C" at which point its update
      // to "D" will be unmarked. But "D" must still update because
      // "B" marked it. If "D" isn't updated, then we have a bug.
      //     A
      //   /   \
      //  B     *C <- returns same value every time
      //   \   /
      //     D
      const a = signal("a");
      const b = computed(() => a.value);
      const c = computed(() => {
        a.value;
        return "c";
      });
      const spy = vi.fn(() => b.value + " " + c.value);
      const d = computed(spy);
      expect(d.value).to.equal("a c");
      spy.mockClear();

      a.value = "aa";
      d.value;
      expect(spy).toReturnWith("aa c");
    });

    it("should ensure subs update even if two deps unmark it", () => {
      // In this scenario both "C" and "D" always return the same
      // value. But "E" must still update because "A"  marked it.
      // If "E" isn't updated, then we have a bug.
      //     A
      //   / | \
      //  B *C *D
      //   \ | /
      //     E
      const a = signal("a");
      const b = computed(() => a.value);
      const c = computed(() => {
        a.value;
        return "c";
      });
      const d = computed(() => {
        a.value;
        return "d";
      });
      const spy = vi.fn(() => b.value + " " + c.value + " " + d.value);
      const e = computed(spy);
      expect(e.value).to.equal("a c d");
      spy.mockClear();

      a.value = "aa";
      e.value;
      expect(spy).toReturnWith("aa c d");
    });
  });

  describe("error handling", () => {
    it("should throw when writing to computeds", () => {
      const a = signal("a");
      const b = computed(() => a.value);
      const fn = () => ((b as Signal).value = "aa");
      expect(fn).to.throw(/Cannot set property value/);
    });

    it("should keep graph consistent on errors during activation", () => {
      const a = signal(0);
      const b = computed(() => {
        throw new Error("fail");
      });
      const c = computed(() => a.value);
      expect(() => b.value).to.throw("fail");

      a.value = 1;
      expect(c.value).to.equal(1);
    });

    it("should keep graph consistent on errors in computeds", () => {
      const a = signal(0);
      const b = computed(() => {
        if (a.value === 1) throw new Error("fail");
        return a.value;
      });
      const c = computed(() => b.value);
      expect(c.value).to.equal(0);

      a.value = 1;
      expect(() => b.value).to.throw("fail");

      a.value = 2;
      expect(c.value).to.equal(2);
    });

    it("should support lazy branches", () => {
      const a = signal(0);
      const b = computed(() => a.value);
      const c = computed(() => (a.value > 0 ? a.value : b.value));

      expect(c.value).to.equal(0);
      a.value = 1;
      expect(c.value).to.equal(1);

      a.value = 0;
      expect(c.value).to.equal(0);
    });

    it("should not update a sub if all deps unmark it", () => {
      // In this scenario "B" and "C" always return the same value. When "A"
      // changes, "D" should not update.
      //     A
      //   /   \
      // *B     *C
      //   \   /
      //     D
      const a = signal("a");
      const b = computed(() => {
        a.value;
        return "b";
      });
      const c = computed(() => {
        a.value;
        return "c";
      });
      const spy = vi.fn(() => b.value + " " + c.value);
      const d = computed(spy);
      expect(d.value).to.equal("b c");
      spy.mockClear();

      a.value = "aa";
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
