import { Effect } from "./adaptEffect/effectTypes";

export default function observableSubscriptionsCleanup(effect: Effect) {
  effect.observableSubscriptionSets.forEach((observableSubscriptionSet) => {
    observableSubscriptionSet.delete(effect);
  });
  effect.observableSubscriptionSets.clear();
}
