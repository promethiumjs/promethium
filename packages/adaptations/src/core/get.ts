import { effectContexts } from "./effectContexts";
import { InternalStateObject } from "./adaptState/stateTypes";
import { InternalEffectObject } from "./adaptEffect/effectTypes";

function subscribe<T = any>(
  state: InternalStateObject<T>,
  effect: InternalEffectObject,
) {
  //get active subscriptions to properly manage sync effects and memos
  const type = effect.type;

  //if `effect.tracking` is equal to "depArray", don't track effects because the tracking
  //will be done explicitly using the provided dependency array
  if (effect.tracking === "depArray") return;

  //track effects using the right subscription sets, based on whether they are async, render,
  //sync effects, or memos
  if (type === "async" || type === "render") {
    //tracking async and render effects
    state.asyncAndRenderSubscriptions.add(effect);
    effect.observableSubscriptionSets.add(state.asyncAndRenderSubscriptions);
  } else {
    //tracking sync effects and memos
    state[`${type}Subscriptions`].add(effect);
    effect.observableSubscriptionSets.add(state[`${type}Subscriptions`]);
  }
}

export default function get<T = any>(state: InternalStateObject<T>) {
  const currentEffect = effectContexts[effectContexts.length - 1];
  if (currentEffect) {
    subscribe(state, currentEffect);
  }

  return state.value;
}
