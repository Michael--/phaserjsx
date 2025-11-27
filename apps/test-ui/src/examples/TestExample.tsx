import { Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { CharText, CharTextInput, Icon, ScrollView } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3, ViewLevel4 } from './Helper'

function DevelopPage3() {
  const tokens = useThemeTokens()
  const [inputValue, setInputValue] = useState('abcdef')
  const [password, setPassword] = useState('')
  const [multilineValue, setMultilineValue] = useState(
    'Multi-line text input. Try typing and using keyboard shortcuts!'
  )
  const [submitValue, setSubmitValue] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [charInput, setCharInput] = useState('')

  return (
    <ViewLevel2 direction="column" padding={10}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="CharTextInput Component" />
      </View>
      <ViewLevel3
        width={500}
        gap={20}
        direction="column"
        padding={10}
        backgroundColor={tokens?.colors.background.medium.toNumber()}
      >
        <ViewLevel4>
          <Text text="Basic CharTextInput:" />
          <CharTextInput
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            maxWidth={300}
            height={40}
            padding={10}
          />
          <Text text={`"${inputValue}"`} />
          <Text text={`(${inputValue.length} chars)`} />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="CharTextInput with placeholder:" />
          <CharTextInput
            value=""
            placeholder="Click here to type..."
            onChange={(value) => setCharInput(value)}
            onBlur={() => setCharInput('')}
            width={300}
            height={40}
            padding={10}
          />
          <Text text={`Input: "${charInput}"`} />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="CharTextInput with maxLength (20):" />
          <CharTextInput
            value={password}
            onChange={(value) => setPassword(value)}
            maxLength={20}
            width={300}
            height={40}
            padding={10}
          />
          <Text text={`Length: ${password.length}/20`} />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="Multi-line CharTextInput:" />
          <CharTextInput
            value={multilineValue}
            onChange={(value) => setMultilineValue(value)}
            multiline={true}
            maxWidth={400}
            maxLines={5}
            lineHeight={1.3}
            width={400}
            minHeight={100}
            padding={10}
          />
          <Text
            text={`Lines: ${multilineValue.split('\n').length}, Chars: ${multilineValue.length}`}
          />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="CharTextInput with Submit (Enter):" />
          <CharTextInput
            value={submitValue}
            onChange={(value) => setSubmitValue(value)}
            onSubmit={(value) => {
              setSubmitted(value)
              setSubmitValue('')
            }}
            placeholder="Type and press Enter"
            width={300}
            height={40}
            padding={10}
          />
          {submitted ? <Text text={`Submitted: "${submitted}"`} /> : null}
        </ViewLevel4>

        <ViewLevel4>
          <Text text="Disabled CharTextInput:" />
          <CharTextInput
            value="Cannot edit this"
            disabled={true}
            width={300}
            height={40}
            padding={10}
          />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="Custom cursor style:" />
          <CharTextInput
            value="Custom cursor"
            onChange={() => {}}
            cursorColor={0xff00ff}
            cursorWidth={3}
            cursorBlinkSpeed={300}
            width={300}
            height={40}
            padding={10}
          />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="Custom selection color:" />
          <CharTextInput
            value="Select this text"
            onChange={() => {}}
            selectionColor={0xff6600}
            selectionAlpha={0.4}
            width={300}
            height={40}
            padding={10}
          />
        </ViewLevel4>

        <ViewLevel4>
          <Text text="Keyboard shortcuts:" />
          <Text text="• Backspace/Delete - Remove chars" />
          <Text text="• Arrow Left/Right - Move cursor" />
          <Text text="• Shift+Arrow - Select text" />
          <Text text="• Ctrl/Cmd+A - Select all" />
          <Text text="• Home/End - Jump to start/end" />
        </ViewLevel4>
      </ViewLevel3>
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
        width={500}
        gap={20}
        direction="column"
        padding={10}
        backgroundColor={tokens?.colors.background.medium.toNumber()}
      >
        <ViewLevel4>
          <Text text="Basic CharText:" />
          <CharText text="Hello" />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="CharText with spacing:" />
          <CharText text="Spaced" charSpacing={5} />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="CharText with heading style:" />
          <CharText text="Big Text" textStyle={tokens?.textStyles.heading} />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="CharText with cursor:" />
          <CharText text="Hello" showCursor={true} cursorPosition={cursorPos} />
          <View direction="row" gap={10}>
            <Text text={`Cursor at: ${cursorPos}`} />
          </View>
        </ViewLevel4>
        <ViewLevel4>
          <Text text="CharText with cursor (custom style):" />
          <CharText
            text="Styled"
            showCursor={true}
            cursorPosition={3}
            cursorColor={0xff00ff}
            cursorWidth={4}
            cursorBlinkSpeed={300}
          />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Clickable CharText (click to set cursor):" />
          <CharText
            text="Click me!"
            showCursor={true}
            cursorPosition={clickableCursorPos}
            onCursorPositionChange={(pos) => setClickableCursorPos(pos)}
          />
          <Text text={`Cursor at: ${clickableCursorPos}`} />
        </ViewLevel4>
        <ViewLevel4>
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
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Multi-line CharText (word wrap):" />
          <CharText
            text="This is a very long text that should automatically wrap to multiple lines when it exceeds the maximum width."
            multiline={true}
            maxWidth={300}
            wordWrap={true}
          />
        </ViewLevel4>
        <ViewLevel4>
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
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Multi-line with maxLines (3) + ellipsis:" />
          <CharText
            text="This is a very long text with many words that will be limited to only three lines maximum. The rest will be truncated with an ellipsis indicator at the end of the third line."
            multiline={true}
            maxWidth={300}
            maxLines={3}
            textOverflow="ellipsis"
          />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Multi-line without word wrap (char break):" />
          <CharText
            text="Supercalifragilisticexpialidocious"
            multiline={true}
            maxWidth={200}
            wordWrap={false}
          />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Multi-line with custom lineHeight (1.5):" />
          <CharText
            text="This text has increased line spacing for better readability. Notice the extra vertical space between lines."
            multiline={true}
            maxWidth={300}
            lineHeight={1.5}
          />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="Controlled CharText (editable via onChange):" />
          <CharText
            text={editableText}
            showCursor={true}
            onChange={(newText) => setEditableText(newText)}
          />
          <Text text={`Current text: "${editableText}"`} />
        </ViewLevel4>
        <ViewLevel4>
          <Text text="CharText with padding:" />
          <CharText text="Padded" padding={10} />
        </ViewLevel4>
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
        <ViewLevel2></ViewLevel2>
      </ScrollView>
    </View>
  )
}
