/** @jsxImportSource @phaserjsx/ui */
import { AlertDialog, Button, Text, useCallback, useState } from '@phaserjsx/ui'

/**
 * Quick Start AlertDialog Example
 * Basic alert with title and description
 */
export function QuickStartExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => {
    console.log('Confirmed!')
  }, [])

  return (
    <>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Alert" />
      </Button>

      <AlertDialog
        key="quick-start-alert"
        isOpen={isOpen}
        onClose={handleClose}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        onConfirm={handleConfirm}
      />
    </>
  )
}
