/**
 * Portal Modal Pattern Example - Building a simple modal with Portal
 */
/** @jsxImportSource @phaserjsx/ui */
import { Portal, Text, View, WrapText, useState } from '@phaserjsx/ui'

export function ModalPatternExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Custom Modal Pattern" style={{ fontSize: '18px' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setIsOpen(true)}
        >
          <Text text="Open Modal" style={{ fontSize: '16px', color: '#fff' }} />
        </View>

        <Text
          text="Shows how to build a modal-like pattern with Portal"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      {/* Modal using Portal */}
      {isOpen && (
        <Portal depth={2000} blockEvents={true}>
          {/* Semi-transparent backdrop */}
          <View
            x={0}
            y={0}
            width={'fill'}
            height={'fill'}
            backgroundColor={0x000000}
            alpha={0.6}
            onTouch={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <View
            x={200}
            y={80}
            width={400}
            height={300}
            backgroundColor={0xffffff}
            cornerRadius={16}
            padding={24}
          >
            <View direction="column" gap={16} width={'fill'} height={'fill'}>
              {/* Header */}
              <View direction="row" justifyContent="space-between" width={'fill'}>
                <Text text="Modal Title" style={{ fontSize: '20px', color: '#111' }} />
                <View
                  width={32}
                  height={32}
                  backgroundColor={0xe5e7eb}
                  cornerRadius={16}
                  justifyContent="center"
                  alignItems="center"
                  onTouch={() => setIsOpen(false)}
                >
                  <Text text="×" style={{ fontSize: '24px', color: '#666' }} />
                </View>
              </View>

              {/* Content */}
              <View direction="column" gap={12} flex={1} width={'fill'}>
                <WrapText
                  text="This demonstrates how Portal can be used to build overlay patterns like modals, dialogs, or tooltips."
                  style={{ fontSize: '14px', color: '#666' }}
                />
                <WrapText
                  text="Portal handles the rendering at a higher depth, while you control the layout and behavior."
                  style={{ fontSize: '14px', color: '#666' }}
                />
              </View>

              {/* Actions */}
              <View direction="row" gap={12} justifyContent="end">
                <View
                  padding={12}
                  backgroundColor={0xe5e7eb}
                  cornerRadius={6}
                  onTouch={() => setIsOpen(false)}
                >
                  <Text text="Cancel" style={{ fontSize: '14px', color: '#666' }} />
                </View>
                <View
                  padding={12}
                  backgroundColor={0x3b82f6}
                  cornerRadius={6}
                  onTouch={() => setIsOpen(false)}
                >
                  <Text text="Confirm" style={{ fontSize: '14px', color: '#fff' }} />
                </View>
              </View>
            </View>
          </View>
        </Portal>
      )}
    </View>
  )
}
