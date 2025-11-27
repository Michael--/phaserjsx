import { Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { Icon, ScrollView, TextInput } from '../components'
import { CharText } from '../components/CharText'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function DevelopPage3() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="CharTextInput Component" />
      </View>
      <ViewLevel3
        gap={20}
        direction="column"
        padding={10}
        backgroundColor={tokens?.colors.background.medium.toNumber()}
      ></ViewLevel3>
    </ViewLevel2>
  )
}

function DevelopPage2() {
  const tokens = useThemeTokens()
  const [cursorPos, _setCursorPos] = useState(5)
  const [editableText, setEditableText] = useState('Edit me!')
  const [clickableCursorPos, setClickableCursorPos] = useState(0)
  const [clickableCursorPos2, setClickableCursorPos2] = useState(0)
  const [selectionStart2, setSelectionStart2] = useState(-1)
  const [selectionEnd2, setSelectionEnd2] = useState(-1)
  const [clickableCursorPos3, setClickableCursorPos3] = useState(0)
  const [selectionStart3, setSelectionStart3] = useState(-1)
  const [selectionEnd3, setSelectionEnd3] = useState(-1)

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="CharText" />
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
          <Text text="Clickable CharText (click to set cursor):" />
          <CharText
            text="Click me!"
            showCursor={true}
            cursorPosition={clickableCursorPos}
            onCursorPositionChange={(pos) => setClickableCursorPos(pos)}
          />
          <Text text={`Cursor at: ${clickableCursorPos}`} />
        </View>
        <View direction="column" gap={10}>
          <Text text="CharText with selection (drag to select):" />
          <CharText
            text="Drag over this text to select!"
            showCursor={true}
            cursorPosition={clickableCursorPos2}
            selectionStart={selectionStart2}
            selectionEnd={selectionEnd2}
            onCursorPositionChange={(pos) => setClickableCursorPos2(pos)}
            onSelectionChange={(start, end) => {
              setSelectionStart2(start)
              setSelectionEnd2(end)
              if (end - start > 0 && end >= 0) {
                setClickableCursorPos2(end)
              }
            }}
          />
          <Text
            text={
              selectionStart2 >= 0 && selectionEnd2 >= 0
                ? `Selection: ${selectionStart2} - ${selectionEnd2}`
                : 'No selection'
            }
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Multi-line CharText (word wrap):" />
          <CharText
            text="This is a very long text that should automatically wrap to multiple lines when it exceeds the maximum width."
            multiline={true}
            maxWidth={300}
            wordWrap={true}
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Multi-line with cursor & selection:" />
          <CharText
            text="Multi-line text with interactive cursor. Try clicking and dragging to select across lines!"
            multiline={true}
            maxWidth={300}
            showCursor={true}
            cursorPosition={clickableCursorPos3}
            selectionStart={selectionStart3}
            selectionEnd={selectionEnd3}
            onCursorPositionChange={(pos) => setClickableCursorPos3(pos)}
            onSelectionChange={(start, end) => {
              setSelectionStart3(start)
              setSelectionEnd3(end)
              if (end - start > 0 && end >= 0) {
                setClickableCursorPos3(end)
              }
            }}
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Multi-line with maxLines (3) + ellipsis:" />
          <CharText
            text="This is a very long text with many words that will be limited to only three lines maximum. The rest will be truncated with an ellipsis indicator at the end of the third line."
            multiline={true}
            maxWidth={300}
            maxLines={3}
            textOverflow="ellipsis"
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Multi-line without word wrap (char break):" />
          <CharText
            text="Supercalifragilisticexpialidocious"
            multiline={true}
            maxWidth={200}
            wordWrap={false}
          />
        </View>
        <View direction="column" gap={10}>
          <Text text="Multi-line with custom lineHeight (1.5):" />
          <CharText
            text="This text has increased line spacing for better readability. Notice the extra vertical space between lines."
            multiline={true}
            maxWidth={300}
            lineHeight={1.5}
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
        <ViewLevel2 direction="row" padding={10}>
          <DevelopPage2 />
          <DevelopPage3 />
        </ViewLevel2>
        <ViewLevel2>
          <DevelopPage1 />
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
