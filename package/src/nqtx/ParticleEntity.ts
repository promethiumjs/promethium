import { adaptState, State } from "../nqtui";
import { Deletable, OptionalLiteralKeys } from "./entityTypes";

type ParticleValues = {
  [key: string]: any;
};

type Particles<PV> = {
  [ParticleValue in keyof PV]: State<PV[ParticleValue]>;
};

export default class ParticleEntity<
  PV extends ParticleValues = ParticleValues
> {
  private particles: Particles<PV>;

  constructor(initialParticleValues: PV) {
    this.particles = {} as Particles<PV>;
    this.createParticles(initialParticleValues);
    this.adaptParticle = this.adaptParticle.bind(this);
    this.deleteParticles = this.deleteParticles.bind(this);
    this.getParticleValues = this.getParticleValues.bind(this);
  }

  adaptParticle<T extends keyof PV>(id: T): State<PV[T]>;
  adaptParticle<T extends keyof PV>(
    id: T,
    initialValue: NonNullable<PV[T]>
  ): State<NonNullable<PV[T]>>;
  adaptParticle<T extends keyof PV>(
    id: T,
    initialValue?: PV[T]
  ): State<PV[T]> | State<NonNullable<PV[T]>> {
    if (this.particles[id] === undefined) {
      this.createParticles({
        [id as keyof PV]: initialValue as PV[keyof PV],
      } as Partial<PV>);
    }

    return this.particles[id] as State<PV[T]>;
  }

  private createParticles(particleValues: Partial<PV>) {
    if (particleValues) {
      Object.keys(particleValues).forEach((particleValue: keyof PV) => {
        this.particles[particleValue] = adaptState(
          particleValues[particleValue]
        ) as State<PV[keyof PV]>;
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

  getParticles() {
    return this.particles;
  }
}
