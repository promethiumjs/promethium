import {
  Effect,
  EffectFn,
  EffectOptions,
  untracked,
} from "../signals/signals.js";

export type EffectTiming = "sync" | "macro" | "micro";

export type TimingStrategy = "first" | "subsequent" | "all";

class InternalAdaptedEffect extends Effect {
  constructor(fn: EffectFn, options?: EffectOptions) {
    super(fn, options);
  }
}

export type AdaptedEffect = Pick<InternalAdaptedEffect, "name" | "dispose">;

export interface AdaptEffectOptions {
  name?: EffectOptions["name"];
  deps?: () => any;
  defer?: boolean;
  timing?: EffectTiming;
  timingStrategy?: TimingStrategy;
}

function getScheduler(timing: EffectTiming): (cb: () => void) => void {
  if (timing === "micro") return queueMicrotask;
  if (timing === "macro") return (cb) => setTimeout(cb, 0);

  return (cb) => cb();
}

/**
 * Create a managed effect with configurable timing and dependency tracking.
 *
 * @param fn The effect body.
 * @param options Configuration for timing, dependencies, and deferral.
 */
export function adaptEffect(
  fn: () => void | (() => void),
  options?: AdaptEffectOptions
): AdaptedEffect {
  const {
    name,
    deps,
    defer,
    timing = "macro",
    timingStrategy = "all",
  } = options || {};
  if (defer && !deps) {
    throw new Error("The 'defer' option requires 'deps' to be provided.");
  }
  const isAsyncUpdates =
    timing !== "sync" &&
    (timingStrategy === "subsequent" || timingStrategy === "all");
  const isAsyncFirst =
    timing !== "sync" &&
    (timingStrategy === "first" || timingStrategy === "all");
  const scheduler = isAsyncUpdates ? getScheduler(timing) : undefined;
  let isFirst = true;
  const wrapper = () => {
    if (deps) {
      deps();
      if (isFirst) {
        isFirst = false;
        if (defer) return;
      }

      return untracked(fn);
    }
    isFirst = false;

    return fn();
  };
  const e = new InternalAdaptedEffect(wrapper, { scheduler, name });
  if (isAsyncFirst) {
    getScheduler(timing)(() => {
      try {
        e._callback();
      } catch (err) {
        e.dispose();
        throw err;
      }
    });
  } else {
    try {
      e._callback();
    } catch (err) {
      e.dispose();
      throw err;
    }
  }

  return e as AdaptedEffect;
}
