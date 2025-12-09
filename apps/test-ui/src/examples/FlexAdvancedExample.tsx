import { ScrollView, Text, useThemeTokens, View } from '@number10/phaserjsx'
import { ViewLevel2, ViewLevel3 } from './Helper/ViewLevel'

/**
 * Advanced Flexbox Demo - flexShrink and flexBasis
 * Demonstrates shrinking behavior and flex-basis usage
 * @returns Advanced flex demo JSX
 */
export function FlexAdvancedExample() {
  const tokens = useThemeTokens()

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2 width="fill">
          <Text text="Advanced Flexbox: Shrink & Basis" style={tokens?.textStyles.title} />

          <View direction="row" gap={5} alignItems="start">
            {/* Example 1: flexShrink basics */}
            <View direction="column" gap={5}>
              <Text
                text="1. FlexShrink - Proportional Shrinking"
                style={tokens?.textStyles.large}
              />
              <Text
                text="Container: 300px | Items: 200px + 200px = 400px (overflow!)"
                style={tokens?.textStyles.small}
              />
              <ViewLevel3 direction="row" gap={0} width={300}>
                <View
                  width={200}
                  flexShrink={1}
                  backgroundColor={tokens?.colors.primary.dark.toNumber()}
                  padding={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="flexShrink={1}" style={tokens?.textStyles.medium} />
                  <Text text="Width: 200px" style={tokens?.textStyles.small} />
                  <Text text="Shrinks equally" style={tokens?.textStyles.caption} />
                </View>
                <View
                  width={200}
                  flexShrink={1}
                  backgroundColor={tokens?.colors.secondary.dark.toNumber()}
                  padding={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="flexShrink={1}" style={tokens?.textStyles.medium} />
                  <Text text="Width: 200px" style={tokens?.textStyles.small} />
                  <Text text="Shrinks equally" style={tokens?.textStyles.caption} />
                </View>
              </ViewLevel3>
              <Text
                text="Result: Each shrinks by 50px → 150px + 150px = 300px ✓"
                style={tokens?.textStyles.caption}
              />
            </View>

            {/* Example 2: Different shrink ratios */}
            <View direction="column" gap={5}>
              <Text text="2. Different Shrink Ratios" style={tokens?.textStyles.large} />
              <Text
                text="Container: 300px | Items: 200px + 200px = 400px"
                style={tokens?.textStyles.small}
              />
              <ViewLevel3 direction="row" gap={0} width={300}>
                <View
                  width={200}
                  flexShrink={1}
                  backgroundColor={tokens?.colors.success.dark.toNumber()}
                  padding={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="flexShrink={1}" style={tokens?.textStyles.medium} />
                  <Text text="Shrinks 1x" style={tokens?.textStyles.small} />
                </View>
                <View
                  width={200}
                  flexShrink={2}
                  backgroundColor={tokens?.colors.warning.dark.toNumber()}
                  padding={10}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text text="flexShrink={2}" style={tokens?.textStyles.medium} />
                  <Text text="Shrinks 2x faster" style={tokens?.textStyles.small} />
                </View>
              </ViewLevel3>
              <Text
                text="Result: First shrinks 33px, second 67px → 167px + 133px = 300px"
                style={tokens?.textStyles.caption}
              />
            </View>
          </View>

          {/* Example 3: flexShrink: 0 */}
          <View direction="column" gap={5}>
            <Text
              text="3. Prevent Shrinking with flexShrink={0}"
              style={tokens?.textStyles.large}
            />
            <Text
              text="Container: 300px | Icon: 80px (fixed), Text: 250px"
              style={tokens?.textStyles.small}
            />
            <ViewLevel3 direction="row" gap={0} width={300}>
              <View
                width={80}
                flexShrink={0}
                backgroundColor={tokens?.colors.error.dark.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Icon" style={tokens?.textStyles.medium} />
                <Text text="flexShrink={0}" style={tokens?.textStyles.caption} />
                <Text text="NEVER shrinks" style={tokens?.textStyles.caption} />
              </View>
              <View
                width={250}
                flexShrink={1}
                backgroundColor={tokens?.colors.info.dark.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Long Text Content..." style={tokens?.textStyles.medium} />
                <Text text="flexShrink={1}" style={tokens?.textStyles.small} />
                <Text text="Absorbs all shrinkage" style={tokens?.textStyles.caption} />
              </View>
            </ViewLevel3>
            <Text
              text="Result: Icon stays 80px, Text shrinks to 220px"
              style={tokens?.textStyles.caption}
            />
          </View>

          {/* Example 4: flexBasis basics */}
          <View direction="column" gap={5}>
            <Text text="4. FlexBasis - Initial Size Before Flex" style={tokens?.textStyles.large} />
            <Text
              text="Container: 600px | Basis: 100px + 100px = 200px, then grow 1:2"
              style={tokens?.textStyles.small}
            />
            <ViewLevel3 direction="row" gap={0} width={600}>
              <View
                flex={1}
                flexBasis={100}
                backgroundColor={tokens?.colors.primary.DEFAULT.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flex={1}" style={tokens?.textStyles.medium} />
                <Text text="flexBasis={100}" style={tokens?.textStyles.small} />
                <Text text="Starts at 100px" style={tokens?.textStyles.caption} />
              </View>
              <View
                flex={2}
                flexBasis={100}
                backgroundColor={tokens?.colors.secondary.DEFAULT.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flex={2}" style={tokens?.textStyles.medium} />
                <Text text="flexBasis={100}" style={tokens?.textStyles.small} />
                <Text text="Starts at 100px" style={tokens?.textStyles.caption} />
              </View>
            </ViewLevel3>
            <Text
              text="Result: Free 400px split 1:2 → 233px + 367px = 600px"
              style={tokens?.textStyles.caption}
            />
          </View>

          {/* Example 5: Percentage flexBasis */}
          <View direction="column" gap={5}>
            <Text text="5. Percentage FlexBasis" style={tokens?.textStyles.large} />
            <Text
              text="Container: 500px | Basis: 25% + 25% = 250px, then grow equally"
              style={tokens?.textStyles.small}
            />
            <ViewLevel3 direction="row" gap={0} width={500}>
              <View
                flex={1}
                flexBasis="25%"
                backgroundColor={tokens?.colors.success.DEFAULT.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flex={1}" style={tokens?.textStyles.medium} />
                <Text text='flexBasis="25%"' style={tokens?.textStyles.small} />
                <Text text="Starts at 125px" style={tokens?.textStyles.caption} />
              </View>
              <View
                flex={1}
                flexBasis="25%"
                backgroundColor={tokens?.colors.warning.DEFAULT.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flex={1}" style={tokens?.textStyles.medium} />
                <Text text='flexBasis="25%"' style={tokens?.textStyles.small} />
                <Text text="Starts at 125px" style={tokens?.textStyles.caption} />
              </View>
            </ViewLevel3>
            <Text
              text="Result: Free 250px split equally → 250px + 250px = 500px"
              style={tokens?.textStyles.caption}
            />
          </View>

          {/* Example 6: Combined - Real-world toolbar */}
          <View direction="column" gap={5}>
            <Text text="6. Real-World: Responsive Toolbar" style={tokens?.textStyles.large} />
            <Text
              text="Icon (fixed) + Title (flexible) + Actions (fixed)"
              style={tokens?.textStyles.small}
            />
            <ViewLevel3 direction="row" gap={10} width={'fill'}>
              <View
                width={50}
                flexShrink={0}
                backgroundColor={tokens?.colors.primary.dark.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="☰" style={tokens?.textStyles.large} />
              </View>
              <View
                flex={1}
                flexShrink={1}
                minWidth={100}
                backgroundColor={tokens?.colors.surface.dark.toNumber()}
                padding={10}
                justifyContent="center"
              >
                <Text text="App Title Here..." style={tokens?.textStyles.medium} />
                <Text
                  text="flex={1}, flexShrink={1}, minWidth={100}"
                  style={tokens?.textStyles.caption}
                />
              </View>
              <View
                width={100}
                flexShrink={0}
                backgroundColor={tokens?.colors.secondary.dark.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="Actions" style={tokens?.textStyles.medium} />
              </View>
            </ViewLevel3>
            <Text
              text="Title shrinks when space is tight, but never below 100px"
              style={tokens?.textStyles.caption}
            />
          </View>

          {/* Example 7: Column direction */}
          <View direction="column" gap={5} width={'fill'}>
            <Text text="7. Vertical Shrinking (Column)" style={tokens?.textStyles.large} />
            <Text
              text="Container: 300px height | Items: 200px + 200px = 400px"
              style={tokens?.textStyles.small}
            />
            <ViewLevel3 direction="column" gap={0} width={200} height={300}>
              <View
                height={200}
                flexShrink={1}
                backgroundColor={tokens?.colors.info.dark.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flexShrink={1}" style={tokens?.textStyles.medium} />
                <Text text="Height: 200px" style={tokens?.textStyles.small} />
                <Text text="Shrinks to 150px" style={tokens?.textStyles.caption} />
              </View>
              <View
                height={200}
                flexShrink={1}
                backgroundColor={tokens?.colors.error.DEFAULT.toNumber()}
                padding={10}
                alignItems="center"
                justifyContent="center"
              >
                <Text text="flexShrink={1}" style={tokens?.textStyles.medium} />
                <Text text="Height: 200px" style={tokens?.textStyles.small} />
                <Text text="Shrinks to 150px" style={tokens?.textStyles.caption} />
              </View>
            </ViewLevel3>
          </View>

          <Text text={'EOF'} />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
