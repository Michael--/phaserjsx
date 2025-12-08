/** @jsxImportSource @phaserjsx/ui */
import { AlertDialog, Button, Text, useCallback, useState } from '@phaserjsx/ui'

/**
 * Async Confirm Example
 * Shows loading state during async operations
 */
export function AsyncExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('')

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleAsyncConfirm = useCallback(async () => {
    setStatus('Processing...')
    // Simulate async operation (e.g., API call)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStatus('✓ Operation completed!')
    setTimeout(() => setStatus(''), 2000)
  }, [])

  return (
    <>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Start Process" />
      </Button>
      {status && <Text text={status} key="status-msg" />}

      <AlertDialog
        key="async-alert"
        isOpen={isOpen}
        onClose={handleClose}
        title="Start Process?"
        description="This will take a few seconds to complete. Buttons are disabled during processing."
        confirmText="Start"
        onConfirm={handleAsyncConfirm}
      />
    </>
  )
}
