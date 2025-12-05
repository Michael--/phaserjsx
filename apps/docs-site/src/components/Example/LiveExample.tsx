/**
 * LiveExample - React component that wraps a Phaser Game instance
 * Renders PhaserJSX examples in an isolated Phaser canvas
 */
/** @jsxImportSource react */
import type { BackgroundConfig } from '@/types/background'
import Phaser from 'phaser'
import { useEffect, useRef } from 'react'

interface LiveExampleProps {
  /** Factory function that creates a Phaser Scene */
  sceneFactory: () => typeof Phaser.Scene
  /** Canvas width in pixels */
  width?: number
  /** Canvas height in pixels */
  height?: number
  /** Optional background configuration */
  background?: BackgroundConfig
}

/**
 * Renders a Phaser canvas with a PhaserJSX example
 */
export function LiveExample({ sceneFactory, width = 800, height = 600 }: LiveExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create isolated Phaser Game instance
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width,
      height,
      backgroundColor: '#2d2d2d',
      scene: sceneFactory(),
      scale: {
        mode: Phaser.Scale.NONE,
      },
      input: {
        mouse: true,
        touch: true,
        activePointers: 2,
      },
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [sceneFactory, width, height])

  return (
    <div
      ref={containerRef}
      style={{
        boxShadow: '0 0 0 3px #444',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: width,
        maxHeight: height,
        margin: '20px 0',
      }}
    />
  )
}
