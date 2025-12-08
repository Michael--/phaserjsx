/**
 * Animated Accordion Example
 * Accordion with smooth height animation
 */
/** @jsxImportSource @phaserjsx/ui */
import { Accordion, Text, View } from '@phaserjsx/ui'

export function AnimatedAccordionExample() {
  return (
    <View width={'100%'} direction="column" gap={10} padding={20}>
      <Text text="Animated Accordion" style={{ fontSize: '20px' }} />
      <Accordion title="Animated Section" animated={true}>
        <Text text="This accordion animates smoothly when opening and closing." />
        <Text text="The height transitions provide a better user experience." />
        <Text text="Multiple lines of content here." />
      </Accordion>
    </View>
  )
}
