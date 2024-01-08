import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { adaptState } from "../src/nqtui/adaptations/adaptState/adaptState";
import adaptEffect from "../src/nqtui/adaptations/adaptEffect/adaptEffect";
import adaptMemo from "../src/nqtui/adaptations/adaptMemo/adaptMemo";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("adaptState", () => {
  const [count, setCount] = adaptState(0);
  const effectFn = vi.fn(() => {
    count();
  });

  test("state has right value", () => {
    expect(count()).toBe(0);
  });

  test("setState correctly changes state value", () => {
    setCount(1);
    expect(count()).toBe(1);
  });

  test("state change triggers effects", () => {
    adaptEffect(effectFn);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(1);
    setCount(2);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(2);
  });

  test("state doesn't trigger effects when its value hasn't changed", () => {
    setCount(2);
    vi.advanceTimersToNextTimer();
    expect(effectFn).toHaveBeenCalledTimes(0);
  });
});

describe("adaptMemo", () => {
  const [count, setCount] = adaptState(0);
  const memoFn_1 = vi.fn(() => count() + 1);
  const countPlusOne = adaptMemo(memoFn_1);

  test("memo has right value and is lazily evaluated", () => {
    expect(memoFn_1).toHaveBeenCalledTimes(0);
    expect(countPlusOne()).toBe(count() + 1);
    expect(memoFn_1).toHaveBeenCalledTimes(1);
    countPlusOne();
    expect(memoFn_1).toHaveBeenCalledTimes(1);
    setCount(1);
    expect(memoFn_1).toHaveBeenCalledTimes(2);
    expect(countPlusOne()).toBe(count() + 1);
    expect(memoFn_1).toHaveBeenCalledTimes(2);
  });

  const memoFn_2 = vi.fn(() => countPlusOne() + 1);
  const countPlusTwo = adaptMemo(memoFn_2);

  test("memo triggers other memos", () => {
    expect(memoFn_2).toHaveBeenCalledTimes(0);
    expect(countPlusTwo()).toBe(countPlusOne() + 1);
    expect(memoFn_2).toHaveBeenCalledTimes(1);
    countPlusTwo();
    expect(memoFn_2).toHaveBeenCalledTimes(1);
  });

  const effectFn_1 = vi.fn(() => {
    countPlusTwo();
  });

  test("memo value change triggers effects", () => {
    adaptEffect(effectFn_1);
    vi.advanceTimersToNextTimer();
    expect(effectFn_1).toHaveBeenCalledTimes(1);
    setCount(2);
    vi.advanceTimersToNextTimer();
    expect(effectFn_1).toHaveBeenCalledTimes(2);
  });

  const memoFn_3 = vi.fn(() => (count() < 3 ? count() : 3));
  const threeOrLess = adaptMemo(memoFn_3);
  const memoFn_4 = vi.fn(() => threeOrLess() + 1);
  const threeOrLessPlusOne = adaptMemo(memoFn_4);
  const effectFn_2 = vi.fn(() => {
    threeOrLess();
  });

  test("memo doesn't trigger effects if its value hasn't changed", () => {
    adaptEffect(effectFn_2);
    vi.advanceTimersToNextTimer();
    expect(effectFn_2).toHaveBeenCalledTimes(1);
    setCount(3);
    vi.advanceTimersToNextTimer();
    expect(effectFn_2).toHaveBeenCalledTimes(2);
    setCount(4);
    vi.advanceTimersToNextTimer();
    expect(effectFn_2).toHaveBeenCalledTimes(2);
  });

  test("memo doesn't trigger other memos if its value hasn't changed", () => {
    expect(memoFn_4).toHaveBeenCalledTimes(0);
    expect(threeOrLessPlusOne()).toBe(threeOrLess() + 1);
    expect(memoFn_4).toHaveBeenCalledTimes(1);
    setCount(2);
    expect(memoFn_4).toHaveBeenCalledTimes(2);
    setCount(3);
    expect(memoFn_4).toHaveBeenCalledTimes(3);
    setCount(4);
    expect(memoFn_4).toHaveBeenCalledTimes(3);
  });

  test.todo("memo cleanup works");
});

describe("adaptEffect functions", () => {
  test.todo("effects are reactive");
  test.todo("effect cleanup functions work properly");
  test.todo("effect cleanup function return values work properly");
  test.todo("dependency array effects work properly");
  test.todo("effect cleanups work properly");
  test.todo(
    "wrapping effects effectively clean up every effect and memo within the scope they wrap (that are synchronously called)",
  );
});
