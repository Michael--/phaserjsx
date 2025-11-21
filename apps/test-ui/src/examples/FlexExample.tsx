import { Text, useThemeTokens, View } from '@phaserjsx/ui'
import { ViewLevel1, ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Flex vs Spacer Demo
 * Shows two different approaches to fill remaining space
 * @returns Flex demo JSX
 */
export function FlexExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel1 width={700}>
      <ViewLevel2>
        <Text text="Flex Layout Examples" style={tokens?.textStyles.title} />

        {/* Example 1: Basic flex */}
        <View direction="column" gap={5} width={'fill'}>
          <Text text="1. Basic Flex - Fixed + Flexible" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="row" gap={10} width={'fill'}>
            <View
              width={100}
              backgroundColor={tokens?.colors.error.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Fixed" style={tokens?.textStyles.medium} />
              <Text text="100px" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={1}
              backgroundColor={tokens?.colors.success.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={1}" style={tokens?.textStyles.medium} />
              <Text text="fills remaining" style={tokens?.textStyles.small} />
            </View>
          </ViewLevel3>
        </View>

        {/* Example 2: Spacer pattern */}
        <View direction="column" gap={5}>
          <Text text="2. Spacer Pattern - Push to edges" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="row" gap={10} width={'fill'}>
            <View
              width={120}
              backgroundColor={tokens?.colors.error.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Left" style={tokens?.textStyles.medium} />
              <Text text="120px" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={1}
              backgroundColor={tokens?.colors.surface.dark.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Spacer" style={tokens?.textStyles.small} />
              <Text text="flex={1}" style={tokens?.textStyles.caption} />
            </View>
            <View
              width={120}
              backgroundColor={tokens?.colors.info.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Right" style={tokens?.textStyles.medium} />
              <Text text="120px" style={tokens?.textStyles.small} />
            </View>
          </ViewLevel3>
        </View>

        {/* Example 3: Proportional flex */}
        <View direction="column" gap={5}>
          <Text text="3. Proportional Flex Ratios - 1:2:3" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="row" gap={10} width={'fill'}>
            <View
              flex={1}
              backgroundColor={tokens?.colors.warning.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={1}" style={tokens?.textStyles.medium} />
              <Text text="1 part" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={2}
              backgroundColor={tokens?.colors.warning.DEFAULT.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={2}" style={tokens?.textStyles.medium} />
              <Text text="2 parts (2x wider)" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={3}
              backgroundColor={tokens?.colors.info.DEFAULT.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={3}" style={tokens?.textStyles.medium} />
              <Text text="3 parts (3x wider)" style={tokens?.textStyles.small} />
            </View>
          </ViewLevel3>
        </View>

        {/* Example 4: Mixed fixed + flex */}
        <View direction="column" gap={5}>
          <Text text="4. Mixed Layout - Multiple Fixed + Flex" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="row" gap={10} width={'fill'}>
            <View
              width={80}
              backgroundColor={tokens?.colors.error.dark.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="80px" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={1}
              backgroundColor={tokens?.colors.success.dark.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={1}" style={tokens?.textStyles.small} />
            </View>
            <View
              width={100}
              backgroundColor={tokens?.colors.info.dark.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="100px" style={tokens?.textStyles.small} />
            </View>
            <View
              flex={2}
              backgroundColor={tokens?.colors.accent.dark.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={2}" style={tokens?.textStyles.small} />
            </View>
            <View
              width={80}
              backgroundColor={tokens?.colors.info.DEFAULT.toNumber()}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="80px" style={tokens?.textStyles.small} />
            </View>
          </ViewLevel3>
        </View>

        {/* Example 5: Column layout */}
        <View direction="column" gap={5}>
          <Text text="5. Column Layout with Flex (Vertical)" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="column" gap={10} height={250} width={'fill'}>
            <View
              flex={1}
              backgroundColor={tokens?.colors.error.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={1} - Header" style={tokens?.textStyles.medium} />
            </View>
            <View
              flex={3}
              backgroundColor={tokens?.colors.success.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={3} - Main Content (3x taller)" style={tokens?.textStyles.medium} />
            </View>
            <View
              flex={1}
              backgroundColor={tokens?.colors.info.dark.toNumber()}
              padding={10}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="flex={1} - Footer" style={tokens?.textStyles.medium} />
            </View>
          </ViewLevel3>
        </View>

        {/* Example 6: Nested flex */}
        <View direction="column" gap={5}>
          <Text text="6. Nested Flex Layouts" style={tokens?.textStyles.large} />
          <ViewLevel3 direction="column" gap={10} height={200} width={'fill'}>
            <View direction="row" gap={10} flex={1} width={'fill'}>
              <View
                flex={1}
                backgroundColor={tokens?.colors.error.dark.toNumber()}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Top Left" style={tokens?.textStyles.small} />
                <Text text="flex={1}" style={tokens?.textStyles.caption} />
              </View>
              <View
                flex={2}
                backgroundColor={tokens?.colors.warning.dark.toNumber()}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Top Center" style={tokens?.textStyles.small} />
                <Text text="flex={2}" style={tokens?.textStyles.caption} />
              </View>
              <View
                flex={1}
                backgroundColor={tokens?.colors.warning.DEFAULT.toNumber()}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Top Right" style={tokens?.textStyles.small} />
                <Text text="flex={1}" style={tokens?.textStyles.caption} />
              </View>
            </View>
            <View direction="row" gap={10} flex={1.5} width={'fill'}>
              <View
                flex={2}
                backgroundColor={tokens?.colors.success.dark.toNumber()}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Bottom Left" style={tokens?.textStyles.small} />
                <Text text="flex={2}" style={tokens?.textStyles.caption} />
              </View>
              <View
                flex={1}
                backgroundColor={tokens?.colors.info.dark.toNumber()}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Bottom Right" style={tokens?.textStyles.small} />
                <Text text="flex={1}" style={tokens?.textStyles.caption} />
              </View>
            </View>
          </ViewLevel3>
        </View>

        {/* Key Concepts */}
        <View direction="column" gap={5}>
          <Text text="💡 Key Concepts:" style={tokens?.textStyles.medium} />
          <Text text="• flex={1} takes available space equally" style={tokens?.textStyles.small} />
          <Text text="• flex={2} takes 2x space of flex={1}" style={tokens?.textStyles.small} />
          <Text
            text="• Fixed sizes are respected, flex fills the rest"
            style={tokens?.textStyles.small}
          />
          <Text text="• Works in both row and column directions" style={tokens?.textStyles.small} />
        </View>
      </ViewLevel2>
    </ViewLevel1>
  )
}
