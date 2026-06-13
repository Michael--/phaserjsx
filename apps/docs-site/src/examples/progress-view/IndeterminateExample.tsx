/** @jsxImportSource @number10/phaserjsx */
import { ProgressView, View, useState } from '@number10/phaserjsx'

export function IndeterminateProgressViewExample() {
  const [loading, setLoading] = useState(true)
  const [cancelled, setCancelled] = useState(false)

  const handleCancel = () => {
    setLoading(false)
    setCancelled(true)
  }

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <ProgressView
        indeterminate={loading}
        value={loading ? undefined : cancelled ? 27 : 100}
        label={
          loading ? 'Processing payment...' : cancelled ? 'Cancelled at 27%' : 'Payment complete!'
        }
        showPercentage={!loading}
        showCancel={loading}
        onCancel={handleCancel}
        width={340}
        progressBarProps={{
          fillColor: cancelled ? 0xf59e0b : 0x34d399,
        }}
      />
    </View>
  )
}
