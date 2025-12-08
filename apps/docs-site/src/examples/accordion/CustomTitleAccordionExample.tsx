/**
 * Custom Title Accordion Example
 * Accordion with custom JSX title
 */
/** @jsxImportSource @phaserjsx/ui */
import { Accordion, Text, View } from '@phaserjsx/ui'

export function CustomTitleAccordionExample() {
  return (
    <View width={'100%'} direction="column" gap={10} padding={20}>
      <Text text="Custom Title Accordion" style={{ fontSize: '20px' }} />
      <Accordion
        title={
          <View direction="row" gap={10} alignItems="center">
            <Text text="📁" />
            <Text text="Custom Title Section" />
          </View>
        }
      >
        <Text text="This accordion has a custom JSX title." />
        <Text text="You can include icons, multiple elements, etc." />
      </Accordion>
    </View>
  )
}
