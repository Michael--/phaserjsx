import {
  ScrollView,
  Text,
  useForceRedraw,
  useSpring,
  useThemeTokens,
  View,
} from '@number10/phaserjsx'
import { Button } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Flex Grid Examples demonstrating flexWrap and alignContent
 * Shows how multi-line flex layouts enable responsive grid patterns
 * @returns Flex grid demo JSX
 */
export function FlexGridExample() {
  const tokens = useThemeTokens()

  const colors = [
    tokens?.colors.error.dark.toNumber() ?? 0xff4444,
    tokens?.colors.success.dark.toNumber() ?? 0x44ff44,
    tokens?.colors.info.dark.toNumber() ?? 0x4444ff,
    tokens?.colors.warning.dark.toNumber() ?? 0xffaa44,
    tokens?.colors.primary.DEFAULT.toNumber() ?? 0x8844ff,
    tokens?.colors.secondary.DEFAULT.toNumber() ?? 0xff44aa,
  ]
  function AutoWrapGrid() {
    return (
      <View direction="column" gap={5}>
        <Text text="1. Auto-Wrap Grid - Fixed Items" style={tokens?.textStyles.large} />
        <ViewLevel3 direction="row" flexWrap="wrap" gap={10} width={'fill'}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              width={90}
              height={90}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.large} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function ResponsiveCards() {
    const cardWidths = [180, 140, 160, 200, 150, 170]
    return (
      <View direction="column" gap={5}>
        <Text text="2. Mixed Card Sizes - Variable Width" style={tokens?.textStyles.large} />
        <ViewLevel3 direction="row" flexWrap="wrap" gap={15} width={'fill'} justifyContent="center">
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              width={cardWidths[i]}
              height={100}
              backgroundColor={colors[i % colors.length]}
              padding={10}
              justifyContent="center"
            >
              <Text text={`Card ${i + 1}`} style={tokens?.textStyles.medium} />
              <Text text={`${cardWidths[i]}px`} style={tokens?.textStyles.small} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function AlignContentSpaceBetween() {
    return (
      <View direction="column" gap={5}>
        <Text text="3. AlignContent: space-between" style={tokens?.textStyles.large} />
        <ViewLevel3
          direction="row"
          flexWrap="wrap"
          alignContent="space-between"
          gap={10}
          width={'fill'}
          height={250}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <View
              key={i}
              width={80}
              height={60}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.medium} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function AlignContentCenter() {
    return (
      <View direction="column" gap={5}>
        <Text text="4. AlignContent: center" style={tokens?.textStyles.large} />
        <ViewLevel3
          direction="row"
          flexWrap="wrap"
          alignContent="center"
          gap={10}
          width={'fill'}
          height={250}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              width={90}
              height={70}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.medium} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function WrapReverse() {
    return (
      <View direction="column" gap={5}>
        <Text text="5. Wrap-Reverse - Lines in Reverse Order" style={tokens?.textStyles.large} />
        <ViewLevel3 direction="row" flexWrap="wrap-reverse" gap={10} width={'fill'}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={i}
              width={70}
              height={70}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.small} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function ColumnWrap() {
    return (
      <View direction="column" gap={5}>
        <Text text="6. Column Direction Wrap" style={tokens?.textStyles.large} />
        <ViewLevel3 direction="column" flexWrap="wrap" gap={10} width={'fill'} height={200}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              width={100}
              height={45}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.small} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  function ToolbarOverflow(props: { width: number }) {
    return (
      <View direction="column" gap={5}>
        <Text text="7. Toolbar with Overflow Wrap" style={tokens?.textStyles.large} />
        <ViewLevel3 direction="row" flexWrap="wrap" gap={8} width={props.width}>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="New" style={tokens?.textStyles.small} />
          </View>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Open" style={tokens?.textStyles.small} />
          </View>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Save" style={tokens?.textStyles.small} />
          </View>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Export" style={tokens?.textStyles.small} />
          </View>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Share" style={tokens?.textStyles.small} />
          </View>
          <View
            width={80}
            height={40}
            backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Help" style={tokens?.textStyles.small} />
          </View>
        </ViewLevel3>
      </View>
    )
  }

  function JustifyContentSpaceAround() {
    return (
      <View direction="column" gap={5}>
        <Text text="8. Justify Content: space-around" style={tokens?.textStyles.large} />
        <ViewLevel3
          direction="row"
          flexWrap="wrap"
          justifyContent="space-around"
          gap={10}
          width={'fill'}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              width={85}
              height={65}
              backgroundColor={colors[i % colors.length]}
              alignItems="center"
              justifyContent="center"
            >
              <Text text={`${i + 1}`} style={tokens?.textStyles.medium} />
            </View>
          ))}
        </ViewLevel3>
      </View>
    )
  }

  const [w42, setW42] = useSpring(400, 'instant')
  useForceRedraw(20, w42)

  const width = w42.value

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2 gap={20}>
          <Text text="Flex Grid Examples" style={tokens?.textStyles.title} />
          <View gap={10} direction="row">
            <Button text="300" onClick={() => setW42(300)} />
            <Button text="400" onClick={() => setW42(400)} />
            <Button text="600" onClick={() => setW42(600)} />
            <Button text="800" onClick={() => setW42(800)} />
          </View>
          <ViewLevel2 gap={20} direction="row">
            <ViewLevel2 width={width} gap={20}>
              <AutoWrapGrid />
              <ResponsiveCards />
            </ViewLevel2>
            <ViewLevel2 width={width} gap={20}>
              <AlignContentSpaceBetween />
              <AlignContentCenter />
              <WrapReverse />
            </ViewLevel2>
            <ViewLevel2 width={width} gap={20}>
              <ColumnWrap />
              <ToolbarOverflow width={width} />
              <JustifyContentSpaceAround />
            </ViewLevel2>
          </ViewLevel2>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
