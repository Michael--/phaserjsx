/**
 * Basic Accordion Example
 * Simple collapsible content
 */
/** @jsxImportSource @phaserjsx/ui */
import { Accordion, Text, View } from '@phaserjsx/ui'

export function BasicAccordionExample() {
  return (
    <View width={'100%'} direction="column" gap={10} padding={20}>
      <Text text="Basic Accordion" style={{ fontSize: '20px' }} />
      <Accordion title="Section 1">
        <Text text="This is the content of section 1." />
        <Text text="It can contain multiple elements." />
      </Accordion>
      <Accordion title="Section 2">
        <Text text="Content for section 2." />
      </Accordion>
    </View>
  )
}
