/**
 * Tabs Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Icon } from '@/components/Icon'
import { createTheme, Tab, TabPanel, Tabs, Text, View } from '@number10/phaserjsx'

export function CustomizedTabsExample() {
  // some local theme override for Tabs here
  const theme = createTheme({
    Tabs: {
      tabListStyle: {
        backgroundAlpha: 0,
        justifyContent: 'center',
      },
      tabStyle: {
        backgroundColor: 0x0,
        borderWidth: 2,
        cornerRadius: { tl: 18, tr: 18, bl: 0, br: 0 },
        padding: 4,
      },
      tabActiveStyle: {
        backgroundColor: 0xffff00,
        padding: 4,
      },
      panelStyle: {
        cornerRadius: 8,
        backgroundColor: 0x222222,
      },
    },
  })

  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center">
      <Tabs width={520} theme={theme} scrollableTabs={false}>
        <Tab>
          <Icon type="star" size={32} />
        </Tab>
        <Tab>
          <Icon type="gear" size={32} />
        </Tab>
        <Tab>
          <Icon type="download" size={32} />
        </Tab>

        <TabPanel minHeight={160} gap={8}>
          <Text text="Overview panel with a quick summary." />
          <Text text="Tabs match panels by order." style={{ color: '#9aa0a6', fontSize: '12px' }} />
        </TabPanel>
        <TabPanel minHeight={160} gap={8}>
          <Text text="Settings panel for toggles and sliders." />
        </TabPanel>
        <TabPanel minHeight={160} gap={8}>
          <Text text="Status panel for system info." />
        </TabPanel>
      </Tabs>
    </View>
  )
}
