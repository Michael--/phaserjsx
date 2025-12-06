/**
 * Text Styles Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function StylesTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={16}>
      <Text text="Default Style" />
      <Text text="Large Bold" style={{ fontSize: '28px', fontWeight: 'bold' }} />
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
    </View>
  )
}
