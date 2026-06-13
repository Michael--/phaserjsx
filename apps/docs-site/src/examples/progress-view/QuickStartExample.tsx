/** @jsxImportSource @number10/phaserjsx */
import { ProgressView, View, useEffect, useScene, useState } from '@number10/phaserjsx'

export function QuickStartProgressViewExample() {
  const scene = useScene()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = scene.time.addEvent({
      delay: 60,
      loop: true,
      callback: () => setProgress((p) => (p >= 100 ? 0 : p + 0.3)),
    })
    return () => timer.remove()
  }, [scene])

  return (
    <View width="fill" height="fill" alignItems="center" justifyContent="center" gap={12}>
      <ProgressView
        label="Downloading assets..."
        value={Math.round(progress)}
        showPercentage
        width={300}
        progressBarProps={{ fillColor: 0x34d399 }}
      />
    </View>
  )
}
