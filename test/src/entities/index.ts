import {
  ParticleEntity,
  DerivativeEntity,
  ActionEntity,
  adaptMemo,
  Getter,
} from "promethium-js";

const particleEntity = new ParticleEntity<{ count: number; name: string }>({
  count: 0,
  name: "Paul",
});

const derivativeEntity = new DerivativeEntity<{
  countPlusOne: () => Getter<number>;
  namePlusHello?: () => Getter<string>;
}>({
  countPlusOne: () => adaptMemo(() => 2),
});

export const { dispatch, actions } = new ActionEntity({
  addToCount: () => {
    adaptParticle("count")[1]((count) => {
      return count + 2;
    });
  },
});

export const { adaptParticle, deleteParticles } = particleEntity;
export const { adaptDerivative } = derivativeEntity;
