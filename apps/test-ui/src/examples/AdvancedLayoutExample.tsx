/**
 * Advanced Layout Demo - showcasing gap, justifyContent, alignItems
 */
import { ScrollView, Text, useThemeTokens, View } from '@phaserjsx/ui'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Demo box component for visual testing
 * @param props - Box properties
 * @returns Box component
 */
function Box(props: { color?: number | undefined; text: string; width?: number; height?: number }) {
  const tokens = useThemeTokens()
  return (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={tokens?.colors.secondary.DEFAULT.toNumber()}
      padding={5}
      alignItems="center"
      justifyContent="center"
    >
      <Text text={props.text} style={tokens?.textStyles.DEFAULT} />
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
    <ViewLevel2>
      <Text text="JustifyContent (Column)" style={tokens?.textStyles.large} />

      <View direction="row" gap={10}>
        {/* Start */}
        <ViewLevel3 height={200} direction="column" justifyContent="start">
          <Box text="start" width={100} height={30} />
          <Box text="1" width={100} height={30} />
          <Box text="2" width={100} height={30} />
        </ViewLevel3>

        {/* Center */}
        <ViewLevel3 height={200} justifyContent="center">
          <Box text="1" width={100} height={30} />
          <Box text="center" width={100} height={30} />
          <Box text="3" width={100} height={30} />
        </ViewLevel3>

        {/* End */}
        <ViewLevel3 height={200} justifyContent="end">
          <Box text="1" width={100} height={30} />
          <Box text="2" width={100} height={30} />
          <Box text="end" width={100} height={30} />
        </ViewLevel3>

        {/* Space Between */}
        <ViewLevel3 height={200} justifyContent="space-between">
          <Box text="1" width={100} height={30} />
          <Box text="space-btw" width={100} height={30} />
          <Box text="3" width={100} height={30} />
        </ViewLevel3>

        {/* Space Around */}
        <ViewLevel3 height={200} justifyContent="space-around">
          <Box color={colors?.secondary.DEFAULT.toNumber()} text="1" width={100} height={30} />
          <Box text="space-ard" width={100} height={30} />
          <Box text="3" width={100} height={30} />
        </ViewLevel3>

        {/* Space Evenly */}
        <ViewLevel3 height={200} justifyContent="space-evenly">
          <Box color={colors?.secondary.DEFAULT.toNumber()} text="1" width={100} height={30} />
          <Box text="space-ely" width={100} height={30} />
          <Box text="3" width={100} height={30} />
        </ViewLevel3>
      </View>
    </ViewLevel2>
  )
}

/**
 * AlignItems demonstration - row direction
 * @returns AlignItems demo
 */
function AlignItemsRowExample() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="AlignItems (Row)" style={tokens?.textStyles.large} />

      {/* Start */}
      <ViewLevel3 height={110} direction="row" alignItems="start">
        <Text text="start:" style={tokens?.textStyles.caption} />
        <Box color={0xff6b6b} text="A" width={80} height={50} />
        <Box color={0x4ecdc4} text="B" width={80} height={70} />
        <Box color={0x45b7d1} text="C" width={80} height={30} />
      </ViewLevel3>

      {/* Center */}
      <ViewLevel3 height={110} direction="row" alignItems="center">
        <Text text="center:" style={tokens?.textStyles.caption} />
        <Box text="A" width={80} height={50} />
        <Box text="B" width={80} height={70} />
        <Box text="C" width={80} height={30} />
      </ViewLevel3>

      {/* End */}
      <ViewLevel3 height={110} direction="row" alignItems="end">
        <Text text="end:" style={tokens?.textStyles.caption} />
        <Box text="A" width={80} height={50} />
        <Box text="B" width={80} height={70} />
        <Box text="C" width={80} height={30} />
      </ViewLevel3>

      {/* Stretch */}
      <ViewLevel3 height={110} direction="row" alignItems="stretch">
        <Text text="stretch:" style={tokens?.textStyles.caption} />
        <Box text="A" width={80} height={50} />
        <Box text="B" width={80} height={70} />
        <Box text="C" width={80} height={30} />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Main layout example component
 * @returns Layout example
 */
export function AdvancedLayoutExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <JustifyContentColumnExample />
          <AlignItemsRowExample />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
