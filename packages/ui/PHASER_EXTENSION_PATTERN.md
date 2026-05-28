# Phaser Extension Pattern

This template demonstrates a generic, reusable pattern for extending Phaser prototypes with custom functionality, safely wrapping existing methods, and optionally restoring everything afterward.

## Goal

- Install extensions once and idempotently
- Cleanly add new methods to prototypes
- Extend existing methods without losing core behavior
- Augment TypeScript types so the API feels native
- Provide optional restore support for tests and hot reload

## 1) Utility: Add, Wrap, Restore

```ts
import * as Phaser from 'phaser'

type AnyFn = (...args: unknown[]) => unknown

interface ExtensionHandle {
  restore: () => void
}

/**
 * Adds a method to a prototype if it does not exist yet.
 * Returns a restore handle for tests or hot-reload scenarios.
 */
export function addMethod<T extends object, K extends PropertyKey>(
  proto: T,
  methodName: K,
  fn: AnyFn
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

/**
 * Wraps an existing prototype method while preserving original behavior.
 * Wrapper decides when/how to call original.
 */
export function wrapMethod<T extends object, K extends keyof T & string>(
  proto: T,
  methodName: K,
  wrapper: (original: AnyFn, ...args: unknown[]) => unknown
): ExtensionHandle {
  const original = proto[methodName] as unknown as AnyFn

  if (typeof original !== 'function') {
    throw new Error(`Cannot wrap method "${methodName}": not a function`)
  }

  const wrapped: AnyFn = function (this: unknown, ...args: unknown[]) {
    return wrapper(original.bind(this), ...args)
  }

  ;(proto as Record<string, unknown>)[methodName] = wrapped

  return {
    restore: () => {
      ;(proto as Record<string, unknown>)[methodName] = original
    },
  }
}
```

## 2) Installation: Once and Idempotent

```ts
import * as Phaser from 'phaser'
import { addMethod, wrapMethod } from './phaser-extension-utils'

let installed = false
let restoreHandles: Array<{ restore: () => void }> = []

/**
 * Installs custom Phaser extensions once.
 * Safe to call multiple times.
 */
export function installGameObjectExtensions(): void {
  if (installed) return
  installed = true

  const proto = Phaser.GameObjects.GameObject.prototype as Record<string, unknown>

  restoreHandles.push(
    addMethod(proto, 'setDebugTag', function (this: Phaser.GameObjects.GameObject, tag: string) {
      // Store custom metadata directly on the object.
      ;(this as unknown as { __debugTag?: string }).__debugTag = tag
      return this
    })
  )

  restoreHandles.push(
    wrapMethod(proto, 'destroy', (original, ...args) => {
      // Custom cleanup hook before default destroy.
      // Place extension cleanup here (buffers, listeners, caches).
      return original(...args)
    })
  )
}

/**
 * Optional teardown for test environments or hot-reload.
 */
export function uninstallGameObjectExtensions(): void {
  for (const h of restoreHandles) h.restore()
  restoreHandles = []
  installed = false
}
```

## 3) TypeScript Augmentation

```ts
import 'phaser'

declare module 'phaser' {
  namespace Phaser.GameObjects {
    interface GameObject {
      setDebugTag?: (tag: string) => this
    }
  }
}
```

## 4) Usage

```ts
// Call once during boot/init:
installGameObjectExtensions()

// Directly available everywhere afterward:
someGameObject.setDebugTag?.('inventory-item')
```

## 5) Best Practices

1. Always make installation idempotent.
2. Never replace original methods completely — wrap them instead.
3. Always return `this` for chainable APIs.
4. Add guards where necessary (renderer type, scene availability, destroyed state).
5. Provide a restore path for tests and HMR.
6. Handle Phaser version differences gracefully with no-ops or warnings instead of crashes.

## Optional: Mini Checklist for New Extensions

- Target class selected (GameObject, Container, Sprite, Text, Scene)
- Install hook added (Boot/Init)
- Installed flag implemented
- TypeScript augmentation added
- Restore support available for tests/HMR
- Verified behavior in both WebGL and Canvas
