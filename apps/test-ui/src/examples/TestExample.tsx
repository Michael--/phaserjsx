/**
 * Theme Preview - comprehensive visualization of all theme values
 * Shows colors, typography, spacing, shadows, and component examples
 */
import { Text, View } from '@phaserjsx/ui'
import { ScrollPage } from '../components/ScrollPage'
import { SectionHeader, ViewLevel2 } from './Helper'

/**
 * Display component showcase with real buttons
 */
function BigPage() {
  // const tokens = useThemeTokens()

  const hundredItems = Array.from({ length: 100 }).map((_, i) => {
    return <Text key={i} text={`Label ${i + 1}`} />
  })

  return (
    <ViewLevel2 direction="column" padding={0} width={2000}>
      <SectionHeader title="This is a test example to verify the Test UI setup." />
      <ViewLevel2 gap={20} direction="column" padding={0}>
        {...hundredItems}
      </ViewLevel2>
    </ViewLevel2>
  )
}

/**
 * Main theme preview component
 * TODO: worse idea to fiddle out size of content - find better way
 * TODO: may missing property fit-content for width/height on View
 */
export function TestExample() {
  return (
    <View width={'100%'} height={'100%'} padding={100}>
      <ScrollPage
        showVerticalSlider={true}
        showHorizontalSlider={true}
        borderColor={0xff0000}
        borderWidth={2}
        minWidth={'100%'}
        maxWidth={'100%'}
        minHeight={'100%'}
        maxHeight={'100%'}
      >
        <BigPage />
      </ScrollPage>
    </View>
  )
}
