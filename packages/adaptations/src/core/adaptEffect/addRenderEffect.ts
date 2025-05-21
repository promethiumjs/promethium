const renderEffectArray1: (() => void)[] = [];
const renderEffectArray2: (() => void)[] = [];
let one = true;

export default function addRenderEffect(fn: () => void) {
  const renderEffectArray = one ? renderEffectArray1 : renderEffectArray2;
  const newOne = one ? false : true;

  renderEffectArray.push(fn);

  if (renderEffectArray.length === 1) {
    queueMicrotask(() => {
      one = newOne;
      renderEffectArray.forEach((fn: () => void) => fn());
      renderEffectArray.length = 0;
    });
  }
}
