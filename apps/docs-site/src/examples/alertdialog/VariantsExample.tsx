/** @jsxImportSource @number10/phaserjsx */
import { AlertDialog, Button, Text, View, useCallback, useState } from '@number10/phaserjsx'

/**
 * Variants Example
 * Shows different visual variants
 */
export function VariantsExample() {
  const [variant, setVariant] = useState<'info' | 'warning' | 'destructive' | 'success' | null>(
    null
  )

  const handleClose = useCallback(() => setVariant(null), [])
  const handleConfirm = useCallback(() => {
    console.log('Confirmed:', variant)
  }, [variant])

  return (
    <View gap={10} padding={10}>
      <View direction="row" gap={8}>
        <Button variant="primary" onClick={() => setVariant('info')}>
          <Text text="Info" />
        </Button>
        <Button onClick={() => setVariant('warning')}>
          <Text text="Warning" />
        </Button>
        <Button onClick={() => setVariant('destructive')}>
          <Text text="Destructive" />
        </Button>
        <Button variant="primary" onClick={() => setVariant('success')}>
          <Text text="Success" />
        </Button>
      </View>

      {variant && (
        <AlertDialog
          key={`variant-${variant}`}
          isOpen={true}
          onClose={handleClose}
          variant={variant}
          title={
            variant === 'info'
              ? 'Information'
              : variant === 'warning'
                ? 'Warning'
                : variant === 'destructive'
                  ? 'Delete Item?'
                  : 'Success!'
          }
          description={
            variant === 'info'
              ? 'This is an informational message.'
              : variant === 'warning'
                ? 'This action may have consequences.'
                : variant === 'destructive'
                  ? 'This action cannot be undone.'
                  : 'Operation completed successfully.'
          }
          confirmText={variant === 'destructive' ? 'Delete' : 'OK'}
          showCancel={variant !== 'success'}
          onConfirm={handleConfirm}
        />
      )}
    </View>
  )
}
