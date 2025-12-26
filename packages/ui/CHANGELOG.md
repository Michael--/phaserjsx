# @number10/phaserjsx

## 0.4.0

### Minor Changes

- Add camera FX
- Add viewport size and layout hooks
- add useLayoutEffect hook for post-layout operationsIntroduces useLayoutEffect to solve timing issues when accessing layout dimensions.
- Add particle effects (just demo state)
- Add snap and momentum to ScrollView
- Add custom component for any left internal component, this ensure better type safety
- Explicit return type for any custom component
- Add re-mounting option for mountJSX
- Add Joystick component to be used a a virtual stick especially for touch devices
- Add tabs component

### Patch Changes

- fix parent layout recalculation when child key or children changed

## 0.3.0

### Minor Changes

- VDOM patching instead remountint modal/portal to avoid effects when childrens changed
- add unmountJSX
- Add Momentum and Snap option to ScrollSlider

## 0.2.0

### Minor Changes

- Unified preset and color mode control: `setColorPreset` optionally accepts the target mode, while the new `setColorMode` sets the default mode. Tokens are updated directly, and duplicate listener notifications are eliminated.
