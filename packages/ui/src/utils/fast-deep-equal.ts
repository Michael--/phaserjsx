import * as equalImport from 'fast-deep-equal'

type EqualFn = (a: unknown, b: unknown) => boolean

// Normalize the CJS export shape for ESM usage.
const equal =
  typeof equalImport === 'function'
    ? (equalImport as unknown as EqualFn)
    : (equalImport as { default: EqualFn }).default

export default equal
