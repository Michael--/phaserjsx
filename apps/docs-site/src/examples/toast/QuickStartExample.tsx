/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import {
  Button,
  NotificationStack,
  Text,
  View,
  useState,
  type ToastItem,
} from '@number10/phaserjsx'

const initialToasts: ToastItem[] = [
  {
    id: 'saved',
    variant: 'success',
    title: 'Project saved',
    message: 'Your changes are synced and ready for the next build.',
    prefix: <Icon type="check-circle" size={18} />,
    autoDismiss: false,
  },
]

export function QuickStartToastExample() {
  const [items, setItems] = useState<ToastItem[]>(initialToasts)
  const [counter, setCounter] = useState(1)

  const addToast = () => {
    const next = counter + 1
    setCounter(next)
    setItems((current) => [
      ...current,
      {
        id: `toast-${next}`,
        variant: 'info',
        title: `Build ${next} queued`,
        message: 'The task was added to the background queue.',
        prefix: <Icon type="info-circle" size={18} />,
        autoDismiss: false,
      },
    ])
  }

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <Button width={150} height={36} onClick={addToast}>
        <Text text="Add toast" />
      </Button>

      <Text text={`Visible: ${items.length}`} />

      <NotificationStack
        items={items}
        duration={0}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </View>
  )
}
