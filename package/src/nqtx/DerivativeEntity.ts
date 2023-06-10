import { Getter, adaptMemo } from "../nqtui";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";

type DerivativeFns = {
  [key: string]: () => Getter<any>;
};

type DerivativeValues<DF extends DerivativeFns> = {
  [DerivativeFn in keyof DF]: ReturnType<ReturnType<DF[DerivativeFn]>>;
};

type Derivatives<DF extends DerivativeFns> = {
  [DerivativeFn in keyof DF]: ReturnType<DF[DerivativeFn]>;
};

type CompleteAdaptDerivativeReturnType<
  DF extends DerivativeFns,
  T extends keyof DF
> =
  | ReturnType<DF[T]>
  | ReturnType<NonNullable<DF[T]>>
  | Getter<ReturnType<ReturnType<NonNullable<DF[T]>>> | undefined>;

export default class DerivativeEntity<
  DF extends DerivativeFns = DerivativeFns
> {
  derivatives: Derivatives<DF>;

  constructor(initialDerivativeFns: DF) {
    this.derivatives = {} as Derivatives<DF>;
    this.createDerivatives(initialDerivativeFns);
    this.adaptDerivative = this.adaptDerivative.bind(this);
    this.deleteDerivatives = this.deleteDerivatives.bind(this);
    this.getDerivativeValues = this.getDerivativeValues.bind(this);
  }

  createDerivatives(derivativeFns: Partial<DF>) {
    if (derivativeFns) {
      Object.keys(derivativeFns).forEach((derivativeFn: keyof DF) => {
        this.derivatives[derivativeFn] = derivativeFns[
          derivativeFn
        ]?.() as ReturnType<DF[keyof DF]>;
      });
    }
  }

  adaptDerivative<T extends keyof DF>(
    id: T
  ): undefined extends DF[T]
    ? Getter<ReturnType<ReturnType<NonNullable<DF[T]>>> | undefined>
    : ReturnType<DF[T]>;
  adaptDerivative<T extends keyof DF>(
    id: T,
    initialDerivativeFn: NonNullable<DF[T]>
  ): ReturnType<NonNullable<DF[T]>>;
  adaptDerivative<T extends keyof DF>(
    id: T,
    initialDerivativeFn?: DF[T]
  ): CompleteAdaptDerivativeReturnType<DF, T> {
    if (this.derivatives[id] === undefined) {
      const fallBackDerivativeFn = () => adaptMemo(() => undefined);
      this.createDerivatives({
        [id as keyof DF]: (initialDerivativeFn ||
          fallBackDerivativeFn) as DF[keyof DF],
      } as Partial<DF>);
    }

    return this.derivatives[id] as ReturnType<DF[T]>;
  }

  deleteDerivatives(derivativeIds: Array<OptionalLiteralKeys<DF> | Deletable>) {
    derivativeIds.forEach(
      (derivativeId) => delete this.derivatives[derivativeId as keyof DF]
    );
  }

  getDerivativeValues() {
    const derivativeValues = {} as DerivativeValues<DF>;
    Object.keys(this.derivatives).forEach(
      (derivative) =>
        (derivativeValues[derivative as keyof DerivativeValues<DF>] =
          this.derivatives[derivative]())
    );

    return derivativeValues;
  }
}
