/**
 * View Padding Variations Example - Individual padding for each side
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View } from '@number10/phaserjsx'

const Box = ({ text }: { text: string }) => (
  <View
    borderColor={0xffff00}
    width={'fill'}
    height={'fill'}
    justifyContent="center"
    alignItems="center"
  >
    <Text text={text} style={{ color: '#ffffff', fontSize: '12px' }} />
  </View>
)

export function PaddingVariationsViewExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={16}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <View backgroundColor={0x3498db} padding={20} width={150} height={80}>
        <Box text="padding={20}" />
      </View>

      <View backgroundColor={0xe74c3c} padding={{ top: 30 }} width={150} height={80}>
        <Box text="top: 30" />
      </View>

      <View backgroundColor={0x2ecc71} padding={{ right: 40 }} width={150} height={80}>
        <Box text="right: 40" />
      </View>

      <View backgroundColor={0x9b59b6} padding={{ bottom: 30 }} width={150} height={80}>
        <Box text="bottom: 30" />
      </View>

      <View backgroundColor={0xf39c12} padding={{ left: 40 }} width={150} height={80}>
        <Box text="left: 40" />
      </View>

      <View backgroundColor={0x34495e} padding={{ left: 30, right: 30 }} width={180} height={80}>
        <Box text="Horizontal: 30" />
      </View>

      <View backgroundColor={0x16a085} padding={{ top: 25, bottom: 25 }} width={150} height={80}>
        <Box text="Vertical: 25" />
      </View>

      <View
        backgroundColor={0xc0392b}
        padding={{ top: 10, right: 30, bottom: 20, left: 15 }}
        width={180}
        height={80}
      >
        <Box text="T:10 R:30 B:20 L:15" />
      </View>
    </View>
  )
}
