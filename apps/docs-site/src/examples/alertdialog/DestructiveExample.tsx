/** @jsxImportSource @phaserjsx/ui */
import { AlertDialog, Button, Text, useCallback, useState, View } from '@phaserjsx/ui'

/**
 * Destructive Action Example
 * Common pattern for delete confirmations
 */
export function DestructiveExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleDelete = useCallback(() => {
    setDeleted(true)
    setTimeout(() => setDeleted(false), 2000)
  }, [])

  return (
    <View gap={10} padding={10}>
      <Button onClick={handleOpen}>
        <Text text="Delete Item" />
      </Button>
      {deleted && <Text text="✓ Item deleted!" style={{ color: '#f44336' }} key="deleted-msg" />}

      <AlertDialog
        key="delete-alert"
        isOpen={isOpen}
        onClose={handleClose}
        variant="destructive"
        title="Delete Item?"
        description="This action cannot be undone. All data will be permanently deleted."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </View>
  )
}
