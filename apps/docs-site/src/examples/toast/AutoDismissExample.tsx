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

export function AutoDismissToastExample() {
  const [items, setItems] = useState<ToastItem[]>([])
  const [counter, setCounter] = useState(0)

  const pushToast = () => {
    const next = counter + 1
    setCounter(next)
    setItems((current) => [
      ...current,
      {
        id: `auto-${next}`,
        variant: next % 3 === 0 ? 'warning' : 'success',
        title: next % 3 === 0 ? 'Retry scheduled' : 'Saved',
        message: next % 3 === 0 ? 'The operation will be retried shortly.' : 'Dismisses in 2.5s.',
        prefix:
          next % 3 === 0 ? (
            <Icon type="exclamation-triangle" size={18} />
          ) : (
            <Icon type="check-circle" size={18} />
          ),
        duration: 2500,
      },
    ])
  }

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <Button width={180} height={36} onClick={pushToast}>
        <Text text="Show auto toast" />
      </Button>
      <Text text="Manual close and timer both call onDismiss." />

      <NotificationStack
        items={items}
        position="bottom-right"
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </View>
  )
}
