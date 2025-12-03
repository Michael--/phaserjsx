# VDOM Warning System

## Overview

PhaserJSX now includes **React-like warnings** for common VDOM mistakes that cause performance issues. These warnings help detect:

1. **Missing key props** in lists
2. **Unnecessary remounts** due to inline JSX/callback creation

## Why This Matters

Without warnings, performance problems are **invisible**:

- Components remount instead of updating → state loss, layout flashing
- VDOM can't match elements correctly → inefficient reconciliation
- Only visible with visual effects (e.g., WrapText width re-detection)

**With warnings**: Immediate feedback in console → fix before it becomes a problem!

## Configuration

Warnings are enabled by default in development:

```typescript
import { DevConfig } from '@phaserjsx/ui'

// Disable specific warnings
DevConfig.warnings.missingKeys = false // Disable key warnings
DevConfig.warnings.unnecessaryRemounts = false // Disable remount warnings

// Configure sensitivity
DevConfig.warnings.keyWarningThreshold = 3 // Only warn for 3+ siblings (default: 2)
```

## Warning Types

### 1. Missing Key Props

**When it triggers:**

- Multiple siblings of same type (e.g., multiple `<Button>` in same parent)
- 50%+ of siblings missing keys
- At least 2 siblings (configurable via `keyWarningThreshold`)

**Example warning:**

```
[PhaserJSX] Missing key props: 3/3 <Button> children in <View> don't have keys.
This can cause:
  • Unnecessary component recreation instead of updates
  • State loss in conditional rendering
  • Performance degradation with lists

Add unique key props to each child, e.g.:
  <Button key="unique-id" />

To disable this warning: DevConfig.warnings.missingKeys = false
```

**Example problem:**

```tsx
// ❌ Bad - no keys, VDOM can't track which button is which
<View>
  {items.map((item) => (
    <Button onClick={() => handleClick(item)}>
      <Text text={item.name} />
    </Button>
  ))}
</View>
```

**Solution:**

```tsx
// ✅ Good - unique keys allow VDOM to track identity
<View>
  {items.map((item) => (
    <Button key={item.id} onClick={() => handleClick(item)}>
      <Text text={item.name} />
    </Button>
  ))}
</View>
```

### 2. Unnecessary Remounts

**When it triggers:**

- Component remounts (full unmount + mount) instead of updating
- Caused by key or type changes between renders
- Only triggers for components (not primitives like Text)

**Example warning:**

```
[PhaserJSX] Unnecessary remount: <AlertDialog> remounted because key changed.
This often happens when:
  • JSX elements are created inline: prefix={<Icon />} (create new object every render)
  • Callbacks are not memoized: onClick={() => handler()} (new function every render)

Solutions:
  • Memoize JSX: const icon = useMemo(() => <Icon />, [])
  • Memoize callbacks: const handleClick = useCallback(() => handler(), [])
  • Add stable key props: key="my-component"

To disable this warning: DevConfig.warnings.unnecessaryRemounts = false
```

**Example problem:**

```tsx
// ❌ Bad - new JSX object every render → remount
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      prefix={<Icon type="info" />} // New object every render!
      onClose={() => setIsOpen(false)} // New function every render!
    />
  )
}
```

**Solution:**

```tsx
// ✅ Good - memoized references → stable props → updates not remounts
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => setIsOpen(false), [])
  const icon = useMemo(() => <Icon type="info" key="info-icon" />, [])

  return <Dialog key="my-dialog" prefix={icon} onClose={handleClose} />
}
```

## Implementation Details

### Detection Heuristics

**Missing Keys:**

1. Check if children are list-like:
   - All same type → definitely a list
   - 50%+ missing keys → likely a list
2. Only warn if ≥ `keyWarningThreshold` siblings (default: 2)
3. Ignore single children (no ambiguity)

**Unnecessary Remounts:**

1. Detect when `patchVNode` triggers unmount + mount
2. Only warn for components (functions), not primitives
3. Identify reason: key changed or type changed

