import * as Phaser from 'phaser'
import {
  applyStencilClip,
  clearStencilClip,
  getStencilClipHandle,
  type StencilClipHandle,
  type StencilClipSource,
  type StencilClipUpdate,
} from './stencil-clip'

type AnyFn = (...args: unknown[]) => unknown

interface ExtensionHandle {
  restore(): void
}

function addMethod<T extends object, K extends PropertyKey>(
  proto: T,
  methodName: K,
  fn: unknown
): ExtensionHandle {
  const hadOwn = Object.prototype.hasOwnProperty.call(proto, methodName)
  const previous = (proto as Record<PropertyKey, unknown>)[methodName]

  if (!hadOwn) {
    ;(proto as Record<PropertyKey, unknown>)[methodName] = fn
  }

  return {
    restore: () => {
      if (!hadOwn) {
        delete (proto as Record<PropertyKey, unknown>)[methodName]
      } else {
        ;(proto as Record<PropertyKey, unknown>)[methodName] = previous
      }
    },
  }
}

function wrapMethod<T extends object, K extends keyof T & string>(
  proto: T,
  methodName: K,
  wrapper: (original: AnyFn, self: unknown, ...args: unknown[]) => unknown
): ExtensionHandle {
  const original = proto[methodName] as unknown as AnyFn

  if (typeof original !== 'function') {
    return { restore() {} }
  }

  const wrapped: AnyFn = function (this: unknown, ...args: unknown[]) {
    return wrapper(original, this, ...args)
  }

  ;(proto as Record<string, unknown>)[methodName] = wrapped

  return {
    restore: () => {
      ;(proto as Record<string, unknown>)[methodName] = original
    },
  }
}

let installed = false
let restoreHandles: ExtensionHandle[] = []

function canCreateStencilClipSource(source: StencilClipUpdate): source is StencilClipSource {
  if (source.kind === 'bitmap') {
    return source.texture !== undefined
  }

  return source.width !== undefined && source.height !== undefined
}

/** Installs stencil clip helpers on Phaser.GameObjects.Container.prototype. */
export function installStencilClipExtension(): void {
  if (installed) return
  installed = true

  const proto = Phaser.GameObjects.Container.prototype as Phaser.GameObjects.Container &
    Record<string, unknown>

  restoreHandles.push(
    addMethod(
      proto,
      'setStencilClip',
      function (this: Phaser.GameObjects.Container, source: StencilClipSource) {
        applyStencilClip(this, source)
        return this
      }
    )
  )

  restoreHandles.push(
    addMethod(
      proto,
      'updateStencilClip',
      function (this: Phaser.GameObjects.Container, source: StencilClipUpdate) {
        const handle = getStencilClipHandle(this)
        if (handle) handle.update(source)
        else if (canCreateStencilClipSource(source)) applyStencilClip(this, source)
        return this
      }
    )
  )

  restoreHandles.push(
    addMethod(proto, 'clearStencilClip', function (this: Phaser.GameObjects.Container) {
      clearStencilClip(this)
      return this
    })
  )

  restoreHandles.push(
    addMethod(proto, 'getStencilClipHandle', function (this: Phaser.GameObjects.Container) {
      return getStencilClipHandle(this)
    })
  )

  restoreHandles.push(
    wrapMethod(proto, 'destroy', (original, self, ...args) => {
      clearStencilClip(self as Phaser.GameObjects.Container)
      return original.apply(self, args)
    })
  )
}

/** Restores Phaser prototypes to their previous state. Intended for tests/HMR. */
export function uninstallStencilClipExtension(): void {
  for (const handle of [...restoreHandles].reverse()) handle.restore()
  restoreHandles = []
  installed = false
}

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface Container {
        setStencilClip(source: StencilClipSource): this
        updateStencilClip(source: StencilClipUpdate): this
        clearStencilClip(): this
        getStencilClipHandle(): StencilClipHandle | undefined
      }
    }
  }
}
