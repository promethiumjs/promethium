export function unify(state) {
    if (state !== undefined) {
        function unifiedState(nextValue) {
            if (nextValue === undefined) {
                return state[0]();
            }
            else {
                return state[1](nextValue);
            }
        }
        return unifiedState;
    }
    else {
        return undefined;
    }
}
export function getValue(stateOrGetter) {
    if (stateOrGetter !== undefined) {
        if (typeof stateOrGetter === "function") {
            return stateOrGetter();
        }
        else {
            return stateOrGetter[0]();
        }
    }
    else {
        return undefined;
    }
}
export function getGetter(state) {
    if (state !== undefined) {
        return state[0];
    }
    else {
        return undefined;
    }
}
export function getSetter(state) {
    if (state !== undefined) {
        return state[1];
    }
    else {
        return undefined;
    }
}
