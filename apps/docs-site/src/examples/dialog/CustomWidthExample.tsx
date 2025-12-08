/** @jsxImportSource @phaserjsx/ui */
import { Button, Dialog, Text, View, WrapText, useCallback, useMemo, useState } from '@phaserjsx/ui'

/**
 * Custom Width Dialog Example
 * Shows maxWidth prop usage
 */
export function CustomWidthExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const content = useMemo(
    () => (
      <WrapText text="This dialog is wider than the default 600px. Use maxWidth to control dialog size based on content needs." />
    ),
    []
  )

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Wide Dialog" />
      </Button>

      <Dialog
        key="wide-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Wide Dialog"
        maxWidth={800}
      >
        {content}
      </Dialog>
    </View>
  )
}
