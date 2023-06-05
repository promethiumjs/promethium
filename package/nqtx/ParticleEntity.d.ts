import { StateTuple } from "./../nqtui/adaptations/adaptState/stateTypes";
declare type OptionalLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never]: 0;
};
declare type ParticleValues = {
    [key: string]: any;
};
declare type Particles<PV> = {
    [ParticleValue in keyof PV]: StateTuple<PV[ParticleValue]>;
};
export declare type Deletable = string & {
    deletable: true;
};
export default class ParticleEntity<PV extends ParticleValues = ParticleValues> {
    particles: Particles<PV>;
    constructor(initialParticleValues: PV);
    createParticles(particleValues: Partial<PV>): void;
    adaptParticle<T extends keyof PV>(id: T): StateTuple<PV[T]>;
    adaptParticle<T extends keyof PV>(options: {
        id: T;
        initialValue: NonNullable<PV[T]>;
    }): StateTuple<NonNullable<PV[T]>>;
    deleteParticles(particleIds: Array<OptionalLiteralKeys<PV> | Deletable>): void;
}
export {};
//# sourceMappingURL=ParticleEntity.d.ts.map