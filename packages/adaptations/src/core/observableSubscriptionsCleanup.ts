import { InternalEffectObject } from "./adaptEffect/effectTypes.js";

export function observableSubscriptionsCleanup(effect: InternalEffectObject) {
  effect.observableSubscriptionSets.forEach((observableSubscriptionSet) => {
    observableSubscriptionSet.delete(effect);
  });
  effect.observableSubscriptionSets.clear();
}
