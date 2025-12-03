# VDOM Optimization Pattern

## Problem: Unnecessary Re-renders and Component Recreation

When components receive **new object references** on every parent render, the VDOM cannot detect that it's the "same" component, causing complete recreation instead of updates.

### Root Causes

1. **Inline JSX creation**: `<Icon type="trash" />` creates new object every render
2. **Inline callbacks**: `() => setIsOpen(false)` creates new function every render
3. **Inline function definitions**: Function definitions inside render create new references
4. **Missing keys**: VDOM cannot identify component instances without stable keys

### Symptoms

- Component mounts/unmounts repeatedly instead of updating
- State resets unnecessarily
- Performance degradation
- Logs show repeated initialization (e.g., WrapText width detection triggers 3x)

## Solution: Memoization + Key Props

### 1. Memoize JSX Elements with `useMemo`

❌ **Problem:**

```tsx
<AlertDialog
  prefix={<Icon type="trash" size={24} />} // New object every render
/>
```

✅ **Solution:**

```tsx
const prefix = useMemo(() => <Icon type="trash" size={24} key="trash-icon" />, [])

<AlertDialog prefix={prefix} />
```

**Why it works:**

- `useMemo` returns same reference until dependencies change
- Empty deps `[]` = never changes
- VDOM sees identical reference → updates instead of recreating

### 2. Memoize Callbacks with `useCallback`

❌ **Problem:**

```tsx
<AlertDialog
  onClose={() => setIsOpen(false)} // New function every render
  onConfirm={() => handleAction()} // New function every render
/>
```

✅ **Solution:**

```tsx
const handleClose = useCallback(() => setIsOpen(false), [])
const handleConfirm = useCallback(() => {
  setDeleted(true)
  setTimeout(() => setDeleted(false), 2000)
}, [])

<AlertDialog
  onClose={handleClose}
  onConfirm={handleConfirm}
/>
```

**Why it works:**

- `useCallback` returns same function reference until dependencies change
- Prevents prop changes that trigger re-renders

### 3. Add `key` Props for VDOM Identification

❌ **Problem:**

```tsx
<AlertDialog variant="destructive" /> // No stable identifier
```

✅ **Solution:**

```tsx
<AlertDialog key="destructive-dialog" variant="destructive" />
```

**Why it works:**

- VDOM uses `key` to match elements across renders
- Same `key` → update existing element
- Different `key` → create new element
- Without `key`, VDOM relies on position/type (unreliable)

### 4. Add Keys to Dynamic Content

❌ **Problem:**

```tsx
{
  deleted && <Text text="✓ Item deleted!" />
} // Position-based matching
```

✅ **Solution:**

```tsx
{
  deleted && <Text text="✓ Item deleted!" key="deleted-msg" />
}
```

## Complete Example Pattern

```tsx
function DestructiveVariantExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)

  // ✅ Memoize callbacks
  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleDelete = useCallback(() => {
    setDeleted(true)
    setTimeout(() => setDeleted(false), 2000)
  }, [])

  // ✅ Memoize JSX elements
  const prefix = useMemo(() => <Icon type="trash" size={24} key="trash-icon" />, [])

  return (
    <View>
      <Button onClick={handleOpen}>
        <Text text="Delete Item" />
      </Button>

      {/* ✅ Conditional content with key */}
      {deleted && <Text text="✓ Item deleted!" key="deleted-msg" />}

      {/* ✅ Component with key + memoized props */}
      <AlertDialog
        key="destructive-dialog"
        isOpen={isOpen}
        onClose={handleClose}
        prefix={prefix}
        onConfirm={handleDelete}
      />
    </View>
  )
}
```

## Implementation Checklist

Component Props Interface:

- [ ] Add `key?: string` to props interface (for TypeScript)

Component Usage:

- [ ] Add unique `key` prop to each component instance
- [ ] Use `useMemo` for all JSX element props (icons, custom content)
- [ ] Use `useCallback` for all function props (event handlers)
- [ ] Add `key` to conditional elements
- [ ] Verify empty deps `[]` if values truly never change

Component Implementation:

- [ ] Use `useMemo` for expensive computed JSX (actions, content)
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Include all dependencies in deps array (or none if stable)

## Performance Impact

**Before optimization (Destructive Dialog example):**

- Open: WrapText width detection (500 → 452)
- Animation end: WrapText re-renders
- Close: WrapText re-renders again
- Total: 3 layout calculations

**After optimization:**

- Open: WrapText width detection (452 → 452) ✅ matches immediately
- Animation/Close: No unnecessary re-renders
- Total: 1 layout calculation

## Key Takeaways

1. **Inline creation = new reference = VDOM recreation**
2. **Memoization = stable reference = VDOM update**
3. **Keys = VDOM identity = correct matching**
4. **Empty deps `[]` = never recalculate = maximum stability**
5. **Apply pattern consistently** across all component examples
