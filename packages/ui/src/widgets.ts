/**
 * VNode factories for JSX usage with native Phaser primitives
 * These create VNode objects that will be mounted by the VDOM system
 */

// Use strings as types to avoid function component mounting
export const View = 'View' as const
export const Text = 'Text' as const
