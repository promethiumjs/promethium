export default function observableSubscriptionsCleanup(effect) {
    effect.observableSubscriptionSets.forEach((observableSubscriptionSet) => {
        observableSubscriptionSet.delete(effect);
    });
    effect.observableSubscriptionSets.clear();
}
