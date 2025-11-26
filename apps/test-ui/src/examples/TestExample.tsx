import { Text, useState, View } from '@phaserjsx/ui'
import { Icon, ScrollView, TextInput } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function DevelopPage1() {
  const [inputValue, setInputValue] = useState('')
  const [password, setPassword] = useState('')
  const [submitInputValue, setSubmitInputValue] = useState('')
  const [submittedValue, setSubmittedValue] = useState('')

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="TextInput Component" />
      </View>
      <ViewLevel3 gap={20} direction="column" padding={10}>
        <View direction="column" gap={10}>
          <Text text="Basic TextInput (max 20 chars):" />
          <TextInput
            placeholder="Type something..."
            value={inputValue}
            onChange={(event) => setInputValue(event.value)}
            width={300}
            height={40}
            maxLength={20}
          />
          <Text text={`Value: ${inputValue} (${inputValue.length}/20)`} />
        </View>

        <View direction="column" gap={10}>
          <Text text="Password Input:" />
          <TextInput
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.value)}
            width={300}
            height={40}
          />
          <Text text={`Length: ${password.length} characters`} />
        </View>

        <View direction="column" gap={10}>
          <Text text="Input with Submit (press Enter):" />
          <TextInput
            placeholder="Press Enter to submit"
            value={submitInputValue}
            onChange={(event) => setSubmitInputValue(event.value)}
            onSubmit={(value) => {
              setSubmittedValue(value)
              setSubmitInputValue('') // Clear input after submit
            }}
            width={300}
            height={40}
          />
          {submittedValue ? <Text text={`Submitted: ${submittedValue}`} /> : null}
        </View>

        <View direction="column" gap={10}>
          <Text text="Disabled Input:" />
          <TextInput placeholder="This is disabled" disabled={true} width={300} height={40} />
        </View>
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
