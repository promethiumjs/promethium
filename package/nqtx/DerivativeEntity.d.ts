import { Deletable, OptionalLiteralKeys } from "./entityTypes";
declare type Derivatives = {
    [key: string]: () => any;
};
declare type DerivativeValues<D extends Derivatives> = {
    [Derivative in keyof D]: ReturnType<D[Derivative]>;
};
export default class DerivativeEntity<D extends Derivatives = Derivatives> {
    private derivatives;
    constructor(initialDerivativeFns: D);
    private createDerivatives;
    adaptDerivative<T extends keyof D>(id: T): undefined extends D[T] ? () => ReturnType<NonNullable<D[T]>> | undefined : D[T];
    adaptDerivative<T extends keyof D>(id: T, initialDerivativeFn: NonNullable<D[T]>): NonNullable<D[T]>;
    deleteDerivatives(derivativeIds: Array<OptionalLiteralKeys<D> | Deletable>): void;
    getDerivativeValues(): DerivativeValues<D>;
    getDerivatives(): D;
}
export {};
//# sourceMappingURL=DerivativeEntity.d.ts.map