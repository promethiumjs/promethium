import { InternalMemoObject } from "./memoTypes";
export declare function sendStaleNotifications(memo: InternalMemoObject): void;
export declare function updateValueAndSendFreshNotifications(memo: InternalMemoObject, fn: (prev?: any) => any): InternalMemoObject | undefined;
//# sourceMappingURL=notifyAndUpdate.d.ts.map