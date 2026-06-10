/**
 * Badge Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Badge, Button, Tag, Text, useState, View } from '@number10/phaserjsx'

export function QuickStartBadgeExample() {
  const [notifications, setNotifications] = useState(3)

  return (
    <View width="fill" height="fill" padding={24} gap={18} justifyContent="center">
      <View direction="row" gap={12} alignItems="center">
        <Text text="Inbox" style={{ color: '#ffffff', fontSize: '18px' }} />
        <Badge count={notifications} tone="danger" />
        <Badge dot tone="success" />
      </View>

      <View direction="row" gap={10} alignItems="center">
        <Tag label="Quest" tone="primary" selected />
        <Tag label="Rare" tone="warning" />
        <Tag label="New" tone="success" variant="outline" />
      </View>

      <View direction="row" gap={10}>
        <Button
          width={120}
          height={34}
          onClick={() => setNotifications((value) => Math.max(0, value - 1))}
        >
          <Text text="Read one" style={{ color: '#ffffff', fontSize: '13px' }} />
        </Button>
        <Button width={120} height={34} onClick={() => setNotifications((value) => value + 5)}>
          <Text text="Add five" style={{ color: '#ffffff', fontSize: '13px' }} />
        </Button>
      </View>
    </View>
  )
}
