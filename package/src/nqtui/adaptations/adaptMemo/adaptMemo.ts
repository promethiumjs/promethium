import sendSignal from "./sendSignal";
import get from "../get";
import setInitialParameters from "../setInitialParameters";
import setCleanupSet from "../setCleanupSet";
import { updateValueAndSendFreshNotifications } from "./notifyAndUpdate";
import { InternalMemoObject } from "./memoTypes";
import { Getter } from "../adaptState/stateTypes";

export default function adaptMemo<T = any>(fn: (prev?: T) => T): Getter<T> {
  const memo: InternalMemoObject = {
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
    value: undefined,
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
    falseAlarmSignalsCount: 0,
    sendSignal: (signal) => sendSignal(memo, fn, signal),
  };

  setInitialParameters(memo);
  setCleanupSet(memo);

  let freshMemoRun = true;
  let cleanupMemo: InternalMemoObject | undefined;

  return () => {
    if (freshMemoRun === true) {
      cleanupMemo = updateValueAndSendFreshNotifications(memo, fn);
      freshMemoRun = false;
    }

    return (cleanupMemo ? get<T>(cleanupMemo) : get<T>(memo)) as T;
  };
}
