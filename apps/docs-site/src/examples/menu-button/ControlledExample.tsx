/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { Button, MenuButton, Text, View, useState, type ContextMenuItem } from '@number10/phaserjsx'

export function ControlledMenuButtonExample() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('Closed')

  const items: ContextMenuItem[] = [
    {
      id: 'duplicate',
      label: 'Duplicate',
      prefix: <Icon type="copy" size={16} />,
    },
    {
      id: 'rename',
      label: 'Rename',
      disabled: true,
      prefix: <Icon type="pencil" size={16} />,
    },
    {
      id: 'remove',
      label: 'Remove',
      danger: true,
      prefix: <Icon type="trash" size={16} />,
    },
  ]

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={16}>
      <View alignItems="center" gap={10}>
        <Button
          variant="ghost"
          size="small"
          label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        />

        <MenuButton
          label="Object"
          icon={<Icon type="gear" size={16} />}
          items={items}
          open={open}
          onOpenChange={setOpen}
          placement="right-start"
          width={180}
          onSelect={(item) => setStatus(item.label)}
        />
      </View>

      <Text text={`Menu: ${open ? 'open' : 'closed'} | Last: ${status}`} />
    </View>
  )
}
