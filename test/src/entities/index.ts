import {
  ParticleEntity,
  DerivativeEntity,
  ActionEntity,
  adaptMemo,
  Getter,
} from "promethium-js";

export const particleEntity = new ParticleEntity<{
  count: number;
  name: string;
}>({
  count: 0,
  name: "Paul",
});

export const derivativeEntity = new DerivativeEntity<{
  countPlusOne: Getter<number>;
  namePlusHello?: () => string;
}>({
  countPlusOne: adaptMemo(() => 2),
});

export const actionEntity = new ActionEntity({
  addToCount: () => {
    particleEntity.adaptParticle("count")[1]((count) => {
      return count + 2;
    });
  },
});
