/**
 * Border and CornerRadius Demo - showcasing new background features
 */
import { Text, useState, View } from '@phaserjsx/ui'

/**
 * Border and corner radius demonstration
 * @returns BorderDemo component
 */
export function BorderExample() {
  const [px, setPx] = useState(0)

  return (
    <View
      x={20 + px}
      y={20}
      backgroundColor={0x1a1a1a}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
      gap={px}
      direction="column"
      onPointerDown={() => {
        setPx(px == 0 ? 20 : 0)
      }}
    >
      <Text text="Border & Corner Radius Demo" color={'yellow'} style={{ fontSize: 18 }} />

      {/* Simple border */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        borderWidth={2}
        borderColor={0xff6b6b}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Simple Border" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* Rounded corners */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        cornerRadius={15}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Rounded Corners" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* Border + rounded corners */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        borderWidth={3}
        borderColor={0x4ecdc4}
        borderAlpha={0.8}
        cornerRadius={20}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Border + Rounded" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* Different corner radii */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        borderWidth={2}
        borderColor={0xfeca57}
        cornerRadius={{ tl: 5, tr: 20, bl: 20, br: 5 }}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Mixed Corners" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* Thick border showcase */}
      <View
        width={150}
        height={80}
        backgroundColor={0x1e3a5f}
        borderWidth={6}
        borderColor={0x45b7d1}
        cornerRadius={25}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Thick Border" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* No background, border only */}
      <View
        width={150}
        height={80}
        borderWidth={3}
        borderColor={0xee5a6f}
        cornerRadius={10}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Border Only" color={'white'} style={{ fontSize: 12 }} />
      </View>

      {/* Overflow hidden - text clipping */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        borderWidth={2}
        borderColor={0xff9ff3}
        cornerRadius={10}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        overflow="hidden"
      >
        <Text
          text="This is a very long text that will be clipped by the overflow hidden property"
          color={'white'}
          style={{ fontSize: 22 }}
        />
        <View width={70} height={35} borderWidth={2} borderColor={0xffffff} overflow="hidden">
          <Text text="Nested Box" color={'white'} style={{ fontSize: 14 }} />
        </View>
      </View>

      {/* Overflow visible - comparison */}
      <View
        width={150}
        height={60}
        backgroundColor={0x2a2a2a}
        borderWidth={2}
        borderColor={0x95e1d3}
        cornerRadius={10}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        overflow="visible"
      >
        <Text
          text="Same text but overflow visible (default)"
          color={'white'}
          style={{ fontSize: 12 }}
        />
      </View>
    </View>
  )
}
