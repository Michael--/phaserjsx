/**
 * Tabs Quick Start Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Tab, TabPanel, Tabs, Text, View } from '@number10/phaserjsx'

export function QuickStartTabsExample() {
  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center">
      <Tabs width={520}>
        <Tab>
          <Text text="Overview" />
        </Tab>
        <Tab>
          <Text text="Settings" />
        </Tab>
        <Tab>
          <Text text="Status" />
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
