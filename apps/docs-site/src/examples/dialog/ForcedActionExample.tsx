/** @jsxImportSource @phaserjsx/ui */
import { Button, Dialog, Text, View, WrapText, useCallback, useMemo, useState } from '@phaserjsx/ui'

/**
 * Forced Action Dialog Example
 * No backdrop/Escape closing, no close button
 */
export function ForcedActionExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const actions = useMemo(
    () => (
      <Button variant="primary" onClick={handleClose}>
        <Text text="I Understand" />
      </Button>
    ),
    [handleClose]
  )

  const content = useMemo(
    () => (
      <WrapText text="You must click the button to close this dialog. Backdrop click and Escape key are disabled." />
    ),
    []
  )

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog
        key="forced-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Important Message"
        showClose={false}
        closeOnBackdrop={false}
        closeOnEscape={false}
        actions={actions}
      >
        {content}
      </Dialog>
    </View>
  )
}
