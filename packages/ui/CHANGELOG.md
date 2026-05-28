# @number10/phaserjsx

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
