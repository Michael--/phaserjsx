/** @jsxImportSource @phaserjsx/ui */
import { AlertDialog, Button, Text, useCallback, useState, View } from '@phaserjsx/ui'

/**
 * Custom Buttons Example
 * Shows custom button text and single-button mode
 */
export function CustomButtonsExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => {
    console.log('Acknowledged')
  }, [])

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Alert" />
      </Button>

      <AlertDialog
        key="custom-buttons-alert"
        isOpen={isOpen}
        onClose={handleClose}
        variant="success"
        title="Welcome!"
        description="Your account has been successfully created. You can now start using the application."
        confirmText="Get Started"
        showCancel={false}
        onConfirm={handleConfirm}
      />
    </View>
  )
}
