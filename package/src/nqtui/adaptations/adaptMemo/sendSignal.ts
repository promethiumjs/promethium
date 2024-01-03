import { SignalTypes } from "../adaptEffect/effectTypes";
import { InternalMemoObject } from "./memoTypes";
import {
  sendStaleNotifications,
  updateValueAndSendFreshNotifications,
} from "./notifyAndUpdate";

export default function sendSignal(
  memo: InternalMemoObject,
  fn: (prev?: any) => any,
  signal: SignalTypes,
) {
  if (signal === "stale") {
    memo.staleStateValuesCount++;
    if (memo.staleStateValuesCount === 1) {
      sendStaleNotifications(memo);
    }
  } else if (signal === "fresh") {
    memo.staleStateValuesCount--;
    if (memo.staleStateValuesCount <= 0) {
      //to make sure "memo.stateStateValuesCount" doesn't go beyond zero
      memo.staleStateValuesCount = 0;
      updateValueAndSendFreshNotifications(memo, fn);
    }
  }
}
