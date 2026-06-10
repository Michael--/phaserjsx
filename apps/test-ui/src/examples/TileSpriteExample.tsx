/**
 * TileSpriteExample - Demonstrates repeated texture areas and tile offsets.
 */
import { Button, ScrollView, Text, TileSprite, useState, View } from '@number10/phaserjsx'
import { SectionHeader, ViewLevel2, ViewLevel3 } from './Helper'

export function TileSpriteExample() {
  const [offset, setOffset] = useState(0)
  const [scale, setScale] = useState(1)

  return (
    <View width="100%" height="100%">
      <ScrollView>
        <ViewLevel2 gap={30} width={1200}>
          <SectionHeader title="TileSprite Component" />

          <View direction="row" gap={30}>
            <ViewLevel3 width={520} height={260} padding={16} gap={16}>
              <Text text="Scrolling tilePositionX" />
              <View direction="row" gap={10}>
                <Button onClick={() => setOffset((value) => value - 24)}>
                  <Text text="Left" />
                </Button>
                <Button onClick={() => setOffset((value) => value + 24)}>
                  <Text text="Right" />
                </Button>
              </View>
              <TileSprite texture="wideline" width={450} height={90} tilePositionX={offset} />
              <Text text={`tilePositionX: ${offset}`} />
            </ViewLevel3>

            <ViewLevel3 width={520} height={260} padding={16} gap={16}>
              <Text text="Tile scale" />
              <Button onClick={() => setScale((value) => (value >= 2 ? 0.5 : value + 0.25))}>
                <Text text="Change Scale" />
              </Button>
              <TileSprite
                texture="back"
                width={450}
                height={120}
                tileScaleX={scale}
                tileScaleY={scale}
              />
              <Text text={`tileScale: ${scale.toFixed(2)}`} />
            </ViewLevel3>
          </View>
        </ViewLevel2>
      </ScrollView>
    </View>
  )
}