### Performance Impact

- **Zero runtime cost when disabled** (checks only run if warnings enabled)
- **Minimal cost when enabled** (simple array scans, conditional logging)
- **Production builds**: Can be stripped with build-time flags

### Comparison to React

| Feature              | React           | PhaserJSX       |
| -------------------- | --------------- | --------------- |
| Missing key warnings | ✅              | ✅              |
| Lists detection      | Explicit arrays | Heuristic-based |
| Remount detection    | ❌              | ✅ (unique!)    |
| Configuration        | Limited         | Full DevConfig  |

**PhaserJSX advantage**: Also warns about remounts, not just keys!

## Production Usage

Recommendations:

```typescript
// development.ts
DevConfig.warnings.missingKeys = true
DevConfig.warnings.unnecessaryRemounts = true

// production.ts
DevConfig.warnings.missingKeys = false
DevConfig.warnings.unnecessaryRemounts = false
```

Or use environment detection:

```typescript
const isDev = import.meta.env.DEV

DevConfig.warnings.missingKeys = isDev
DevConfig.warnings.unnecessaryRemounts = isDev
```

## Testing the System

### Trigger Missing Key Warning

```tsx
// Create multiple siblings without keys
<View>
  <Button>
    <Text text="Button 1" />
  </Button>
  <Button>
    <Text text="Button 2" />
  </Button>
  <Button>
    <Text text="Button 3" />
  </Button>
</View>
// → Warning: 3/3 <Button> children don't have keys
```

### Trigger Remount Warning

```tsx
// Create inline JSX that changes every render
function BadExample() {
  const [count, setCount] = useState(0)

  return (
    <Dialog
      prefix={<Icon type="info" />} // New object every render
      onClose={() => setCount(0)} // New function every render
    />
  )
}
// → Warning: Unnecessary remount because props changed
```

## Best Practices

1. **Always add keys to lists**

   ```tsx
   {
     items.map((item) => <Item key={item.id} {...item} />)
   }
   ```

2. **Memoize JSX props**

   ```tsx
   const icon = useMemo(() => <Icon type="x" key="icon" />, [])
   <Component prefix={icon} />
   ```

3. **Memoize callbacks**

   ```tsx
   const handleClick = useCallback(() => action(), [])
   <Button onClick={handleClick} />
   ```

4. **Add keys to components**

   ```tsx
   <Dialog key="my-dialog" />
   <Modal key="my-modal" />
   ```

5. **Monitor console during development**
   - Warnings appear when problems are detected
   - Fix warnings immediately (technical debt)

## FAQ

**Q: Do I need keys for single children?**
A: No, warnings only trigger for multiple siblings (≥2 by default)

**Q: What if my list is dynamic?**
A: Use stable IDs from your data, not array indices:

```tsx
// ❌ Bad - indices change when list reorders
items.map((item, i) => <Item key={i} />)

// ✅ Good - stable IDs track items correctly
items.map((item) => <Item key={item.id} />)
```

**Q: Can I disable warnings per-file?**
A: Yes, set DevConfig at file/component level:

```tsx
// Disable for specific component
function MyComponent() {
  const oldSetting = DevConfig.warnings.missingKeys
  DevConfig.warnings.missingKeys = false

  // ... component code ...

  DevConfig.warnings.missingKeys = oldSetting
}
```

**Q: How do I know if a warning is a false positive?**
A: Check if:

1. Component actually remounts (add console.log in mount/unmount)
2. List actually re-orders (keys matter more for re-ordering)
3. Performance actually suffers (use Chrome DevTools)

If no issues, warnings can be suppressed for that case.

## Related Documentation

- [VDOM_OPTIMIZATION_PATTERN.md](./VDOM_OPTIMIZATION_PATTERN.md) - Memoization patterns
- [THEME_SYSTEM.md](./THEME_SYSTEM.md) - Theme propagation with nested props
- DevConfig API - Full configuration options
