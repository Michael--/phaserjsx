import type { CiRunnerConfig } from '@number10/ci-runner-cli/types'

const config = {
  continueOnError: true,
  cwd: '.',
  env: {
    FORCE_COLOR: '1',
  },
  output: {
    format: 'pretty',
    verbose: false,
  },
  watch: {
    exclude: ['.pnpm-store', '.parcel-cache', '.husky', 'dist/**'],
  },
  steps: [
    {
      id: 'build',
      name: 'Build',
      command: 'pnpm run build',
    },
    {
      id: 'typecheck',
      name: 'Typecheck',
      command: 'pnpm run typecheck',
    },
    {
      id: 'lint',
      name: 'Lint',
      command: 'pnpm run lint',
    },
    {
      id: 'spell',
      name: 'Spellcheck',
      command: 'pnpm -r --if-present run spell',
    },
    {
      id: 'unit-tests',
      name: 'Unit Tests',
      command: 'pnpm run test',
    },
  ],
  targets: [
    {
      id: 'quick',
      name: 'Quick Checks',
      includeStepIds: ['typecheck', 'lint', 'spell', 'unit-tests'],
    },
    {
      id: 'build',
      name: 'Build',
      includeStepIds: ['build'],
    },
  ],
} satisfies CiRunnerConfig

export default config
