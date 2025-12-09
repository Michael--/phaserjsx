/**
 * Text Styles Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View } from '@number10/phaserjsx'

export function StylesTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Text text="Default Style" />
      <Text text="Large Bold" style={{ fontSize: '28px', fontStyle: 'bold' }} />
      <Text text="Colored Text" style={{ color: '#e91e63', fontSize: '20px' }} />
      <Text
        text="Custom Font"
        style={{ fontFamily: 'monospace', fontSize: '18px', color: '#9c27b0' }}
      />
      <Text
        text="With Shadow"
        style={{
          fontSize: '22px',
          color: '#ff9800',
          shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true },
        }}
      />
      <Text text="Alpha 50%" alpha={0.5} style={{ fontSize: '18px', backgroundColor: '#2196f3' }} />
    </View>
  )
}
