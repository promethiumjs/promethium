import { Deletable, OptionalLiteralKeys, RequiredLiteralKeys } from "./entityTypes";
declare type Derivatives = {
    [key: string]: () => any;
};
declare type DerivativeValues<D extends Derivatives> = {
    [T in keyof D]: T extends RequiredLiteralKeys<D> ? ReturnType<Exclude<D[T], undefined>> : ReturnType<Exclude<D[T], undefined>> | undefined;
};
export default class DerivativeEntity<D extends Derivatives = Derivatives> {
    private derivatives;
    constructor(initialDerivativeFns: D);
    adaptDerivative<T extends keyof D>(id: T): T extends RequiredLiteralKeys<D> ? Exclude<D[T], undefined> : Exclude<D[T], undefined> | undefined;
    adaptDerivatives(): [keyof D, Exclude<D[keyof D], undefined>][];
    adaptDerivativeValue<T extends keyof D>(id: T): T extends RequiredLiteralKeys<D> ? ReturnType<Exclude<D[T], undefined>> : ReturnType<Exclude<D[T], undefined>> | undefined;
    adaptDerivativeValues(): DerivativeValues<D>;
    createDerivative<T extends keyof D>(id: T, initialDerivativeFn: D[T]): Exclude<D[T], undefined>;
    createDerivatives(derivatives: Partial<D>): void;
    deleteDerivative(id: OptionalLiteralKeys<D> | Deletable): void;
    deleteDerivatives(ids: Array<OptionalLiteralKeys<D> | Deletable>): void;
}
export {};
//# sourceMappingURL=DerivativeEntity.d.ts.map