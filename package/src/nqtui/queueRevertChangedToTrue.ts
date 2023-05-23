import { AsyncDirective } from "lit-html/async-directive";

type hAsyncDirective = AsyncDirective & { changed: boolean };

const changedArray1: hAsyncDirective[] = [];
const changedArray2: hAsyncDirective[] = [];
let one = true;

export default function queueRevertChangedToTrue(
  componentAsyncDirective: hAsyncDirective
) {
  const changedArray = one ? changedArray1 : changedArray2;
  const newOne = one ? false : true;

  changedArray.push(componentAsyncDirective);

  if (changedArray.length === 1) {
    queueMicrotask(() => {
      one = newOne;
      changedArray.forEach(
        (componentAsyncDirective) => (componentAsyncDirective.changed = true)
      );
      changedArray.length = 0;
    });
  }
}
