/**
 * Main app component for dev playground
 */
import {
  Button,
  createCameraFadeInFX,
  createCameraFadeOutFX,
  createCameraFlashFX,
  createCameraShakeFX,
  createCameraZoomFX,
  type MountProps,
  Particles,
  type ParticlesHandle,
  resolveParticlePreset,
  Tab,
  TabPanel,
  Tabs,
  Text,
  useCameraFX,
  useEffect,
  useLayoutEffect,
  useMemo,
  useParticles,
  useRef,
  useScene,
  useState,
  useWorldLayoutRect,
  View,
} from '@number10/phaserjsx'
import Phaser from 'phaser'

// DevConfig.debug.enabled = true
// DevConfig.debug.layout = true

/**
 * Props for App component
 */

export interface AppProps extends MountProps {
  /** Additional props can be defined here if needed */
  title: string
}

const scrollTabLabels = [
  'Overview',
  'Settings',
  'Audio',
  'Video',
  'Network',
  'Controls',
  'Gameplay',
  'Profiles',
  'Credits',
  'About',
]

function CameraFX() {
  const { applyCameraFX, clearCameraFX } = useCameraFX()
  return (
    <View width={720} gap={12} padding={16} backgroundColor={0x1e1e1e} cornerRadius={12}>
      <Text
        text="Camera FX"
        style={{
          fontSize: '22px',
          fontFamily: 'Arial',
          color: '#ffffff',
        }}
      />

      <View direction="row" gap={8}>
        <Button
          onClick={() => applyCameraFX(createCameraShakeFX, { duration: 260, intensity: 0.02 })}
        >
          <Text text="Shake" />
        </Button>
        <Button onClick={() => applyCameraFX(createCameraFlashFX, { duration: 200 })}>
          <Text text="Flash" />
        </Button>
        <Button onClick={() => applyCameraFX(createCameraFadeInFX, { duration: 260 })}>
          <Text text="Fade In" />
        </Button>
        <Button onClick={() => applyCameraFX(createCameraFadeOutFX, { duration: 260 })}>
          <Text text="Fade Out" />
        </Button>
        <Button onClick={() => applyCameraFX(createCameraZoomFX, { zoom: 1.12, duration: 220 })}>
          <Text text="Zoom +" />
        </Button>
        <Button onClick={() => applyCameraFX(createCameraZoomFX, { zoom: 1.0, duration: 220 })}>
          <Text text="Zoom 1.0" />
        </Button>
        <Button onClick={clearCameraFX}>
          <Text text="Clear FX" />
        </Button>
      </View>
    </View>
  )
}

