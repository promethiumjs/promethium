import { describe, it, vi, expect } from "vitest";
import { signal, computed, effect, batch } from "./signals.js";

describe("batch/transaction", () => {
  it("should return the value from the callback", () => {
    expect(batch(() => 1)).to.equal(1);
  });

  it("should throw errors thrown from the callback", () => {
    expect(() =>
      batch(() => {
        throw Error("hello");
      })
    ).to.throw("hello");
  });

  it("should throw non-errors thrown from the callback", () => {
    try {
      batch(() => {
        throw undefined;
      });
      expect.fail();
    } catch (err) {
      expect(err).to.be.undefined;
    }
  });

  it("should delay writes", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + " " + b.value;
    });
    effect(spy);
    spy.mockClear();

    batch(() => {
      a.value = "aa";
      b.value = "bb";
    });

    expect(spy).toHaveBeenCalledOnce();
  });

  it("should delay writes until outermost batch is complete", () => {
    const a = signal("a");
    const b = signal("b");
    const spy = vi.fn(() => {
      a.value + ", " + b.value;
    });
    effect(spy);
    spy.mockClear();

    batch(() => {
      batch(() => {
        a.value += " inner";
        b.value += " inner";
      });
      a.value += " outer";
      b.value += " outer";
    });

    // If the inner batch() would have flushed the update
    // this spy would've been called twice.
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should read signals written to", () => {
    const a = signal("a");

    let result = "";
    batch(() => {
      a.value = "aa";
      result = a.value;
    });

    expect(result).to.equal("aa");
  });

  it("should read computed signals with updated source signals", () => {
    // A->B->C->D->E
    const a = signal("a");
    const b = computed(() => a.value);

    const spyC = vi.fn(() => b.value);
    const c = computed(spyC);

    const spyD = vi.fn(() => c.value);
    const d = computed(spyD);

    const spyE = vi.fn(() => d.value);
    const e = computed(spyE);

    spyC.mockClear();
    spyD.mockClear();
    spyE.mockClear();

    let result = "";
    batch(() => {
      a.value = "aa";
      result = c.value;

      // Since "D" isn't accessed during batching, we should not
      // update it, only after batching has completed
      expect(spyD).not.toHaveBeenCalled();
    });

    expect(result).to.equal("aa");
    expect(d.value).to.equal("aa");
    expect(e.value).to.equal("aa");
    expect(spyC).toHaveBeenCalledOnce();
    expect(spyD).toHaveBeenCalledOnce();
    expect(spyE).toHaveBeenCalledOnce();
  });

  it("should not block writes after batching completed", () => {
    // If no further writes after batch() are possible, than we
    // didn't restore state properly. Most likely "pending" still
    // holds elements that are already processed.
    const a = signal("a");
    const b = signal("b");
    const c = signal("c");
    const d = computed(() => a.value + " " + b.value + " " + c.value);

    let result;
    effect(() => {
      result = d.value;
    });

    batch(() => {
      a.value = "aa";
      b.value = "bb";
    });
    c.value = "cc";
    expect(result).to.equal("aa bb cc");
  });

  it("should not lead to stale signals with .value in batch", () => {
    const invokes: number[][] = [];
    const counter = signal(0);
    const double = computed(() => counter.value * 2);
    const triple = computed(() => counter.value * 3);

    effect(() => {
      invokes.push([double.value, triple.value]);
    });

    expect(invokes).to.deep.equal([[0, 0]]);

    batch(() => {
      counter.value = 1;
      expect(double.value).to.equal(2);
    });

    expect(invokes[1]).to.deep.equal([2, 3]);
  });

  it("should not lead to stale signals with peek() in batch", () => {
    const invokes: number[][] = [];
    const counter = signal(0);
    const double = computed(() => counter.value * 2);
    const triple = computed(() => counter.value * 3);

    effect(() => {
      invokes.push([double.value, triple.value]);
    });

    expect(invokes).to.deep.equal([[0, 0]]);

    batch(() => {
      counter.value = 1;
      expect(double.peek()).to.equal(2);
    });

    expect(invokes[1]).to.deep.equal([2, 3]);
  });

  it("should run pending effects even if the callback throws", () => {
    const a = signal(0);
    const b = signal(1);
    const spy1 = vi.fn(() => {
      a.value;
    });
    const spy2 = vi.fn(() => {
      b.value;
    });
    effect(spy1);
    effect(spy2);
    spy1.mockClear();
    spy2.mockClear();

    expect(() =>
      batch(() => {
        a.value++;
        b.value++;
        throw Error("hello");
      })
    ).to.throw("hello");

    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });

  it("should run pending effects even if some effects throw", () => {
    const a = signal(0);
    const spy1 = vi.fn(() => {
      a.value;
    });
    const spy2 = vi.fn(() => {
      a.value;
    });
    effect(() => {
      if (a.value === 1) {
        throw new Error("hello");
      }
    });
    effect(spy1);
    effect(() => {
      if (a.value === 1) {
        throw new Error("hello");
      }
    });
    effect(spy2);
    effect(() => {
      if (a.value === 1) {
        throw new Error("hello");
      }
    });
    spy1.mockClear();
    spy2.mockClear();

    expect(() =>
      batch(() => {
        a.value++;
      })
    ).to.throw("hello");

    expect(spy1).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });

  it("should run effect's first run immediately even inside a batch", () => {
    let callCount = 0;
    const spy = vi.fn();
    batch(() => {
      effect(spy);
      callCount = spy.mock.calls.length;
    });
    expect(callCount).to.equal(1);
  });
});
