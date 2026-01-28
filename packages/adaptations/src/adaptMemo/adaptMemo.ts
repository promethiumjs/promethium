import { Computed, type SignalOptions } from "../signals/signals.js";

class InternalAdaptedMemo<T> extends Computed<T> {
  constructor(fn: () => T, options?: SignalOptions<T>) {
    super(fn, options);
  }

  get(): T {
    return this.value;
  }
}

export type AdaptedMemo<T> = Pick<
  InternalAdaptedMemo<T>,
  "name" | "get" | "peek" | "subscribe" | "value"
>;

export interface AdaptMemoOptions<T> extends SignalOptions<T> {}

export function adaptMemo<T>(
  fn: () => T,
  options?: AdaptMemoOptions<T>
): AdaptedMemo<T> {
  return new InternalAdaptedMemo(fn, options) as AdaptedMemo<T>;
}
