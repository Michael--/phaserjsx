/**
 * Tabs Scrollable Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Tab, TabPanel, Tabs, Text, useState, View } from '@number10/phaserjsx'

const labels = [
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

export function ScrollableTabsExample() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={12}>
      <Tabs width={520} activeIndex={activeIndex} onChange={setActiveIndex} scrollableTabs>
        {labels.map((label) => (
          <Tab key={label}>
            <Text text={label} />
          </Tab>
        ))}

        {labels.map((label) => (
          <TabPanel key={`${label}-panel`} minHeight={150}>
            <View padding={10} backgroundColor={0xe9f5ff} cornerRadius={6}>
              <Text text={`${label} panel`} />
            </View>
          </TabPanel>
        ))}
      </Tabs>
    </View>
  )
}
