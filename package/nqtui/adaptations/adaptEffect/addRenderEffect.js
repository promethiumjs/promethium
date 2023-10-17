const renderEffectArray1 = [];
const renderEffectArray2 = [];
let one = true;
export default function addRenderEffect(fn) {
    const renderEffectArray = one ? renderEffectArray1 : renderEffectArray2;
    const newOne = one ? false : true;
    renderEffectArray.push(fn);
    if (renderEffectArray.length === 1) {
        queueMicrotask(() => {
            one = newOne;
            renderEffectArray.forEach((fn) => fn());
            renderEffectArray.length = 0;
        });
    }
}
