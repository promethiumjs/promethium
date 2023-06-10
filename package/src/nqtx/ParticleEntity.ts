import { StateTuple } from "./../nqtui/adaptations/adaptState/stateTypes";
import { adaptState } from "../nqtui";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";

type ParticleValues = {
  [key: string]: any;
};

type Particles<PV> = {
  [ParticleValue in keyof PV]: StateTuple<PV[ParticleValue]>;
};

export default class ParticleEntity<
  PV extends ParticleValues = ParticleValues
> {
  particles: Particles<PV>;

  constructor(initialParticleValues: PV) {
    this.particles = {} as Particles<PV>;
    this.createParticles(initialParticleValues);
    this.adaptParticle = this.adaptParticle.bind(this);
    this.deleteParticles = this.deleteParticles.bind(this);
    this.getParticleValues = this.getParticleValues.bind(this);
  }

  adaptParticle<T extends keyof PV>(id: T): StateTuple<PV[T]>;
  adaptParticle<T extends keyof PV>(
    id: T,
    initialValue: NonNullable<PV[T]>
  ): StateTuple<NonNullable<PV[T]>>;
  adaptParticle<T extends keyof PV>(
    id: T,
    initialValue?: PV[T]
  ): StateTuple<PV[T]> | StateTuple<NonNullable<PV[T]>> {
    if (this.particles[id] === undefined) {
      this.createParticles({
        [id as keyof PV]: initialValue as PV[keyof PV],
      } as Partial<PV>);
    }

    return this.particles[id] as StateTuple<PV[T]>;
  }

  createParticles(particleValues: Partial<PV>) {
    if (particleValues) {
      Object.keys(particleValues).forEach((particleValue: keyof PV) => {
        this.particles[particleValue] = adaptState(
          particleValues[particleValue]
        ) as StateTuple<PV[keyof PV]>;
      });
    }
  }

  deleteParticles(particleIds: Array<OptionalLiteralKeys<PV> | Deletable>) {
    particleIds.forEach(
      (particleId) => delete this.particles[particleId as keyof PV]
    );
  }

  getParticleValues() {
    const particleValues = {} as ParticleValues;
    Object.keys(this.particles).forEach(
      (particle) => (particleValues[particle] = this.particles[particle][0]())
    );

    return particleValues;
  }
}
