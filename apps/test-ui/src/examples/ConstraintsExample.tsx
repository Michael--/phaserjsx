/**
 * Min/Max Constraints Demo - showcasing minWidth, maxWidth, minHeight, maxHeight
 */
import { Text, useThemeTokens, View } from '@phaserjsx/ui'
import { ScrollView } from '../components'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Responsive button with min/max constraints
 * @returns Button example
 */
function ResponsiveButton() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Responsive Button with Constraints" style={tokens?.textStyles.large} />

      <View direction="row" gap={10} width="fill">
        <View
          width="100%"
          minWidth={80}
          maxWidth={200}
          backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
          padding={10}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="OK" style={tokens?.textStyles.medium} />
        </View>
      </View>

      <Text
        text="Button fills available width but stays between 80px and 200px"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Flexible sidebar with minimum width
 * @returns Sidebar layout example
 */
function FlexibleSidebar() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Flexible Sidebar with minWidth" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="row" gap={10} height={150} width="fill">
        <View
          flex={1}
          minWidth={200}
          backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Sidebar" style={tokens?.textStyles.medium} />
          <Text text="flex={1}" style={tokens?.textStyles.small} />
          <Text text="minWidth={200}" style={tokens?.textStyles.small} />
        </View>

        <View flex={3} backgroundColor={tokens?.colors.surface.dark.toNumber()} padding={10}>
          <Text text="Main Content" style={tokens?.textStyles.medium} />
          <Text text="flex={3}" style={tokens?.textStyles.small} />
        </View>
      </ViewLevel3>

      <Text
        text="Sidebar is flexible but never shrinks below 200px"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Content area with max width for readability
 * @returns Content area example
 */
function ReadableContent() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Readable Content with maxWidth" style={tokens?.textStyles.large} />

      <ViewLevel3 alignItems="center" width="fill">
        <View
          width="fill"
          maxWidth={500}
          backgroundColor={tokens?.colors.surface.dark.toNumber()}
          justifyContent="center"
          alignItems="center"
          padding={10}
        >
          <Text
            text="This content area fills available space..."
            style={tokens?.textStyles.medium}
          />
          <Text
            text="...but never exceeds 600px for better readability"
            style={tokens?.textStyles.small}
          />
        </View>
      </ViewLevel3>

      <Text
        text="Content grows with container but stays readable (max 600px)"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Image gallery with constrained heights
 * @returns Image gallery example
 */
