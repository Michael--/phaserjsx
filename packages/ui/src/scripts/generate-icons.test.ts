import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { generateLoaders } from './generate-icons'
import type { IconGeneratorConfig } from './icon-generator-config'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('generateLoaders', () => {
  it('detects IconType literals and JSX type expression literals', async () => {
    const projectDir = await mkdtemp(join(tmpdir(), 'phaserjsx-icons-'))
    tempDirs.push(projectDir)

    await writeFile(
      join(projectDir, 'Example.tsx'),
      `/** @jsxImportSource @number10/phaserjsx */
import { Icon, type IconType } from '@/components/Icon'

const up: IconType = 'chevron-up'
const down: IconType = 'chevron-down'

export function Example({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <Icon type={isOpen ? up : down} size={14} />
      <Icon type={isOpen ? 'chevron-up' : 'chevron-down'} size={14} />
    </>
  )
}
`,
      'utf-8'
    )

    const output = './icon-loaders.generated.ts'
    const iconNames = ['chevron-down', 'chevron-up']
    const config: IconGeneratorConfig = {
      source: {
        package: 'bootstrap-icons',
        iconsPath: 'icons',
      },
      loaders: {
        enabled: true,
        output,
        scanDir: '.',
        componentNames: ['Icon'],
        validate: true,
      },
    }

    await generateLoaders(config, projectDir, {
      iconNames,
      sourceIconSets: new Map([[0, new Set(iconNames)]]),
    })

    const generated = await readFile(join(projectDir, output), 'utf-8')

    expect(generated).toContain(
      "'chevron-down': () => import('bootstrap-icons/icons/chevron-down.svg?raw')"
    )
    expect(generated).toContain(
      "'chevron-up': () => import('bootstrap-icons/icons/chevron-up.svg?raw')"
    )
  })
})
