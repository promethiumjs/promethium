import {
  ParticleEntity,
  DerivativeEntity,
  ActionEntity,
  adaptMemo,
  Getter,
} from "promethium-js";

export const particleEntity = new ParticleEntity<{
  count: number;
  name?: string;
  x: null;
}>({
  count: 0,
  name: "Paul",
  x: null,
});

export const parrr = new ParticleEntity<Record<`ce-${number}`, number>>({});

// const x = parrr.adaptParticleValue("ce-5")
// this works perfectly fine without Deletable
// parrr.deleteParticle("ce-5");

// make sure you don't have any references to a particle when you delete it!

export const derivativeEntity = new DerivativeEntity<{
  countPlusOne: Getter<number>;
  namePlusHello?: () => string;
}>({
  countPlusOne: adaptMemo(() => 2),
  namePlusHello: () => "string",
});

const a = derivativeEntity.adaptDerivativeValue("namePlusHello");
console.log(a);

export const derrr = new DerivativeEntity<
  Record<`ce-${number}`, Getter<number>>
>({
  "ce-5": () => 8,
});

const w = derrr.adaptDerivativeValue("ce-5");
console.log(w);

export const actionEntity = new ActionEntity(
  {
    addToCount: (_: undefined, { particleEntity }) => {
      particleEntity.adaptParticle("count")[1]((count) => {
        return count + 9;
      });
      return 5 as const;
    },
    whatever: (num: number) => {
      return num;
    },
  },
  { particleEntity, derivativeEntity },
);

actionEntity.dispatch("addToCount", undefined);
actionEntity.dispatch("whatever", 3);
