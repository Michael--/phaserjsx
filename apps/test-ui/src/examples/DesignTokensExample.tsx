/**
 * Design Tokens Example - demonstrates the new useThemeTokens API
 */
import { ScrollView, Text, useThemeTokens, View } from '@phaserjsx/ui'
import { ViewLevel2 } from './Helper/ViewLevel'

/**
 * Example showing all text style presets
 */
export function DesignTokensExample() {
  const tokens = useThemeTokens()

  if (!tokens) return null

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          {/* Text Style Examples */}
          <ViewLevel2>
            <Text text="Text Style Tokens" style={tokens.textStyles.title} />

            <Text text="Heading Style (36px bold)" style={tokens.textStyles.heading} />
            <Text text="Title Style (28px bold)" style={tokens.textStyles.title} />
            <Text text="Large Style (20px)" style={tokens.textStyles.large} />
            <Text text="Medium/Default Style (16px)" style={tokens.textStyles.medium} />
            <Text text="Small Style (12px)" style={tokens.textStyles.small} />
            <Text text="Caption Style (10px)" style={tokens.textStyles.caption} />
          </ViewLevel2>

          {/* Spacing Examples */}
          <ViewLevel2>
            <Text text="Spacing Tokens" style={tokens.textStyles.title} />
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.xs}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="xs: 4px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.sm}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="sm: 8px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.md}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="md: 16px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.lg}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="lg: 24px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.xl}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="xl: 32px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.xs}>
              <View
                width={tokens.spacing.xxl}
                height={tokens.sizes.md}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
              />
              <Text text="xxl: 48px" style={tokens.textStyles.small} />
            </View>
          </ViewLevel2>

          {/* Border Radius Examples */}
          <ViewLevel2>
            <Text text="Radius Tokens" style={tokens.textStyles.title} />
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.none}
              />
              <Text text="none: 0px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.sm}
              />
              <Text text="sm: 4px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.md}
              />
              <Text text="md: 8px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.lg}
              />
              <Text text="lg: 16px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.xl}
              />
              <Text text="xl: 24px" style={tokens.textStyles.small} />
            </View>
            <View direction="row" gap={tokens.spacing.md} alignItems="center">
              <View
                width={tokens.sizes.lg}
                height={tokens.sizes.lg}
                backgroundColor={tokens.colors.primary.DEFAULT.toNumber()}
                cornerRadius={tokens.radius.xxl}
              />
              <Text text="full: pill/circle" style={tokens.textStyles.small} />
            </View>
          </ViewLevel2>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
