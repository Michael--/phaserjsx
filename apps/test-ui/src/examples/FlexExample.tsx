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
      backgroundAlpha={1.0}
      padding={{ left: 20, top: 20, right: 20, bottom: 20 }}
      gap={25}
      width={700}
    >
      <Text text="Flex Layout Examples" style={{ fontSize: 20, color: 'yellow' }} />

      {/* Example 1: Basic flex */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text text="1. Basic Flex - Fixed + Flexible" style={{ fontSize: 16, color: 'cyan' }} />
        <View
          direction="row"
          gap={10}
          backgroundColor={0x005588}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            width={100}
            backgroundColor={0xcc3333}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Fixed" style={{ fontSize: 14, color: 'white' }} />
            <Text text="150px" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={1}
            backgroundColor={0x33cc33}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" style={{ fontSize: 14, color: 'white' }} />
            <Text text="fills remaining" style={{ fontSize: 12, color: 'white' }} />
          </View>
        </View>
      </View>

      {/* Example 2: Spacer pattern */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text text="2. Spacer Pattern - Push to edges" style={{ fontSize: 16, color: 'cyan' }} />
        <View
          direction="row"
          gap={10}
          backgroundColor={0x005588}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            width={120}
            backgroundColor={0xcc3333}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Left" style={{ fontSize: 14, color: 'white' }} />
            <Text text="120px" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={1}
            backgroundColor={0x444444}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Spacer" style={{ fontSize: 12, color: 'gray' }} />
            <Text text="flex={1}" style={{ fontSize: 10, color: 'gray' }} />
          </View>
          <View
            width={120}
            backgroundColor={0x3333cc}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="Right" style={{ fontSize: 14, color: 'white' }} />
            <Text text="120px" style={{ fontSize: 12, color: 'white' }} />
          </View>
        </View>
      </View>

      {/* Example 3: Proportional flex */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text text="3. Proportional Flex Ratios - 1:2:3" style={{ fontSize: 16, color: 'cyan' }} />
        <View
          direction="row"
          gap={10}
          backgroundColor={0x555500}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            flex={1}
            backgroundColor={0xcc6633}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" style={{ fontSize: 14, color: 'white' }} />
            <Text text="1 part" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={2}
            backgroundColor={0xcccc33}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={2}" style={{ fontSize: 14, color: 'white' }} />
            <Text text="2 parts (2x wider)" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cccc}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={3}" style={{ fontSize: 14, color: 'white' }} />
            <Text text="3 parts (3x wider)" style={{ fontSize: 12, color: 'white' }} />
          </View>
        </View>
      </View>

      {/* Example 4: Mixed fixed + flex */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text
          text="4. Mixed Layout - Multiple Fixed + Flex"
          style={{ fontSize: 16, color: 'cyan' }}
        />
        <View
          direction="row"
          gap={10}
          backgroundColor={0x555500}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            width={80}
            backgroundColor={0xcc3333}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="80px" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={1}
            backgroundColor={0x33cc33}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1}" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            width={100}
            backgroundColor={0x3333cc}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="100px" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            flex={2}
            backgroundColor={0xcc33cc}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={2}" style={{ fontSize: 12, color: 'white' }} />
          </View>
          <View
            width={80}
            backgroundColor={0x33cccc}
            backgroundAlpha={1.0}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="80px" style={{ fontSize: 12, color: 'white' }} />
          </View>
        </View>
      </View>

      {/* Example 5: Column layout */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text
          text="5. Column Layout with Flex (Vertical)"
          style={{ fontSize: 16, color: 'cyan' }}
        />
        <View
          direction="column"
          gap={10}
          height={250}
          backgroundColor={0x555500}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            flex={1}
            backgroundColor={0xcc3333}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Header" style={{ fontSize: 14, color: 'white' }} />
          </View>
          <View
            flex={3}
            backgroundColor={0x33cc33}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              text="flex={3} - Main Content (3x taller)"
              style={{ fontSize: 14, color: 'white' }}
            />
          </View>
          <View
            flex={1}
            backgroundColor={0x3333cc}
            backgroundAlpha={1.0}
            padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
            alignItems="center"
            justifyContent="center"
          >
            <Text text="flex={1} - Footer" style={{ fontSize: 14, color: 'white' }} />
          </View>
        </View>
      </View>

      {/* Example 6: Nested flex */}
      <View gap={8} backgroundColor={0x333333} backgroundAlpha={1.0} width={'fill'}>
        <Text text="6. Nested Flex Layouts" style={{ fontSize: 16, color: 'cyan' }} />
        <View
          direction="column"
          gap={10}
          height={130}
          backgroundColor={0x555500}
          backgroundAlpha={1.0}
          width={'fill'}
        >
          <View
            direction="row"
            gap={10}
            flex={1}
            backgroundColor={0x0077777}
            backgroundAlpha={1.0}
            width={'fill'}
          >
            <View
              flex={1}
              backgroundColor={0xcc3333}
              backgroundAlpha={1.0}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Top Left" style={{ fontSize: 12, color: 'white' }} />
              <Text text="flex={1}" style={{ fontSize: 10, color: 'white' }} />
            </View>
            <View
              flex={2}
              backgroundColor={0xcc6633}
              backgroundAlpha={1.0}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Top Center" style={{ fontSize: 12, color: 'white' }} />
              <Text text="flex={2}" style={{ fontSize: 10, color: 'white' }} />
            </View>
            <View
              flex={1}
              backgroundColor={0xcccc33}
              backgroundAlpha={1.0}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Top Right" style={{ fontSize: 12, color: 'white' }} />
              <Text text="flex={1}" style={{ fontSize: 10, color: 'white' }} />
            </View>
          </View>
          <View
            direction="row"
            gap={10}
            flex={2}
            backgroundColor={0x0077777}
            backgroundAlpha={1.0}
            width={'fill'}
          >
            <View
              flex={2}
              backgroundColor={0x33cc33}
              backgroundAlpha={1.0}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Bottom Left" style={{ fontSize: 12, color: 'white' }} />
              <Text text="flex={2}" style={{ fontSize: 10, color: 'white' }} />
            </View>
            <View
              flex={1}
              backgroundColor={0x3333cc}
              backgroundAlpha={1.0}
              alignItems="center"
              justifyContent="center"
            >
              <Text text="Bottom Right" style={{ fontSize: 12, color: 'white' }} />
              <Text text="flex={1}" style={{ fontSize: 10, color: 'white' }} />
            </View>
          </View>
        </View>
      </View>

      <View
        backgroundColor={0x333333}
        backgroundAlpha={1.0}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        gap={5}
        width={'fill'}
      >
        <Text text="💡 Key Concepts:" style={{ fontSize: 14, color: 'yellow' }} />
        <Text
          text="• flex={1} takes available space equally"
          style={{ fontSize: 12, color: 'white' }}
        />
        <Text
          text="• flex={2} takes 2x space of flex={1}"
          style={{ fontSize: 12, color: 'white' }}
        />
        <Text
          text="• Fixed sizes are respected, flex fills the rest"
          style={{ fontSize: 12, color: 'white' }}
        />
        <Text
          text="• Works in both row and column directions"
          style={{ fontSize: 12, color: 'white' }}
        />
      </View>
    </View>
  )
}
