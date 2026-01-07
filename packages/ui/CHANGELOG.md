# @number10/phaserjsx

## 0.6.1

### Patch Changes

- Fix SVG support (comments) and tinting (stroke)

## 0.6.0

### Minor Changes

- add HSL color to color-utils
- remove and adjust some log messages
- refactoring regarding layout effect

### Patch Changes

- fix slider track redraw
- fix some return type and props type (VNodeLike)

## 0.5.2

### Patch Changes

- fix WrapText measurement when resized scene

## 0.5.0

### Minor Changes

- Add some test apps using some bundler to check compatibility with UI

### Patch Changes

- add jsx runtime type fallbacks for TS

## 0.4.2

### Patch Changes

- Enforce Phaser namespace imports

## 0.4.1

### Patch Changes

- Added typesVersions entries for jsx-runtime and jsx-dev-runtime so older TS resolvers can find the d.ts subpaths while keeping the existing exports map as-is. This targets the TS “react-jsx” consumer error without altering the runtime bundles.

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
