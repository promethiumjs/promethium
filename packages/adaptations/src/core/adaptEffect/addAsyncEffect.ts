const asyncEffectArray1: any = [];
const asyncEffectArray2: any = [];
let one = true;

export default function addAsyncEffect(fn: any) {
  const asyncEffectArray = one ? asyncEffectArray1 : asyncEffectArray2;
  const newOne = one ? false : true;

  asyncEffectArray.push(fn);

  if (asyncEffectArray.length === 1) {
    setTimeout(() => {
      one = newOne;
      asyncEffectArray.forEach((fn: any) => fn());
      asyncEffectArray.length = 0;
    });
  }
}
