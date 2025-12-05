/**
 * View Space Distribution Example - space-around and space-between
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, View } from '@phaserjsx/ui'

export function SpaceDistributionViewExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={24}
      direction="column"
      justifyContent="start"
      alignItems="stretch"
    >
      <View direction="column" gap={8}>
        <Text text="justifyContent='space-between'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-between"
          width={400}
          height={80}
        >
          <View backgroundColor={0x3498db} width={60} height={60} />
          <View backgroundColor={0xe74c3c} width={60} height={60} />
          <View backgroundColor={0x2ecc71} width={60} height={60} />
        </View>
      </View>

      <View direction="column" gap={8}>
        <Text text="justifyContent='space-around'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-around"
          width={400}
          height={80}
        >
          <View backgroundColor={0x3498db} width={60} height={60} />
          <View backgroundColor={0xe74c3c} width={60} height={60} />
          <View backgroundColor={0x2ecc71} width={60} height={60} />
        </View>
      </View>

      <View direction="column" gap={8}>
        <Text text="justifyContent='space-evenly'" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="row"
          justifyContent="space-evenly"
          width={400}
          height={80}
        >
          <View backgroundColor={0x3498db} width={60} height={60} />
          <View backgroundColor={0xe74c3c} width={60} height={60} />
          <View backgroundColor={0x2ecc71} width={60} height={60} />
        </View>
      </View>

      <View direction="column" gap={8}>
        <Text text="Vertical: space-between" style={{ color: '#ffffff' }} />
        <View
          backgroundColor={0x2c3e50}
          padding={10}
          direction="column"
          justifyContent="space-between"
          width={120}
          height={220}
        >
          <View backgroundColor={0x9b59b6} width={100} height={40} />
          <View backgroundColor={0xf39c12} width={100} height={40} />
          <View backgroundColor={0x1abc9c} width={100} height={40} />
        </View>
      </View>
    </View>
  )
}
