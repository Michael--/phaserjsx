/**
 * Modal Quick Start Example - Basic modal with backdrop
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, Modal, Text, View, WrapText, useState } from '@number10/phaserjsx'

export function QuickStartExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View width={'fill'} height={'fill'} padding={20}>
      <View direction="column" gap={16}>
        <Text text="Modal Component" style={{ fontSize: '18px', fontStyle: 'bold' }} />

        <View
          padding={16}
          backgroundColor={0x3b82f6}
          cornerRadius={8}
          onTouch={() => setIsOpen(true)}
        >
          <Text text="Open Modal" style={{ fontSize: '16px', color: '#fff' }} />
        </View>

        <Text
          text="Click to open a modal with backdrop and animations"
          style={{ fontSize: '14px', color: '#666' }}
        />
      </View>

      <Modal show={isOpen} onClosed={() => setIsOpen(false)}>
        <View
          width={400}
          height={250}
          backgroundColor={0xffffff}
          cornerRadius={16}
          padding={24}
          direction="column"
          gap={16}
        >
          <Text text="Modal Title" style={{ fontSize: '20px', color: '#111' }} />
          <WrapText
            text="This is a basic modal with a backdrop. Click outside or press Escape to close."
            style={{ fontSize: '14px', color: '#666' }}
          />
          <View flex={1} />

          <Button onClick={() => setIsOpen(false)}>
            <Text text="Close" style={{ fontSize: '14px', color: '#fff' }} />
          </Button>
        </View>
      </Modal>
    </View>
  )
}
