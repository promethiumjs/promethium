import { State, Getter, Setter } from "../nqtui";
import { Deletable, OptionalLiteralKeys, RequiredLiteralKeys } from "./entityTypes";
declare type ParticleValues = {
    [key: string]: any;
};
declare type ReturnedParticleValues<PV> = {
    [T in keyof PV]: T extends RequiredLiteralKeys<PV> ? PV[T] : PV[T] | undefined;
};
export default class ParticleEntity<PV extends ParticleValues = ParticleValues> {
    private particles;
    constructor(initialParticleValues: PV);
    adaptParticle<T extends keyof PV>(id: T): T extends RequiredLiteralKeys<PV> ? State<Exclude<PV[T], undefined>> : State<Exclude<PV[T], undefined>> | undefined;
    adaptParticleGetter<T extends keyof PV>(id: T): T extends RequiredLiteralKeys<PV> ? Getter<Exclude<PV[T], undefined>> : Getter<Exclude<PV[T], undefined>> | undefined;
    adaptParticles(): [keyof PV, State<Exclude<PV[keyof PV], undefined>>][];
    adaptParticleSetter<T extends keyof PV>(id: T): T extends RequiredLiteralKeys<PV> ? Setter<Exclude<PV[T], undefined>> : Setter<Exclude<PV[T], undefined>> | undefined;
    adaptParticleValue<T extends keyof PV>(id: T): T extends RequiredLiteralKeys<PV> ? PV[T] : PV[T] | undefined;
    adaptParticleValues(): ReturnedParticleValues<PV>;
    createParticle<T extends keyof PV>(id: T, initialValue: PV[T]): State<Exclude<PV[T], undefined>>;
    private createParticles;
    deleteParticle(id: OptionalLiteralKeys<PV> | Deletable): void;
    deleteParticles(ids: Array<OptionalLiteralKeys<PV> | Deletable>): void;
}
export {};
//# sourceMappingURL=ParticleEntity.d.ts.map