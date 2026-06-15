# @number10/phaserjsx

## 4.5.1

### Patch Changes

- Improve npm package discoverability with a clearer package description and more search-oriented keywords for Phaser JSX, Phaser UI, game UI, TSX, and component-library use cases.
- Align the repository README and package README release copy with the `@number10/phaserjsx@4.5.1` package line.

## 4.5.0

### Minor Changes

- Add `NumberInput`, `ColorPicker`, `PalettePicker`, `SegmentedControl`, `Toolbar`, `MenuButton`, `ListBox`, `WheelPicker`, `ActivityIndicator`, `ProgressView`, `Toast`, `RatingBar`, and `BottomSheet` as public custom components with theme defaults, docs examples, and focused test coverage.
- Extend `BottomSheet` with portal-backed overlays, backdrop dismissal, drag-to-dismiss behavior, configurable backdrop alpha, custom handle rendering, handle area sizing/color/corner radius, and corner-radius inset handling.
- Add shared compact component size presets and migrate Button, SegmentedControl, and Toolbar to the shared size/variant theme model.

### Patch Changes

- Improve theme and color internals with cached component-name lookups, HSL-based color scaling, shared neutral constants, binary-search contrast adjustment, more stable `useColors`, and reliable remount notifications when color presets change.
- Strengthen accessibility-oriented color handling with better neutral contrast, deterministic disabled Button styling, improved Button text contrast, and WCAG contrast regression coverage across presets and modes.
- Fix notification stack cleanup, toast layout/dismiss controls, SegmentedControl hover text styles, ColorPicker slider-thumb alignment, and icon texture/type updates for generated icon loaders.
- Add ListBox hover control and ScrollView prop passthrough support for slider sizing and related custom behavior.
- Expand generated icon script coverage and include `IconType` literals in generated icon loader output.
- Remove `lodash` dependency, replacing its `debounce` with a lightweight inline implementation (~490 kB / 43% custom-chunk size reduction).

## 4.4.0

### Minor Changes

- Improve Button defaults and public theme slots with generated `label`/`text` content, `ghost` and `danger` variants, themed size/variant maps, nested Text/Icon defaults, and stronger docs examples.
- Add Popover and ContextMenu open/close presence animations with configurable effects and durations while keeping portal placement and viewport clamping behavior.

### Patch Changes

- Preserve local theme props for function components, notify theme listeners on custom theme updates, and restore global plus nested theme resolution for registered component themes.
- Strengthen themed states and drawing for Toggle, RadioButton, Dropdown, CharTextInput, ScrollSlider, Badge, Tag, and generated background borders.
- Account for margins when resolving fill sizes and add layout/VDOM regression coverage for edge cases around child changes and themed function component rerenders.
- Align ScrollView slider size variants with theme defaults and document the slider-size behavior in the docs site.
- Expand docs and playground coverage for Button variants, effects, icons, sizing, Checkbox custom indicators, Popover behavior, and a StackBlitz showcase.

## 4.3.0

### Minor Changes

- Add `Checkbox` as a public custom component with controlled/uncontrolled state, disabled handling, label positioning, tristate support, theme defaults, docs examples, and package tests.
- Add `ProgressBar` as a public custom component with horizontal/vertical modes, label placement options, theming, docs examples, and package tests.
- Add `Badge` and `Tag` as public custom components with tone, variant, size, count formatting, theme defaults, docs examples, and package tests.
- Add `Popover` and `ContextMenu` as public portal-based overlay components with placement calculation, viewport clamping, measured content positioning, theme defaults, docs examples, and package tests.

### Patch Changes

- Add an interactive performance playground that uses the public `DebugPanel` component.
- Clarify `Particles` emit zones and death zones, resolve death-zone coordinates in local space, and add particle zone regression coverage.
- Improve `TileSprite` support and examples, including size handling and regression coverage.
- Expand docs-site coverage for Sprite, TileSprite, Particles, Checkbox, ProgressBar, Badge/Tag, Popover/ContextMenu, responsive design, layout patterns, performance, theme effects, and gestures/tooltips guidance.
- Synchronize docs-site theme switching across the full layout instead of only the header.
- Clean up Phaser 4 docs-site scaffolding and stale temporary documentation.

## 4.2.0

### Minor Changes

- Add `DebugPanel` as an exported custom component for lightweight Phaser/PhaserJSX runtime diagnostics.

