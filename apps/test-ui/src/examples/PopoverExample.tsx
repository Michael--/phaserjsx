/** @jsxImportSource @number10/phaserjsx */
import {
  Badge,
  ContextMenu,
  Popover,
  ScrollView,
  Tag,
  Text,
  useState,
  useThemeTokens,
  View,
  type ContextMenuItem,
  type PopoverPlacement,
} from '@number10/phaserjsx'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

const placements: PopoverPlacement[] = ['top', 'bottom-start', 'right', 'left-end']

export function PopoverExample() {
  const [lastAction, setLastAction] = useState('None')
  const tokens = useThemeTokens()
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#ffffff'
  const headingStyle =
    tokens?.textStyles.title ?? ({ fontSize: '28px', fontStyle: 'bold', color: textColor } as const)
  const labelStyle = tokens?.textStyles.medium ?? ({ fontSize: '16px', color: textColor } as const)
  const mutedStyle = {
    ...(tokens?.textStyles.small ?? { fontSize: '12px', color: textColor }),
    color: tokens?.colors.text.light.toString() ?? textColor,
  }
  const menuItems: ContextMenuItem[] = [
    { id: 'equip', label: 'Equip', onSelect: () => setLastAction('Equip') },
    { id: 'inspect', label: 'Inspect', onSelect: () => setLastAction('Inspect') },
    { id: 'trade', label: 'Trade', disabled: true },
    { id: 'drop', label: 'Drop', danger: true, onSelect: () => setLastAction('Drop') },
  ]

  return (
    <ScrollView width="fill" height="fill" padding={20}>
      <ViewLevel2 width="fill">
        <SectionHeader title="Popover / ContextMenu Components" />

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Portal Popover" style={headingStyle} />
          <Popover
            placement="bottom-start"
            trigger={
              <View
                width={190}
                height={42}
                justifyContent="center"
                alignItems="center"
                backgroundColor={0x2563eb}
                cornerRadius={8}
              >
                <Text text="Show item details" style={{ color: '#ffffff', fontSize: '14px' }} />
              </View>
            }
          >
            <Text text="Crystal Shield" style={{ color: '#ffffff', fontSize: '16px' }} />
            <Text
              text="This content is mounted in Portal and does not change the row height."
              style={{ color: '#cbd5e1', fontSize: '12px', wordWrap: { width: 245 } }}
            />
            <View direction="row" gap={8}>
              <Tag label="Armor" tone="info" />
              <Badge label="+12" tone="success" />
            </View>
          </Popover>
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="Placements" style={headingStyle} />
          <View direction="row" gap={12} flexWrap="wrap">
            {placements.map((placement) => (
              <Popover
                key={placement}
                placement={placement}
                trigger={
                  <View
                    width={130}
                    height={38}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={0x1e293b}
                    borderColor={0x475569}
                    borderWidth={1}
                    cornerRadius={7}
                  >
                    <Text text={placement} style={{ color: '#ffffff', fontSize: '12px' }} />
                  </View>
                }
              >
                <Text text={placement} style={labelStyle} />
                <Text text="Viewport clamped portal overlay." style={mutedStyle} />
              </Popover>
            ))}
          </View>
        </ViewLevel3>

        <ViewLevel3 width="fill" gap={14}>
          <Text text="ContextMenu" style={headingStyle} />
          <ContextMenu
            items={menuItems}
            placement="bottom-start"
            trigger={
              <View
                width={240}
                height={72}
                direction="row"
                gap={12}
                alignItems="center"
                padding={12}
                backgroundColor={0x172554}
                borderColor={0x3b82f6}
                borderWidth={1}
                cornerRadius={8}
              >
                <View width={42} height={42} backgroundColor={0xf59e0b} cornerRadius={6} />
                <View gap={4}>
                  <Text text="Ancient Key" style={{ color: '#ffffff', fontSize: '14px' }} />
                  <Badge label="Quest" tone="primary" size="small" />
                </View>
              </View>
            }
          />
          <Text text={`Last action: ${lastAction}`} style={mutedStyle} />
        </ViewLevel3>
      </ViewLevel2>
    </ScrollView>
  )
}
