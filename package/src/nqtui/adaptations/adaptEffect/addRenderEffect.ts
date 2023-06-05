const renderEffectArray1: any = [];
const renderEffectArray2: any = [];
let one = true;

export default function addRenderEffect(fn: any) {
  const renderEffectArray = one ? renderEffectArray1 : renderEffectArray2;
  const newOne = one ? false : true;

  renderEffectArray.push(fn);

  if (renderEffectArray.length === 1) {
    queueMicrotask(() => {
      one = newOne;
      renderEffectArray.forEach((fn: any) => fn());
      renderEffectArray.length = 0;
    });
  }
}
