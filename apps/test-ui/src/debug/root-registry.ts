/**
 * Helper to get root VNode from scene
 * Reads __rootVNode stored by mountJSX without modifying VDOM
 */

import type { VNode } from '@number10/phaserjsx'
import Phaser from 'phaser'

/**
 * Gets root VNode from a Phaser scene
 * @param scene - Phaser scene
 * @returns Root VNode or undefined
 */
export function getRootVNodeFromScene(scene: Phaser.Scene): VNode | undefined {
  return (scene as unknown as { __rootVNode?: VNode }).__rootVNode
}

/**
 * Gets root VNode from active scene in game instance
 * @param game - Phaser game instance
 * @returns Root VNode or undefined
 */
export function getRootVNodeFromGame(game: Phaser.Game): VNode | undefined {
  const scene = game.scene.getScenes(true)[0] // Get first active scene
  return scene ? getRootVNodeFromScene(scene) : undefined
}
