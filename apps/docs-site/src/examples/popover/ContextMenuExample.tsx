/**
 * ContextMenu Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Badge, ContextMenu, Text, useState, View, type ContextMenuItem } from '@number10/phaserjsx'

export function ContextMenuPopoverExample() {
  const [lastAction, setLastAction] = useState('None')
  const items: ContextMenuItem[] = [
    { id: 'equip', label: 'Equip', onSelect: () => setLastAction('Equip') },
    { id: 'inspect', label: 'Inspect', onSelect: () => setLastAction('Inspect') },
    { id: 'trade', label: 'Trade', disabled: true },
    { id: 'drop', label: 'Drop', danger: true, onSelect: () => setLastAction('Drop') },
  ]

  return (
    <View width="fill" height="fill" padding={24} gap={18} alignItems="start" direction="row">
      <ContextMenu
        items={items}
        placement="bottom-start"
        trigger={
          <View
            width={220}
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
      <Text text={`Last action: ${lastAction}`} style={{ color: '#cbd5e1', fontSize: '13px' }} />
    </View>
  )
}
