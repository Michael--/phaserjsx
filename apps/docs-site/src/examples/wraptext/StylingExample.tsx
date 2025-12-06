/**
 * WrapText Styling Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { View, WrapText } from '@phaserjsx/ui'

export function StylingWrapTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={24}>
      <View width={400} backgroundColor={0xf5f5f5} padding={16} cornerRadius={8}>
        <WrapText text="Default styling with automatic wrapping." />
      </View>

      <View width={400} backgroundColor={0xe3f2fd} padding={20} cornerRadius={8}>
        <WrapText
          text="Custom font size, color, and alignment work perfectly with automatic wrapping."
          style={{ fontSize: '18px', color: '#1565c0', align: 'center' }}
        />
      </View>

      <View width={400} backgroundColor={0xfce4ec} padding={16} cornerRadius={8}>
        <WrapText
          text="Bold text with custom font family maintains proper wrapping behavior."
          style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}
        />
      </View>

      <View width={400} backgroundColor={0xf3e5f5} padding={16} cornerRadius={8}>
        <WrapText
          text="Text with shadow effects and custom colors."
          style={{
            fontSize: '20px',
            color: '#7b1fa2',
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true },
          }}
        />
      </View>
    </View>
  )
}
