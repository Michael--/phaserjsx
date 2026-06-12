/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { NotificationStack, View, useState, type ToastItem } from '@number10/phaserjsx'

const variantItems: ToastItem[] = [
  {
    id: 'info',
    variant: 'info',
    title: 'New inspector data',
    message: 'A fresh snapshot is available.',
    prefix: <Icon type="info-circle" size={18} />,
    autoDismiss: false,
  },
  {
    id: 'success',
    variant: 'success',
    title: 'Upload complete',
    message: 'All assets were processed successfully.',
    prefix: <Icon type="check-circle" size={18} />,
    autoDismiss: false,
  },
  {
    id: 'warning',
    variant: 'warning',
    title: 'Low memory',
    message: 'Consider closing unused panels before exporting.',
    prefix: <Icon type="exclamation-triangle" size={18} />,
    autoDismiss: false,
  },
  {
    id: 'error',
    variant: 'error',
    title: 'Export failed',
    message: 'The target folder is not writable.',
    prefix: <Icon type="x-circle" size={18} />,
    autoDismiss: false,
  },
]

export function VariantsToastExample() {
  const [items, setItems] = useState<ToastItem[]>(variantItems)

  return (
    <View width="fill" height="fill">
      <NotificationStack
        items={items}
        position="top"
        width={360}
        duration={0}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </View>
  )
}
