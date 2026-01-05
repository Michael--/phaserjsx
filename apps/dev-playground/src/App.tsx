/**
 * Main app component for dev playground
 */
import { type MountProps, Text, View } from '@number10/phaserjsx'

// DevConfig.debug.enabled = true
// DevConfig.debug.layout = true

/**
 * Props for App component
 */

export interface AppProps extends MountProps {
  /** Additional props can be defined here if needed */
  title: string
}

function TestUI() {
  return (
    <View
      width={'fill'}
      flex={1}
      direction="stack"
      backgroundColor={0xffffff}
      backgroundAlpha={0.05}
    ></View>
  )
}

/**
 * Main App component
 */
export function App(props: AppProps) {
  return (
    <View width={'fill'} height={'fill'} padding={{ top: 40 }}>
      <View gap={20} alignItems="center" justifyContent="start" width="100%" height="100%">
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

        <TestUI />
      </View>
    </View>
  )
}
