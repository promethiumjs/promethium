import sendSignal from "./sendSignal";
import get from "../get";
import { updateValueAndSendFreshNotifications } from "./updateValueAndSendFreshNotifications";
import { InternalMemoObject, MemoFn } from "./memoTypes";
import { Getter } from "../adaptState/stateTypes";

export default function adaptMemo<T extends U, U = T>(
  fn: MemoFn<T, U>
): Getter<T> {
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
