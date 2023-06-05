import { ParticleEntity } from "promethium-js";

const entity = new ParticleEntity<{ count: number; name?: string }>({
  count: 0,
});

export const { adaptParticle, deleteParticles } = entity;
