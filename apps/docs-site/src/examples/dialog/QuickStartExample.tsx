/** @jsxImportSource @phaserjsx/ui */
import { Button, Dialog, Text, View, WrapText, useCallback, useMemo, useState } from '@phaserjsx/ui'

/**
 * Quick Start Dialog Example
 * Basic dialog with title and content
 */
export function QuickStartExample() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const content = useMemo(
    () => (
      <WrapText text="This is a basic dialog with just a title and content. You can close it by clicking the X button, clicking outside, or pressing Escape." />
    ),
    []
  )

  return (
    <View gap={10} padding={10}>
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog key="quick-start-dialog" isOpen={isOpen} onClose={handleClose} title="Welcome">
        {content}
      </Dialog>
    </View>
  )
}
