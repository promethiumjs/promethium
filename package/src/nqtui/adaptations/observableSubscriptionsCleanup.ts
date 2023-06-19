import { InternalEffectObject } from "./adaptEffect/effectTypes";

export default function observableSubscriptionsCleanup(
  effect: InternalEffectObject
) {
  effect.observableSubscriptionSets.forEach((observableSubscriptionSet) => {
    observableSubscriptionSet.delete(effect);
  });
  effect.observableSubscriptionSets.clear();
}
