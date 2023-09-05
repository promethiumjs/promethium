declare type Actions = {
    [key: string]: (payload: any) => any;
};
export default class ActionEntity<A extends Actions = Actions> {
    actions: A;
    constructor(actions: A);
    dispatch(actionId: keyof A, payload: Parameters<A[keyof A]>[0]): ReturnType<A[keyof A]>;
}
export {};
//# sourceMappingURL=ActionEntity.d.ts.map