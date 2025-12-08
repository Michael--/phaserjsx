/** @jsxImportSource @phaserjsx/ui */
import {
  Button,
  Modal,
  ScrollView,
  Text,
  Toggle,
  useCallback,
  useMemo,
  useState,
  useThemeTokens,
} from '@phaserjsx/ui'
import { SectionHeader, ViewLevel2 } from './Helper'

/**
 * Modal component example
 * Shows backdrop, animations, and close functionality
 */
function Example() {
  const [isOpen, setIsOpen] = useState(false)
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true)
  const [closeOnEscape, setCloseOnEscape] = useState(true)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const content = useMemo(
    () => (
      <ViewLevel2 minWidth={400} padding={24} gap={16}>
        <Text text="Modal - View" style={tokens?.textStyles.heading} />
        <Text text="Close Options:" style={tokens?.textStyles.DEFAULT} />
        <Text
          text={`Click backdrop: ${closeOnBackdrop ? 'yes' : 'no'}`}
          style={tokens?.textStyles.DEFAULT}
        />
        <Text
          text={`Escape key: ${closeOnEscape ? 'yes' : 'no'}`}
          style={tokens?.textStyles.DEFAULT}
        />
        <Button variant="primary" onClick={handleClose}>
          <Text text="Close" />
        </Button>
      </ViewLevel2>
    ),
    [tokens, closeOnBackdrop, closeOnEscape, handleClose]
  )

  return (
    <ViewLevel2>
      <Toggle
        checked={closeOnBackdrop}
        onChange={setCloseOnBackdrop}
        label="Close on Backdrop Click"
      />
      <Toggle checked={closeOnEscape} onChange={setCloseOnEscape} label="Close on Escape Key" />
      {/* Trigger Buttons */}
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Modal" />
      </Button>

      {/* Modal definition */}
      <Modal
        key="example-modal"
        show={isOpen}
        onClosed={handleClose}
        closeOnBackdrop={closeOnBackdrop}
        closeOnEscape={closeOnEscape}
      >
        {content}
      </Modal>
    </ViewLevel2>
  )
}

/**
 * Main Graphics example component
 */
export function ModalExample() {
  return (
    <ScrollView>
      <ViewLevel2>
        <SectionHeader title="Modal Examples" />
        <Example />
      </ViewLevel2>
    </ScrollView>
  )
}
