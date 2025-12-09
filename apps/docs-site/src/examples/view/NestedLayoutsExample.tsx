/**
 * View Nested Layouts Example - Complex card-like structures
 */
/** @jsxImportSource @number10/phaserjsx */
import { Text, View, WrapText } from '@number10/phaserjsx'

export function NestedLayoutsViewExample() {
  return (
    <View
      width={'fill'}
      height={'fill'}
      padding={20}
      gap={20}
      direction="row"
      justifyContent="center"
      alignItems="start"
      flexWrap="wrap"
    >
      <View
        backgroundColor={0x2c3e50}
        cornerRadius={8}
        overflow="hidden"
        width={280}
        direction="column"
      >
        <View backgroundColor={0x3498db} padding={16} width={'fill'}>
          <Text text="Card Header" style={{ color: '#ffffff', fontSize: '16px' }} />
        </View>

        <View padding={16} direction="column" gap={12} width={'fill'}>
          <Text text="Card Title" style={{ color: '#ffffff', fontSize: '14px' }} />
          <WrapText
            text="This is the body content with multiple nested views creating a card structure."
            style={{ color: '#bdc3c7', fontSize: '12px' }}
          />

          <View direction="row" gap={8} flexWrap="wrap">
            <View backgroundColor={0xe74c3c} padding={6} cornerRadius={4}>
              <Text text="Tag 1" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
            <View backgroundColor={0x2ecc71} padding={6} cornerRadius={4}>
              <Text text="Tag 2" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
            <View backgroundColor={0x9b59b6} padding={6} cornerRadius={4}>
              <Text text="Tag 3" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
          </View>
        </View>

        <View
          backgroundColor={0x34495e}
          padding={12}
          direction="row"
          justifyContent="space-between"
          width={'fill'}
        >
          <Text text="Footer Info" style={{ color: '#95a5a6', fontSize: '11px' }} />
          <Text text="Action →" style={{ color: '#3498db', fontSize: '11px' }} />
        </View>
      </View>

      <View backgroundColor={0x2c3e50} cornerRadius={8} width={280} height={300} direction="column">
        <View
          backgroundColor={0xe74c3c}
          cornerRadius={{ tl: 8, tr: 8, br: 0, bl: 0 }}
          padding={16}
          width={'fill'}
        >
          <Text text="Split View" style={{ color: '#ffffff', fontSize: '16px' }} />
        </View>

        <View direction="row" width={'fill'} height={'fill'}>
          <View backgroundColor={0x34495e} padding={12} width={100} direction="column" gap={8}>
            <Text text="Sidebar" style={{ color: '#ffffff', fontSize: '12px' }} />
            <View backgroundColor={0x3498db} padding={8} cornerRadius={4} width={'fill'}>
              <Text text="Item 1" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
            <View backgroundColor={0x2c3e50} padding={8} cornerRadius={4} width={'fill'}>
              <Text text="Item 2" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
            <View backgroundColor={0x2c3e50} padding={8} cornerRadius={4} width={'fill'}>
              <Text text="Item 3" style={{ color: '#ffffff', fontSize: '10px' }} />
            </View>
          </View>

          <View padding={16} direction="column" gap={8} flex={1}>
            <Text text="Main Content" style={{ color: '#ffffff', fontSize: '14px' }} />
            <WrapText
              text="Content area with sidebar navigation"
              style={{ color: '#bdc3c7', fontSize: '11px' }}
            />
          </View>
        </View>
      </View>

      <View backgroundColor={0x2c3e50} cornerRadius={8} width={280} direction="column" gap={0}>
        <View padding={16} width={'fill'}>
          <Text text="Profile Card" style={{ color: '#ffffff', fontSize: '16px' }} />
        </View>

        <View
          backgroundColor={0x34495e}
          padding={16}
          direction="row"
          gap={12}
          alignItems="center"
          width={'fill'}
        >
          <View
            backgroundColor={0x3498db}
            width={60}
            height={60}
            cornerRadius={30}
            justifyContent="center"
            alignItems="center"
          >
            <Text text="AV" style={{ color: '#ffffff', fontSize: '20px' }} />
          </View>

          <View direction="column" gap={4}>
            <Text text="User Name" style={{ color: '#ffffff', fontSize: '14px' }} />
            <Text text="user@example.com" style={{ color: '#95a5a6', fontSize: '11px' }} />
          </View>
        </View>

        <View padding={16} direction="column" gap={8} width={'fill'}>
          <View direction="row" justifyContent="space-between" width={'fill'}>
            <Text text="Posts" style={{ color: '#95a5a6', fontSize: '12px' }} />
            <Text text="142" style={{ color: '#ffffff', fontSize: '12px' }} />
          </View>
          <View direction="row" justifyContent="space-between" width={'fill'}>
            <Text text="Followers" style={{ color: '#95a5a6', fontSize: '12px' }} />
            <Text text="2.5k" style={{ color: '#ffffff', fontSize: '12px' }} />
          </View>
          <View direction="row" justifyContent="space-between" width={'fill'}>
            <Text text="Following" style={{ color: '#95a5a6', fontSize: '12px' }} />
            <Text text="183" style={{ color: '#ffffff', fontSize: '12px' }} />
          </View>
        </View>
      </View>
    </View>
  )
}
