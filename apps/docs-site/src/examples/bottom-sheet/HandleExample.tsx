/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import {
  BottomSheet,
  BottomSheetHandle,
  Button,
  Divider,
  Text,
  View,
  useState,
  type HandleRenderProps,
  type VNodeLike,
} from '@number10/phaserjsx'

const customHandle = (props: HandleRenderProps): VNodeLike => (
  <View alignItems="center" justifyContent="center" gap={4}>
    <View direction="row" gap={8} alignItems="center" justifyContent="center">
      <Icon type="hand-index-thumb" size={36} tint={props.color} />
      <Icon type="hand-index-thumb" size={36} tint={props.color} />
      <Icon type="hand-index-thumb" size={36} tint={props.color} />
    </View>
    <Divider length="98%" color={props.color} />
  </View>
)

export function HandleBottomSheetExample() {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<'Bar' | 'Grip' | 'Pill' | 'Custom'>('Bar')

  const handleMap = {
    Bar: BottomSheetHandle.Bar,
    Grip: BottomSheetHandle.Grip,
    Pill: BottomSheetHandle.Pill,
    Custom: customHandle,
  } as const

  return (
    <View
      width="fill"
      height="fill"
      alignItems="center"
      justifyContent="start"
      padding={20}
      gap={12}
    >
      <View direction="row" gap={8}>
        <Button
          width={64}
          text="Bar"
          onClick={() => {
            setVariant('Bar')
            setOpen(true)
          }}
        />
        <Button
          width={64}
          text="Grip"
          onClick={() => {
            setVariant('Grip')
            setOpen(true)
          }}
        />
        <Button
          width={64}
          text="Pill"
          onClick={() => {
            setVariant('Pill')
            setOpen(true)
          }}
        />
        <Button
          width={64}
          text="Custom"
          onClick={() => {
            setVariant('Custom')
            setOpen(true)
          }}
        />
      </View>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        height={0.5}
        handleAreaHeight={48}
        renderHandle={handleMap[variant]}
        closeOnBackdrop
      >
        <View
          padding={20}
          gap={12}
          theme={{ Text: { style: { color: '#e0e7ff', fontSize: '14px' } } }}
        >
          <Text text={`Handle: ${variant}`} />
          <Text text="handleAreaHeight is 48px for a larger touch target." />
          <Text text="Try all three variants to compare." />
        </View>
      </BottomSheet>
    </View>
  )
}
