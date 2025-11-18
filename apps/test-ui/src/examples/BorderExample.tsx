/**
 * Border and CornerRadius Demo - showcasing new background features
 */
import { Text, useState, View } from '@phaserjsx/ui'

/**
 * Border and corner radius demonstration
 * @returns BorderDemo component
 */
export function BorderExample() {
  const [px, setPx] = useState(20)

  return (
    <View
      x={20}
      y={20}
      backgroundColor={0x1a1a1a}
      backgroundAlpha={1.0}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
      gap={px}
      direction="column"
      onPointerDown={() => {
        setPx(px == 0 ? 20 : 0)
      }}
    >
      <Text text="Border & Corner Radius Demo" style={{ fontSize: 18, color: 'yellow' }} />

      {/* Simple border */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        borderWidth={2}
        borderColor={0xff6b6b}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Simple Border" style={{ fontSize: 12, color: 'white' }} />
      </View>

      {/* Rounded corners */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        cornerRadius={15}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Rounded Corners" style={{ fontSize: 12, color: 'white' }} />
      </View>

      {/* Border + rounded corners */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        borderWidth={3}
        borderColor={0x4ecdc4}
        borderAlpha={0.8}
        cornerRadius={20}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Border + Rounded" style={{ fontSize: 12, color: 'white' }} />
      </View>

      {/* Different corner radii */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        borderWidth={2}
        borderColor={0xfeca57}
        cornerRadius={{ tl: 5, tr: 20, bl: 20, br: 5 }}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Mixed Corners" style={{ fontSize: 12, color: 'white' }} />
      </View>

      {/* Thick border showcase */}
      <View
        width={150}
        height={80}
        backgroundColor={0x1e3a5f}
        backgroundAlpha={1.0}
        borderWidth={6}
        borderColor={0x45b7d1}
        cornerRadius={25}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        justifyContent="center"
        alignItems="center"
      >
        <Text text="Thick Border" style={{ fontSize: 12, color: 'white' }} />
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
        <Text text="Border Only" style={{ fontSize: 12, color: 'white' }} />
      </View>

      {/* Overflow hidden - text clipping */}
      <View
        width={150}
        height={80}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        borderWidth={2}
        borderColor={0xff9ff3}
        cornerRadius={10}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        overflow="hidden"
      >
        <Text
          text="This is a very long text that will be clipped by the overflow hidden property"
          style={{ fontSize: 22, color: 'white' }}
        />
        <View width={70} height={35} borderWidth={2} borderColor={0xffffff} overflow="hidden">
          <Text text="Nested Box" style={{ fontSize: 14, color: 'white' }} />
        </View>
      </View>

      {/* Overflow visible - comparison */}
      <View
        width={150}
        height={60}
        backgroundColor={0x2a2a2a}
        backgroundAlpha={1.0}
        borderWidth={2}
        borderColor={0x95e1d3}
        cornerRadius={10}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        overflow="visible"
      >
        <Text
          text="Same text but overflow visible (default)"
          style={{ fontSize: 12, color: 'white' }}
        />
      </View>
    </View>
  )
}
