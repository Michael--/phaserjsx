/**
 * Nested Accordion Example
 * Accordions inside accordions
 */
/** @jsxImportSource @phaserjsx/ui */
import { Accordion, ScrollView, Text, View } from '@phaserjsx/ui'

export function NestedAccordionExample() {
  return (
    <ScrollView width={'100%'} height={'100%'}>
      <View width={'100%'} direction="column" gap={10} padding={20}>
        <Text text="Nested Accordions" style={{ fontSize: '20px' }} />
        <Accordion title="Main Section 1">
          <Text text="Content of main section 1." />
          <Accordion title="Sub Section 1.1">
            <Text text="Content of sub section 1.1." />
          </Accordion>
          <Accordion title="Sub Section 1.2">
            <Text text="Content of sub section 1.2." />
            <Accordion title="Sub Sub Section 1.2.1">
              <Text text="Deeply nested content." />
            </Accordion>
          </Accordion>
        </Accordion>
        <Accordion title="Main Section 2">
          <Text text="Content of main section 2." />
          <Accordion title="Sub Section 2.1">
            <Text text="Content of sub section 2.1." />
          </Accordion>
        </Accordion>
      </View>
    </ScrollView>
  )
}
