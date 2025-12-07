import { ScrollView, Text, useState, useThemeTokens, View } from '@phaserjsx/ui'
import { CharTextInput, Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3, ViewLevel4 } from './Helper'

function Example() {
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

export function ChartTextInputExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <Example />
      </ScrollView>
    </View>
  )
}
