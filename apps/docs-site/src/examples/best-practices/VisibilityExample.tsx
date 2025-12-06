/**
 * Visibility Example - Demonstrates different approaches to showing/hiding components
 */
/** @jsxImportSource @phaserjsx/ui */
import { Text, useEffect, useState, View } from '@phaserjsx/ui'

/**
 * Demonstrates three different approaches to controlling component visibility in PhaserJSX
 */
export function VisibilityExample() {
  const [test, setTest] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTest((t) => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const isOdd = test % 2 === 1

  return (
    <View justifyContent="center" alignItems="center" padding={20} gap={20}>
      <Text text={`Test cycle: ${test} (${isOdd ? 'ODD' : 'EVEN'})`} />
      <View gap={20} direction="row">
        {/* Test 1: visible=false - Child should toggle visibility, but stay took place */}
        <View borderColor={0xff0000} padding={10} gap={10} direction="column">
          <Text text={`Test 1: visible=${isOdd}`} style={{ fontSize: '12px' }} />
          <Text
            text={`Parent should unchanged: ${isOdd ? 'VISIBLE' : 'HIDDEN'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
          <View width={100} height={20} backgroundColor={0xff00ff} visible={isOdd} />
        </View>

        {/* Test 2: visible="none" - Child should toggle visibility, parent should re-layout */}
        <View borderColor={0xff0000} padding={10} gap={10} direction="column">
          <Text
            text={`Test 1: visible=${isOdd ? 'true' : "'none'"}`}
            style={{ fontSize: '12px' }}
          />
          <Text
            text={`Parent should shrink/grow: ${isOdd ? 'VISIBLE' : 'HIDDEN'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
          <View
            width={100}
            height={20}
            backgroundColor={0x00ffff}
            visible={isOdd ? true : 'none'}
          />
        </View>

        {/* Test 3: Conditional rendering - Child should be added/removed from VDOM */}
        <View borderColor={0x00ff00} padding={10} gap={10} direction="column">
          <Text
            text={`Test 2: Conditional {${isOdd ? 'true' : 'false'} && <View>}`}
            style={{ fontSize: '12px' }}
          />
          {isOdd && <View width={100} height={20} backgroundColor={0xffff00} />}
          <Text
            text={`VDOM should add/remove: ${isOdd ? 'MOUNTED' : 'UNMOUNTED'}`}
            style={{ fontSize: '10px', color: '#888888' }}
          />
        </View>
      </View>
    </View>
  )
}
