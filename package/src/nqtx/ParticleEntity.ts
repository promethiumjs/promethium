import { StateTuple } from "./../nqtui/adaptations/adaptState/stateTypes";
import { adaptState } from "../nqtui";

type OptionalLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? K
    : never]: 0;
};

type ParticleValues = {
  [key: string]: any;
};

type Particles<PV> = {
  [ParticleValue in keyof PV]: StateTuple<PV[ParticleValue]>;
};

export type Deletable = string & {
  deletable: true;
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

  adaptParticle<T extends keyof PV>(id: T): StateTuple<PV[T]>;
  adaptParticle<T extends keyof PV>(options: {
    id: T;
    initialValue: NonNullable<PV[T]>;
  }): StateTuple<NonNullable<PV[T]>>;
  adaptParticle<T extends keyof PV>(
    optionsOrId:
      | {
          id: T;
          initialValue: PV[T];
        }
      | T
  ): StateTuple<PV[T]> | StateTuple<NonNullable<PV[T]>> {
    if (typeof optionsOrId === "string") {
      const id = optionsOrId;

      return this.particles[id] as StateTuple<PV[T]>;
    } else {
      const options = optionsOrId as {
        id: T;
        initialValue: PV[T];
      };
      if (this.particles[options.id] === undefined) {
        this.createParticles({
          [options.id as keyof PV]: options.initialValue as PV[keyof PV],
        } as Partial<PV>);
      }

      return this.particles[options.id] as StateTuple<PV[T]>;
    }
  }

  deleteParticles(particleIds: Array<OptionalLiteralKeys<PV> | Deletable>) {
    particleIds.forEach(
      (particleId) => delete this.particles[particleId as keyof PV]
    );
  }
}
