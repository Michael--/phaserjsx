/**
 * Advanced Layout Demo - showcasing gap, justifyContent, alignItems
 */
import { Text, useThemeTokens, View } from '@phaserjsx/ui'

/**
 * Demo box component for visual testing
 * @param props - Box properties
 * @returns Box component
 */
function Box(props: { color?: number | undefined; text: string; width?: number; height?: number }) {
  const tokens = useThemeTokens()
  return (
    <View
      width={props.width ?? 60}
      height={props.height ?? 40}
      backgroundColor={props.color}
      padding={5}
      alignItems="center"
      justifyContent="center"
    >
      <Text text={props.text} style={tokens?.textStyles.medium} />
    </View>
  )
}

/**
 * JustifyContent demonstration - column direction
 * @returns JustifyContent demo
 */
function JustifyContentColumnExample() {
  const tokens = useThemeTokens()
  const colors = tokens?.colors
  return (
    <View
      backgroundColor={colors?.surface.DEFAULT.toNumber()}
      padding={10}
      direction="column"
      gap={10}
    >
      <Text text="JustifyContent (Column)" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        {/* Start */}
        <View
          height={150}
          borderColor={colors?.border.DEFAULT.toNumber()}
          direction="column"
          justifyContent="start"
          padding={5}
          gap={5}
        >
          <Box color={colors?.secondary.light.toNumber()} text="start" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="1" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="2" width={100} height={30} />
        </View>

        {/* Center */}
        <View
          height={150}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          direction="column"
          justifyContent="center"
          padding={5}
          gap={5}
        >
          <Box color={colors?.secondary.light.toNumber()} text="1" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="center" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="3" width={100} height={30} />
        </View>

        {/* End */}
        <View
          height={150}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          direction="column"
          justifyContent="end"
          padding={5}
          gap={5}
        >
          <Box color={colors?.secondary.light.toNumber()} text="1" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="2" width={100} height={30} />
          <Box color={colors?.secondary.light.toNumber()} text="end" width={100} height={30} />
        </View>

        {/* Space Between */}
        <View
          height={150}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          direction="column"
          justifyContent="space-between"
          padding={5}
          gap={5}
        >
          <Box color={colors?.secondary.light.toNumber()} text="1" width={100} height={30} />
          <Box
            color={colors?.secondary.light.toNumber()}
            text="space-btw"
            width={100}
            height={30}
          />
          <Box color={colors?.secondary.light.toNumber()} text="3" width={100} height={30} />
        </View>

        {/* Space Around */}
        <View
          height={150}
          borderColor={tokens?.colors.border.DEFAULT.toNumber()}
          direction="column"
          justifyContent="space-around"
          padding={5}
          gap={5}
        >
          <Box color={colors?.secondary.light.toNumber()} text="1" width={100} height={30} />
          <Box
            color={colors?.secondary.light.toNumber()}
            text="space-ard"
            width={100}
            height={30}
          />
          <Box color={colors?.secondary.light.toNumber()} text="3" width={100} height={30} />
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

      {/* Stretch */}
      <View
        height={80}
        backgroundColor={0x444444}
        direction="row"
        alignItems="stretch"
        padding={5}
        gap={5}
      >
        <Text text="stretch:" style={{ fontSize: 10, color: 'cyan' }} />
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
  return (
    <View width={'100%'} height={'100%'} justifyContent="start" padding={20} gap={10}>
      <JustifyContentColumnExample />
      <AlignItemsRowExample />
      <View direction="row" gap={10}>
        <View
          height={200}
          width={200}
          backgroundColor={0xffffff}
          alignItems="start"
          justifyContent="start"
        >
          <Text text="Box 200x200" />
          <Text text="Headless" rotation={0.5} headless={true} />
        </View>
        <View
          height={200}
          width={200}
          backgroundColor={0xffffff}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="Box 200x200" />
          <Text text="Headless" rotation={0.5} headless={true} />
        </View>
        <View
          height={200}
          width={200}
          backgroundColor={0xffffff}
          alignItems="end"
          justifyContent="end"
        >
          <Text text="Box 201x200" />
          <Text text="Headless" rotation={0.5} headless={true} />
        </View>
      </View>
    </View>
  )
}
