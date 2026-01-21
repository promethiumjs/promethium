import { SignalTypes } from "../adaptEffect/effectTypes.js";
import { InternalMemoObject, MemoFn } from "./memoTypes.js";
import { updateValueAndSendFreshNotifications } from "./updateValueAndSendFreshNotifications.js";
import { sendSignals } from "../sendSignals.js";

export function sendSignal<T>(
  memo: InternalMemoObject<T>,
  fn: MemoFn<T>,
  signal: SignalTypes
) {
  if (signal === "stale") {
    memo.staleStateValuesCount++;
    memo.falseAlarmSignalsCount++;
    if (memo.staleStateValuesCount === 1) {
      sendSignals(memo, "stale");
    }
  } else if (signal === "fresh" || signal === "falseAlarm") {
    memo.staleStateValuesCount--;
    if (signal === "falseAlarm") {
      memo.falseAlarmSignalsCount--;
    }
    if (memo.staleStateValuesCount <= 0) {
      if (memo.falseAlarmSignalsCount > 0) {
        updateValueAndSendFreshNotifications(memo, fn);
      } else {
        sendSignals(memo, "falseAlarm");
      }
      memo.staleStateValuesCount = 0;
      memo.falseAlarmSignalsCount = 0;
    }
  }
}
