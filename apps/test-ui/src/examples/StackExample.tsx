import { Text, useState, View } from '@phaserjsx/ui'

interface StackItem {
  id: number
  color: number
  text: string
  x: number
  y: number
  width: number
  height: number
}

export function StackExample() {
  const [items, setItems] = useState<StackItem[]>([
    { id: 1, color: 0x880000, text: 'Layer 1', x: 10, y: 0, width: 200, height: 100 },
    { id: 2, color: 0x008800, text: 'Layer 2', x: 20, y: 30, width: 150, height: 80 },
    { id: 3, color: 0x000088, text: 'Layer 3', x: 0, y: 0, width: 100, height: 60 },
  ])

  const handleClick = (id: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (!item) return prev
      const others = prev.filter((i) => i.id !== id)
      return [...others, item] // Move to front
    })
  }

  return (
    <View alignItems="center">
      <Text text="Interactive Stack Demo" style={{ fontSize: 16, color: 'orange' }} />
      <View
        direction="stack"
        width={220}
        height={120}
        backgroundColor={0x444444}
        backgroundAlpha={1.0}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            backgroundColor={item.color}
            backgroundAlpha={1.0}
            enableGestures={true}
            onTouch={() => handleClick(item.id)}
            justifyContent="center"
            alignItems="center"
          >
            <Text text={item.text} style={{ fontSize: 12, color: 'white' }} />
          </View>
        ))}
      </View>
    </View>
  )
}
