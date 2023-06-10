import {
  ParticleEntity,
  DerivativeEntity,
  ActionEntity,
  adaptMemo,
  Getter,
} from "promethium-js";

const particleEntity = new ParticleEntity<{ count: number; name: string }>({
  count: 5,
  name: "Paul",
});

const derivativeEntity = new DerivativeEntity<{
  countPlusOne: () => Getter<number>;
  namePlusHello?: () => Getter<string>;
}>({
  countPlusOne: () => adaptMemo((prev?: number) => 2),
});

export const { dispatch, actions } = new ActionEntity({
  addToCount: (payload?: { inc: number }) => {
    adaptParticle("count")[1]((count) => {
      return count + 2;
    });
  },
});

export const { adaptParticle, deleteParticles } = particleEntity;
export const { adaptDerivative } = derivativeEntity;
