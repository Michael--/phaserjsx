/**
 * Controlled Accordion Example
 * Accordion controlled by external state
 */
/** @jsxImportSource @number10/phaserjsx */
import { Accordion, Button, Text, View, useState } from '@number10/phaserjsx'

export function ControlledAccordionExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View width={'100%'} direction="column" gap={10} padding={20}>
      <Text text="Controlled Accordion" style={{ fontSize: '20px' }} />
      <Button onTouch={() => setIsOpen(!isOpen)}>
        <Text text={isOpen ? 'Close' : 'Open'} />
      </Button>
      <Accordion title="Controlled Section" isOpen={isOpen} onToggle={setIsOpen}>
        <Text text="This accordion is controlled externally." />
        <Text text="Use the button above to toggle it." />
      </Accordion>
    </View>
  )
}
