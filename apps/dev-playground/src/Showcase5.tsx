import {
  Badge,
  Button,
  Divider,
  ProgressBar,
  ScrollView,
  setColorPreset,
  Text,
  Toggle,
  useState,
  useThemeTokens,
  View,
  WrapText,
} from '@number10/phaserjsx'

setColorPreset('midnight', 'dark')

type Tab = 'quests' | 'loadout'

type Quest = {
  id: string
  title: string
  zone: string
  risk: 'Low' | 'Medium' | 'High'
  progress: number
  reward: string
}

type InventoryItem = {
  id: string
  name: string
  slot: string
  rarity: 'common' | 'rare' | 'epic'
  power: number
}

const quests: Quest[] = [
  {
    id: 'relay',
    title: 'Repair the sky relay',
    zone: 'North Ridge',
    risk: 'Medium',
    progress: 72,
    reward: '+240 XP',
  },
  {
    id: 'forge',
    title: 'Secure the ember forge',
    zone: 'Old Foundry',
    risk: 'High',
    progress: 36,
    reward: 'Epic core',
  },
  {
    id: 'garden',
    title: 'Map the glass garden',
    zone: 'Lower Canopy',
    risk: 'Low',
    progress: 91,
    reward: '+80 gold',
  },
  {
    id: 'vault',
    title: 'Open the silent vault',
    zone: 'Archive 7',
    risk: 'High',
    progress: 18,
    reward: 'Relic key',
  },
]

const inventory: InventoryItem[] = [
  { id: 'blade', name: 'Ion Blade', slot: 'Weapon', rarity: 'epic', power: 96 },
  { id: 'cloak', name: 'Mist Cloak', slot: 'Armor', rarity: 'rare', power: 74 },
  { id: 'boots', name: 'Drift Boots', slot: 'Utility', rarity: 'common', power: 42 },
  { id: 'orb', name: 'Echo Orb', slot: 'Focus', rarity: 'rare', power: 69 },
  { id: 'ring', name: 'Copper Ring', slot: 'Charm', rarity: 'common', power: 31 },
  { id: 'core', name: 'Nova Core', slot: 'Relic', rarity: 'epic', power: 88 },
]

function riskTone(risk: Quest['risk']) {
  if (risk === 'High') return 'danger'
  if (risk === 'Medium') return 'warning'
  return 'success'
}

function rarityTone(rarity: InventoryItem['rarity']) {
  if (rarity === 'epic') return 'danger'
  if (rarity === 'rare') return 'info'
  return 'neutral'
}

function StatCard(props: { label: string; value: number; color: number; trackColor: number }) {
  const tokens = useThemeTokens()

  return (
    <View
      minWidth={180}
      width="fill"
      gap={6}
      padding={10}
      cornerRadius={10}
      backgroundColor={tokens?.colors.background.light.toNumber()}
      borderColor={tokens?.colors.border.dark.toNumber()}
      borderWidth={1}
    >
      <View
        direction="row"
        justifyContent="space-between"
        alignItems="stretch"
        flex={1}
        width="fill"
      >
        <Text text={props.label} style={tokens?.textStyles.small} />
        <Text text={`${props.value}%`} style={tokens?.textStyles.large} />
      </View>
      <ProgressBar
        value={props.value}
        width="fill"
        height={12}
        trackColor={props.trackColor}
        fillColor={props.color}
        cornerRadius={8}
      />
    </View>
  )
}

function NavButton(props: { active: boolean; count: number; label: string; onClick: () => void }) {
  const tokens = useThemeTokens()
  const textColor = tokens?.colors.text.DEFAULT.toString() ?? '#dbeafe'

  return (
    <Button
      variant={props.active ? 'primary' : 'outline'}
      size="medium"
      minWidth={148}
      gap={8}
      onClick={props.onClick}
    >
      <Text
        text={props.label}
        style={{
          ...tokens?.textStyles.DEFAULT,
          color: props.active ? '#08111f' : textColor,
        }}
      />
      <Badge count={props.count} tone={props.active ? 'warning' : 'neutral'} size="small" />
    </Button>
  )
}

function QuestRow(props: { key?: string; quest: Quest; selected: boolean; onSelect: () => void }) {
  const tokens = useThemeTokens()
  const mutedTextColor = tokens?.colors.text.light.toString() ?? '#9fb3c8'

  return (
    <Button
      variant="outline"
      width="fill"
      padding={14}
      cornerRadius={0}
      backgroundColor={
        props.selected
          ? tokens?.colors.primary.dark.toNumber()
          : tokens?.colors.background.DEFAULT.toNumber()
      }
      borderColor={
        props.selected
          ? tokens?.colors.accent.light.toNumber()
          : tokens?.colors.border.dark.toNumber()
      }
      borderWidth={2}
      gap={12}
      onClick={props.onSelect}
    >
      <View width="fill" gap={10}>
        <View direction="row" width="fill" justifyContent="space-between" alignItems="center">
          <View gap={3}>
            <Text text={props.quest.title} style={tokens?.textStyles.DEFAULT} />
            <Text
              text={props.quest.zone}
              style={{ ...tokens?.textStyles.caption, color: mutedTextColor }}
            />
          </View>
          <Badge label={props.quest.risk} tone={riskTone(props.quest.risk)} variant="soft" />
        </View>
        <ProgressBar
          value={props.quest.progress}
          width="fill"
          height={10}
          fillColor={tokens?.colors.accent.DEFAULT.toNumber() ?? 0x22d3ee}
          trackColor={tokens?.colors.background.dark.toNumber() ?? 0x101827}
          borderWidth={0}
          cornerRadius={6}
        />
      </View>
    </Button>
  )
}

