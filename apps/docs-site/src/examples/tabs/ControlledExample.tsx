/**
 * Tabs Controlled Example
 */
/** @jsxImportSource @number10/phaserjsx */
import { Tab, TabPanel, Tabs, Text, useState, View } from '@number10/phaserjsx'

export function ControlledTabsExample() {
  const [activeIndex, setActiveIndex] = useState(1)
  const labels = ['Profile', 'Notifications', 'Security']

  return (
    <View width={'fill'} height={'fill'} alignItems="center" justifyContent="center" gap={12}>
      <Text text={`Active tab: ${labels[activeIndex]}`} style={{ color: '#c7d2fe' }} />
      <Tabs width={520} activeIndex={activeIndex} onChange={setActiveIndex}>
        {labels.map((label) => (
          <Tab key={label}>
            <Text text={label} />
          </Tab>
        ))}

        {labels.map((label) => (
          <TabPanel key={`${label}-panel`} minHeight={150} gap={6}>
            <Text text={`${label} settings`} />
            <Text
              text="Controlled Tabs uses activeIndex + onChange."
              style={{ color: '#9aa0a6', fontSize: '12px' }}
            />
          </TabPanel>
        ))}
      </Tabs>
    </View>
  )
}
