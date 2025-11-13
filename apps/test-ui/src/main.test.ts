// Placeholder test file
// This ensures the test suite runs successfully
import { describe, expect, it, vi } from 'vitest'
import { Button } from './App'

describe('Button component', () => {
  it('should create a Button component with onClick', () => {
    const mockOnClick = vi.fn()
    const button = Button({ onClick: mockOnClick, children: null })

    expect(button.type).toBe('RexSizer')
    expect(button.props.onPointerdown).toBe(mockOnClick)
  })
})
