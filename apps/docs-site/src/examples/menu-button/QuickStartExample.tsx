/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { MenuButton, Text, View, useState, type ContextMenuItem } from '@number10/phaserjsx'

export function QuickStartMenuButtonExample() {
  const [lastAction, setLastAction] = useState('None')

  const items: ContextMenuItem[] = [
    {
      id: 'save',
      label: 'Save',
      prefix: <Icon type="check" size={16} />,
    },
    {
      id: 'open',
      label: 'Open folder',
      prefix: <Icon type="folder" size={16} />,
    },
    {
      id: 'export',
      label: 'Export',
      prefix: <Icon type="download" size={16} />,
    },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      prefix: <Icon type="trash" size={16} />,
    },
  ]

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={20}>
      <MenuButton
        label="File"
        icon={<Icon type="folder" size={16} />}
        items={items}
        width={190}
        onSelect={(item) => setLastAction(item.label)}
      />

      <View padding={10} backgroundColor={0x1e293b} cornerRadius={6}>
        <View direction="row" gap={8} alignItems="center">
          <Text text="Last Action:" />
          <Text text={lastAction} alpha={0.8} />
        </View>
      </View>
    </View>
  )
}