function InventoryTile(props: {
  key?: string
  item: InventoryItem
  selected: boolean
  onSelect: () => void
}) {
  const tokens = useThemeTokens()

  return (
    <Button
      variant="outline"
      effect="shake"
      minHeight={132}
      padding={12}
      gap={10}
      cornerRadius={0}
      backgroundColor={
        props.selected
          ? tokens?.colors.secondary.dark.toNumber()
          : tokens?.colors.background.DEFAULT.toNumber()
      }
      borderColor={
        props.selected
          ? tokens?.colors.accent.light.toNumber()
          : tokens?.colors.border.dark.toNumber()
      }
      borderWidth={3}
      onClick={props.onSelect}
    >
      <View
        width={48}
        height={48}
        cornerRadius={14}
        alignItems="center"
        justifyContent="center"
        backgroundColor={tokens?.colors.background.dark.toNumber()}
        borderColor={tokens?.colors.border.dark.toNumber()}
        borderWidth={1}
      >
        <Text text={props.item.slot.slice(0, 2).toUpperCase()} style={tokens?.textStyles.small} />
      </View>
      <View gap={4} alignItems="center">
        <Text text={props.item.name} style={tokens?.textStyles.small} />
        <Badge label={props.item.rarity} tone={rarityTone(props.item.rarity)} variant="soft" />
      </View>
      <ProgressBar
        value={props.item.power}
        width={118}
        height={8}
        fillColor={tokens?.colors.warning.DEFAULT.toNumber() ?? 0xf59e0b}
        trackColor={tokens?.colors.background.dark.toNumber() ?? 0x101827}
        borderWidth={0}
        cornerRadius={6}
      />
    </Button>
  )
}

function DocsCard() {
  const tokens = useThemeTokens()
  const mutedTextColor = tokens?.colors.text.light.toString() ?? '#9fb3c8'

  return (
    <View
      gap={12}
      padding={18}
      cornerRadius={18}
      backgroundColor={tokens?.colors.background.light.toNumber()}
      borderColor={tokens?.colors.border.dark.toNumber()}
      borderWidth={1}
    >
      <Text text="Why this sample?" style={tokens?.textStyles.large} />
      <WrapText
        text="Phaser UI work often becomes hard around layout, scroll areas, hit targets, overlays, theming and state updates. This keeps those problems visible without hiding them in game logic."
        style={{ ...tokens?.textStyles.small, color: mutedTextColor }}
      />
      <View direction="row" gap={10} flexWrap="wrap">
        <Badge label="responsive layout" tone="info" variant="soft" />
        <Badge label="scroll list" tone="success" variant="soft" />
        <Badge label="stateful selection" tone="warning" variant="soft" />
        <Badge label="theme tokens" tone="primary" variant="soft" />
      </View>
      <Button
        size="medium"
        onClick={() => window.open('https://michael--.github.io/phaserjsx/', '_blank')}
      >
        <Text text="Open docs" />
      </Button>
    </View>
  )
}

