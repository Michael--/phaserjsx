/**
 * Text Alignment Example
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function AlignmentTextExample() {
  return (
    <View width={'fill'} height={'fill'} justifyContent="center" alignItems="center" gap={24}>
      <View width={300} direction="column" gap={12}>
        <Text
          text={`Left\nAligned Multiple lines`}
          style={{ fontSize: '16px', align: 'left', backgroundColor: '#555555' }}
        />
        <Text
          text={`Center\nAligned Multiple lines`}
          style={{ fontSize: '16px', align: 'center', backgroundColor: '#555555' }}
        />
        <Text
          text={`Right\nAligned Multiple lines`}
          style={{ fontSize: '16px', align: 'right', backgroundColor: '#555555' }}
        />
      </View>
    </View>
  )
}
