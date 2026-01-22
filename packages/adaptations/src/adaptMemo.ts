import { sendSignal } from "./sendSignal.js";
import { get } from "../get.js";
import { updateValueAndSendFreshNotifications } from "./updateValueAndSendFreshNotifications.js";
import { InternalMemoObject, MemoFn } from "./memoTypes.js";
import { Getter } from "../adaptState/stateTypes.js";

export function adaptMemo<T>(fn: MemoFn<T>): Getter<T> {
  const memo: InternalMemoObject<T> = {
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

  updateValueAndSendFreshNotifications(memo, fn);

  return () => get<T>(memo) as T;
}
