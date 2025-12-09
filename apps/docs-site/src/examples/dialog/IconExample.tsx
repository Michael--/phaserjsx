/** @jsxImportSource @number10/phaserjsx */
import {
  Button,
  Dialog,
  Text,
  Toggle,
  useCallback,
  useMemo,
  useState,
  View,
} from '@number10/phaserjsx'

/**
 * Dialog with Icon Example
 * Shows prefix icon in header
 */
export function IconExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleToggle = useCallback(() => {}, [])

  const prefix = useMemo(() => <Text text="ICON" />, [])

  const content = useMemo(
    () => (
      <View direction="column" gap={16}>
        <Text text="Configure your application settings here." />
        <Toggle label="Enable notifications" checked={false} onChange={handleToggle} />
        <Toggle label="Dark mode" checked={false} onChange={handleToggle} />
        <Toggle label="Auto-save" checked={true} onChange={handleToggle} />
      </View>
    ),
    [handleToggle]
  )

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Settings Dialog" />
      </Button>

      <Dialog
        key="settings-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Settings"
        prefix={prefix}
      >
        {content}
      </Dialog>
    </View>
  )
}
