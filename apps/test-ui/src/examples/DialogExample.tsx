/** @jsxImportSource @phaserjsx/ui */
import {
  Button,
  Dialog,
  ScrollView,
  Text,
  Toggle,
  View,
  WrapText,
  useCallback,
  useMemo,
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

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const content = useMemo(
    () => (
      <WrapText text="This is a basic dialog with just a title and content. You can close it by clicking the X button, clicking outside, or pressing Escape." />
    ),
    []
  )

  return (
    <ViewLevel3>
      <Text text="Basic Dialog" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog key="basic-dialog" isOpen={isOpen} onClose={handleClose} title="Basic Dialog">
        {content}
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

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleToggle = useCallback(() => {}, [])

  const prefix = useMemo(() => <Icon type="gear" size={24} key="gear-icon" />, [])

  const content = useMemo(
    () => (
      <View direction="column" gap={16}>
        <Text text="Configure your application settings here." />
        <Toggle label="Enable notifications" checked={false} onChange={handleToggle} />
        <Toggle label="Dark mode" checked={false} onChange={handleToggle} />
        <Toggle label="Auto-save" checked={true} onChange={handleToggle} />
      </View>
    ),
    [handleToggle]
  )

  return (
    <ViewLevel3>
      <Text text="Dialog with Icon" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Settings Dialog" />
      </Button>

      <Dialog
        key="settings-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Settings"
        prefix={prefix}
      >
        {content}
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

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleSave = useCallback(() => {
    setSaved(true)
    setIsOpen(false)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  const prefix = useMemo(() => <Icon type="person" size={24} key="person-icon" />, [])

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
    <ViewLevel3>
      <Text text="Dialog with Actions" style={tokens?.textStyles.heading} />
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
    </ViewLevel3>
  )
}

/**
 * Dialog without Close Button
 */
function DialogNoCloseExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

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
    <ViewLevel3>
      <Text text="Dialog without Close Button" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Dialog" />
      </Button>

      <Dialog
        key="noclose-dialog"
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
    </ViewLevel3>
  )
}

/**
 * Large Dialog Example
 */
function LargeDialogExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  const prefix = useMemo(() => <Icon type="file-text" size={24} key="file-icon" />, [])

  const actions = useMemo(
    () => (
      <Button variant="primary" onClick={handleClose}>
        <Text text="Accept" />
      </Button>
    ),
    [handleClose]
  )

  const content = useMemo(
    () => (
      <WrapText
        text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}
      />
    ),
    []
  )

  return (
    <ViewLevel3>
      <Text text="Large Dialog" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Open Large Dialog" />
      </Button>

      <Dialog
        key="large-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        title="Terms of Service"
        maxWidth={800}
        prefix={prefix}
        actions={actions}
      >
        {content}
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
