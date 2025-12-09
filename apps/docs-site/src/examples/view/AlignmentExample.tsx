/**
 * View Alignment Example - Positioning content within View
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View } from '@number10/phaserjsx'

const Box = ({ label }: { label: string }) => (
  <View backgroundColor={0xe74c3c} padding={8} cornerRadius={4}>
    <Text text={label} style={{ color: '#ffffff', fontSize: '12px' }} />
  </View>
)

export function AlignmentViewExample() {
  return (
    <View padding={20} gap={16} justifyContent="center" alignItems="center">
      {/* Center (default) */}
      <View
        width={250}
        height={80}
        backgroundColor={0x34495e}
        justifyContent="center"
        alignItems="center"
      >
        <Box label="Center (default)" />
      </View>

      {/* Flex Start */}
      <View
        width={250}
        height={80}
        backgroundColor={0x34495e}
        justifyContent="start"
        alignItems="start"
        padding={8}
      >
        <Box label="Flex Start" />
      </View>

      {/* Flex End */}
      <View
        width={250}
        height={80}
        backgroundColor={0x34495e}
        justifyContent="end"
        alignItems="end"
        padding={8}
      >
        <Box label="Flex End" />
      </View>

      {/* Space Between */}
      <View
        direction="row"
        width={250}
        height={60}
        backgroundColor={0x34495e}
        justifyContent="space-between"
        alignItems="center"
        padding={8}
      >
        <Box label="Start" />
        <Box label="End" />
      </View>
    </View>
  )
}
