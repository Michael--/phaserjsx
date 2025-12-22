/**
 * Main app component for dev playground
 */
import {
  type MountProps,
  Button,
  Tab,
  TabPanel,
  Tabs,
  Text,
  useLayoutEffect,
  useLayoutRect,
  useRef,
  useState,
  View,
} from '@number10/phaserjsx'

/**
 * Props for App component
 */

export interface AppProps extends MountProps {
  /** Additional props can be defined here if needed */
  title: string
}

/**
 * Main App component
 */
export function App(props: AppProps) {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)
  const [layoutText, setLayoutText] = useState('Calculating layout...')

  useLayoutEffect(() => {
    const layout = useLayoutRect(ref)
    setLayoutText(JSON.stringify(layout, null, 2))
  }, [props, ref])

  return (
    <View
      ref={ref}
      width={'fill'}
      height={'fill'}
      backgroundColor={0x333333}
      alpha={0.8}
      padding={40}
    >
      <View gap={20} alignItems="center" justifyContent="center" width="100%" height="100%">
        <Text
          text={props.title}
          style={{
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
          }}
        />

        <Text
          text="Focused development environment for testing new features"
          style={{
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#aaaaaa',
          }}
        />

        <View gap={10} direction="row">
          <Button onClick={() => console.log('Button 1 clicked')} width={200} height={60}>
            <Text text="Test Button 1" />
          </Button>

          <Button onClick={() => console.log('Button 2 clicked')} width={200} height={60}>
            <Text text="Test Button 2" />
          </Button>
        </View>

        <Tabs width={700}>
          <Tab>
            <View direction="row" gap={8} alignItems="center">
              <Text text="Overview" />
            </View>
          </Tab>
          <Tab>
            <Text text="Settings" />
          </Tab>
          <Tab disabled>
            <Text text="Disabled" />
          </Tab>

          <TabPanel>
            <View gap={8}>
              <Text text="This panel hosts Phaser JSX content." />
              <Text text="Swap tabs to see different content containers." />
            </View>
          </TabPanel>
          <TabPanel>
            <View gap={6}>
              <Text text="Settings panel (custom VNode header)." />
              <Text text="Add any UI controls or layouts here." />
            </View>
          </TabPanel>
          <TabPanel>
            <View gap={6}>
              <Text text="Disabled tab keeps its panel unreachable." />
            </View>
          </TabPanel>
        </Tabs>

        <View width={400} backgroundColor={0x444444} cornerRadius={10} padding={20}>
          <Text
            text={`Layout Info:\n${layoutText}`}
            style={{
              fontSize: '24px',
              fontFamily: 'Courier New',
              color: '#ffff88',
              align: 'left',
            }}
          />
        </View>
      </View>
    </View>
  )
}
