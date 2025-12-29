/**
 * Texture Registry for managing SVG texture loading and reference counting
 * Prevents race conditions when multiple components request the same texture
 */
import type * as Phaser from 'phaser'
import { svgToTexture } from './svg-texture'

interface TextureRequest {
  key: string
  svg: string
  width: number
  height: number
}

interface TextureEntry {
  refCount: number
  promise: Promise<void> | null
  loaded: boolean
}

/**
 * Global texture registry to manage texture loading and cleanup
 * Uses reference counting per scene to ensure textures are only removed when no longer needed
 */
class TextureRegistry {
  // Map of scene -> textures in that scene
  private sceneTextures = new Map<Phaser.Scene, Map<string, TextureEntry>>()

  /**
   * Get or create texture map for a scene
   */
  private getTextureMap(scene: Phaser.Scene): Map<string, TextureEntry> {
    let textures = this.sceneTextures.get(scene)
    if (!textures) {
      textures = new Map()
      this.sceneTextures.set(scene, textures)
    }
    return textures
  }

  /**
   * Request a texture in a specific scene, incrementing reference count
   * Loads the texture if it's the first request in this scene
   */
  async requestTexture(scene: Phaser.Scene, request: TextureRequest): Promise<void> {
    const { key } = request
    const textures = this.getTextureMap(scene)
    let entry = textures.get(key)

    if (!entry) {
      // First request for this texture in this scene
      entry = {
        refCount: 0,
        promise: null,
        loaded: false,
      }
      textures.set(key, entry)
    }

    entry.refCount++

    if (!entry.loaded && !entry.promise) {
      // Start loading
      entry.promise = svgToTexture(scene, request.key, request.svg, request.width, request.height)
        .then(() => {
          if (entry) {
            entry.loaded = true
            entry.promise = null
          }
        })
        .catch((err) => {
          if (entry) {
            entry.promise = null
          }
          throw err
        })
    }

    // Wait for loading if in progress
    if (entry.promise) {
      await entry.promise
    }
  }

  /**
   * Release a texture in a specific scene, decrementing reference count
   * Removes the texture if reference count reaches zero
   */
  releaseTexture(scene: Phaser.Scene, key: string) {
    const textures = this.sceneTextures.get(scene)
    if (!textures) return

    const entry = textures.get(key)
    if (!entry) return

    entry.refCount--
    if (entry.refCount <= 0) {
      // No more references, remove texture
      if (scene.textures.exists(key)) {
        scene.textures.remove(key)
      }
      textures.delete(key)
    }
  }

  /**
   * Check if a texture is loaded in a specific scene
   */
  isTextureLoaded(scene: Phaser.Scene, key: string): boolean {
    const textures = this.sceneTextures.get(scene)
    if (!textures) return false
    const entry = textures.get(key)
    return entry?.loaded ?? false
  }

  /**
   * Get all loaded textures in a specific scene
   */
  getLoadedTextures(scene: Phaser.Scene): string[] {
    const textures = this.sceneTextures.get(scene)
    if (!textures) return []
    return Array.from(textures.entries())
      .filter(([, entry]) => entry.loaded)
      .map(([key]) => key)
  }

  /**
   * Release all textures in a specific scene
   * Called automatically when scene shuts down
   */
  releaseScene(scene: Phaser.Scene) {
    const textures = this.sceneTextures.get(scene)
    if (!textures) return

    for (const key of textures.keys()) {
      if (scene.textures.exists(key)) {
        scene.textures.remove(key)
      }
    }
    this.sceneTextures.delete(scene)
  }

  /**
   * Release all textures from all scenes
   * Use with caution - removes all textures from all Phaser scenes
   */
  releaseAll() {
    for (const [scene, textures] of this.sceneTextures.entries()) {
      for (const key of textures.keys()) {
        if (scene.textures.exists(key)) {
          scene.textures.remove(key)
        }
      }
    }
    this.sceneTextures.clear()
  }
}

// Global instance
export const textureRegistry = new TextureRegistry()
