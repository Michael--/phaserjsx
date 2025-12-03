/** @jsxImportSource @phaserjsx/ui */
import {
  AlertDialog,
  Button,
  ScrollView,
  Text,
  View,
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

  return (
    <ViewLevel3>
      <Text text="Info Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Show Info" />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="info"
        prefix={<Icon type="info-circle" size={24} />}
        title="Information"
        description="This is an informational message. Click OK to acknowledge."
        onConfirm={() => console.log('Info acknowledged')}
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

  return (
    <ViewLevel3>
      <Text text="Warning Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Show Warning" />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="warning"
        prefix={<Icon type="exclamation-triangle" size={24} />}
        title="Warning"
        description="This action may have unintended consequences. Are you sure you want to continue?"
        confirmText="Continue"
        onConfirm={() => console.log('Warning accepted')}
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

  const handleDelete = () => {
    setDeleted(true)
    setTimeout(() => setDeleted(false), 2000)
  }

  return (
    <ViewLevel3>
      <Text text="Destructive Variant" style={tokens?.textStyles.heading} />
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        <Text text="Delete Item" />
      </Button>
      {deleted && <Text text="✓ Item deleted!" style={{ color: '#f44336' }} />}

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="destructive"
        prefix={<Icon type="trash" size={24} />}
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

  return (
    <ViewLevel3>
      <Text text="Success Variant" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Show Success" />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="success"
        prefix={<Icon type="check-circle" size={24} />}
        title="Success!"
        description="Your operation completed successfully."
        confirmText="Great"
        showCancel={false}
        onConfirm={() => console.log('Success acknowledged')}
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

  const handleAsyncConfirm = async () => {
    setStatus('Processing...')
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStatus('✓ Operation completed!')
    setTimeout(() => setStatus(''), 2000)
  }

  return (
    <ViewLevel3>
      <Text text="Async Confirm" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Start Process" />
      </Button>
      {status && <Text text={status} />}

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prefix={<Icon type="hourglass" size={24} />}
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

  return (
    <ViewLevel3>
      <Text text="No Cancel Button" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Show Alert" />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prefix={<Icon type="bell" size={24} />}
        title="Notification"
        description="You have 5 new messages."
        confirmText="View Messages"
        showCancel={false}
        onConfirm={() => console.log('View messages')}
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

  return (
    <ViewLevel3>
      <Text text="Custom Icon (Non-Variant)" style={tokens?.textStyles.heading} />
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <Text text="Show Custom" />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prefix={<Icon type="star" size={24} />}
        title="Rate Your Experience"
        description="How would you rate your experience with this app?"
        confirmText="Rate Now"
        onConfirm={() => console.log('Rating flow')}
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
