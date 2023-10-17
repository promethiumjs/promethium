import getCleanupNode from "../getCleanupNode";
function traverseAndEvaluate(cleanupNode) {
    let nextChildNode = 0;
    while (cleanupNode === null || cleanupNode === void 0 ? void 0 : cleanupNode.get(nextChildNode)) {
        if (nextChildNode === 0) {
            const cleanupSet = cleanupNode.get(0);
            cleanupSet.forEach((cleanup) => {
                cleanup();
            });
            cleanupSet.clear();
        }
        else {
            const nextCleanupNode = cleanupNode.get(nextChildNode);
            traverseAndEvaluate(nextCleanupNode);
        }
        nextChildNode++;
    }
}
export default function effectAndDescendantCleanup(effect) {
    const cleanupNode = getCleanupNode(effect);
    traverseAndEvaluate(cleanupNode);
}
