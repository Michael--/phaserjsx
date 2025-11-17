import { Text, View } from '@phaserjsx/ui'
import { ScrollView } from '../components'

export function ScrollExample() {
  return (
    <View
      backgroundColor={0x222222}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      gap={10}
      alignItems="center"
    >
      <Text text="Scroll Example (Drag to scroll)" style={{ fontSize: 16, color: 'orange' }} />
      {/** X: The overall example container, this is always a part of the user code */}
      <View width={400} height={600}>
        <ScrollView width={400} height={600} gap={10}>
          <View>
            {/** C: At least the content */}
            {Array.from({ length: 20 }).map((_, index) => (
              <View
                key={index}
                width={'fill'}
                height={50}
                backgroundColor={index % 2 === 0 ? 0xaa0000 : 0x00aa00}
                justifyContent="center"
                alignItems="center"
              >
                <Text text={`Item ${index + 1}`} style={{ fontSize: 14, color: 'white' }} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
