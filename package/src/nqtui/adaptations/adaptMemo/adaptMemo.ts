import sendSignal from "./sendSignal";
import get from "../get";
import setInitialParameters from "../setInitialParameters";
import setCleanupSet from "../setCleanupSet";
import { updateValueAndSendFreshNotifications } from "./notifyAndUpdate";
import { Memo } from "./memoTypes";
import { Getter } from "../adaptState/stateTypes";

export default function adaptMemo<T = any>(fn: () => T): Getter<T> {
  const memo: Memo = {
    //state properties
    syncSubscriptions: {
      one: new Set(),
      two: new Set(),
    },
    memoSubscriptions: {
      one: new Set(),
      two: new Set(),
    },
    asyncAndRenderSubscriptions: new Set(),
    activeSubscriptions: "one",
    value: null,
    //effect properties
    firstRun: true,
    type: "memo",
    childCount: 0,
    position: null,
    level: null,
    cleanupTree: null,
    cleanupTreeNodePointer: null,
    observableSubscriptionSets: new Set(),
    staleStateValuesCount: 0,
    sendSignal: (signal) => sendSignal(memo, fn, signal),
  };

  setInitialParameters(memo);
  setCleanupSet(memo);

  const cleanupMemo = updateValueAndSendFreshNotifications(memo, fn);

  return cleanupMemo ? () => get<T>(cleanupMemo) : () => get<T>(memo);
}
