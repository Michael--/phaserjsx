import { Text, useThemeTokens, View } from '@phaserjsx/ui'
import { Icon, ScrollView } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3, ViewLevel4 } from './Helper'

function Example() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="Whatever Example" />
      </View>
      <ViewLevel3
        width={500}
        gap={20}
        direction="column"
        padding={10}
        backgroundColor={tokens?.colors.background.medium.toNumber()}
      >
        <ViewLevel4>
          <Text text="Example 1:" />
          <Text text={`result`} />
        </ViewLevel4>
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function TestExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <ViewLevel2 direction="row" padding={10}>
          <Example />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
