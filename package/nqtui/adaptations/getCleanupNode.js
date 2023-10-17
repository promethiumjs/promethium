//use `cleanupTreeNodePointer` of effect to get `cleanupNode` of effect
//this is basically the cleanup tree for the effect tree that begins with this effect
export default function getCleanupNode(effect) {
    var _a;
    let cleanupNode = effect.cleanupTree;
    (_a = effect.cleanupTreeNodePointer) === null || _a === void 0 ? void 0 : _a.forEach((part) => {
        cleanupNode = cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.get(part);
    });
    return cleanupNode;
}