function ConstrainedGallery() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Image Gallery with Height Constraints" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="row" gap={10} width="fill">
        <View
          flex={1}
          minHeight={100}
          maxHeight={200}
          backgroundColor={tokens?.colors.info.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="Image 1" style={tokens?.textStyles.small} />
          <Text text="minHeight={100}" style={tokens?.textStyles.caption} />
          <Text text="maxHeight={200}" style={tokens?.textStyles.caption} />
        </View>

        <View
          flex={1}
          minHeight={100}
          maxHeight={200}
          backgroundColor={tokens?.colors.success.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="Image 2" style={tokens?.textStyles.small} />
          <Text text="minHeight={100}" style={tokens?.textStyles.caption} />
          <Text text="maxHeight={200}" style={tokens?.textStyles.caption} />
        </View>

        <View
          flex={1}
          minHeight={100}
          maxHeight={200}
          backgroundColor={tokens?.colors.warning.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="Image 3" style={tokens?.textStyles.small} />
          <Text text="minHeight={100}" style={tokens?.textStyles.caption} />
          <Text text="maxHeight={200}" style={tokens?.textStyles.caption} />
        </View>
      </ViewLevel3>

      <Text
        text="Images scale proportionally but stay between 100-200px height"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Flex children with competing constraints
 * @returns Complex flex example
 */
function ComplexFlexConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Complex Flex with Multiple Constraints" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="row" gap={10} height={120} width="fill">
        <View
          flex={1}
          minWidth={100}
          maxWidth={150}
          backgroundColor={tokens?.colors.error.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="A" style={tokens?.textStyles.medium} />
          <Text text="flex={1}" style={tokens?.textStyles.caption} />
          <Text text="100-150px" style={tokens?.textStyles.caption} />
        </View>

        <View
          flex={2}
          minWidth={150}
          maxWidth={300}
          backgroundColor={tokens?.colors.warning.DEFAULT.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="B" style={tokens?.textStyles.medium} />
          <Text text="flex={2}" style={tokens?.textStyles.caption} />
          <Text text="150-300px" style={tokens?.textStyles.caption} />
        </View>

        <View
          flex={1}
          minWidth={100}
          maxWidth={200}
          backgroundColor={tokens?.colors.info.DEFAULT.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text="C" style={tokens?.textStyles.medium} />
          <Text text="flex={1}" style={tokens?.textStyles.caption} />
          <Text text="100-200px" style={tokens?.textStyles.caption} />
        </View>
      </ViewLevel3>

      <Text
        text="Flex distribution respects all individual min/max constraints"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Percentage with constraints
 * @returns Percentage constraints example
 */
function PercentageWithConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Percentage Sizes with Constraints" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="column" gap={10} width="fill">
        <View
          width="80%"
          maxWidth={400}
          height={40}
          backgroundColor={tokens?.colors.accent.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text='width="80%" maxWidth={400}' style={tokens?.textStyles.small} />
        </View>

        <View
          width="60%"
          minWidth={300}
          height={40}
          backgroundColor={tokens?.colors.primary.dark.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text text='width="60%" minWidth={300}' style={tokens?.textStyles.small} />
        </View>

        <View
          width="100%"
          minWidth={200}
          maxWidth={500}
          height={40}
          backgroundColor={tokens?.colors.success.DEFAULT.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            text='width="100%" minWidth={200} maxWidth={500}'
            style={tokens?.textStyles.small}
          />
        </View>
        <View
          width="100%"
          minWidth={200}
          maxWidth={2000} // larger than container to test clamping
          height={40}
          backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            text='width="100%" minWidth={200} maxWidth={2000}'
            style={tokens?.textStyles.small}
          />
        </View>
      </ViewLevel3>

      <Text
        text="Percentages are calculated first, then clamped to constraints"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * SizeValue constraints - percentage-based
 * @returns Percentage constraint examples
 */
function PercentageConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Percentage-Based Constraints (NEW)" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="row" gap={10} height={120} width="fill">
        <View
          flex={1}
          minWidth="20%"
          backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Box 1" style={tokens?.textStyles.medium} />
          <Text text="minWidth='20%'" style={tokens?.textStyles.small} />
        </View>

        <View
          flex={1}
          maxWidth="30%"
          backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Box 2" style={tokens?.textStyles.medium} />
          <Text text="maxWidth='30%'" style={tokens?.textStyles.small} />
        </View>

        <View
          flex={1}
          minWidth="25%"
          maxWidth="50%"
          backgroundColor={tokens?.colors.success.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Box 3" style={tokens?.textStyles.medium} />
          <Text text="min='25%' max='50%'" style={tokens?.textStyles.small} />
        </View>
      </ViewLevel3>

      <Text
        text="Constraints relative to parent: 20%, 30%, and 25-50%"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * SizeValue constraints - viewport-based
 * @returns Viewport constraint examples
 */
function ViewportConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Viewport-Based Constraints (NEW)" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="column" gap={10} width="fill">
        <View
          width="100%"
          minHeight="15vh"
          backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Viewport Height Constrained" style={tokens?.textStyles.medium} />
          <Text text="minHeight='15vh'" style={tokens?.textStyles.small} />
        </View>

        <View
          width="100%"
          maxWidth="90vw"
          backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Viewport Width Constrained" style={tokens?.textStyles.medium} />
          <Text text="maxWidth='90vw'" style={tokens?.textStyles.small} />
        </View>
      </ViewLevel3>

      <Text
        text="Constraints relative to viewport: 15vh and 90vw"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * SizeValue constraints - calc expressions
 * @returns Calc constraint examples
 */
function CalcConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Calc Expression Constraints (NEW)" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="column" gap={10} width="fill">
        <View
          width="100%"
          minWidth="calc(50% - 20px)"
          backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Dynamic Minimum" style={tokens?.textStyles.medium} />
          <Text text="minWidth='calc(50% - 20px)'" style={tokens?.textStyles.small} />
        </View>

        <View
          width="100%"
          maxHeight="calc(100vh - 100px)"
          backgroundColor={tokens?.colors.accent.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Viewport Calc" style={tokens?.textStyles.medium} />
          <Text text="maxHeight='calc(100vh - 100px)'" style={tokens?.textStyles.small} />
        </View>

        <View
          flex={1}
          minWidth="calc(30% + 50px)"
          maxWidth="calc(70% - 20px)"
          backgroundColor={tokens?.colors.success.DEFAULT.toNumber()}
          padding={10}
        >
          <Text text="Combined Calc" style={tokens?.textStyles.medium} />
          <Text text="min='calc(30% + 50px)'" style={tokens?.textStyles.small} />
          <Text text="max='calc(70% - 20px)'" style={tokens?.textStyles.small} />
        </View>
      </ViewLevel3>

      <Text
        text="Complex calculations: percentage, viewport, and math operations"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * SizeValue constraints - text wrapping
 * @returns Text constraint examples
 */
function TextConstraints() {
  const tokens = useThemeTokens()
  return (
    <ViewLevel2>
      <Text text="Text maxWidth with SizeValue (NEW)" style={tokens?.textStyles.large} />

      <ViewLevel3 direction="column" gap={10} width="fill">
        <View backgroundColor={tokens?.colors.surface.dark.toNumber()} padding={10}>
          <Text
            text="This is a long text that will wrap at 80% of the parent width using percentage-based maxWidth constraint."
            maxWidth="80%"
            style={tokens?.textStyles.medium}
          />
        </View>

        <View backgroundColor={tokens?.colors.surface.dark.toNumber()} padding={10}>
          <Text
            text="This text wraps at 50vw (50% of viewport width) which is responsive to screen size."
            maxWidth="50vw"
            style={tokens?.textStyles.medium}
          />
        </View>

        <View backgroundColor={tokens?.colors.surface.dark.toNumber()} padding={10}>
          <Text
            text="This text uses calc(100% - 40px) to wrap with padding consideration."
            maxWidth="calc(100% - 40px)"
            style={tokens?.textStyles.medium}
          />
        </View>
      </ViewLevel3>

      <Text
        text="Text wrapping with percentage, viewport, and calc maxWidth"
        style={tokens?.textStyles.caption}
      />
    </ViewLevel2>
  )
}

/**
 * Main constraints example component
 * @returns Constraints examples
 */
export function ConstraintsExample() {
  const tokens = useThemeTokens()
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2 width={'fill'}>
          <Text text="Min/Max Constraints Examples" style={tokens?.textStyles.title} />

          <ViewLevel2>
            <Text text="🎯 Fixed Number Constraints" style={tokens?.textStyles.large} />
          </ViewLevel2>

          <ResponsiveButton />
          <FlexibleSidebar />
          <ReadableContent />
          <ConstrainedGallery />
          <ComplexFlexConstraints />
          <PercentageWithConstraints />

          <ViewLevel2>
            <Text text="✨ SizeValue Constraints (NEW)" style={tokens?.textStyles.large} />
            <Text
              text="All min/max constraints now support: percentage, viewport units (vw/vh), and calc() expressions"
              style={tokens?.textStyles.caption}
            />
          </ViewLevel2>

          <PercentageConstraints />
          <ViewportConstraints />
          <CalcConstraints />
          <TextConstraints />

          <ViewLevel2>
            <Text text="💡 Key Benefits:" style={tokens?.textStyles.medium} />
            <Text
              text="• Responsive layouts that adapt gracefully"
              style={tokens?.textStyles.small}
            />
            <Text
              text="• Prevent content from becoming too small or too large"
              style={tokens?.textStyles.small}
            />
            <Text text="• Better control over flex distribution" style={tokens?.textStyles.small} />
            <Text text="• Maintain readability and usability" style={tokens?.textStyles.small} />
            <Text
              text="• NEW: Percentage, viewport, and calc() support for all constraints"
              style={tokens?.textStyles.small}
            />
          </ViewLevel2>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
