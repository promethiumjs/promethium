import sendSignal from "./sendSignal";
import get from "../get";
import { updateValueAndSendFreshNotifications } from "./updateValueAndSendFreshNotifications";
import { InternalMemoObject } from "./memoTypes";
import { Getter } from "../adaptState/stateTypes";

export default function adaptMemo<T = any>(fn: (prev?: T) => T): Getter<T> {
  const memo: InternalMemoObject = {
    //state properties
    syncSubscriptions: new Set(),
    memoSubscriptions: new Set(),
    asyncAndRenderSubscriptions: new Set(),
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

  let freshMemoRun = true;

  return () => {
    if (freshMemoRun === true) {
      updateValueAndSendFreshNotifications(memo, fn);
      freshMemoRun = false;
    }

    return get<T>(memo) as T;
  };
}
