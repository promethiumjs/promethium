const asyncEffectArray1: (() => void)[] = [];
const asyncEffectArray2: (() => void)[] = [];
let one = true;

export default function addAsyncEffect(fn: () => void) {
  const asyncEffectArray = one ? asyncEffectArray1 : asyncEffectArray2;
  const newOne = one ? false : true;

  asyncEffectArray.push(fn);

  if (asyncEffectArray.length === 1) {
    setTimeout(() => {
      one = newOne;
      asyncEffectArray.forEach((fn: () => void) => fn());
      asyncEffectArray.length = 0;
    });
  }
}
