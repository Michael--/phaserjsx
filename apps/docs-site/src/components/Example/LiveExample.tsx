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
  /** Optional preload function for Phaser assets */
  preload?: (scene: Phaser.Scene) => void
}

/**
 * Renders a Phaser canvas with a PhaserJSX example
 */
export function LiveExample({
  sceneFactory,
  width = 800,
  height = 600,
  preload,
}: LiveExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create scene class with preload support
    const SceneClass = sceneFactory()
    if (preload) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalPreload = (SceneClass.prototype as any).preload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(SceneClass.prototype as any).preload = function (this: Phaser.Scene) {
        preload(this)
        originalPreload?.call(this)
      }
    }

    // Create isolated Phaser Game instance
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width,
      height,
      backgroundColor: '#2d2d2d',
      scene: SceneClass,
      scale: {
        mode: Phaser.Scale.NONE,
      },
      input: {
        mouse: true,
        touch: true,
        activePointers: 2,
      },
      disableContextMenu: true,
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneFactory, width, height])

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: width,
        margin: '20px 0',
      }}
    >
      <div
        ref={containerRef}
        style={{
          boxShadow: '0 0 0 3px #444',
          borderRadius: '8px',
          overflow: 'hidden',
          maxWidth: width,
          maxHeight: height,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#444',
          color: '#fff',
          padding: '2px 12px',
          borderRadius: '4px',
          fontStyle: 'italic',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        Phaser JSX
      </div>
    </div>
  )
}
