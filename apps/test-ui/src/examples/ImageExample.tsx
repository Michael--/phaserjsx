/**
 * Image Component Examples
 * Demonstrates various uses of the Image component
 */
import { Image, Text, View, useState, useThemeTokens } from '@phaserjsx/ui'
import type Phaser from 'phaser'
import { ScrollView } from '../components'
import { SectionHeader } from './Helper'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Basic image with auto-sizing
 */
function AutoSizeImage() {
  const tokens = useThemeTokens()
  const [dimensions, setDimensions] = useState<string | undefined>(undefined)

  return (
    <ViewLevel2>
      <Text text="Auto-Size Image" style={tokens?.textStyles.large} />
      <Text
        text="No displayWidth/displayHeight - uses texture dimensions"
        style={tokens?.textStyles.small}
      />
      {dimensions && <Text text={`Dimensions: ${dimensions}`} style={tokens?.textStyles.small} />}
      <ViewLevel3 direction="row" gap={10}>
        <Image
          texture="phaser-jsx-logo"
          onReady={(img: Phaser.GameObjects.GameObject) => {
            const image = img as Phaser.GameObjects.Image
            setDimensions(`${image.width}x${image.height}`)
          }}
        />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Image with explicit display size
 */
function ExplicitSizeImage() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Explicit Size" style={tokens?.textStyles.large} />
      <Text text="displayWidth and displayHeight set" style={tokens?.textStyles.small} />

      <ViewLevel3 direction="row" gap={10}>
        <Image texture="phaser-jsx-logo" displayWidth={64} displayHeight={64} />
        <Image texture="phaser-jsx-logo" displayWidth={128} displayHeight={128} />
        <Image texture="phaser-jsx-logo" displayWidth={96} displayHeight={64} />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Fit modes demonstration (CSS object-fit equivalent)
 */
function FitModesDemo() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <ViewLevel2>
      <Text text="Fit Modes (CSS object-fit)" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="row" gap={20}>
        <View direction="column" gap={5} alignItems="center">
          <Text text="fill (default)" style={tokens?.textStyles.small} />
          <View
            width={120}
            height={80}
            borderColor={colors?.primary.medium.toNumber()}
            borderWidth={2}
            direction="stack"
          >
            <Image texture="phaser-jsx-logo" displayWidth={120} displayHeight={80} fit="fill" />
          </View>
        </View>

        <View direction="column" gap={5} alignItems="center">
          <Text text="contain" style={tokens?.textStyles.small} />
          <View
            width={120}
            height={80}
            borderColor={colors?.success.medium.toNumber()}
            borderWidth={2}
            direction="stack"
          >
            <Image texture="phaser-jsx-logo" displayWidth={120} displayHeight={80} fit="contain" />
          </View>
        </View>

        <View direction="column" gap={5} alignItems="center">
          <Text text="cover" style={tokens?.textStyles.small} />
          <View
            width={120}
            height={80}
            borderColor={colors?.error.medium.toNumber()}
            borderWidth={2}
            direction="stack"
            overflow="hidden"
          >
            <Image texture="phaser-jsx-logo" displayWidth={120} displayHeight={80} fit="cover" />
          </View>
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Headless mode demonstration
 */
function HeadlessImage() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <ViewLevel2>
      <Text text="Headless Mode" style={tokens?.textStyles.large} />
      <Text
        text="Image with rotation (only works with headless)"
        style={tokens?.textStyles.small}
      />

      <ViewLevel3
        width={300}
        height={200}
        backgroundColor={colors?.background.darkest.toNumber()}
        direction="stack"
      >
        <Image texture="test-image" headless={true} x={150} y={100} displayWidth={200} />
        <Image
          texture="test-image"
          headless={true}
          x={150}
          y={100}
          displayWidth={200}
          rotation={Math.PI / 4}
          alpha={0.7}
        />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Tint demonstration
 */
function TintDemo() {
  const tokens = useThemeTokens()
  const [tintColor, setTintColor] = useState(0xffffff)

  const colors = [
    { name: 'White', value: 0xffffff },
    { name: 'Red', value: 0xff0000 },
    { name: 'Green', value: 0x00ff00 },
    { name: 'Blue', value: 0x0000ff },
    { name: 'Yellow', value: 0xffff00 },
  ]

  return (
    <ViewLevel2>
      <Text text="Tint Colors" style={tokens?.textStyles.large} />
      <Text text="Click to change tint" style={tokens?.textStyles.small} />

      <ViewLevel3 direction="column" gap={10} alignItems="center">
        <Image texture="test-image" displayWidth={200} tint={tintColor} />

        <View direction="row" gap={10}>
          {colors.map((color) => (
            <View
              key={color.name}
              width={60}
              height={40}
              backgroundColor={color.value}
              enableGestures={true}
              onTouch={() => setTintColor(color.value)}
              justifyContent="center"
              alignItems="center"
            >
              <Text
                text={color.name}
                style={{
                  fontSize: 10,
                  color: color.value === 0xffffff ? '#000000' : '#ffffff',
                }}
              />
            </View>
          ))}
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Main Image example component
 */
export function ImageExample() {
  return (
    <ScrollView>
      <ViewLevel2>
        <SectionHeader title="Image Component Examples" />
        <View direction="row">
          <AutoSizeImage />
          <ExplicitSizeImage />
        </View>
        <View direction="row">
          <FitModesDemo />
        </View>
        <View direction="row">
          <HeadlessImage />
          <TintDemo />
        </View>
      </ViewLevel2>
    </ScrollView>
  )
}
