import { Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { Icon, ScrollView, TextInput } from '../components'
import { CharText } from '../components/CharText'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function DevelopPage2() {
  const tokens = useThemeTokens()
  const [cursorPos, _setCursorPos] = useState(5)
  const [editableText, setEditableText] = useState('Edit me!')

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="CharText & CharTextInput Component" />
      </View>
      <ViewLevel3
        gap={20}
        direction="column"
        padding={10}
        backgroundColor={tokens?.colors.background.medium.toNumber()}
      >
        <View direction="column" gap={10}>
          <Text text="Basic CharText:" />
          <CharText text="Hello" />
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with spacing:" />
          <CharText text="Spaced" charSpacing={5} />
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with heading style:" />
          <CharText text="Big Text" textStyle={tokens?.textStyles.heading} />
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with cursor:" />
          <CharText text="Hello" showCursor={true} cursorPosition={cursorPos} />
          <View direction="row" gap={10}>
            <Text text={`Cursor at: ${cursorPos}`} />
          </View>
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with cursor (custom style):" />
          <CharText
            text="Styled"
            showCursor={true}
            cursorPosition={3}
            cursorColor={0xff00ff}
            cursorWidth={4}
            cursorBlinkSpeed={300}
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Controlled CharText (editable via onChange):" />
          <CharText
            text={editableText}
            showCursor={true}
            onChange={(newText) => setEditableText(newText)}
          />
          <Text text={`Current text: "${editableText}"`} />
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with padding:" />
          <CharText text="Padded" padding={10} />
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

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
          <DevelopPage2 />
        </ViewLevel2>
        <ViewLevel2>
          <DevelopPage1 />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
