import { EffectFn, EffectOptions, ExecuteFn, DepArray } from "./effectTypes";
import createEffect from "./createEffect";

export default function adaptEffect<T extends unknown[], V extends U, U = V>(
  fn: EffectFn<T, undefined | NoInfer<U>, V>,
  depArray?: DepArray<T>,
  options?: EffectOptions
) {
  //determine if the effect is tracked by the state it uses implicitly, or using the
  //state provided by its dependency array
  const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";

  const [execute, effect] = createEffect("async", tracking, fn, depArray);

  //execute effect asynchronously after next screen paint and return a promise that
  //resolves with the cleanup function / component cleanup array
  return new Promise<() => void>((resolve) =>
    setTimeout(() => {
      resolve(execute(effect, fn, depArray!, options) as ReturnType<ExecuteFn>);
    })
  );
}
