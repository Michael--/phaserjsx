/**
 * Theme Preview - comprehensive visualization of all theme values
 * Shows colors, typography, spacing, shadows, and component examples
 */
import { Image, Text, useSVGTexture, useSVGTextures, View } from '@phaserjsx/ui'
import { Icon, ScrollView } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

import bell from 'bootstrap-icons/icons/bell-fill.svg'
import boxes from 'bootstrap-icons/icons/boxes.svg'
import bricks from 'bootstrap-icons/icons/bricks.svg'
import { Checkbox } from '../components/Checkbox'

/**
 * Display component showcase with real buttons
 */
function SVGPageSingle() {
  const ready = useSVGTexture('icon-bricks', bricks)

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <SectionHeader title="SVG load single" />
        <Image texture={ready ? 'icon-bricks' : ''} />
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Display component showcase with real buttons
 */
function SVGPageMultiple() {
  const ready = useSVGTextures([
    { key: 'icon-boxes', svg: boxes, width: 128, height: 128 },
    { key: 'icon-bell-32', svg: bell, width: 32, height: 32 },
    { key: 'icon-bell', svg: bell, width: 128, height: 128 },
  ])

  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      {/** Use a rerender workaround because of too simple VDOM patch logic, evaluate only position and count, not content */}
      <ViewLevel3
        key={`workaround${ready}`}
        gap={20}
        direction="column"
        padding={10}
        width={'fill'}
      >
        <SectionHeader title="SVG load multiple" />
        {!ready && <Text text={`Loading textures...${ready}`} />}
        {ready && (
          <View direction="row" gap={10}>
            <Image texture="icon-bell-32" />
            <Image texture="icon-bell" />
            <Image texture="icon-boxes" />
          </View>
        )}
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Display component showcase with real buttons
 */
function IconPage() {
  return (
    <ViewLevel2 direction="column" padding={10} width={1500}>
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <SectionHeader title="Icon System with Lazy Loading" />
        <View direction="row" gap={10}>
          <Icon type="bell" />
          <Icon type="boxes" />
          <Icon type="bricks" />
          <Icon type="check" />
          <Icon type="square" />
        </View>
        <Text text="Icons are loaded lazily when first used, with strong typing! (iconRegistry)" />
        <View gap={4}>
          <Checkbox
            label="Check me!"
            checked={true}
            onChange={(checked) => console.log('Checkbox changed:', checked)}
          />
          <Checkbox
            label="Another checkbox"
            checked={false}
            onChange={(checked) => console.log('Checkbox changed:', checked)}
          />
        </View>
      </ViewLevel3>
    </ViewLevel2>
  )
}

/**
 * Display component showcase with real buttons
 */
function BigPage() {
  // const tokens = useThemeTokens()

  const hundredItems = Array.from({ length: 10 }).map((_, i) => {
    return <Text key={i} text={`Label ${i + 1}`} />
  })

  return (
    <ViewLevel2 direction="column" padding={10} width={2000}>
      <ViewLevel3 gap={20} direction="column" padding={10} width={'fill'}>
        <SectionHeader title="Very Big Area need to scroll" />
        {...hundredItems}
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
        <SVGPageSingle />
        <SVGPageMultiple />
        <IconPage />
        <BigPage />
      </ScrollView>
    </View>
  )
}
