/** @jsxImportSource @phaserjsx/ui */
import { ScrollView, Text, View, WrapText, useThemeTokens } from '@phaserjsx/ui'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

/**
 * Basic WrapText Example
 */
function BasicWrapTextExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Basic Auto-Wrap" style={tokens?.textStyles.heading} />
      <View width={300} maxWidth={300} backgroundColor={0xf0f0f0} padding={16} cornerRadius={8}>
        <WrapText text="This is a long text that will automatically wrap to fit within the container width. No manual configuration needed!" />
      </View>
    </ViewLevel3>
  )
}

/**
 * Styled WrapText Example
 */
function StyledWrapTextExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Styled WrapText" style={tokens?.textStyles.heading} />
      <View width={400} backgroundColor={0xe3f2fd} padding={20} cornerRadius={8}>
        <WrapText
          text="This text has custom styling applied. Font size, color, and alignment can all be controlled while maintaining automatic wrapping."
          style={{ fontSize: '18px', color: '#1565c0' }}
          align="center"
        />
      </View>
    </ViewLevel3>
  )
}

/**
 * Narrow Container Example
 */
function NarrowContainerExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Narrow Container" style={tokens?.textStyles.heading} />
      <View width={200} backgroundColor={0xfff3e0} padding={12} cornerRadius={8}>
        <WrapText text="Even in narrow containers, text wraps gracefully and remains readable." />
      </View>
    </ViewLevel3>
  )
}

/**
 * Wide Container Example
 */
function WideContainerExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Wide Container" style={tokens?.textStyles.heading} />
      <View width={600} backgroundColor={0xe8f5e9} padding={24} cornerRadius={8}>
        <WrapText
          text="In wider containers, the text can span multiple lines comfortably. This is useful for descriptions, explanations, or any content that needs more breathing room. The wrapping happens automatically based on the available width."
          style={{ fontSize: '16px' }}
        />
      </View>
    </ViewLevel3>
  )
}

/**
 * No Wrap Example
 */
function NoWrapExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Disabled Wrapping" style={tokens?.textStyles.heading} />
      <View width={300} backgroundColor={0xfce4ec} padding={16} cornerRadius={8}>
        <WrapText
          text="This text has wrapping disabled and will overflow the container."
          wrap={false}
        />
      </View>
    </ViewLevel3>
  )
}

/**
 * Multiple Paragraphs Example
 */
function MultipleParagraphsExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Multiple Paragraphs" style={tokens?.textStyles.heading} />
      <View
        width={500}
        backgroundColor={0xf3e5f5}
        padding={20}
        cornerRadius={8}
        direction="column"
        gap={12}
      >
        <WrapText text="First paragraph with some content that wraps automatically." />
        <WrapText text="Second paragraph with more detailed information. This demonstrates how multiple WrapText components can be used together in a layout with proper spacing." />
        <WrapText text="Final paragraph to conclude the example." />
      </View>
    </ViewLevel3>
  )
}

/**
 * Dynamic Width Example
 */
function DynamicWidthExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Dynamic Width (Fill)" style={tokens?.textStyles.heading} />
      <View backgroundColor={0xfff9c4} padding={16} cornerRadius={8} width="fill">
        <WrapText text="This text is in a container with width='fill', so it adapts to the parent's width. Try resizing the viewport to see how it responds!" />
      </View>
    </ViewLevel3>
  )
}

/**
 * Padding Offset Example
 */
function PaddingOffsetExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="With Padding Offset" style={tokens?.textStyles.heading} />
      <View width={400} backgroundColor={0xe0f2f1} padding={24} cornerRadius={8}>
        <WrapText
          text="This text accounts for the container's padding using paddingOffset, ensuring proper wrapping without overflow."
          paddingOffset={48}
        />
      </View>
    </ViewLevel3>
  )
}

/**
 * Main WrapText Example Component
 */
export function WrapTextExample() {
  return (
    <ScrollView width="100%" height="100%">
      <ViewLevel2>
        <SectionHeader title="WrapText Examples" />
        <View direction="column" gap={32}>
          <BasicWrapTextExample />
          <StyledWrapTextExample />
          <NarrowContainerExample />
          <WideContainerExample />
          <NoWrapExample />
          <MultipleParagraphsExample />
          <DynamicWidthExample />
          <PaddingOffsetExample />
        </View>
      </ViewLevel2>
    </ScrollView>
  )
}
