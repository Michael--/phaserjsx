import { Text, View } from '@phaserjsx/ui'
import { Icon, ScrollView } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function DevelopPage1() {
  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="The Title" />
      </View>
      <ViewLevel3 gap={20} direction="column" padding={10}>
        <Text text="Place to add new features here..." />
      </ViewLevel3>
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
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2>
          <DevelopPage1 />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
