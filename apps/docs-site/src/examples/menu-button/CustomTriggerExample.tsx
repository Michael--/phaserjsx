/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { MenuButton, Text, View, type ContextMenuItem } from '@number10/phaserjsx'

export function CustomTriggerMenuButtonExample() {
  const items: ContextMenuItem[] = [
    { id: 'profile', label: 'View Profile', prefix: <Icon type="person" size={16} /> },
    { id: 'settings', label: 'Settings', prefix: <Icon type="gear" size={16} /> },
    {
      id: 'logout',
      label: 'Logout',
      danger: true,
      prefix: <Icon type="box-arrow-right" size={16} />,
    },
  ]

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center">
      <MenuButton
        items={items}
        trigger={({ isOpen }) => (
          <View
            direction="row"
            alignItems="center"
            gap={10}
            padding={{ left: 12, right: 12, top: 8, bottom: 8 }}
            backgroundColor={isOpen ? 0x334155 : 0x1e293b}
            borderColor={0x475569}
            borderWidth={1}
            cornerRadius={20}
          >
            <View
              width={24}
              height={24}
              cornerRadius={12}
              backgroundColor={0x3b82f6}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="JD" style={{ fontSize: '12px', color: '#ffffff' }} />
            </View>
            <Text text="John Doe" />
            <Icon type={isOpen ? 'chevron-up' : 'chevron-down'} size={14} />
          </View>
        )}
      />
    </View>
  )
}
