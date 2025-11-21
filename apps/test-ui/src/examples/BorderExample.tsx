/**
 * Border and CornerRadius Demo - showcasing new background features
 */
import { Text, useThemeTokens } from '@phaserjsx/ui'
import { ViewLevel1, ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Border and corner radius demonstration
 * @returns BorderDemo component
 */
export function BorderExample() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel1>
      <ViewLevel2>
        <Text text="Border & Corner Radius Demo" style={tokens?.textStyles.title} />

        {/* Simple border */}
        <ViewLevel3
          width={150}
          height={80}
          borderWidth={2}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Simple Border" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* Rounded corners */}
        <ViewLevel3
          width={150}
          height={80}
          cornerRadius={15}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Rounded Corners" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* Border + rounded corners */}
        <ViewLevel3
          width={150}
          height={80}
          borderWidth={3}
          borderColor={tokens?.colors.primary.DEFAULT.toNumber()}
          cornerRadius={20}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Border + Rounded" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* Different corner radii */}
        <ViewLevel3
          width={150}
          height={80}
          borderWidth={2}
          borderColor={tokens?.colors.warning.DEFAULT.toNumber()}
          cornerRadius={{ tl: 5, tr: 20, bl: 20, br: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Mixed Corners" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* Thick border showcase */}
        <ViewLevel3
          width={150}
          height={80}
          borderWidth={6}
          borderColor={tokens?.colors.info.DEFAULT.toNumber()}
          cornerRadius={25}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Thick Border" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* No background, border only */}
        <ViewLevel3
          width={150}
          height={80}
          backgroundColor={undefined}
          borderWidth={3}
          borderColor={tokens?.colors.error.DEFAULT.toNumber()}
          cornerRadius={10}
          justifyContent="center"
          alignItems="center"
        >
          <Text text="Border Only" style={tokens?.textStyles.small} />
        </ViewLevel3>

        {/* Overflow hidden - text clipping */}
        <ViewLevel3 width={150} height={80} cornerRadius={10} overflow="hidden">
          <Text
            text="This is a very long text that will be clipped by the overflow hidden property"
            style={tokens?.textStyles.large}
          />
          <ViewLevel3
            width={70}
            height={35}
            borderWidth={2}
            borderColor={tokens?.colors.border.lightest.toNumber()}
            overflow="hidden"
          >
            <Text text="Nested Box" style={tokens?.textStyles.caption} />
          </ViewLevel3>
        </ViewLevel3>

        {/* Overflow visible - comparison */}
        <ViewLevel3 width={150} height={60} cornerRadius={10} overflow="visible">
          <Text text="Same text but overflow visible (default)" style={tokens?.textStyles.small} />
        </ViewLevel3>
      </ViewLevel2>
    </ViewLevel1>
  )
}
