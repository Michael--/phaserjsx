/**
 * Modal Animations Example - Zoom and fade animations
 */
/** @jsxImportSource @phaserjsx/ui */
import {
  Modal,
  Text,
  View,
  WrapText,
  createZoomInEffect,
  createZoomOutEffect,
  useState,
} from '@phaserjsx/ui'

export function AnimationsExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Built-in Animations" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setIsOpen(true)}
        >
          <Text text="Show Animated Modal" style={{ fontSize: '16px', color: '#fff' }} />
        </View>

        <View direction="column" gap={8}>
          <Text
            text="• Backdrop: Fade in/out animation"
            style={{ fontSize: '14px', color: '#666' }}
          />
          <Text
            text="• Content: Zoom in/out animation"
            style={{ fontSize: '14px', color: '#666' }}
          />
          <Text text="• Duration: 500ms" style={{ fontSize: '14px', color: '#666' }} />
        </View>
      </View>

      <Modal
        show={isOpen}
        onClosed={() => setIsOpen(false)}
        viewOpenEffect={createZoomInEffect}
        viewCloseEffect={createZoomOutEffect}
      >
        <View
          width={400}
          height={300}
          backgroundColor={0xffffff}
          cornerRadius={16}
          padding={24}
          direction="column"
          gap={16}
        >
          <Text
            text="Animated Modal"
            style={{ fontSize: '22px', color: '#111', fontStyle: 'bold' }}
          />

          <View direction="column" gap={12} flex={1}>
            <WrapText
              text="The modal smoothly zooms in when opening and zooms out when closing."
              style={{ fontSize: '14px', color: '#666' }}
            />
            <WrapText
              text="The backdrop fades in and out simultaneously for a polished effect."
              style={{ fontSize: '14px', color: '#666' }}
            />
            <WrapText
              text="Animations are built-in and require no additional configuration."
              style={{ fontSize: '14px', color: '#666' }}
            />
          </View>

          <View direction="row" gap={12} justifyContent="end">
            <View
              padding={12}
              backgroundColor={0x3b82f6}
              cornerRadius={6}
              onTouch={() => setIsOpen(false)}
            >
              <Text text="Close & Animate" style={{ fontSize: '14px', color: '#fff' }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
