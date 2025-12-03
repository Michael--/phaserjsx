/** @jsxImportSource @phaserjsx/ui */
import {
  AlertDialog,
  Button,
  ScrollView,
  Text,
  View,
  useCallback,
  useMemo,
  useState,
  useThemeTokens,
} from '@phaserjsx/ui'
import { Icon } from '../components'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

/**
 * Info Variant Example
 */
function InfoVariantExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => console.log('Info acknowledged'), [])

  const prefix = useMemo(() => <Icon type="info-circle" size={24} key="info-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="Info Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Info" />
      </Button>

      <AlertDialog
        key="info-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        variant="info"
        prefix={prefix}
        title="Information"
        description="This is an informational message. Click OK to acknowledge."
        onConfirm={handleConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * Warning Variant Example
 */
function WarningVariantExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => console.log('Warning accepted'), [])

  const prefix = useMemo(
    () => <Icon type="exclamation-triangle" size={24} key="warning-icon" />,
    []
  )

  return (
    <ViewLevel3>
      <Text text="Warning Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Warning" />
      </Button>

      <AlertDialog
        key="warning-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        variant="warning"
        prefix={prefix}
        title="Warning"
        description="This action may have unintended consequences. Are you sure you want to continue?"
        confirmText="Continue"
        onConfirm={handleConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * Destructive Variant Example
 */
function DestructiveVariantExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleDelete = useCallback(() => {
    setDeleted(true)
    setTimeout(() => setDeleted(false), 2000)
  }, [])

  const prefix = useMemo(() => <Icon type="trash" size={24} key="trash-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="Destructive Variant" style={tokens?.textStyles.heading} />
      <Button variant="danger" onClick={handleOpen}>
        <Text text="Delete Item" />
      </Button>
      {deleted && <Text text="✓ Item deleted!" style={{ color: '#f44336' }} key="deleted-msg" />}

      <AlertDialog
        key="destructive-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        variant="destructive"
        prefix={prefix}
        title="Delete Item?"
        description="This action cannot be undone. All data will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </ViewLevel3>
  )
}

/**
 * Success Variant Example
 */
function SuccessVariantExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => console.log('Success acknowledged'), [])

  const prefix = useMemo(() => <Icon type="check-circle" size={24} key="success-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="Success Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Success" />
      </Button>

      <AlertDialog
        key="success-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        variant="success"
        prefix={prefix}
        title="Success!"
        description="Your operation completed successfully."
        confirmText="Great"
        showCancel={false}
        onConfirm={handleConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * Async Confirm Example
 */
function AsyncConfirmExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleAsyncConfirm = useCallback(async () => {
    setStatus('Processing...')
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStatus('✓ Operation completed!')
    setTimeout(() => setStatus(''), 2000)
  }, [])

  const prefix = useMemo(() => <Icon type="hourglass" size={24} key="hourglass-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="Async Confirm" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Start Process" />
      </Button>
      {status && <Text text={status} key="status-msg" />}

      <AlertDialog
        key="async-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        prefix={prefix}
        title="Start Process?"
        description="This will take a few seconds to complete. The button will be disabled during processing."
        confirmText="Start"
        onConfirm={handleAsyncConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * No Cancel Button Example
 */
function NoCancelExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => console.log('View messages'), [])

  const prefix = useMemo(() => <Icon type="bell" size={24} key="bell-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="No Cancel Button" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Alert" />
      </Button>

      <AlertDialog
        key="nocancel-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        prefix={prefix}
        title="Notification"
        description="You have 5 new messages."
        confirmText="View Messages"
        showCancel={false}
        onConfirm={handleConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * Custom Icon Example
 */
function CustomIconExample() {
  const [isOpen, setIsOpen] = useState(false)
  const tokens = useThemeTokens()

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleConfirm = useCallback(() => console.log('Custom icon action'), [])

  const prefix = useMemo(() => <Icon type="star" size={24} key="star-icon" />, [])

  return (
    <ViewLevel3>
      <Text text="Custom Icon (Non-Variant)" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={handleOpen}>
        <Text text="Show Custom" />
      </Button>

      <AlertDialog
        key="custom-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        prefix={prefix}
        title="Rate Your Experience"
        description="How would you rate your experience with this app?"
        confirmText="Rate Now"
        onConfirm={handleConfirm}
      />
    </ViewLevel3>
  )
}

/**
 * Main AlertDialog Example Component
 */
export function AlertDialogExample() {
  return (
    <ScrollView width="100%" height="100%">
      <ViewLevel2>
        <SectionHeader title="AlertDialog Examples" />
        <View direction="column" gap={32}>
          <InfoVariantExample />
          <WarningVariantExample />
          <DestructiveVariantExample />
          <SuccessVariantExample />
          <AsyncConfirmExample />
          <NoCancelExample />
          <CustomIconExample />
        </View>
      </ViewLevel2>
    </ScrollView>
  )
}
