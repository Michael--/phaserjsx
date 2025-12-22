/**
 * PhaserJSX Plugin Guide Page
 */
/** @jsxImportSource react */
import { DocDescription, Section, SectionDescription } from '@/components/Doc'
import { CodeBlock } from '@/components/Example'
import { DocLayout } from '@/components/Layout'
import { createPluginExampleGame } from '../../examples-docs/installation/plugin-config'
import pluginConfigCode from '../../examples-docs/installation/plugin-config.tsx?raw'
import type Phaser from 'phaser'
import { useEffect, useRef } from 'react'
import '@/styles/docs.css'

const exampleWidth = 800
const exampleHeight = 320

function PluginLiveExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gameRef.current = createPluginExampleGame({
      parent: containerRef.current,
      width: exampleWidth,
      height: exampleHeight,
      title: 'Plugin Auto-Mount',
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [createPluginExampleGame, exampleHeight, exampleWidth])

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: exampleWidth,
        margin: '20px 0',
      }}
    >
      <div
        ref={containerRef}
        style={{
          boxShadow: '0 0 0 3px #444',
          borderRadius: '8px',
          overflow: 'hidden',
          maxWidth: exampleWidth,
          maxHeight: exampleHeight,
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

export function PhaserJsxPluginPage() {
  return (
    <DocLayout>
      <h1>PhaserJSX Plugin</h1>
      <DocDescription>
        Use the PhaserJSX plugin to auto-mount your root component straight from the Phaser game
        config. This is handy for quick prototypes or when you want to keep scene logic minimal.
      </DocDescription>

      <Section title="Live Example">
        <SectionDescription>
          The plugin mounts on the first scene create hook and can auto-resize your UI on scale
          events.
        </SectionDescription>
        <PluginLiveExample />
      </Section>

      <Section title="Configuration">
        <SectionDescription>
          Use <code>createPhaserJSXPlugin</code> to set up auto-mounting in your game config.
        </SectionDescription>
        <CodeBlock language="tsx">{pluginConfigCode}</CodeBlock>
      </Section>
    </DocLayout>
  )
}
