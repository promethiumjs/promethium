export default function setCleanupSet(effect) {
    var _a;
    //create variable to store `cleanupNode` of effect and initially set the variable to the cleanup tree
    let cleanupNode = effect.cleanupTree;
    //extract the `cleanupNode` from the `cleanupTree` and set it to the `cleanupNode` variable
    (_a = effect.cleanupTreeNodePointer) === null || _a === void 0 ? void 0 : _a.forEach((part) => {
        if (!(cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.get(part))) {
            cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.set(part, new Map());
        }
        cleanupNode = cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.get(part);
    });
    //set cleanup set for effect if it doesn't already exist in the cleanup map
    if (!(cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.get(0))) {
        cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.set(0, new Set());
    }
}
