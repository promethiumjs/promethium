import { StateTuple } from "./../nqtui/adaptations/adaptState/stateTypes";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";
declare type ParticleValues = {
    [key: string]: any;
};
declare type Particles<PV> = {
    [ParticleValue in keyof PV]: StateTuple<PV[ParticleValue]>;
};
export default class ParticleEntity<PV extends ParticleValues = ParticleValues> {
    particles: Particles<PV>;
    constructor(initialParticleValues: PV);
    adaptParticle<T extends keyof PV>(id: T): StateTuple<PV[T]>;
    adaptParticle<T extends keyof PV>(id: T, initialValue: NonNullable<PV[T]>): StateTuple<NonNullable<PV[T]>>;
    createParticles(particleValues: Partial<PV>): void;
    deleteParticles(particleIds: Array<OptionalLiteralKeys<PV> | Deletable>): void;
    getParticleValues(): ParticleValues;
}
export {};
//# sourceMappingURL=ParticleEntity.d.ts.map