/**
 * LiveExample - React component that wraps a Phaser Game instance
 * Renders PhaserJSX examples in an isolated Phaser canvas
 */
/** @jsxImportSource react */
import Phaser from 'phaser'
import { useEffect, useRef } from 'react'

interface LiveExampleProps {
  /** Factory function that creates a Phaser Scene */
  sceneFactory: () => typeof Phaser.Scene
  /** Canvas width in pixels */
  width?: number
  /** Canvas height in pixels */
  height?: number
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
        border: '1px solid #444',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '100%',
        margin: '20px 0',
      }}
    />
  )
}
