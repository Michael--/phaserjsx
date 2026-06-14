/**
 * Press Feedback Example - spring feedback without changing layout
 */
/** @jsxImportSource @number10/phaserjsx */
import {
  Text,
  TransformOriginView,
  useEffect,
  useForceRedraw,
  useRef,
  useSpring,
  useState,
  View,
  WrapText,
} from '@number10/phaserjsx'

/**
 * Button-like control that uses scale for tactile feedback without resizing layout.
 */
export function PressFeedbackExample() {
  const [scale, setScale] = useSpring(1, 'stiff')
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState('Ready')
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useForceRedraw(20, scale)

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current)
    }
  }, [])

  const handlePress = () => {
    if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current)

    setScale(0.92)
    setCount((prev) => prev + 1)
    setStatus('Saved')

    releaseTimerRef.current = setTimeout(() => {
      setScale(1)
      setStatus('Ready')
    }, 250)
  }

  return (
    <View
      width="fill"
      height="fill"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={14}
    >
      <View
        width={360}
        direction="column"
        gap={16}
        padding={18}
        backgroundColor={0x172033}
        cornerRadius={10}
      >
        <View direction="row" justifyContent="space-between" alignItems="center">
          <View direction="column" gap={4}>
            <Text text="Problem" style={{ fontSize: 11, color: '#7f8da3' }} />
            <Text
              text="Tap feedback should feel instant"
              style={{ fontSize: 15, color: '#ffffff' }}
            />
          </View>
          <Text text={`${count} saved`} style={{ fontSize: 11, color: '#8bdc9d' }} />
        </View>

        <WrapText
          text="The button springs down and back through transform scale, so surrounding layout stays stable."
          style={{ fontSize: 10, color: '#aeb8c8' }}
        />

        <View direction="row" alignItems="center" justifyContent="space-between">
          <TransformOriginView width={156} height={42} scale={scale.value} cornerRadius={8}>
            <View
              width={156}
              height={42}
              backgroundColor={0x4f7cff}
              cornerRadius={8}
              direction="row"
              alignItems="center"
              justifyContent="center"
              enableGestures
              onTouch={handlePress}
            >
              <Text text="Save changes" style={{ fontSize: 13, color: '#ffffff' }} />
            </View>
          </TransformOriginView>

          <View
            width={110}
            height={34}
            backgroundColor={0x0f1726}
            cornerRadius={6}
            alignItems="center"
            justifyContent="center"
          >
            <Text text={status} style={{ fontSize: 12, color: '#cbd5e1' }} />
          </View>
        </View>
      </View>
    </View>
  )
}
