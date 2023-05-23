import getCleanupNode from "../getCleanupNode";
import { CleanupTree, Effect } from "./effectTypes";

function traverseAndEvaluate(cleanupNode: CleanupTree) {
  let nextChildNode = 0;
  while (cleanupNode.get(nextChildNode)) {
    if (nextChildNode === 0) {
      const cleanupSet = cleanupNode.get(0) as Set<() => void>;
      cleanupSet.forEach((cleanup) => {
        cleanup();
      });
      cleanupSet.clear();
    } else {
      const nextCleanupNode = cleanupNode.get(nextChildNode) as CleanupTree;
      traverseAndEvaluate(nextCleanupNode);
    }

    nextChildNode++;
  }
}

export default function effectAndDescendantCleanup(effect: Effect) {
  const cleanupNode = getCleanupNode(effect);
  traverseAndEvaluate(cleanupNode);
}
