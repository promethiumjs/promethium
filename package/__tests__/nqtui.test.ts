import { describe, expect, expectTypeOf, test } from "vitest";
import { adaptState } from "../src/nqtui/adaptations/adaptState/adaptState";
import { adaptMemo } from "../src/nqtui/adaptations/adaptMemo/adaptMemo";

describe("adaptState", () => {
  test("basic stuff", () => {
    const [count, setCount] = adaptState(0);
    expect(count()).toBe(0);
    setCount(3);
    expect(count()).toBe(3);
    expectTypeOf(count()).toEqualTypeOf<string>();
  });

  test("testing adaptMemo", () => {
    const [count, setCount] = adaptState(0);
    expect(count()).toBe(0);
    setCount(3);
    expect(count()).toBe(3);
  });
});
