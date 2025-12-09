/**
 * View Space Distribution Example - space-around and space-between
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View } from '@number10/phaserjsx'

function Box({ color }: { color: number }) {
  return <View backgroundColor={color} width={40} height={40} />
}

function BoxRow() {
  return (
    <>
      <Box color={0x3498db} />
      <Box color={0xe74c3c} />
      <Box color={0x2ecc71} />
    </>
  )
}

export function SpaceDistributionViewExample() {
  return (
    <View direction="row" width={'fill'} height={'fill'} padding={20} gap={24} flexWrap="wrap">
      <View direction="column" gap={8}>
        <Text text="justifyContent='space-between'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-between"
          width={300}
        >
          <BoxRow />
        </View>
      </View>

      <View direction="column" gap={8}>
        <Text text="justifyContent='space-around'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-around"
          width={300}
        >
          <BoxRow />
        </View>
      </View>

      <View direction="column" gap={8}>
        <Text text="justifyContent='space-evenly'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-evenly"
          width={300}
        >
          <BoxRow />
        </View>
      </View>
      <View direction="column" gap={8}>
        <Text text="Vertical: space-between" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="column"
          justifyContent="space-between"
          height={220}
        >
          <BoxRow />
        </View>
      </View>
    </View>
  )
}
