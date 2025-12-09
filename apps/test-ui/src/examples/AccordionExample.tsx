import { createTheme, ScrollView, Text, useThemeTokens, View } from '@number10/phaserjsx'
import { Accordion, Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

function AccordionShowcase() {
  const tokens = useThemeTokens()

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <View gap={10} direction="row" alignContent="center">
        <Icon type="bricks" />
        <SectionHeader title="Accordion Component" />
      </View>
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        {/* Simple Accordion with string title */}
        <Accordion key="simple" title="Simple Accordion">
          <Text text="This is a simple accordion with a string title." />
          <Text text="It can contain any content you want." />
        </Accordion>

        {/* Accordion with icon */}
        <Accordion
          key="with-icon"
          title={
            <>
              <Icon type={'bell-fill'} />
              <Text text={'Accordion with Icon'} />
            </>
          }
          defaultOpen={true}
        >
          <Text text="This accordion has an icon and is open by default." />
          <View direction="column" gap={10}>
            <Text text="• Feature 1" />
            <Text text="• Feature 2" />
            <Text text="• Feature 3" />
          </View>
        </Accordion>

        {/* Accordion with custom title */}
        <Accordion
          key="custom-title"
          defaultOpen={true}
          theme={createTheme({
            Accordion: {
              effect: 'none', // disable effect
              headerStyle: {
                backgroundColor: tokens?.colors.info.light.toNumber(),
                cornerRadius: { tl: 20, tr: 20, bl: 0, br: 0 },
              },
              contentStyle: { padding: 0 },
            },
          })}
          title={
            <View direction="row" gap={{ horizontal: 10 }} alignItems="center">
              <Text text="Custom Title with JSX" style={tokens?.textStyles.heading} />
              <Icon type="check" size={64} />
            </View>
          }
        >
          <View
            width={'fill'}
            backgroundColor={tokens?.colors.info.light.toNumber()}
            cornerRadius={{ tl: 0, tr: 0, bl: 20, br: 20 }}
            padding={10}
          >
            <Text text="This accordion uses a custom JSX element as title." />
            <Text text="You can compose any layout you need." />
          </View>
        </Accordion>

        {/* Nested Accordions */}
        <Accordion key="nested-parent" title="Nested Accordions">
          <Text text="This accordion contains nested accordions." />
          <Accordion key="nested-sub-1" title="Sub Accordion 1">
            <Text text="Content of sub accordion 1." />
          </Accordion>
          <Accordion key="nested-sub-2" title="Sub Accordion 2">
            <Text text="Content of sub accordion 2." />
          </Accordion>
        </Accordion>

        {/* Animated Accordion */}
        <Accordion key="animated" title="Animated Accordion" animated={true} maxHeight={150}>
          <Text text="This accordion animates its height smoothly." />
          <Text text="You can adjust maxHeight for different content sizes." />
          <Text text="Animation is optional and can be enabled per accordion." />
        </Accordion>

        {/* Auto-Height Animated Accordion */}
        <Accordion
          key="auto-height"
          title="Auto-Height Animated Accordion"
          animated={true}
          autoHeight={true}
        >
          <Text text="This accordion measures its content height automatically." />
          <Text text="No need to specify maxHeight." />
          <Text text="But force extra calculation because of a hidden measurement container" />
        </Accordion>

        {/* Animated Accordion with Wobbly Preset */}
        <Accordion
          key="wobbly"
          title="Animated Accordion (Wobbly)"
          animated={true}
          animationConfig="wobbly"
          maxHeight={120}
        >
          <Text text="This accordion uses the 'wobbly' animation preset." />
          <Text text="Different presets provide various animation feels." />
        </Accordion>

        {/* Animated Accordion with Custom Config */}
        <Accordion
          key="custom-config"
          title="Animated Accordion (Custom)"
          animated={true}
          animationConfig={{ tension: 200, friction: 10 }}
          maxHeight={100}
          onAnimationEnd={() => console.log('Animation ended')}
        >
          <Text text="This accordion uses a custom spring configuration." />
          <Text text="You can fine-tune tension and friction." />
          <Text text="Check console for onAnimationEnd callback." />
        </Accordion>

        {/* Multiple accordions */}
        <View direction="column" gap={5}>
          <Text text="Multiple Accordion Items:" style={tokens?.textStyles.caption} />
          <Accordion
            key="section-1"
            title={
              <>
                <Icon type={'boxes'} />
                <Text text={'Section 1'} />
              </>
            }
          >
            <Text text="Content for section 1" />
          </Accordion>
          <Accordion
            key="section-2"
            title={
              <>
                <Icon type={'boxes'} />
                <Text text={'Section 2'} />
              </>
            }
          >
            <Text text="Content for section 2" />
          </Accordion>
          <Accordion
            key="section-3"
            title={
              <>
                <Icon type={'boxes'} />
                <Text text={'Section 3'} />
              </>
            }
          >
            <Text text="Content for section 3" />
          </Accordion>
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

export function AccordionExample() {
  return (
    <View width={'100%'} height={'100%'}>
      <ScrollView>
        <AccordionShowcase />
      </ScrollView>
    </View>
  )
}
