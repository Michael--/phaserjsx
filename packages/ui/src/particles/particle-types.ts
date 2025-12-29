/**
 * Local particle types to avoid reliance on Phaser type exports
 */
import type * as Phaser from 'phaser'

export type ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter

export type ParticleEmitterManagerLike = Phaser.GameObjects.GameObject & {
  emitters?: ParticleEmitter[] | { list?: ParticleEmitter[] }
  createEmitter?: (config: unknown) => ParticleEmitter | void
  setTexture?: (key: string, frame?: string | number) => void
  setPosition?: (x: number, y: number) => void
  setScale: (x: number, y?: number) => void
  setRotation: (rotation: number) => void
  setDepth: (depth: number) => void
  setAlpha: (alpha: number) => void
  visible: boolean
  __emitter?: ParticleEmitter | null
  destroy: () => void
  scene: Phaser.Scene
}

export type ParticlesHandle = ParticleEmitter | ParticleEmitterManagerLike
