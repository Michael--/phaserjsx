/**
 * Theme System Example - demonstrates global and local theme usage
 */
import { Text, View, createTheme, useTheme } from '@phaserjsx/ui'
import { ScrollView } from '../components'
import { ViewLevel2 } from './Helper'

/**
 * Component that uses theme context
 */
function ThemedText(props: { text: string }) {
  const theme = useTheme()
  return (
    <>
      <Text text={`${props.text} (Theme: ${theme ? 'Custom' : 'Global'})`} />
      <Text text={`${JSON.stringify(theme)}`} />
    </>
  )
}

/**
 * Theme Example - demonstrates the theme system
 */
export function ThemeExample() {
  const ourTheme = createTheme({
    Text: {
      style: {
        color: '#00ff00',
        fontSize: '18px',
        fontFamily: 'Arial',
      },
    },
    View: {
      backgroundColor: 0x333333,
      backgroundAlpha: 1.0,
      cornerRadius: 8,
    },
  })

  // Set up global theme, commented out to avoid resetting global theme on every render
  // now, we will use it as local theme only
  // themeRegistry.updateGlobalTheme(ourTheme)

  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <View theme={ourTheme}>
            <View padding={{ top: 20, left: 20, right: 20, bottom: 20 }} gap={25}>
              {/* Global theme applied */}
              <Text text="Global Theme Text (green, 18px)" />

              {/* Local theme override - blue text */}
              <View
                theme={createTheme({
                  Text: {
                    style: {
                      color: '#0000ff',
                      fontSize: '40px',
                    },
                  },
                })}
              >
                <Text text="Local Theme Text (blue, 40px)" />
                {/* Inherits blue text color from parent theme */}
                <View>
                  <Text text="Also blue - inherits from parent" />
                </View>

                {/* Nested theme override - red text */}
                <View
                  theme={createTheme({
                    Text: {
                      style: {
                        color: '#ff0000',
                        fontSize: '16px',
                      },
                    },
                  })}
                >
                  <Text text="Nested Theme (red, 16px)" />
                  <ThemedText text="Using useTheme hook" />
                </View>
              </View>

              {/* Back to global theme */}
              <Text text="Back to Global Theme (green)" />

              {/* Explicit props override theme */}
              <Text
                text="Explicit props override (yellow)"
                style={{ color: '#ffff00', fontSize: '22px' }}
              />

              {/* add this view to make inside view visible, otherwise it background is name as parent */}
              <View
                padding={{ left: 10, top: 10, bottom: 10, right: 10 }}
                backgroundColor={0x777777}
              >
                {/* View with themed background */}
                <View padding={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                  <Text text="Themed View Background (should be gray with rounded corners)" />
                </View>
              </View>

              {/* Explicit background override */}
              <View backgroundColor={0xff0000} padding={10}>
                <Text text="Explicit red background (overrides theme)" />
              </View>
            </View>
          </View>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
