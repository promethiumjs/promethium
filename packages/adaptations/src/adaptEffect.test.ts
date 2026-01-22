import { afterEach, beforeEach, describe, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("adaptEffect functions", () => {
  test.todo("effects are reactive");
  test.todo("effect cleanup functions work properly");
  test.todo("effect cleanup function return values work properly");
  test.todo("dependency array effects work properly");
  test.todo("effect cleanups work properly");
  test.todo(
    "wrapping effects effectively clean up every effect and memo within the scope they wrap (that are synchronously called)"
  );
});
