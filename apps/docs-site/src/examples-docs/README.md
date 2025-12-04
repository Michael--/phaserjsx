# Documentation Code Examples

This directory contains **executable, type-checked code examples** used in the documentation pages.

## Purpose

- **Single Source of Truth**: Code examples are actual `.ts`/`.tsx` files that are type-checked
- **Compile-Time Validation**: TypeScript catches API changes, breaking changes, and typos
- **Maintainability**: When APIs change, examples fail to compile, forcing docs updates
- **Quality Assurance**: No more outdated or incorrect documentation examples

## Structure

```
examples-docs/
├── tsconfig.json           # Strict TypeScript config with noEmit
├── installation/           # Examples for Installation Guide
│   ├── basic-scene.tsx
│   ├── game-config.ts
│   ├── scene-lifecycle.tsx
│   ├── multi-mount.tsx
│   ├── mount-with-props.tsx
│   ├── dev-config.ts
│   ├── input-config.ts
│   └── test-component.tsx
└── introduction/           # Examples for Introduction
    ├── imperative-example.ts
    └── declarative-example.tsx
```

## Usage in Documentation

Code examples are imported as raw strings and displayed in `CodeBlock` components:

```tsx
import basicSceneCode from '../examples-docs/installation/basic-scene.tsx?raw'

;<CodeBlock language="typescript" title="GameScene.ts">
  {basicSceneCode}
</CodeBlock>
```

## Type Checking

Run type checking on all examples:

```bash
pnpm typecheck:examples
```

This is also part of the main `typecheck` script:

```bash
pnpm typecheck  # Checks both docs site AND examples
```

## Guidelines

### 1. File Naming

- Use descriptive names: `basic-scene.tsx`, `mount-with-props.tsx`
- Match the context: `installation/*.tsx` for installation guide examples

### 2. JSX Import Source

- **PhaserJSX examples**: Add `/** @jsxImportSource @phaserjsx/ui */` at the top
- **Plain TypeScript**: No pragma needed
- **React examples**: Add `/** @jsxImportSource react */` (if needed)

### 3. Exports

- Export main classes/functions for potential reuse
- Keep examples focused and minimal

### 4. Comments

- Add brief comments explaining key concepts
- Keep code readable and self-documenting

## Adding New Examples

1. Create a new `.ts` or `.tsx` file in the appropriate subdirectory
2. Write your example code
3. Run `pnpm typecheck:examples` to verify
4. Import the example in your documentation page:
   ```tsx
   import myExampleCode from '../examples-docs/path/to/my-example.tsx?raw'
   ```
5. Display it in a CodeBlock:
   ```tsx
   <CodeBlock language="typescript" title="MyExample.ts">
     {myExampleCode}
   </CodeBlock>
   ```

## CI Integration

The `typecheck:examples` script runs in CI to catch breaking changes:

```yaml
# .github/workflows/ci.yml
- run: pnpm --filter docs-site typecheck
```

If examples fail to compile, the build fails, ensuring docs stay up-to-date.

## Benefits

✅ **No more stale examples** - Compile errors force updates  
✅ **API changes caught immediately** - TypeScript validates against @phaserjsx/ui  
✅ **Copy-paste ready** - Examples are real, working code  
✅ **Refactoring safe** - Renaming APIs breaks examples, making them discoverable  
✅ **Developer confidence** - Know that docs match reality
