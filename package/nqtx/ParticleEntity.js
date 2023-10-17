import { adaptState, getGetter, getSetter, getValue, } from "../nqtui";
export default class ParticleEntity {
    constructor(initialParticleValues) {
        this.particles = {};
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
    adaptParticle(id) {
        return this.particles[id];
    }
    adaptParticleGetter(id) {
        return getGetter(this.particles[id]);
    }
    adaptParticles() {
        return Object.entries(this.particles);
    }
    adaptParticleSetter(id) {
        return getSetter(this.particles[id]);
    }
    adaptParticleValue(id) {
        return getValue(this.particles[id]);
    }
    adaptParticleValues() {
        const particleValues = {};
        Object.keys(this.particles).forEach((particle) => (particleValues[particle] = this.particles[particle][0]()));
        return particleValues;
    }
    createParticle(id, initialValue) {
        if (this.particles[id] === undefined) {
            this.particles[id] = adaptState(initialValue);
        }
        return this.particles[id];
    }
    createParticles(particleValues) {
        if (particleValues) {
            Object.keys(particleValues).forEach((id) => {
                this.createParticle(id, particleValues[id]);
            });
        }
    }
    deleteParticle(id) {
        delete this.particles[id];
    }
    deleteParticles(ids) {
        ids.forEach((id) => this.deleteParticle(id));
    }
}
