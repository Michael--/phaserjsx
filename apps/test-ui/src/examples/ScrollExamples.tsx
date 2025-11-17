import { Text, useRef, useState, View } from '@phaserjsx/ui'
import type Phaser from 'phaser'

export function ScrollExample() {
  const [scrollY, setScrollY] = useState(0)
  const contentRef = useRef<Phaser.GameObjects.Container | null>(null)
  const viewportRef = useRef<Phaser.GameObjects.Container | null>(null)
  const isDraggingRef = useRef(false)
  const lastPointerYRef = useRef(0)

  const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    isDraggingRef.current = true
    lastPointerYRef.current = pointer.y
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  const handlePointerUpOutside = () => {
    isDraggingRef.current = false
  }

  const handlePointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!isDraggingRef.current || !contentRef.current || !viewportRef.current) return

    const deltaY = pointer.y - lastPointerYRef.current
    lastPointerYRef.current = pointer.y

    // Get viewport and content heights
    const viewportHeight = viewportRef.current.height // height minus padding if exists
    const contentHeight = contentRef.current.height

    // Calculate new scroll position
    const maxScroll = Math.max(0, contentHeight - viewportHeight)
    const newScrollY = Math.max(0, Math.min(maxScroll, scrollY - deltaY))

    setScrollY(newScrollY)
  }

  const handleContentRef = (container: Phaser.GameObjects.Container | null) => {
    contentRef.current = container
  }

  const handleViewportRef = (container: Phaser.GameObjects.Container | null) => {
    viewportRef.current = container
  }

  return (
    <View
      backgroundColor={0x222222}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text="Scroll Example (Drag to scroll)" style={{ fontSize: 16, color: 'orange' }} />
      {/** next view is used to hold padding (darkgray 0x444444)*/}
      <View
        width={400}
        height={600}
        backgroundColor={0x444444}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      >
        {/** next view is the viewport, the measure base where the scroll content is contained (medium gray 0x555555) */}
        <View
          ref={handleViewportRef}
          direction="stack"
          width={`fill`}
          height={'fill'}
          backgroundColor={0x555555}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerUpOutside={handlePointerUpOutside}
          onPointerMove={handlePointerMove}
          overflow="hidden"
        >
          {/** next view is the dynamic sized content which could be scrolled in parent */}
          <View
            ref={handleContentRef}
            x={0}
            y={-scrollY}
            width="fill"
            backgroundColor={0x888888}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            gap={10}
          >
            {/** At least the content */}
            {Array.from({ length: 20 }).map((_, index) => (
              <View
                key={index}
                width="80%"
                height={50}
                backgroundColor={index % 2 === 0 ? 0xaa0000 : 0x00aa00}
                justifyContent="center"
                alignItems="center"
              >
                <Text text={`Item ${index + 1}`} style={{ fontSize: 14, color: 'white' }} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
