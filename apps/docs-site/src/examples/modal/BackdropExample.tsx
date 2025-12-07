/**
 * Modal Backdrop Behavior Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Modal, Text, View, WrapText, useState } from '@phaserjsx/ui'

export function BackdropExample() {
  const [blockingModal, setBlockingModal] = useState(false)
  const [nonBlockingModal, setNonBlockingModal] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Backdrop Click Behavior" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View direction="row" gap={12}>
          <View
            padding={12}
            backgroundColor={0x3b82f6}
            cornerRadius={6}
            onTouch={() => setBlockingModal(true)}
          >
            <Text text="Close on Backdrop" style={{ fontSize: '14px', color: '#fff' }} />
          </View>

          <View
            padding={12}
            backgroundColor={0x10b981}
            cornerRadius={6}
            onTouch={() => setNonBlockingModal(true)}
          >
            <Text text="No Close on Backdrop" style={{ fontSize: '14px', color: '#fff' }} />
          </View>
        </View>

        <Text
          text="Compare modal behavior with different backdrop settings"
          style={{ fontSize: '12px', color: '#666' }}
        />
      </View>

      {/* Modal that closes on backdrop click */}
      <Modal isOpen={blockingModal} onClose={() => setBlockingModal(false)} closeOnBackdrop={true}>
        <View
          width={350}
          height={200}
          backgroundColor={0xffffff}
          cornerRadius={12}
          padding={20}
          direction="column"
          gap={12}
          justifyContent="center"
          alignItems="center"
        >
          <Text
            text="Click Outside to Close"
            style={{ fontSize: '18px', color: '#111', fontStyle: 'bold' }}
          />
          <WrapText
            text="This modal closes when you click the backdrop or press Escape."
            style={{ fontSize: '14px', color: '#666' }}
          />
        </View>
      </Modal>

      {/* Modal that doesn't close on backdrop click */}
      <Modal
        isOpen={nonBlockingModal}
        onClose={() => setNonBlockingModal(false)}
        closeOnBackdrop={false}
      >
        <View
          width={350}
          height={220}
          backgroundColor={0xffffff}
          cornerRadius={12}
          padding={20}
          direction="column"
          gap={12}
        >
          <Text
            text="Explicit Close Required"
            style={{ fontSize: '18px', color: '#111', fontStyle: 'bold' }}
          />
          <WrapText
            text="This modal only closes with the button or Escape key."
            style={{ fontSize: '14px', color: '#666' }}
          />
          <View flex={1} />
          <View
            padding={12}
            backgroundColor={0xef4444}
            cornerRadius={6}
            onTouch={() => setNonBlockingModal(false)}
          >
            <Text text="Close Modal" style={{ fontSize: '14px', color: '#fff' }} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