export function ShowCase5() {
  const tokens = useThemeTokens()
  const [tab, setTab] = useState<Tab>('quests')
  const [selectedQuestId, setSelectedQuestId] = useState(quests[0]?.id ?? '')
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id ?? '')
  const [rareOnly, setRareOnly] = useState(false)

  const selectedQuest = quests.find((quest) => quest.id === selectedQuestId) ?? quests[0]
  const visibleItems = rareOnly
    ? inventory.filter((item) => item.rarity === 'rare' || item.rarity === 'epic')
    : inventory
  const selectedItem = inventory.find((item) => item.id === selectedItemId) ?? inventory[0]
  const mutedTextColor = tokens?.colors.text.light.toString() ?? '#9fb3c8'

  return (
    <View
      width="fill"
      direction="row"
      flexWrap="wrap"
      gap={18}
      padding={22}
      cornerRadius={28}
      backgroundColor={tokens?.colors.background.darkest.toNumber()}
    >
      <View minWidth={360} gap={18}>
        <View
          direction="row"
          width="fill"
          gap={18}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <View gap={6}>
            <Text
              text="A game HUD built with JSX, hooks, flex layout and Phaser-rendered components."
              maxWidth={560}
              style={{ ...tokens?.textStyles.small, color: mutedTextColor }}
            />
          </View>
          <View direction="row" gap={10} flexWrap="wrap">
            <NavButton
              active={tab === 'quests'}
              count={quests.length}
              label="Quests"
              onClick={() => setTab('quests')}
            />
            <NavButton
              active={tab === 'loadout'}
              count={inventory.length}
              label="Loadout"
              onClick={() => setTab('loadout')}
            />
          </View>
        </View>

        <View direction="row" width="fill" gap={14} flexWrap="wrap">
          <StatCard
            label="Health"
            value={84}
            color={tokens?.colors.success.DEFAULT.toNumber() ?? 0x22c55e}
            trackColor={tokens?.colors.background.lightest.toNumber() ?? 0x1f2937}
          />
          <StatCard
            label="Energy"
            value={62}
            color={tokens?.colors.info.DEFAULT.toNumber() ?? 0x38bdf8}
            trackColor={tokens?.colors.background.lightest.toNumber() ?? 0x1f2937}
          />
          <StatCard
            label="XP"
            value={78}
            color={tokens?.colors.warning.DEFAULT.toNumber() ?? 0xf59e0b}
            trackColor={tokens?.colors.background.lightest.toNumber() ?? 0x1f2937}
          />
        </View>

        <View
          width="fill"
          minHeight={360}
          padding={18}
          gap={16}
          cornerRadius={24}
          backgroundColor={tokens?.colors.background.light.toNumber()}
          borderColor={tokens?.colors.border.dark.toNumber()}
          borderWidth={1}
        >
          {tab === 'quests' ? (
            <View width="fill" height="fill" gap={14}>
              <View direction="row" width="fill" justifyContent="space-between" alignItems="center">
                <Text text="Mission board" style={tokens?.textStyles.title} />
                <Badge label={selectedQuest?.reward ?? 'No reward'} tone="warning" />
              </View>
              <Divider length="fill" />
              <ScrollView width="fill" flex={1} sliderSize="small">
                <View width="fill" gap={12}>
                  {quests.map((quest) => (
                    <QuestRow
                      key={quest.id}
                      quest={quest}
                      selected={quest.id === selectedQuestId}
                      onSelect={() => setSelectedQuestId(quest.id)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View width="fill" gap={14}>
              <View direction="row" width="fill" justifyContent="space-between" alignItems="center">
                <Text text="Loadout grid" style={tokens?.textStyles.title} />
                <Toggle
                  labelPosition="left"
                  label="Show all"
                  checked={!rareOnly}
                  onChange={() => setRareOnly(!rareOnly)}
                ></Toggle>
              </View>
              <View direction="row" width={'fill'} gap={12} flexWrap="wrap">
                {visibleItems.map((item) => (
                  <InventoryTile
                    key={item.id}
                    item={item}
                    selected={item.id === selectedItemId}
                    onSelect={() => setSelectedItemId(item.id)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View width={320} minWidth={280} gap={18} direction="row">
        <View
          gap={12}
          padding={18}
          cornerRadius={22}
          backgroundColor={tokens?.colors.background.light.toNumber()}
          borderColor={tokens?.colors.border.dark.toNumber()}
          borderWidth={1}
        >
          <Text text="Selection" style={tokens?.textStyles.title} />
          {tab === 'quests' ? (
            <View gap={10}>
              <Text text={selectedQuest?.title ?? 'No quest'} style={tokens?.textStyles.large} />
              <Text
                text={`Zone: ${selectedQuest?.zone ?? '-'}`}
                style={{ ...tokens?.textStyles.small, color: mutedTextColor }}
              />
              <ProgressBar
                value={selectedQuest?.progress ?? 0}
                label="Complete"
                showValue
                labelPosition="bottom"
                width="fill"
                fillColor={tokens?.colors.accent.DEFAULT.toNumber() ?? 0x22d3ee}
                trackColor={tokens?.colors.background.dark.toNumber() ?? 0x101827}
              />
            </View>
          ) : (
            <View gap={10}>
              <Text text={selectedItem?.name ?? 'No item'} style={tokens?.textStyles.large} />
              <View direction="row" gap={8}>
                <Badge label={selectedItem?.slot ?? '-'} tone="neutral" />
                <Badge
                  label={selectedItem?.rarity ?? '-'}
                  tone={selectedItem ? rarityTone(selectedItem.rarity) : 'neutral'}
                  variant="soft"
                />
              </View>
              <ProgressBar
                value={selectedItem?.power ?? 0}
                label="Power"
                showValue
                labelPosition="bottom"
                width="fill"
                fillColor={tokens?.colors.warning.DEFAULT.toNumber() ?? 0xf59e0b}
                trackColor={tokens?.colors.background.dark.toNumber() ?? 0x101827}
              />
            </View>
          )}
        </View>
        <DocsCard />
      </View>
    </View>
  )
}