function ParticleSystem() {
  const particlesRef = useRef<ParticlesHandle | null>(null)
  const restartTimerRef = useRef<number | null>(null)
  const [particlePreset, setParticlePreset] = useState<'sparkle' | 'trail' | 'rain' | 'snow'>(
    'sparkle'
  )
  const [particleTexture, setParticleTexture] = useState<string | null>(null)
  const scene = useScene()
  const { explode, setConfig, start, stop } = useParticles(particlesRef)

  useEffect(() => {
    const key = 'particle-blob'
    if (!scene.textures.exists(key)) {
      const gfx = scene.add.graphics()
      gfx.fillStyle(0xffffff, 1)
      for (let i = 0; i < 6; i += 1) {
        const radius = 4 + (i % 3)
        const x = 12 + (i % 3) * 2 - 2
        const y = 12 + Math.floor(i / 3) * 2 - 2
        gfx.fillCircle(x, y, radius)
      }
      gfx.generateTexture(key, 24, 24)
      gfx.destroy()
    }
    setParticleTexture(key)
  }, [scene])

  const particleFrequency = particlePreset === 'trail' ? 30 : 60
  const particleTint =
    particlePreset === 'rain'
      ? 0x6fd1ff
      : particlePreset === 'snow'
        ? 0xffffff
        : particlePreset === 'trail'
          ? 0xff9f6e
          : 0xb08bff
  const particleConfig = useMemo(
    () => ({ frequency: particleFrequency, tint: particleTint }),
    [particleFrequency, particleTint]
  )
  const resolvedParticleConfig = useMemo(
    () => resolveParticlePreset(particlePreset, particleConfig),
    [particlePreset, particleConfig]
  )

  useEffect(() => {
    setConfig(resolvedParticleConfig)
    start()
  }, [resolvedParticleConfig, setConfig, start])

  useEffect(() => {
    return () => {
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current)
        restartTimerRef.current = null
      }
    }
  }, [])

  const handleExplode = () => {
    explode(50, 0, 0)

    const resolvedConfig = resolvedParticleConfig
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current)
    }
    restartTimerRef.current = window.setTimeout(() => {
      setConfig(resolvedConfig)
      start()
    }, 800)
  }

  return (
    <View width={720} gap={12} padding={16} backgroundColor={0x1e1e1e} cornerRadius={12}>
      <Text
        text="Particle System"
        style={{
          fontSize: '22px',
          fontFamily: 'Arial',
          color: '#ffffff',
        }}
      />

      <View
        width={680}
        height={180}
        direction="stack"
        backgroundColor={0x101010}
        cornerRadius={10}
        overflow="hidden"
      >
        {particleTexture != null && (
          <Particles
            ref={particlesRef}
            texture={particleTexture}
            preset={particlePreset}
            zone={{ shape: 'rect', width: 680, height: 180 }}
            config={particleConfig}
            depth={0}
          />
        )}

        <View padding={12} width="100%" height="100%" justifyContent="space-between" depth={1000}>
          <Text
            depth={1000}
            text={`Preset: ${particlePreset}`}
            style={{
              fontSize: '18px',
              fontFamily: 'Arial',
              color: '#ffffff',
            }}
          />

          <View direction="row" gap={8} depth={1000}>
            <Button onClick={() => setParticlePreset('sparkle')}>
              <Text text="Sparkle" />
            </Button>
            <Button onClick={() => setParticlePreset('trail')}>
              <Text text="Trail" />
            </Button>
            <Button onClick={() => setParticlePreset('rain')}>
              <Text text="Rain" />
            </Button>
            <Button onClick={() => setParticlePreset('snow')}>
              <Text text="Snow" />
            </Button>
            <Button onClick={handleExplode}>
              <Text text="Explode" />
            </Button>
            <Button onClick={start}>
              <Text text="Start" />
            </Button>
            <Button onClick={stop}>
              <Text text="Stop" />
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export function TabsExample() {
  return (
    <Tabs width={700}>
      <Tab>
        <Text text="Overview" />
      </Tab>
      <Tab>
        <Text text="Settings" />
      </Tab>
      <Tab disabled>
        <Text text="Disabled" />
      </Tab>

      <TabPanel minHeight={200} gap={8}>
        <Text text="This panel hosts Phaser JSX content." />
        <Text text="Swap tabs to see different content containers." />
      </TabPanel>
      <TabPanel minHeight={200} gap={6}>
        <Text text="Settings panel (custom VNode header)." />
        <Text text="Add any UI controls or layouts here." />
      </TabPanel>
      <TabPanel minHeight={200} gap={6}>
        <Text text="Disabled tab keeps its panel unreachable." />
      </TabPanel>
    </Tabs>
  )
}

export function ScrollableTabsExample() {
  const [scrollTabIndex, setScrollTabIndex] = useState(0)

  return (
    <Tabs
      width={700}
      scrollableTabs={true}
      activeIndex={scrollTabIndex}
      onChange={setScrollTabIndex}
    >
      {scrollTabLabels.map((label) => (
        <Tab key={label}>
          <Text text={label} />
        </Tab>
      ))}
      {scrollTabLabels.map((label) => (
        <TabPanel key={`${label}-panel`}>
          <View padding={10} backgroundColor={0xffff3f} cornerRadius={6}>
            <Text text={`${label} panel`} />
          </View>
        </TabPanel>
      ))}
    </Tabs>
  )
}

type LayoutInfoProps = {
  ref: {
    current: Phaser.GameObjects.Container | null
  }
}

function LayoutInfo({ ref }: LayoutInfoProps) {
  const [layoutText, setLayoutText] = useState('Calculating layout...')

  useLayoutEffect(() => {
    const layout = useWorldLayoutRect(ref)
    setLayoutText(JSON.stringify(layout, null, 2))
  }, [ref])

  return (
    <View width={400} backgroundColor={0x444444} cornerRadius={10} padding={20}>
      <Text
        text={`Layout Info:\n${layoutText}`}
        style={{
          fontSize: '14px',
          fontFamily: 'Courier New',
          color: '#ffff88',
          align: 'left',
        }}
      />
    </View>
  )
}

/**
 * Main App component
 */
export function App(props: AppProps) {
  const ref = useRef<Phaser.GameObjects.Container | null>(null)

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

        <CameraFX />

        <ParticleSystem />

        <ScrollableTabsExample />

        <LayoutInfo ref={ref} />
      </View>
    </View>
  )
}
