/**
 * Modal Nested Example - Confirm dialog from modal
 */
/** @jsxImportSource @phaserjsx/ui */
import { Modal, Text, View, WrapText, useState } from '@phaserjsx/ui'

export function NestedExample() {
  const [mainModal, setMainModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)

  const handleDelete = () => {
    setConfirmModal(false)
    setMainModal(false)
  }

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Nested Modals" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setMainModal(true)}
        >
          <Text text="Open Main Modal" style={{ fontSize: '16px', color: '#fff' }} />
        </View>

        <WrapText
          text="Demonstrates modal stacking with proper depth ordering"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      {/* Main Modal */}
      <Modal isOpen={mainModal} onClose={() => setMainModal(false)} depth={1000}>
        <View
          width={400}
          height={280}
          backgroundColor={0xffffff}
          cornerRadius={16}
          padding={24}
          direction="column"
          gap={16}
        >
          <Text
            text="User Settings"
            style={{ fontSize: '20px', color: '#111', fontStyle: 'bold' }}
          />

          <View direction="column" gap={12} flex={1}>
            <Text text="Account name: John Doe" style={{ fontSize: '14px', color: '#666' }} />
            <Text text="Email: john@example.com" style={{ fontSize: '14px', color: '#666' }} />
            <WrapText
              text="Click the delete button to open a confirmation dialog."
              style={{ fontSize: '12px', color: '#999' }}
            />
          </View>

          <View direction="row" gap={12} justifyContent="end">
            <View
              padding={12}
              backgroundColor={0xe5e7eb}
              cornerRadius={6}
              onTouch={() => setMainModal(false)}
            >
              <Text text="Cancel" style={{ fontSize: '14px', color: '#666' }} />
            </View>
            <View
              padding={12}
              backgroundColor={0xef4444}
              cornerRadius={6}
              onTouch={() => setConfirmModal(true)}
            >
              <Text text="Delete Account" style={{ fontSize: '14px', color: '#fff' }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal (higher depth) */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} depth={1500}>
        <View
          width={350}
          height={220}
          backgroundColor={0xffffff}
          cornerRadius={12}
          padding={20}
          direction="column"
          gap={16}
        >
          <Text
            text="Confirm Deletion"
            style={{ fontSize: '18px', color: '#111', fontStyle: 'bold' }}
          />

          <WrapText
            text="Are you sure you want to delete your account? This action cannot be undone."
            style={{ fontSize: '14px', color: '#666' }}
          />

          <View direction="row" gap={12} justifyContent="end">
            <View
              padding={12}
              backgroundColor={0xe5e7eb}
              cornerRadius={6}
              onTouch={() => setConfirmModal(false)}
            >
              <Text text="Cancel" style={{ fontSize: '14px', color: '#666' }} />
            </View>
            <View padding={12} backgroundColor={0xef4444} cornerRadius={6} onTouch={handleDelete}>
              <Text text="Delete" style={{ fontSize: '14px', color: '#fff' }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
