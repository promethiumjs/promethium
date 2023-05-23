import { Memo } from "./memoTypes";
import {
  sendStaleNotifications,
  updateValueAndSendFreshNotifications,
} from "./notifyAndUpdate";

export default function sendSignal(
  memo: Memo,
  fn: () => any,
  signal: "stale" | "fresh"
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
