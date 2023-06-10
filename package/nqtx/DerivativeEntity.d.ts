import { Getter } from "../nqtui";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";
declare type DerivativeFns = {
    [key: string]: () => Getter<any>;
};
declare type DerivativeValues<DF extends DerivativeFns> = {
    [DerivativeFn in keyof DF]: ReturnType<ReturnType<DF[DerivativeFn]>>;
};
declare type Derivatives<DF extends DerivativeFns> = {
    [DerivativeFn in keyof DF]: ReturnType<DF[DerivativeFn]>;
};
export default class DerivativeEntity<DF extends DerivativeFns = DerivativeFns> {
    derivatives: Derivatives<DF>;
    constructor(initialDerivativeFns: DF);
    createDerivatives(derivativeFns: Partial<DF>): void;
    adaptDerivative<T extends keyof DF>(id: T): undefined extends DF[T] ? Getter<ReturnType<ReturnType<NonNullable<DF[T]>>> | undefined> : ReturnType<DF[T]>;
    adaptDerivative<T extends keyof DF>(id: T, initialDerivativeFn: NonNullable<DF[T]>): ReturnType<NonNullable<DF[T]>>;
    deleteDerivatives(derivativeIds: Array<OptionalLiteralKeys<DF> | Deletable>): void;
    getDerivativeValues(): DerivativeValues<DF>;
}
export {};
//# sourceMappingURL=DerivativeEntity.d.ts.map