/**
 * Texture Registry for managing SVG texture loading and reference counting
 * Prevents race conditions when multiple components request the same texture
 */
import type Phaser from 'phaser'
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
 * Uses reference counting to ensure textures are only removed when no longer needed
 */
class TextureRegistry {
  private textures = new Map<string, TextureEntry>()
  private scene: Phaser.Scene | null = null

  /**
   * Set the current scene for texture operations
   */
  setScene(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Request a texture, incrementing reference count
   * Loads the texture if it's the first request
   */
  async requestTexture(request: TextureRequest): Promise<void> {
    if (!this.scene) {
      throw new Error('Scene not set in TextureRegistry')
    }

    const { key } = request
    let entry = this.textures.get(key)

    if (!entry) {
      // First request for this texture
      entry = {
        refCount: 0,
        promise: null,
        loaded: false,
      }
      this.textures.set(key, entry)
    }

    entry.refCount++

    if (!entry.loaded && !entry.promise) {
      // Start loading
      entry.promise = svgToTexture(
        this.scene,
        request.key,
        request.svg,
        request.width,
        request.height
      )
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
   * Release a texture, decrementing reference count
   * Removes the texture if reference count reaches zero
   */
  releaseTexture(key: string) {
    if (!this.scene) return

    const entry = this.textures.get(key)
    if (!entry) return

    entry.refCount--
    if (entry.refCount <= 0) {
      // No more references, remove texture
      if (this.scene.textures.exists(key)) {
        this.scene.textures.remove(key)
      }
      this.textures.delete(key)
    }
  }

  /**
   * Check if a texture is loaded
   */
  isTextureLoaded(key: string): boolean {
    const entry = this.textures.get(key)
    return entry?.loaded ?? false
  }

  /**
   * Get all loaded textures
   */
  getLoadedTextures(): string[] {
    return Array.from(this.textures.entries())
      .filter(([, entry]) => entry.loaded)
      .map(([key]) => key)
  }
}

// Global instance
export const textureRegistry = new TextureRegistry()
