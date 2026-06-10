/**
 * Sprite Sizing Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Sprite, Text, useState, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

const FIT_MODES = ['fill', 'contain', 'cover'] as const

export function SizingSpriteExample() {
  const [fit, setFit] = useState<(typeof FIT_MODES)[number]>('contain')

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <View direction="row" gap={10}>
        {FIT_MODES.map((mode) => (
          <Button key={mode} onClick={() => setFit(mode)}>
            <Text text={mode} />
          </Button>
        ))}
      </View>

      <View width={360} height={180} direction="stack" backgroundColor={0x20283a} cornerRadius={8}>
        <View
          x={58}
          y={50}
          width={120}
          height={80}
          backgroundColor={0x39445c}
          borderColor={0xffc857}
          borderWidth={2}
        />
        <Sprite
          texture="sprite-eye-sizing"
          x={118}
          y={90}
          displayWidth={120}
          displayHeight={80}
          fit={fit}
        />

        <View
          x={238}
          y={30}
          width={80}
          height={120}
          backgroundColor={0x39445c}
          borderColor={0xffc857}
          borderWidth={2}
        />
        <Sprite
          texture="sprite-eye-sizing"
          x={278}
          y={90}
          displayWidth={80}
          displayHeight={120}
          fit={fit}
        />
      </View>
      <Text text={`fit: ${fit}`} />
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadSizingSprite(scene: Phaser.Scene) {
  scene.load.image(
    'sprite-eye-sizing',
    resolveAssetPath('assets/images/lance-overdose-loader-eye.png')
  )
}
