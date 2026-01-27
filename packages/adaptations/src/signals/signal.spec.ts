import { describe, it, vi, expect } from "vitest";
import { signal, computed, effect, Signal } from "./signals.js";

describe("signal", () => {
  it("should return value", () => {
    const v = [1, 2];
    const s = signal(v);
    expect(s.value).to.equal(v);
  });

  it("should inherit from Signal", () => {
    expect(signal(0)).to.be.instanceOf(Signal);
  });

  it("should support .toString()", () => {
    const s = signal(123);
    expect(s.toString()).equal("123");
  });

  it("should support .toJSON()", () => {
    const s = signal(123);
    expect(s.toJSON()).equal(123);
  });

  it("should support JSON.Stringify()", () => {
    const s = signal(123);
    expect(JSON.stringify({ s })).equal(JSON.stringify({ s: 123 }));
  });

  it("should support .valueOf()", () => {
    const s = signal(123);
    expect(s).to.have.property("valueOf");
    expect(s.valueOf).to.be.a("function");
    expect(s.valueOf()).equal(123);
    expect(+s).equal(123);

    const a = signal(1);
    const b = signal(2);
    // @ts-ignore-next-line
    expect(a + b).to.equal(3);
  });

  it("should notify other listeners of changes after one listener is disposed", () => {
    const s = signal(0);
    const spy1 = vi.fn(() => {
      s.value;
    });
    const spy2 = vi.fn(() => {
      s.value;
    });
    const spy3 = vi.fn(() => {
      s.value;
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

  describe(".peek()", () => {
    it("should get value", () => {
      const s = signal(1);
      expect(s.peek()).equal(1);
    });

    it("should get the updated value after a value change", () => {
      const s = signal(1);
      s.value = 2;
      expect(s.peek()).equal(2);
    });

    it("should not make surrounding effect depend on the signal", () => {
      const s = signal(1);
      const spy = vi.fn(() => {
        s.peek();
      });

      effect(spy);
      expect(spy).toHaveBeenCalledOnce();

      s.value = 2;
      expect(spy).toHaveBeenCalledOnce();
    });

    it("should not make surrounding computed depend on the signal", () => {
      const s = signal(1);
      const spy = vi.fn(() => {
        s.peek();
      });
      const d = computed(spy);

      d.value;
      expect(spy).toHaveBeenCalledOnce();

      s.value = 2;
      d.value;
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe(".subscribe()", () => {
    it("should subscribe to a signal", () => {
      const spy = vi.fn();
      const a = signal(1);

      a.subscribe(spy);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it("should run the callback when the signal value changes", () => {
      const spy = vi.fn();
      const a = signal(1);

      a.subscribe(spy);

      a.value = 2;
      expect(spy).toHaveBeenCalledWith(2);
    });

    it("should unsubscribe from a signal", () => {
      const spy = vi.fn();
      const a = signal(1);

      const dispose = a.subscribe(spy);
      dispose();
      spy.mockClear();

      a.value = 2;
      expect(spy).not.toHaveBeenCalled();
    });

    it("should not start triggering on when a signal accessed in the callback changes", () => {
      const spy = vi.fn();
      const a = signal(0);
      const b = signal(0);

      a.subscribe(() => {
        b.value;
        spy();
      });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockClear();

      b.value++;
      expect(spy).not.toHaveBeenCalled();
    });

    it("should not cause surrounding effect to subscribe to changes to a signal accessed in the callback", () => {
      const spy = vi.fn();
      const a = signal(0);
      const b = signal(0);

      effect(() => {
        a.subscribe(() => {
          b.value;
        });
        spy();
      });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockClear();

      b.value++;
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe(".(un)watched()", () => {
    it("should call watched when first subscription occurs", () => {
      const watched = vi.fn();
      const unwatched = vi.fn();
      const s = signal(1, { watched, unwatched });
      expect(watched).not.toHaveBeenCalled();
      const unsubscribe = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledOnce();
      const unsubscribe2 = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledOnce();
      unsubscribe();
      unsubscribe2();
      expect(unwatched).toHaveBeenCalledOnce();
    });

    it("should allow updating the signal from watched", async () => {
      const calls: number[] = [];
      const watched = vi.fn(() => {
        setTimeout(() => {
          s.value = 2;
        });
      });
      const unwatched = vi.fn();
      const s = signal(1, { watched, unwatched });
      expect(watched).not.toHaveBeenCalled();
      const unsubscribe = s.subscribe(() => {
        calls.push(s.value);
      });
      expect(watched).toHaveBeenCalledOnce();
      const unsubscribe2 = s.subscribe(() => {});
      expect(watched).toHaveBeenCalledOnce();
      await new Promise((resolve) => setTimeout(resolve));
      unsubscribe();
      unsubscribe2();
      expect(unwatched).toHaveBeenCalledOnce();
      expect(calls).to.deep.equal([1, 2]);
    });
  });

  it("signals should be identified with a symbol", () => {
    const a = signal(0);
    expect(a.brand).to.equal(Symbol.for("promethium-signals"));
  });

  describe.todo("imperativeUpdate", () => {
    it.todo("should trigger effects without changing value");
    it.todo("should cause computeds to re-evaluate");
  });
});
