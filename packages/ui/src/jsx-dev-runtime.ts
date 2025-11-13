/**
 * JSX dev runtime (re-exports jsx-runtime for development mode)
 */
import { jsx as jsxProd } from './jsx-runtime'

export { Fragment, jsxs } from './jsx-runtime'
export const jsx = jsxProd
export const jsxDEV = jsxProd
