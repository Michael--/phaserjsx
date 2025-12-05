/**
 * RadioButton Controlled Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { RadioGroup, Text, useState, View } from '@phaserjsx/ui'

export function ControlledRadioButtonExample() {
  const [priority, setPriority] = useState('normal')
  const [notifications, setNotifications] = useState('all')

  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={24}
      direction="column"
      justifyContent="center"
      alignItems="start"
    >
      <View direction="column" gap={12}>
        <Text text="Task Priority" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RadioGroup
          value={priority}
          onChange={setPriority}
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'normal', label: 'Normal Priority' },
            { value: 'high', label: 'High Priority' },
            { value: 'urgent', label: 'Urgent' },
          ]}
        />
        <Text
          text={`Current priority: ${priority}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>

      <View direction="column" gap={12}>
        <Text text="Notification Settings" style={{ color: '#ffffff', fontSize: '14px' }} />
        <RadioGroup
          value={notifications}
          onChange={setNotifications}
          options={[
            { value: 'all', label: 'All notifications' },
            { value: 'mentions', label: 'Mentions only' },
            { value: 'none', label: 'No notifications' },
          ]}
        />
        <Text
          text={`Notifications: ${notifications}`}
          style={{ color: '#95a5a6', fontSize: '12px' }}
        />
      </View>
    </View>
  )
}
