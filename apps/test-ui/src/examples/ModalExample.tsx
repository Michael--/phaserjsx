/** @jsxImportSource @phaserjsx/ui */
import {
  Button,
  Modal,
  ScrollView,
  Text,
  Toggle,
  View,
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

  return (
    <ViewLevel2>
      <Toggle
        checked={closeOnBackdrop}
        onChange={setCloseOnBackdrop}
        label="Close on Backdrop Click"
      />
      <Toggle checked={closeOnEscape} onChange={setCloseOnEscape} label="Close on Escape Key" />
      {/* Trigger Buttons */}
      <View gap={12} direction="row">
        <Button variant="primary" onClick={() => setIsOpen(true)} disabled={isOpen}>
          <Text text="Open Modal" />
        </Button>
      </View>

      {/* Modal definition */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnBackdrop={closeOnBackdrop}
        closeOnEscape={closeOnEscape}
      >
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
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            <Text text="Close" />
          </Button>
        </ViewLevel2>
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
