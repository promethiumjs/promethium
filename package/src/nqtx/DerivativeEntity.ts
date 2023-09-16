import { getValue } from "../nqtui";
import {
  Deletable,
  OptionalLiteralKeys,
  RequiredLiteralKeys,
} from "./entityTypes";

type Derivatives = {
  [key: string]: () => any;
};

type DerivativeValues<D extends Derivatives> = {
  [T in keyof D]: T extends RequiredLiteralKeys<D>
    ? ReturnType<Exclude<D[T], undefined>>
    : ReturnType<Exclude<D[T], undefined>> | undefined;
};

export default class DerivativeEntity<D extends Derivatives = Derivatives> {
  private derivatives: D;

  constructor(initialDerivativeFns: D) {
    this.derivatives = {} as D;
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

  adaptDerivative<T extends keyof D>(
    id: T
  ): T extends RequiredLiteralKeys<D>
    ? Exclude<D[T], undefined>
    : Exclude<D[T], undefined> | undefined {
    return this.derivatives[id] as T extends RequiredLiteralKeys<D>
      ? Exclude<D[T], undefined>
      : Exclude<D[T], undefined> | undefined;
  }

  adaptDerivatives(): [keyof D, Exclude<D[keyof D], undefined>][] {
    return Object.entries(this.derivatives) as [
      keyof D,
      Exclude<D[keyof D], undefined>
    ][];
  }

  adaptDerivativeValue<T extends keyof D>(
    id: T
  ): T extends RequiredLiteralKeys<D>
    ? ReturnType<Exclude<D[T], undefined>>
    : ReturnType<Exclude<D[T], undefined>> | undefined {
    return getValue(this.derivatives[id]);
  }

  adaptDerivativeValues() {
    const derivativeValues = {} as DerivativeValues<D>;
    Object.keys(this.derivatives).forEach(
      (derivative: keyof DerivativeValues<D>) =>
        (derivativeValues[derivative] = this.derivatives[derivative]())
    );

    return derivativeValues;
  }

  createDerivative<T extends keyof D>(
    id: T,
    initialDerivativeFn: D[T]
  ): Exclude<D[T], undefined> {
    if (this.derivatives[id] === undefined) {
      this.derivatives[id] = initialDerivativeFn;
    }

    return this.derivatives[id] as Exclude<D[T], undefined>;
  }

  createDerivatives(derivatives: Partial<D>) {
    if (derivatives) {
      Object.keys(derivatives).forEach((id: keyof D) => {
        this.createDerivative(id, derivatives[id] as D[keyof D]);
      });
    }
  }

  deleteDerivative(id: OptionalLiteralKeys<D> | Deletable) {
    delete this.derivatives[id as keyof D];
  }

  deleteDerivatives(ids: Array<OptionalLiteralKeys<D> | Deletable>) {
    ids.forEach((id) => this.deleteDerivative(id));
  }
}
