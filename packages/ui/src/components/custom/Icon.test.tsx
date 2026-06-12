import { beforeEach, describe, expect, it, vi } from 'vitest'
import { withHooks, type Ctx, type VNode } from '../../hooks'
import { createElement } from '../../vdom'
import { Icon, type IconLoaderFn } from './Icon'

vi.mock('../../render-context', () => ({
  getContextFromParent: vi.fn(() => ({
    getCurrent: vi.fn(() => null),
    setCurrent: vi.fn(),
    deferLayout: vi.fn(),
    setViewport: vi.fn(),
    getTextureScene: vi.fn(),
    isShutdown: vi.fn(() => false),
  })),
}))

const useSVGTexture = vi.fn((_key: string, _svg: string, _width?: number, _height?: number) => true)

vi.mock('../../hooks-svg', () => ({
  useSVGTexture: (key: string, svg: string, width?: number, height?: number) =>
    useSVGTexture(key, svg, width, height),
}))

const mockParent = {
  scene: {
    sys: {
      settings: {
        active: true,
      },
    },
  },
}

function makeMockCtx(): Ctx {
  return {
    index: 0,
    slots: [],
    effects: [],
    cleanups: [],
    vnode: createElement('div', {}),
    componentVNode: createElement('component', {}),
    parent: mockParent,
    function: vi.fn(() => createElement('div', {})),
    isFactory: false,
    disposed: true,
  } as unknown as Ctx
}

function renderIcon(
  ctx: Ctx,
  type: 'chevron-down' | 'chevron-up',
  loader: IconLoaderFn<'chevron-down' | 'chevron-up'>
): VNode {
  return withHooks(ctx, () => Icon({ type, loader, size: 14 })) as VNode
}

async function runEffects(ctx: Ctx): Promise<void> {
  for (const effect of ctx.effects) {
    effect()
  }

  await Promise.resolve()
  await Promise.resolve()
}

describe('Icon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not register the previous SVG under the next icon texture key', async () => {
    const ctx = makeMockCtx()
    const loader = vi.fn(async (type: 'chevron-down' | 'chevron-up') => `${type}-svg`)

    renderIcon(ctx, 'chevron-down', loader)
    await runEffects(ctx)

    const loadedDown = renderIcon(ctx, 'chevron-down', loader)
    expect(loadedDown.props?.texture).toBe('icon-chevron-down-14')
    expect(useSVGTexture).toHaveBeenLastCalledWith(
      'icon-chevron-down-14',
      'chevron-down-svg',
      14,
      14
    )

    useSVGTexture.mockClear()

    const pendingUp = renderIcon(ctx, 'chevron-up', loader)
    expect(pendingUp.props?.texture).toBe('')
    expect(useSVGTexture).not.toHaveBeenCalled()

    await runEffects(ctx)

    const loadedUp = renderIcon(ctx, 'chevron-up', loader)
    expect(loadedUp.props?.texture).toBe('icon-chevron-up-14')
    expect(useSVGTexture).toHaveBeenLastCalledWith('icon-chevron-up-14', 'chevron-up-svg', 14, 14)
  })
})
