const asyncEffectArray1: any = [];
const asyncEffectArray2 = [];
let one = true;

export default function addAsyncEffect(fn: any) {
  const asyncEffectArray = one ? asyncEffectArray1 : asyncEffectArray2;
  const newOne = one ? false : true;

  asyncEffectArray.push(fn);

  if (asyncEffectArray.length === 1) {
    queueMicrotask(() => {
      one = newOne;
      asyncEffectArray.forEach((fn) => fn());
      asyncEffectArray.length = 0;
    });
  }
}
