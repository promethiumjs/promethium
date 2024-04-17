import DerivativeEntity from "./DerivativeEntity";
import ParticleEntity from "./ParticleEntity";

export type StateEntities = Record<string, ParticleEntity | DerivativeEntity>;

type Actions<S extends StateEntities> = {
  [key: string]: (payload: any, stateEntities: S) => any;
};

export default class ActionEntity<
  S extends StateEntities = StateEntities,
  A extends Actions<S> = Actions<S>,
> {
  private actions: A;
  private stateEntities: S;

  constructor(actions: A, stateEntities?: S) {
    this.actions = actions;
    this.stateEntities = stateEntities ?? ({} as S);
    this.dispatch = this.dispatch.bind(this);
    this.adaptStateEntity = this.adaptStateEntity.bind(this);
  }

  dispatch<T extends keyof A>(
    id: T,
    payload: Parameters<A[T]>[0],
  ): ReturnType<A[T]> {
    return this.actions[id](payload, this.stateEntities);
  }

  adaptStateEntity<T extends keyof S>(id: T): S[T] {
    return this.stateEntities[id] as S[T];
  }
}
