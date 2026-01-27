import { describe, it, vi, expect } from "vitest";
import { signal, effect } from "./signals.js";

describe("internals", () => {
  it("should pass in the effect instance in callback's `this`", () => {
    let e: any;
    effect(function (this: any) {
      e = this;
    });
    expect(typeof e._start).to.equal("function");
    expect(typeof e._dispose).to.equal("function");
  });

  it("should allow setting _callback that replaces the default functionality", () => {
    const a = signal(0);
    const oldSpy = vi.fn();
    const newSpy = vi.fn();

    let e: any;
    effect(function (this: any) {
      e = this;
      a.value;
      oldSpy();
    });
    oldSpy.mockClear();

    e._callback = newSpy;
    a.value = 1;

    expect(oldSpy).not.toHaveBeenCalled();
    expect(newSpy).toHaveBeenCalled();
  });

  it("should return a function for closing the effect scope from _start", () => {
    const s = signal(0);

    let e: any;
    effect(function (this: any) {
      e = this;
    });

    const spy = vi.fn();
    e._callback = spy;

    const done1 = e._start();
    s.value;
    done1();
    expect(spy).not.toHaveBeenCalled();

    s.value = 2;
    expect(spy).toHaveBeenCalled();
    spy.mockClear();

    const done2 = e._start();
    done2();

    s.value = 3;
    expect(spy).not.toHaveBeenCalled();
  });

  it("should throw on out-of-order start1-start2-end1 sequences", () => {
    let e1: any;
    effect(function (this: any) {
      e1 = this;
    });

    let e2: any;
    effect(function (this: any) {
      e2 = this;
    });

    const done1 = e1._start();
    const done2 = e2._start();
    try {
      expect(() => done1()).to.throw(/Out-of-order/);
    } finally {
      done2();
      done1();
    }
  });

  it("should throw a cycle detection error when _start is called while the effect is running", () => {
    let e: any;
    effect(function (this: any) {
      e = this;
    });

    const done = e._start();
    try {
      expect(() => e._start()).to.throw(/Cycle detected/);
    } finally {
      done();
    }
  });

  it("should dispose the effect on _dispose", () => {
    const s = signal(0);

    let e: any;
    effect(function (this: any) {
      e = this;
    });

    const spy = vi.fn();
    e._callback = spy;

    const done = e._start();
    try {
      s.value;
    } finally {
      done();
    }
    expect(spy).not.toHaveBeenCalled();

    s.value = 2;
    expect(spy).toHaveBeenCalled();
    spy.mockClear();

    e._dispose();
    s.value = 3;
    expect(spy).not.toHaveBeenCalled();
  });

  it("should allow reusing the effect after disposing it", () => {
    const s = signal(0);

    let e: any;
    effect(function (this: any) {
      e = this;
    });

    const spy = vi.fn();
    e._callback = spy;
    e._dispose();

    const done = e._start();
    try {
      s.value;
    } finally {
      done();
    }
    s.value = 2;
    expect(spy).toHaveBeenCalled();
  });

  it("should have property _sources that is undefined when and only when the effect has no sources", () => {
    const s = signal(0);

    let e: any;
    effect(function (this: any) {
      e = this;
    });
    expect(e._sources).to.be.undefined;

    const done1 = e._start();
    try {
      s.value;
    } finally {
      done1();
    }
    expect(e._sources).not.to.be.undefined;

    const done2 = e._start();
    done2();
    expect(e._sources).to.be.undefined;

    const done3 = e._start();
    try {
      s.value;
    } finally {
      done3();
    }
    expect(e._sources).not.to.be.undefined;

    e._dispose();
    expect(e._sources).to.be.undefined;
  });
});
