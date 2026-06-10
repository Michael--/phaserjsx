/**
 * Sprite Tinting Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Sprite, Text, useState, View } from '@number10/phaserjsx'
import { resolveAssetPath } from '@/utils/assetPath'

const TINTS = [
  { label: 'None', value: undefined },
  { label: 'Red', value: 0xff5a5f },
  { label: 'Green', value: 0x8bd450 },
  { label: 'Blue', value: 0x61dafb },
] as const

export function TintingSpriteExample() {
  const [tint, setTint] = useState<number | undefined>(undefined)

  return (
    <View width="fill" height="fill" padding={20} gap={14} justifyContent="center">
      <View direction="row" gap={10}>
        {TINTS.map((option) => (
          <Button key={option.label} onClick={() => setTint(option.value)}>
            <Text text={option.label} />
          </Button>
        ))}
      </View>
      <View width={320} height={150} direction="stack" backgroundColor={0x20283a} cornerRadius={8}>
        <Sprite texture="sprite-eye-tint" x={160} y={75} scale={1.05} tint={tint} />
      </View>
    </View>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function preloadTintingSprite(scene: Phaser.Scene) {
  scene.load.image(
    'sprite-eye-tint',
    resolveAssetPath('assets/images/lance-overdose-loader-eye.png')
  )
}
