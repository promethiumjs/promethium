import addAsyncEffect from "./addAsyncEffect";
import addRenderEffect from "./addRenderEffect";
export default function sendSignal(effect, execute, fn, signal, depArray) {
    if (signal === "stale") {
        effect.staleStateValuesCount++;
    }
    else if (signal === "fresh") {
        effect.staleStateValuesCount--;
        if (effect.staleStateValuesCount <= 0) {
            //to make sure "effect.stateStateValuesCount" doesn't go beyond zero
            effect.staleStateValuesCount = 0;
            executeMap[effect.type](effect, execute, fn, depArray);
        }
    }
}
const executeMap = {
    sync: (effect, execute, fn, depArray) => execute(effect, fn, depArray),
    async: (effect, execute, fn, depArray) => addAsyncEffect(() => execute(effect, fn, depArray)),
    render: (effect, execute, fn, depArray) => addRenderEffect(() => execute(effect, fn, depArray)),
};
