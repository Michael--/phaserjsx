/** @jsxImportSource @phaserjsx/ui */
import {
  Button,
  Dialog,
  ScrollView,
  Text,
  Toggle,
  View,
  useState,
  useThemeTokens,
} from '@phaserjsx/ui'
import { Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

/**
 * Basic Dialog Example
 */
function BasicDialogExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Basic Dialog" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Basic Dialog">
        <Text text="This is a basic dialog with just a title and content." />
        <Text text="You can close it by clicking the X button, clicking outside, or pressing Escape." />
      </Dialog>
    </ViewLevel3>
  )
}

/**
 * Dialog with Icon
 */
function DialogWithIconExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Dialog with Icon" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Open Settings Dialog" />
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        prefix={<Icon type="gear" size={24} />}
      >
        <View direction="column" gap={16}>
          <Text text="Configure your application settings here." />
          <Toggle label="Enable notifications" checked={false} onChange={() => {}} />
          <Toggle label="Dark mode" checked={false} onChange={() => {}} />
          <Toggle label="Auto-save" checked={true} onChange={() => {}} />
        </View>
      </Dialog>
    </ViewLevel3>
  )
}

/**
 * Dialog with Actions
 */
function DialogWithActionsExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const tokens = useThemeTokens()

  const handleSave = () => {
    setSaved(true)
    setIsOpen(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ViewLevel3>
      <Text text="Dialog with Actions" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Edit Profile" />
      </Button>
      {saved && <Text text="✓ Profile saved!" style={{ color: '#4caf50' }} />}

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        prefix={<Icon type="person" size={24} />}
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              <Text text="Cancel" />
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Text text="Save Changes" />
            </Button>
          </>
        }
      >
        <View direction="column" gap={16}>
          <Text text="Name: John Doe" />
          <Text text="Email: john@example.com" />
          <Text text="Role: Developer" />
        </View>
      </Dialog>
    </ViewLevel3>
  )
}

/**
 * Dialog without Close Button
 */
function DialogNoCloseExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Dialog without Close Button" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Important Message"
        showClose={false}
        closeOnBackdrop={false}
        closeOnEscape={false}
        actions={
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            <Text text="I Understand" />
          </Button>
        }
      >
        <Text text="You must click the button to close this dialog." />
        <Text text="Backdrop click and Escape key are disabled." />
      </Dialog>
    </ViewLevel3>
  )
}

/**
 * Large Dialog Example
 */
function LargeDialogExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  return (
    <ViewLevel3>
      <Text text="Large Dialog" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Open Large Dialog" />
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms of Service"
        maxWidth={800}
        prefix={<Icon type="file-text" size={24} />}
        actions={
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            <Text text="Accept" />
          </Button>
        }
      >
        <View direction="column" gap={12}>
          <Text text="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Text text="Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
          <Text text="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." />
          <Text text="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum." />
          <Text text="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia." />
          <Text text="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
          <Text text="Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
        </View>
      </Dialog>
    </ViewLevel3>
  )
}

/**
 * Main Dialog Example Component
 */
export function DialogExample() {
  return (
    <ScrollView width="100%" height="100%">
      <ViewLevel2>
        <SectionHeader title="Dialog Examples" />
        <View direction="column" gap={32}>
          <BasicDialogExample />
          <DialogWithIconExample />
          <DialogWithActionsExample />
          <DialogNoCloseExample />
          <LargeDialogExample />
        </View>
      </ViewLevel2>
    </ScrollView>
  )
}
