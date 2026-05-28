import type {
  StencilBitmapClipSource,
  StencilBitmapTexture,
  StencilClipSource,
  StencilClipUpdate,
  StencilCornerRadius,
  StencilRoundRectClipSource,
} from './stencil-clip-types'

export type RoundRectMaskState = {
  kind: 'roundRect'
  width: number
  height: number
  offsetX: number
  offsetY: number
  radii: [number, number, number, number]
}

export type BitmapMaskState = {
  kind: 'bitmap'
  texture: StencilBitmapTexture
  frame: string | number | undefined
  width: number | undefined
  height: number | undefined
  offsetX: number
  offsetY: number
  alphaThreshold: number
  invertAlpha: boolean
}

export type MaskState = RoundRectMaskState | BitmapMaskState

function resolveRadii(
  r: number | StencilCornerRadius | undefined
): [number, number, number, number] {
  if (!r) return [0, 0, 0, 0]
  if (typeof r === 'number') return [r, r, r, r]
  return [r.tl ?? 0, r.tr ?? 0, r.br ?? 0, r.bl ?? 0]
}

/** Returns true when a source/update selects the bitmap mask renderer. */
export function isBitmapStencilClipSource(
  source: StencilClipUpdate
): source is Partial<StencilBitmapClipSource> & { kind: 'bitmap' } {
  return source.kind === 'bitmap'
}

function toRoundRectState(source: StencilRoundRectClipSource): RoundRectMaskState {
  return {
    kind: 'roundRect',
    width: source.width,
    height: source.height,
    offsetX: source.offsetX ?? 0,
    offsetY: source.offsetY ?? 0,
    radii: source.kind === 'rect' ? [0, 0, 0, 0] : resolveRadii(source.cornerRadius),
  }
}

function toBitmapState(source: StencilBitmapClipSource): BitmapMaskState {
  return {
    kind: 'bitmap',
    texture: source.texture,
    frame: source.frame,
    width: source.width,
    height: source.height,
    offsetX: source.offsetX ?? 0,
    offsetY: source.offsetY ?? 0,
    alphaThreshold: source.alphaThreshold ?? 0.5,
    invertAlpha: source.invertAlpha ?? false,
  }
}

export function toMaskState(source: StencilClipSource): MaskState {
  return isBitmapStencilClipSource(source) ? toBitmapState(source) : toRoundRectState(source)
}

export function mergeMaskState(current: MaskState, update: StencilClipUpdate): MaskState {
  if (isBitmapStencilClipSource(update)) {
    if (current.kind !== 'bitmap' || update.texture !== undefined) {
      return toBitmapState(update as StencilBitmapClipSource)
    }

    return {
      kind: 'bitmap',
      texture: current.texture,
      frame: update.frame !== undefined ? update.frame : current.frame,
      width: update.width !== undefined ? update.width : current.width,
      height: update.height !== undefined ? update.height : current.height,
      offsetX: update.offsetX !== undefined ? update.offsetX : current.offsetX,
      offsetY: update.offsetY !== undefined ? update.offsetY : current.offsetY,
      alphaThreshold:
        update.alphaThreshold !== undefined ? update.alphaThreshold : current.alphaThreshold,
      invertAlpha: update.invertAlpha !== undefined ? update.invertAlpha : current.invertAlpha,
    }
  }

  if (current.kind === 'bitmap' && update.kind === undefined) {
    const bitmapUpdate = update as Partial<StencilBitmapClipSource>
    return {
      kind: 'bitmap',
      texture: current.texture,
      frame: bitmapUpdate.frame !== undefined ? bitmapUpdate.frame : current.frame,
      width: bitmapUpdate.width !== undefined ? bitmapUpdate.width : current.width,
      height: bitmapUpdate.height !== undefined ? bitmapUpdate.height : current.height,
      offsetX: bitmapUpdate.offsetX !== undefined ? bitmapUpdate.offsetX : current.offsetX,
      offsetY: bitmapUpdate.offsetY !== undefined ? bitmapUpdate.offsetY : current.offsetY,
      alphaThreshold:
        bitmapUpdate.alphaThreshold !== undefined
          ? bitmapUpdate.alphaThreshold
          : current.alphaThreshold,
      invertAlpha:
        bitmapUpdate.invertAlpha !== undefined ? bitmapUpdate.invertAlpha : current.invertAlpha,
    }
  }

  if (current.kind === 'bitmap') {
    return toRoundRectState(update as StencilRoundRectClipSource)
  }

  const roundUpdate = update as Partial<StencilRoundRectClipSource>
  return {
    kind: 'roundRect',
    width: roundUpdate.width !== undefined ? roundUpdate.width : current.width,
    height: roundUpdate.height !== undefined ? roundUpdate.height : current.height,
    offsetX: roundUpdate.offsetX !== undefined ? roundUpdate.offsetX : current.offsetX,
    offsetY: roundUpdate.offsetY !== undefined ? roundUpdate.offsetY : current.offsetY,
    radii:
      roundUpdate.kind === 'rect'
        ? [0, 0, 0, 0]
        : 'cornerRadius' in roundUpdate
          ? resolveRadii(roundUpdate.cornerRadius)
          : current.radii,
  }
}
