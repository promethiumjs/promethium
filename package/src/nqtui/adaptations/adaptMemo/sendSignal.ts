import { SignalTypes } from "../adaptEffect/effectTypes";
import { InternalMemoObject } from "./memoTypes";
import { updateValueAndSendFreshNotifications } from "./updateValueAndSendFreshNotifications";
import { sendSignals } from "../sendSignals";

export default function sendSignal(
  memo: InternalMemoObject,
  fn: (prev?: any) => any,
  signal: SignalTypes,
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
