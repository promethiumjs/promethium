import {
  adaptState,
  State,
  Getter,
  Setter,
  getGetter,
  getSetter,
  getValue,
} from "../nqtui";
import {
  Deletable,
  OptionalLiteralKeys,
  RequiredLiteralKeys,
} from "./entityTypes";

type ParticleValues = {
  [key: string]: any;
};

type ReturnedParticleValues<PV> = {
  [T in keyof PV]: T extends RequiredLiteralKeys<PV>
    ? PV[T]
    : PV[T] | undefined;
};

type Particles<PV> = {
  [T in keyof PV]: State<PV[T]>;
};

export default class ParticleEntity<
  PV extends ParticleValues = ParticleValues
> {
  private particles: Particles<PV>;

  constructor(initialParticleValues: PV) {
    this.particles = {} as Particles<PV>;
    this.createParticles(initialParticleValues);
    this.adaptParticle = this.adaptParticle.bind(this);
    this.adaptParticleGetter = this.adaptParticleGetter.bind(this);
    this.adaptParticles = this.adaptParticles.bind(this);
    this.adaptParticleSetter = this.adaptParticleSetter.bind(this);
    this.adaptParticleValue = this.adaptParticleValue.bind(this);
    this.adaptParticleValues = this.adaptParticleValues.bind(this);
    this.createParticle = this.createParticle.bind(this);
    this.createParticles = this.createParticles.bind(this);
    this.deleteParticle = this.deleteParticle.bind(this);
    this.deleteParticles = this.deleteParticles.bind(this);
  }

  adaptParticle<T extends keyof PV>(
    id: T
  ): T extends RequiredLiteralKeys<PV>
    ? State<Exclude<PV[T], undefined>>
    : State<Exclude<PV[T], undefined>> | undefined {
    return this.particles[id] as T extends RequiredLiteralKeys<PV>
      ? State<Exclude<PV[T], undefined>>
      : State<Exclude<PV[T], undefined>> | undefined;
  }

  adaptParticleGetter<T extends keyof PV>(
    id: T
  ): T extends RequiredLiteralKeys<PV>
    ? Getter<Exclude<PV[T], undefined>>
    : Getter<Exclude<PV[T], undefined>> | undefined {
    return getGetter(this.particles[id]) as T extends RequiredLiteralKeys<PV>
      ? Getter<Exclude<PV[T], undefined>>
      : Getter<Exclude<PV[T], undefined>> | undefined;
  }

  adaptParticles(): [keyof PV, State<Exclude<PV[keyof PV], undefined>>][] {
    return Object.entries(this.particles);
  }

  adaptParticleSetter<T extends keyof PV>(
    id: T
  ): T extends RequiredLiteralKeys<PV>
    ? Setter<Exclude<PV[T], undefined>>
    : Setter<Exclude<PV[T], undefined>> | undefined {
    return getSetter(this.particles[id]) as T extends RequiredLiteralKeys<PV>
      ? Setter<Exclude<PV[T], undefined>>
      : Setter<Exclude<PV[T], undefined>> | undefined;
  }

  adaptParticleValue<T extends keyof PV>(
    id: T
  ): T extends RequiredLiteralKeys<PV> ? PV[T] : PV[T] | undefined {
    return getValue(this.particles[id]);
  }

  adaptParticleValues() {
    const particleValues = {} as ParticleValues;
    Object.keys(this.particles).forEach(
      (particle) => (particleValues[particle] = this.particles[particle][0]())
    );

    return particleValues as ReturnedParticleValues<PV>;
  }

  createParticle<T extends keyof PV>(
    id: T,
    initialValue: PV[T]
  ): State<Exclude<PV[T], undefined>> {
    if (this.particles[id] === undefined) {
      this.particles[id] = adaptState(initialValue);
    }

    return this.particles[id];
  }

  private createParticles(particleValues: Partial<PV>) {
    if (particleValues) {
      Object.keys(particleValues).forEach((id: keyof PV) => {
        this.createParticle(id, particleValues[id] as PV[keyof PV]);
      });
    }
  }

  deleteParticle(id: OptionalLiteralKeys<PV> | Deletable) {
    delete this.particles[id];
  }

  deleteParticles(ids: Array<OptionalLiteralKeys<PV> | Deletable>) {
    ids.forEach((id) => this.deleteParticle(id));
  }
}
