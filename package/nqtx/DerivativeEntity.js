import { getValue } from "../nqtui";
export default class DerivativeEntity {
    constructor(initialDerivativeFns) {
        this.derivatives = {};
        this.createDerivatives(initialDerivativeFns);
        this.adaptDerivative = this.adaptDerivative.bind(this);
        this.adaptDerivatives = this.adaptDerivatives.bind(this);
        this.adaptDerivativeValue = this.adaptDerivativeValue.bind(this);
        this.adaptDerivativeValues = this.adaptDerivativeValues.bind(this);
        this.createDerivative = this.createDerivative.bind(this);
        this.createDerivatives = this.createDerivatives.bind(this);
        this.deleteDerivative = this.deleteDerivative.bind(this);
        this.deleteDerivatives = this.deleteDerivatives.bind(this);
    }
    adaptDerivative(id) {
        return this.derivatives[id];
    }
    adaptDerivatives() {
        return Object.entries(this.derivatives);
    }
    adaptDerivativeValue(id) {
        return getValue(this.derivatives[id]);
    }
    adaptDerivativeValues() {
        const derivativeValues = {};
        Object.keys(this.derivatives).forEach((derivative) => (derivativeValues[derivative] = this.derivatives[derivative]()));
        return derivativeValues;
    }
    createDerivative(id, initialDerivativeFn) {
        if (this.derivatives[id] === undefined) {
            this.derivatives[id] = initialDerivativeFn;
        }
        return this.derivatives[id];
    }
    createDerivatives(derivatives) {
        if (derivatives) {
            Object.keys(derivatives).forEach((id) => {
                this.createDerivative(id, derivatives[id]);
            });
        }
    }
    deleteDerivative(id) {
        delete this.derivatives[id];
    }
    deleteDerivatives(ids) {
        ids.forEach((id) => this.deleteDerivative(id));
    }
}
