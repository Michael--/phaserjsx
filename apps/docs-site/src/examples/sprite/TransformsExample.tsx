/**
 * Sprite Transforms Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Sprite, Text, useState, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

export function TransformsSpriteExample() {
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(0.85)

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <View direction="row" gap={10}>
        <Button onClick={() => setRotation((value) => value + Math.PI / 8)}>
          <Text text="Rotate" />
        </Button>
        <Button onClick={() => setScale((value) => (value >= 1.45 ? 0.65 : value + 0.2))}>
          <Text text="Scale" />
        </Button>
      </View>
      <View width={320} height={170} direction="stack" backgroundColor={0x20283a} cornerRadius={8}>
        <Sprite texture="sprite-eye-transform" x={160} y={85} rotation={rotation} scale={scale} />
      </View>
      <Text text={`rotation ${rotation.toFixed(2)} | scale ${scale.toFixed(2)}`} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadTransformsSprite(scene: Phaser.Scene) {
  scene.load.image(
    'sprite-eye-transform',
    resolveAssetPath('assets/images/lance-overdose-loader-eye.png')
  )
}
