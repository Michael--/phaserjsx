import { Text, View } from '@phaserjsx/ui'
import { Accordion, AccordionPage, Icon, ScrollView } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function DevelopPage1() {
  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="Accordion Component" />
      </View>
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        {/* Simple Accordion with string title */}
        <Accordion title="Simple Accordion" width={400}>
          <AccordionPage padding={15}>
            <Text text="This is a simple accordion with a string title." />
            <Text text="It can contain any content you want." />
          </AccordionPage>
        </Accordion>

        {/* Accordion with icon */}
        <Accordion title="Accordion with Icon" icon="bell" width={400} defaultOpen={true}>
          <AccordionPage padding={15}>
            <Text text="This accordion has an icon and is open by default." />
            <View direction="column" gap={10}>
              <Text text="• Feature 1" />
              <Text text="• Feature 2" />
              <Text text="• Feature 3" />
            </View>
          </AccordionPage>
        </Accordion>

        {/* Accordion with custom title */}
        <Accordion
          title={
            <View direction="row" gap={10} alignItems="center">
              <Icon type="check" size={20} />
              <Text text="Custom Title with JSX" style={{ fontSize: 18 }} />
            </View>
          }
          width={400}
        >
          <AccordionPage padding={15}>
            <Text text="This accordion uses a custom JSX element as title." />
            <Text text="You can compose any layout you need." />
          </AccordionPage>
        </Accordion>

        {/* Multiple accordions */}
        <View direction="column" gap={5} width={400}>
          <Text text="Multiple Accordion Items:" style={{ fontSize: 16 }} />
          <Accordion title="Section 1" icon="boxes" width={400}>
            <AccordionPage padding={15}>
              <Text text="Content for section 1" />
            </AccordionPage>
          </Accordion>
          <Accordion title="Section 2" icon="boxes" width={400}>
            <AccordionPage padding={15}>
              <Text text="Content for section 2" />
            </AccordionPage>
          </Accordion>
          <Accordion title="Section 3" icon="boxes" width={400}>
            <AccordionPage padding={15}>
              <Text text="Content for section 3" />
            </AccordionPage>
          </Accordion>
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
        <DevelopPage1 />
      </ScrollView>
    </View>
  )
}
