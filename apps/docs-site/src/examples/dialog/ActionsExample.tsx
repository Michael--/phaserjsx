/** @jsxImportSource @number10/phaserjsx */
import { Button, Dialog, Text, View, useCallback, useMemo, useState } from '@number10/phaserjsx'

/**
 * Dialog with Actions Example
 * Shows footer action buttons
 */
export function ActionsExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleSave = useCallback(() => {
    setSaved(true)
    setIsOpen(false)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  const prefix = useMemo(() => <Text text="<ICON>" />, [])

  const actions = useMemo(
    () => (
      <>
        <Button onClick={handleClose}>
          <Text text="Cancel" />
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Text text="Save Changes" />
        </Button>
      </>
    ),
    [handleClose, handleSave]
  )

  const content = useMemo(
    () => (
      <View direction="column" gap={16}>
        <Text text="Name: John Doe" />
        <Text text="Email: john@example.com" />
        <Text text="Role: Developer" />
      </View>
    ),
    []
  )

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Edit Profile" />
      </Button>
      {saved && <Text text="✓ Profile saved!" style={{ color: '#4caf50' }} key="saved-msg" />}

      <Dialog
        key="profile-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Profile"
        prefix={prefix}
        actions={actions}
      >
        {content}
      </Dialog>
    </View>
  )
}
