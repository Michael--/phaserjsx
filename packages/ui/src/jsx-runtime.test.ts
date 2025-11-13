/**
 * Tests for JSX runtime functionality
 * Tests Fragment and jsx functions
 */
import { describe, it, expect } from 'vitest'
import { Fragment, jsx, jsxs } from './jsx-runtime'

describe('JSX Runtime', () => {
  describe('Fragment', () => {
    it('should return children or null', () => {
      const children = [{ type: 'div', props: {}, children: [] }]
      const result = Fragment({ children })

      expect(result).toEqual(children)
    })

    it('should return null when no children', () => {
      const result = Fragment({})

      expect(result).toBeNull()
    })
  })

  describe('jsx', () => {
    it('should create VNode for host components', () => {
      const vnode = jsx('div', { id: 'test' })

      expect(vnode).toEqual({
        type: 'div',
        props: { id: 'test' },
        children: [],
      })
    })

    it('should handle children in props', () => {
      const child1 = { type: 'span', props: {}, children: [] }
      const child2 = { type: 'p', props: {}, children: [] }

      const vnode = jsx('div', { id: 'parent', children: [child1, child2] })

      expect(vnode).toEqual({
        type: 'div',
        props: { id: 'parent' },
        children: [child1, child2],
      })
    })
  })

  describe('jsxs', () => {
    it('should be the same as jsx', () => {
      const vnode1 = jsx('div', { id: 'test' })
      const vnode2 = jsxs('div', { id: 'test' })

      expect(vnode1).toEqual(vnode2)
    })
  })
})
