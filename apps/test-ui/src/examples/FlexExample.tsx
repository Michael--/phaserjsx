import { Text, View } from '@phaserjsx/ui'

/**
 * Flex vs Spacer Demo
 * Shows two different approaches to fill remaining space
 * @returns Flex demo JSX
 */
export function FlexExample() {
  return (
    <View
      backgroundColor={0x2a2a2a}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
      gap={25}
      width={700}
    >
      <Text text="Flex Layout Examples" color={'yellow'} style={{ fontSize: 20 }} />

      {/* Example 1: Basic flex */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text text="1. Basic Flex - Fixed + Flexible" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} backgroundColor={0x005588} width={'fill'}>
          <View
            width={100}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Fixed" color={'white'} style={{ fontSize: 14 }} />
            <Text text="150px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={1}
            backgroundColor={0x33cc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="fills remaining" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 2: Spacer pattern */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text text="2. Spacer Pattern - Push to edges" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} backgroundColor={0x005588} width={'fill'}>
          <View
            width={120}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Left" color={'white'} style={{ fontSize: 14 }} />
            <Text text="120px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={1} backgroundColor={0x444444} alignItems="center" justifyContent="center">
            <Text text="Spacer" color={'gray'} style={{ fontSize: 12 }} />
            <Text text="flex={1}" color={'gray'} style={{ fontSize: 10 }} />
          </View>
          <View
            width={120}
            backgroundColor={0x3333cc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Right" color={'white'} style={{ fontSize: 14 }} />
            <Text text="120px" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 3: Proportional flex */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text text="3. Proportional Flex Ratios - 1:2:3" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="row" gap={10} backgroundColor={0x555500} width={'fill'}>
          <View
            flex={1}
            backgroundColor={0xcc6633}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="1 part" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={2}
            backgroundColor={0xcccc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={2}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="2 parts (2x wider)" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cccc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={3}" color={'white'} style={{ fontSize: 14 }} />
            <Text text="3 parts (3x wider)" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 4: Mixed fixed + flex */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text
          text="4. Mixed Layout - Multiple Fixed + Flex"
          color={'cyan'}
          style={{ fontSize: 16 }}
        />
        <View direction="row" gap={10} backgroundColor={0x555500} width={'fill'}>
          <View width={80} backgroundColor={0xcc3333} alignItems="center" justifyContent="center">
            <Text text="80px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={1} backgroundColor={0x33cc33} alignItems="center" justifyContent="center">
            <Text text="flex={1}" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View width={100} backgroundColor={0x3333cc} alignItems="center" justifyContent="center">
            <Text text="100px" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View flex={2} backgroundColor={0xcc33cc} alignItems="center" justifyContent="center">
            <Text text="flex={2}" color={'white'} style={{ fontSize: 12 }} />
          </View>
          <View width={80} backgroundColor={0x33cccc} alignItems="center" justifyContent="center">
            <Text text="80px" color={'white'} style={{ fontSize: 12 }} />
          </View>
        </View>
      </View>

      {/* Example 5: Column layout */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text
          text="5. Column Layout with Flex (Vertical)"
          color={'cyan'}
          style={{ fontSize: 16 }}
        />
        <View direction="column" gap={10} height={250} backgroundColor={0x555500} width={'fill'}>
          <View
            flex={1}
            backgroundColor={0xcc3333}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Header" color={'white'} style={{ fontSize: 14 }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cc33}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              text="flex={3} - Main Content (3x taller)"
              color={'white'}
              style={{ fontSize: 14 }}
            />
          </View>
          <View
            flex={1}
            backgroundColor={0x3333cc}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Footer" color={'white'} style={{ fontSize: 14 }} />
          </View>
        </View>
      </View>

      {/* Example 6: Nested flex */}
      <View gap={8} backgroundColor={0x333333} width={'fill'}>
        <Text text="6. Nested Flex Layouts" color={'cyan'} style={{ fontSize: 16 }} />
        <View direction="column" gap={10} height={130} backgroundColor={0x555500} width={'fill'}>
          <View direction="row" gap={10} flex={1} backgroundColor={0x0077777} width={'fill'}>
            <View flex={1} backgroundColor={0xcc3333} alignItems="center" justifyContent="center">
              <Text text="Top Left" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={2} backgroundColor={0xcc6633} alignItems="center" justifyContent="center">
              <Text text="Top Center" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={2}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={1} backgroundColor={0xcccc33} alignItems="center" justifyContent="center">
              <Text text="Top Right" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
          </View>
          <View direction="row" gap={10} flex={2} backgroundColor={0x0077777} width={'fill'}>
            <View flex={2} backgroundColor={0x33cc33} alignItems="center" justifyContent="center">
              <Text text="Bottom Left" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={2}" color={'white'} style={{ fontSize: 10 }} />
            </View>
            <View flex={1} backgroundColor={0x3333cc} alignItems="center" justifyContent="center">
              <Text text="Bottom Right" color={'white'} style={{ fontSize: 12 }} />
              <Text text="flex={1}" color={'white'} style={{ fontSize: 10 }} />
            </View>
          </View>
        </View>
      </View>

      <View
        backgroundColor={0x333333}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        gap={5}
        width={'fill'}
      >
        <Text text="💡 Key Concepts:" color={'yellow'} style={{ fontSize: 14 }} />
        <Text
          text="• flex={1} takes available space equally"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• flex={2} takes 2x space of flex={1}"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• Fixed sizes are respected, flex fills the rest"
          color={'white'}
          style={{ fontSize: 12 }}
        />
        <Text
          text="• Works in both row and column directions"
          color={'white'}
          style={{ fontSize: 12 }}
        />
      </View>
    </View>
  )
}
