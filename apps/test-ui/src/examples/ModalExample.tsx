/** @jsxImportSource @phaserjsx/ui */
import { Button, Modal, Text, View, useState } from '@phaserjsx/ui'

/**
 * Modal component example
 * Shows backdrop, animations, and close functionality
 */
export function ModalExample() {
  const [isOpen1, setIsOpen1] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [isOpen3, setIsOpen3] = useState(false)

  return (
    <View width="100%" padding={20} gap={16} direction="column">
      <Text text="Modal Examples" style={{ fontSize: '24px', fontStyle: 'bold' }} />

      {/* Trigger Buttons */}
      <View gap={12} direction="row">
        <Button variant="primary" onClick={() => setIsOpen1(true)}>
          <Text text="Open Modal 1" />
        </Button>
        <Button variant="secondary" onClick={() => setIsOpen2(true)}>
          <Text text="Open Modal 2" />
        </Button>
        <Button variant="outline" onClick={() => setIsOpen3(true)}>
          <Text text="Open Modal 3" />
        </Button>
      </View>

      {/* Modal 1 - Close on backdrop */}
      <Modal isOpen={isOpen1} onClose={() => setIsOpen1(false)} depth={1000}>
        <View
          minWidth={400}
          padding={24}
          gap={16}
          direction="column"
          backgroundColor={0xffffff}
          cornerRadius={8}
        >
          <Text text="Modal 1 - Default Behavior" style={{ fontSize: '20px', fontStyle: 'bold' }} />
          <Text text="Click backdrop or press Escape to close" />
          <Button variant="primary" onClick={() => setIsOpen1(false)}>
            <Text text="Close" />
          </Button>
        </View>
      </Modal>

      {/* Modal 2 - No backdrop close */}
      <Modal
        isOpen={isOpen2}
        onClose={() => setIsOpen2(false)}
        closeOnBackdrop={false}
        depth={2000}
      >
        <View
          minWidth={400}
          padding={24}
          gap={16}
          direction="column"
          backgroundColor={0xf0f0f0}
          cornerRadius={8}
        >
          <Text
            text="Modal 2 - No Backdrop Close"
            style={{ fontSize: '20px', fontStyle: 'bold' }}
          />
          <Text text="Backdrop clicks disabled. Use button or Escape." />
          <Button variant="secondary" onClick={() => setIsOpen2(false)}>
            <Text text="Close" />
          </Button>
        </View>
      </Modal>

      {/* Modal 3 - No escape close */}
      <Modal isOpen={isOpen3} onClose={() => setIsOpen3(false)} closeOnEscape={false} depth={3000}>
        <View
          minWidth={400}
          padding={24}
          gap={16}
          direction="column"
          backgroundColor={0xe0e0e0}
          cornerRadius={8}
        >
          <Text text="Modal 3 - No Escape Close" style={{ fontSize: '20px', fontStyle: 'bold' }} />
          <Text text="Escape key disabled. Click backdrop or button." />
          <Button variant="outline" onClick={() => setIsOpen3(false)}>
            <Text text="Close" />
          </Button>
        </View>
      </Modal>
    </View>
  )
}
