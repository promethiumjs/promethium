import DerivativeEntity from "./DerivativeEntity";
import ParticleEntity from "./ParticleEntity";
export type StateEntities = Record<string, ParticleEntity | DerivativeEntity>;
type Actions<S extends StateEntities> = {
    [key: string]: (payload: any, stateEntities: S) => any;
};
export default class ActionEntity<S extends StateEntities = StateEntities, A extends Actions<S> = Actions<S>> {
    private actions;
    private stateEntities;
    constructor(actions: A, stateEntities?: S);
    dispatch(id: keyof A, payload: Parameters<A[keyof A]>[0]): ReturnType<A[keyof A]>;
    adaptStateEntity<T extends keyof S>(id: T): S[T];
}
export {};
//# sourceMappingURL=ActionEntity.d.ts.map