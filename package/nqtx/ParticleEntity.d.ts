import { State } from "../nqtui";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";
declare type ParticleValues = {
    [key: string]: any;
};
declare type Particles<PV> = {
    [ParticleValue in keyof PV]: State<PV[ParticleValue]>;
};
export default class ParticleEntity<PV extends ParticleValues = ParticleValues> {
    private particles;
    constructor(initialParticleValues: PV);
    adaptParticle<T extends keyof PV>(id: T): State<PV[T]>;
    adaptParticle<T extends keyof PV>(id: T, initialValue: NonNullable<PV[T]>): State<NonNullable<PV[T]>>;
    private createParticles;
    deleteParticles(particleIds: Array<OptionalLiteralKeys<PV> | Deletable>): void;
    getParticleValues(): ParticleValues;
    getParticles(): Particles<PV>;
}
export {};
//# sourceMappingURL=ParticleEntity.d.ts.map