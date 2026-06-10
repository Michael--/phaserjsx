/**
 * ProgressBar States Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Button, ProgressBar, Text, useState, View } from '@number10/phaserjsx'

export function StatesProgressBarExample() {
  const [cooldown, setCooldown] = useState(35)
  const [health, setHealth] = useState(82)

  const stepCooldown = () => setCooldown((current) => (current >= 100 ? 0 : current + 15))
  const hit = () => setHealth((current) => Math.max(0, current - 18))
  const heal = () => setHealth((current) => Math.min(100, current + 22))

  return (
    <View width="fill" height="fill" padding={22} gap={18} justifyContent="center">
      <View gap={8}>
        <Text text="Inside Label" style={{ color: '#ffffff', fontSize: '15px' }} />
        <ProgressBar
          value={health}
          label="HP"
          showValue
          labelPosition="inside"
          width={340}
          height={28}
          fillColor={health < 35 ? 0xef4444 : 0x22c55e}
        />
        <View direction="row" gap={10}>
          <Button width={92} height={34} onClick={hit}>
            <Text text="Hit" style={{ color: '#ffffff', fontSize: '13px' }} />
          </Button>
          <Button width={92} height={34} onClick={heal}>
            <Text text="Heal" style={{ color: '#ffffff', fontSize: '13px' }} />
          </Button>
        </View>
      </View>

      <View gap={8}>
        <Text text="Cooldown" style={{ color: '#ffffff', fontSize: '15px' }} />
        <ProgressBar value={cooldown} label="Skill" showValue width={340} fillColor={0xf59e0b} />
        <Button width={160} height={34} onClick={stepCooldown}>
          <Text text="Advance" style={{ color: '#ffffff', fontSize: '13px' }} />
        </Button>
      </View>

      <ProgressBar value={55} label="Disabled" showValue disabled width={340} />
    </View>
  )
}