### Patch Changes

- Restore Phaser's cached WebGL wrapper state after custom stencil clipping setup and mask draw passes, preventing transient global flicker when bitmap stencil clips are added.
- Project stencil masks through the active camera matrix so clipped content stays aligned under camera transforms.
- Keep bitmap stencil mask rendering on Phaser texture-unit bindings instead of mutating raw texture state directly.
- Split stencil clip depth, framebuffer bridge, renderer, runtime state, and shared types into focused modules for easier maintenance.
- Add stencil clip regression coverage for asynchronous corner handling, camera projection, and bitmap texture-unit state restoration.

## 4.1.0

### Minor Changes

- Add standalone WebGL stencil clip support for Phaser 4 Containers via `@number10/phaserjsx/clip`.
- Add `Container#setStencilClip`, `updateStencilClip`, `clearStencilClip`, and `getStencilClipHandle` extension methods with idempotent install/uninstall helpers.
- Add bitmap stencil sources with hard alpha-threshold evaluation alongside the existing fast `roundRect`/`rect` SDF path.
- Export the stencil clip API from the package root and the new `./clip` subpath.

### Patch Changes

- Route internal `overflow="hidden"` clipping through the shared stencil clip extension.
- Keep the rounded-rectangle overflow path on its existing shader path so bitmap support does not add overhead to common View clipping.
- Avoid persistent Graphics objects for internal View backgrounds and cache generated background textures.
- Render View backgrounds through image-backed textures for improved performance.
- Stabilize animated layout invalidation.
- Add extension-pattern documentation for future Phaser prototype extensions.

## 4.0.0

### Major Changes

- **Phaser 4.1.0** — upgraded peer dependency from Phaser 3 to Phaser 4 (breaking)
- Phaser 3 projects should stay on `@number10/phaserjsx@0.6.1`; the 4.x line targets Phaser 4 and no longer aims to preserve Phaser 3 compatibility.
- Overflow masking: replaced `GeometryMask`/`setMask()` with a WebGL stencil-buffer clip; no separate Graphics game object or per-frame world-position tracking needed; supports arbitrary nesting via increment/decrement stencil ops and optional rounded corners via SDF shader
- FX system: replaced `postFX`/`preFX` pipelines with `filters.internal`/`filters.external`; `FXType` changed from `'post'|'pre'` to `'internal'|'external'`
- `Phaser.FX.Controller` renamed to `Phaser.Filters.Controller`
- `ColorMatrix` filter effects now accessed via `colorMatrixFilter.colorMatrix.*`
- `addGlow()` gained a new `scale` parameter (4th argument) in Phaser 4

### Patch Changes

- Replace Phaser 4 overflow masking with a faster WebGL stencil-clip path for `overflow="hidden"` containers, including nested clip support.
- Fix stencil overflow clips when `cornerRadius` is removed from an existing container.
- Chain stencil clipping through Phaser render steps instead of replacing `_renderSteps[0]`, improving compatibility with Phaser filters and other render steps.
- Track actual framebuffer transitions in the stencil/FBO bridge so PostFX and RenderTexture rendering restore stencil state correctly.
- Fix PostFX effects on children inside stencil-clipped containers by patching `gl.bindFramebuffer` to disable the stencil test when entering an off-screen FBO and restore it on return to the main framebuffer.
- Restore long-press and double-tap target resolution when an overlay handles `onTouch` above another interactive target.
- Replace `NodeJS.Timeout` timer state types with `ReturnType<typeof setTimeout>` for cross-runtime type compatibility.
- Update script build/type generation flow to emit declarations for `icon-generator-config` and `vite-plugin-icons`.
- Pre-initialize Phaser 4 filter pipeline in `useFX` to prevent resize on first FX application.

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

- Added typesVersions entries for jsx-runtime and jsx-dev-runtime so older TS resolvers can find the d.ts sub-paths while keeping the existing exports map as-is. This targets the TS “react-jsx” consumer error without altering the runtime bundles.

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

- VDOM patching instead of remounting modal/portal to avoid effects when children change
- add unmountJSX
- Add Momentum and Snap option to ScrollSlider

## 0.2.0

### Minor Changes

- Unified preset and color mode control: `setColorPreset` optionally accepts the target mode, while the new `setColorMode` sets the default mode. Tokens are updated directly, and duplicate listener notifications are eliminated.
