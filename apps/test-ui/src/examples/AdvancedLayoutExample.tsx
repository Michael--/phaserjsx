/**
 * Advanced Layout Demo - showcasing gap, justifyContent, alignItems
 */
import { Text, useState, View } from '@phaserjsx/ui'

/**
 * Demo box component for visual testing
 * @param props - Box properties
 * @returns Box component
 */
function Box(props: { color: number; text: string; width?: number; height?: number }) {
  return (
    <View
      width={props.width ?? 60}
      height={props.height ?? 40}
      backgroundColor={props.color}
      padding={5}
      alignItems="center"
      justifyContent="center"
    >
      <Text text={props.text} style={{ fontSize: 12, color: 'white' }} />
    </View>
  )
}

/**
 * Gap demonstration
 * @returns Gap demo
 */
function GapExample() {
  return (
    <View backgroundColor={0x2a2a2a} backgroundAlpha={1.0} padding={10} gap={15}>
      <Text text="Gap(15)" style={{ fontSize: 14, color: 'yellow' }} />
      <Box color={0xff6b6b} text="Box 1" />
      <Box color={0x4ecdc4} text="Box 2" />
      <Box color={0x45b7d1} text="Box 3" />
    </View>
  )
}

/**
 * JustifyContent demonstration - column direction
 * @returns JustifyContent demo
 */
function JustifyContentColumnExample() {
  return (
    <View backgroundColor={0x2a2a2a} padding={10} direction="column" gap={10}>
      <Text text="JustifyContent (Column)" style={{ fontSize: 16, color: 'yellow' }} />

      <View direction="row" gap={10}>
        {/* Start */}
        <View
          width={100}
          height={120}
          backgroundColor={0x444444}
          backgroundAlpha={1.0}
          direction="column"
          justifyContent="start"
          padding={5}
          gap={5}
        >
          <Box color={0x44ccbb} text="start" width={80} height={20} />
          <Box color={0xff6b6b} text="1" width={80} height={20} />
          <Box color={0x4ecdc4} text="2" width={80} height={20} />
        </View>

        {/* Center */}
        <View
          width={100}
          height={120}
          backgroundColor={0x444444}
          direction="column"
          justifyContent="center"
          padding={5}
          gap={5}
        >
          <Box color={0x44ccbb} text="center" width={80} height={20} />
          <Box color={0xff6b6b} text="1" width={80} height={20} />
          <Box color={0x4ecdc4} text="2" width={80} height={20} />
        </View>

        {/* End */}
        <View
          width={100}
          height={120}
          backgroundColor={0x444444}
          direction="column"
          justifyContent="end"
          padding={5}
          gap={5}
        >
          <Box color={0x44ccbb} text="end" width={80} height={20} />
          <Box color={0xff6b6b} text="1" width={80} height={20} />
          <Box color={0x4ecdc4} text="2" width={80} height={20} />
        </View>

        {/* Space Between */}
        <View
          width={100}
          height={120}
          backgroundColor={0x444444}
          direction="column"
          justifyContent="space-between"
          padding={5}
          gap={5}
        >
          <Box color={0x44ccbb} text="space-btw" width={80} height={20} />
          <Box color={0xff6b6b} text="1" width={80} height={20} />
          <Box color={0x4ecdc4} text="2" width={80} height={20} />
        </View>

        {/* Space Around */}
        <View
          width={100}
          height={120}
          backgroundColor={0x444444}
          direction="column"
          justifyContent="space-around"
          padding={5}
          gap={5}
        >
          <Box color={0x44ccbb} text="space-ard" width={80} height={20} />
          <Box color={0xff6b6b} text="1" width={80} height={20} />
          <Box color={0x4ecdc4} text="2" width={80} height={20} />
        </View>
      </View>
    </View>
  )
}

/**
 * AlignItems demonstration - row direction
 * @returns AlignItems demo
 */
function AlignItemsRowExample() {
  return (
    <View backgroundColor={0x2a2a2a} direction="column">
      <Text text="AlignItems (Row)" style={{ fontSize: 16, color: 'yellow' }} />

      {/* Start */}
      <View
        height={80}
        backgroundColor={0x444444}
        direction="row"
        alignItems="start"
        padding={5}
        gap={5}
      >
        <Text text="start:" style={{ fontSize: 10, color: 'cyan' }} />
        <Box color={0xff6b6b} text="A" width={80} height={40} />
        <Box color={0x4ecdc4} text="B" width={80} height={60} />
        <Box color={0x45b7d1} text="C" width={80} height={20} />
      </View>

      {/* Center */}
      <View
        height={80}
        backgroundColor={0x444444}
        direction="row"
        alignItems="center"
        padding={5}
        gap={5}
      >
        <Text text="center:" style={{ fontSize: 10, color: 'cyan' }} />
        <Box color={0xff6b6b} text="A" width={80} height={40} />
        <Box color={0x4ecdc4} text="B" width={80} height={60} />
        <Box color={0x45b7d1} text="C" width={80} height={20} />
      </View>

      {/* End */}
      <View
        height={80}
        backgroundColor={0x444444}
        direction="row"
        alignItems="end"
        padding={5}
        gap={5}
      >
        <Text text="end:" style={{ fontSize: 10, color: 'cyan' }} />
        <Box color={0xff6b6b} text="A" width={80} height={40} />
        <Box color={0x4ecdc4} text="B" width={80} height={60} />
        <Box color={0x45b7d1} text="C" width={80} height={20} />
      </View>
    </View>
  )
}

/**
 * Main layout example component
 * @returns Layout example
 */
export function AdvancedLayoutExample() {
  const [n, setN] = useState(0)

  return (
    <View
      x={10}
      y={10}
      enableGestures={true}
      onTouch={() => {
        setN((n) => n + 1)
      }}
    >
      <Text text={`Pointer Down Count: ${n}`} style={{ fontSize: 18, color: 'white' }} />
      <GapExample />
      <JustifyContentColumnExample />
      <AlignItemsRowExample />
    </View>
  )
}
