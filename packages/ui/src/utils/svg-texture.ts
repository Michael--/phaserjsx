/**
 * SVG to Phaser Texture Utilities
 * Provides conversion from SVG strings/URLs to Phaser texture resources
 */
import type * as Phaser from 'phaser'

/**
 * Preprocesses SVG string to ensure tinting works correctly
 * Replaces fill="currentColor" and other color fills with white (#FFFFFF)
 * This allows Phaser's tint to work multiplicatively (white × tint = tint color)
 * @param svg - Raw SVG string
 * @returns Preprocessed SVG string with white fills
 */
function preprocessSvgForTinting(svg: string): string {
  return (
    svg
      // Replace fill="currentColor" with fill="#FFFFFF"
      .replace(/fill="currentColor"/gi, 'fill="#FFFFFF"')
      // Replace fill='currentColor' with fill='#FFFFFF'
      .replace(/fill='currentColor'/gi, "fill='#FFFFFF'")
      // Replace fill:currentColor in style attributes
      .replace(/fill:\s*currentColor/gi, 'fill: #FFFFFF')
      // Replace black fills (common fallback)
      .replace(/fill="#000000"/gi, 'fill="#FFFFFF"')
      .replace(/fill="#000"/gi, 'fill="#FFFFFF"')
      .replace(/fill='#000000'/gi, "fill='#FFFFFF'")
      .replace(/fill='#000'/gi, "fill='#FFFFFF'")
  )
}

/**
 * Converts an SVG (string or URL) into a Phaser texture
 *
 * Supports multiple input formats:
 * - Raw SVG string (must start with '<svg')
 * - data:image/svg+xml URL
 * - External URL (http/https)
 *
 * The function creates a canvas element, renders the SVG at the specified dimensions,
 * and registers it as a Phaser texture. If a texture with the same key already exists,
 * it will be replaced.
 *
 * @param scene - Phaser scene instance
 * @param key - Unique texture key for registration
 * @param svgOrUrl - SVG string or URL
 * @param width - Desired texture width in pixels (default: 32)
 * @param height - Desired texture height in pixels (default: 32)
 * @throws {Error} If SVG loading or canvas rendering fails
 * @example
 * ```typescript
 * // Raw SVG string
 * await svgToTexture(scene, 'my-icon', '<svg>...</svg>', 64, 64)
 *
 * // URL
 * await svgToTexture(scene, 'external-icon', 'https://example.com/icon.svg')
 * ```
 */
export async function svgToTexture(
  scene: Phaser.Scene,
  key: string,
  svgOrUrl: string,
  width: number = 32,
  height: number = 32
): Promise<void> {
  const trimmed = svgOrUrl.trim()
  let finalUrl: string
  let shouldRevokeUrl = false

  // Detect input type: raw SVG string or URL
  if (trimmed.startsWith('<svg')) {
    // Raw SVG string - preprocess for tinting, then create blob URL
    const processedSvg = preprocessSvgForTinting(trimmed)
    const blob = new Blob([processedSvg], { type: 'image/svg+xml' })
    finalUrl = URL.createObjectURL(blob)
    shouldRevokeUrl = true
  } else {
    // Already a URL (data: or http/https)
    finalUrl = svgOrUrl
  }

  // Load SVG as HTMLImageElement
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load SVG: ${key}`))
    image.src = finalUrl
  })

  // Create canvas and render scaled SVG
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context')
  }

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  // Remove existing texture if present
  if (scene.textures.exists(key)) {
    scene.textures.remove(key)
  }

  // Register canvas as Phaser texture
  scene.textures.addCanvas(key, canvas)

  // Cleanup blob URL after canvas is added
  if (shouldRevokeUrl) {
    URL.revokeObjectURL(finalUrl)
  }

  // Force texture refresh to ensure GL texture is created
  const texture = scene.textures.get(key)
  if (texture && texture.source[0]) {
    texture.source[0].update()
  }
}
