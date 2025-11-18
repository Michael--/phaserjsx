import { Text, View, useState } from '@phaserjsx/ui'

export function ToggleButton(props: {
  key?: number | string
  textOn: string
  textOff: string
  colorOn?: number
  colorOff?: number
  initialState?: boolean
  onToggle?: (state: boolean) => void
  width?: number
  height?: number
}) {
  const [toggled, setToggled] = useState(props.initialState ?? false)
  return (
    <View
      key={props.key}
      width={props.width}
      height={props.height}
      backgroundColor={toggled ? (props.colorOn ?? 0x008800) : (props.colorOff ?? 0x880000)}
      backgroundAlpha={1.0}
      padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
      alignItems="center"
      justifyContent="center"
      onPointerDown={() => {
        const newState = !toggled
        setToggled(newState)
        props.onToggle?.(newState)
      }}
    >
      <Text
        text={toggled ? props.textOn : props.textOff}
        style={{ fontSize: 16, color: 'white' }}
      />
    </View>
  )
}

export function ToggleButtonExample() {
  const testButton = (key: number) => {
    return (
      <ToggleButton
        key={key}
        textOn="ON"
        textOff="OFF"
        colorOn={0x004400}
        colorOff={0x440000}
        initialState={false}
        onToggle={(state) => {
          console.log('ToggleButton state:', state)
        }}
      />
    )
  }

  return (
    <View alignItems="center">
      <Text text="Toggle Button Demo" style={{ fontSize: 16, color: 'yellow' }} />
      {testButton(1)}
      {testButton(2)}
      {testButton(3)}
    </View>
  )
}
