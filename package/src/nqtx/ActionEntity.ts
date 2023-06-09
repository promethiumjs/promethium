type Actions = {
  [key: string]: (payload: any) => any;
};
export default class ActionEntity<A extends Actions = Actions> {
  actions: A;

  constructor(actions: A) {
    this.actions = actions;
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(actionId: keyof A, payload: Parameters<A[keyof A]>[0]) {
    return this.actions[actionId](payload);
  }
}
