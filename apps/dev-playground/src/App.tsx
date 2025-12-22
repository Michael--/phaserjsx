/**
 * Main app component for dev playground
 */
import { Button, Text, View } from '@number10/phaserjsx'

/**
 * Props for App component
 */
export interface AppProps {
  width: number
  height: number
}

/**
 * Main App component
 */
export function App(props: AppProps) {
  return (
    <View
      width={props.width}
      height={props.height}
      backgroundColor={0x333333}
      alpha={0.8}
      padding={40}
    >
      <View gap={20} alignItems="center" justifyContent="center" width="100%" height="100%">
        <Text
          text="🚀 PhaserJSX Dev Playground"
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

        <View width={400} height={200} backgroundColor={0x444444} cornerRadius={10} padding={20}>
          <Text
            text={`This is your development playground.\nAdd your test components here.`}
            style={{
              fontSize: '18px',
              fontFamily: 'Arial',
              color: '#cccccc',
              align: 'left',
            }}
          />
        </View>
      </View>
    </View>
  )
}
