/**
 * Native Phaser stencil clip example.
 * Uses PhaserJSX only for the root View; all clipped content is native Phaser.
 */
/** @jsxImportSource @number10/phaserjsx */
import { useEffect, useRef, useScene, View } from '@number10/phaserjsx'
import * as Phaser from 'phaser'

const MASK_KEY = 'docs-stencil-blob-mask'

function ensureBlobMaskTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(MASK_KEY)) return

  const texture = scene.textures.createCanvas(MASK_KEY, 180, 140)
  if (!texture) return

  const ctx = texture.context
  ctx.clearRect(0, 0, 180, 140)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(90, 8)
  ctx.bezierCurveTo(132, 0, 174, 30, 166, 72)
  ctx.bezierCurveTo(158, 122, 112, 140, 70, 130)
  ctx.bezierCurveTo(22, 118, 4, 82, 18, 48)
  ctx.bezierCurveTo(30, 20, 56, 12, 90, 8)
  ctx.closePath()
  ctx.fill()
  texture.refresh()
}

function addStripeField(scene: Phaser.Scene, parent: Phaser.GameObjects.Container) {
  const stripes: Phaser.GameObjects.Rectangle[] = []

  for (let i = 0; i < 7; i++) {
    const stripe = scene.add
      .rectangle(-50 + i * 42, 18 + i * 10, 32, 170, i % 2 === 0 ? 0x32d6a0 : 0xffc857, 0.9)
      .setOrigin(0, 0)
      .setRotation(-0.42)
    parent.add(stripe)
    stripes.push(stripe)
  }

  scene.tweens.add({
    targets: stripes,
    x: '+=36',
    duration: 1800,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}

function addNativePanel(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  x: number,
  title: string,
  clip: Parameters<Phaser.GameObjects.Container['setStencilClip']>[0]
) {
  const label = scene.add.text(x, 12, title, {
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Arial',
    fontStyle: 'bold',
  })
  root.add(label)

  const panel = scene.add.container(x, 44)
  panel.setStencilClip(clip)
  root.add(panel)

  const background = scene.add.rectangle(0, 0, 180, 140, 0x253044, 1).setOrigin(0, 0)
  panel.add(background)
  addStripeField(scene, panel)

  const dot = scene.add.circle(126, 86, 30, 0x7c5cff, 0.9)
  const caption = scene.add.text(18, 104, 'native Phaser children', {
    color: '#ffffff',
    fontSize: '13px',
    fontFamily: 'Arial',
  })
  panel.add([dot, caption])

  scene.tweens.add({
    targets: dot,
    x: 58,
    duration: 1500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}

export function NativeStencilClipViewExample() {
  const scene = useScene()
  const rootRef = useRef<Phaser.GameObjects.Container | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    ensureBlobMaskTexture(scene)

    const nativeRoot = scene.add.container(28, 28)
    root.add(nativeRoot)

    addNativePanel(scene, nativeRoot, 0, 'roundRect stencil', {
      kind: 'roundRect',
      width: 180,
      height: 140,
      cornerRadius: { tl: 28, tr: 10, br: 28, bl: 10 },
    })

    addNativePanel(scene, nativeRoot, 230, 'bitmap stencil', {
      kind: 'bitmap',
      texture: MASK_KEY,
      width: 180,
      height: 140,
    })

    return () => {
      nativeRoot.destroy(true)
    }
  }, [scene])

  return <View ref={rootRef} width="fill" height="fill" />
}
