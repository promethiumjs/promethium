import {
  imperativeUpdate,
  Signal,
  type SignalOptions,
} from "../signals/signals.js";

class InternalAdaptedState<T> extends Signal<T> {
  constructor(value?: T, options?: SignalOptions<T>) {
    super(value, options);
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
  }

  mutate(fn: () => void): void {
    fn();
    this.value = imperativeUpdate;
  }
}

export type AdaptedState<T> = Pick<
  InternalAdaptedState<T>,
  "name" | "get" | "set" | "peek" | "mutate" | "subscribe" | "value"
>;

export interface AdaptStateOptions<T> extends SignalOptions<T> {}

export function adaptState<T>(
  value: T,
  options?: SignalOptions<T>
): AdaptedState<T>;
export function adaptState<T = undefined>(): AdaptedState<T | undefined>;
export function adaptState<T>(
  value?: T,
  options?: SignalOptions<T>
): AdaptedState<T> {
  return new InternalAdaptedState(value, options) as AdaptedState<T>;
}
