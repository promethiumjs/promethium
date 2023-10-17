export default class ActionEntity {
    constructor(actions, stateEntities) {
        this.actions = actions;
        this.stateEntities = stateEntities !== null && stateEntities !== void 0 ? stateEntities : {};
        this.dispatch = this.dispatch.bind(this);
        this.adaptStateEntity = this.adaptStateEntity.bind(this);
    }
    dispatch(id, payload) {
        return this.actions[id](payload, this.stateEntities);
    }
    adaptStateEntity(id) {
        return this.stateEntities[id];
    }
}
