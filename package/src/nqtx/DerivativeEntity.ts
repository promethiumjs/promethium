import { Deletable, OptionalLiteralKeys } from "./entityTypes";

type Derivatives = {
  [key: string]: () => any;
};

type DerivativeValues<D extends Derivatives> = {
  [Derivative in keyof D]: ReturnType<D[Derivative]>;
};

type CompleteAdaptDerivativeReturnType<
  D extends Derivatives,
  T extends keyof D
> =
  | D[T]
  | NonNullable<D[T]>
  | (() => ReturnType<NonNullable<D[T]>> | undefined);

export default class DerivativeEntity<D extends Derivatives = Derivatives> {
  private derivatives: D;

  constructor(initialDerivativeFns: D) {
    this.derivatives = {} as D;
    this.createDerivatives(initialDerivativeFns);
    this.adaptDerivative = this.adaptDerivative.bind(this);
    this.deleteDerivatives = this.deleteDerivatives.bind(this);
    this.getDerivativeValues = this.getDerivativeValues.bind(this);
  }

  private createDerivatives(derivatives: Partial<D>) {
    if (derivatives) {
      Object.keys(derivatives).forEach((derivative: keyof D) => {
        this.derivatives[derivative] = derivatives[derivative] as D[keyof D];
      });
    }
  }

  adaptDerivative<T extends keyof D>(
    id: T
  ): undefined extends D[T]
    ? () => ReturnType<NonNullable<D[T]>> | undefined
    : D[T];
  adaptDerivative<T extends keyof D>(
    id: T,
    initialDerivativeFn: NonNullable<D[T]>
  ): NonNullable<D[T]>;
  adaptDerivative<T extends keyof D>(
    id: T,
    initialDerivativeFn?: D[T]
  ): CompleteAdaptDerivativeReturnType<D, T> {
    if (this.derivatives[id] === undefined) {
      const fallBackDerivativeFn = () => undefined;
      this.createDerivatives({
        [id as keyof D]: (initialDerivativeFn ||
          fallBackDerivativeFn) as D[keyof D],
      } as Partial<D>);
    }

    return this.derivatives[id] as D[T];
  }

  deleteDerivatives(derivativeIds: Array<OptionalLiteralKeys<D> | Deletable>) {
    derivativeIds.forEach(
      (derivativeId) => delete this.derivatives[derivativeId as keyof D]
    );
  }

  getDerivativeValues() {
    const derivativeValues = {} as DerivativeValues<D>;
    Object.keys(this.derivatives).forEach(
      (derivative: keyof DerivativeValues<D>) =>
        (derivativeValues[derivative] = this.derivatives[derivative]())
    );

    return derivativeValues;
  }

  getDerivatives() {
    return this.derivatives;
  }
}
