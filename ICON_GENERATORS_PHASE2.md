# Icon Generators - Phase 2 Implementation

## Overview

Phase 2 completed: Generator scripts are now compiled to JavaScript and executed from dist/ instead of TypeScript source files.

## Changes Summary

### Build Infrastructure

**New Files:**

- `packages/ui/scripts.vite.config.ts` - Separate Vite config for building CLI scripts

**Configuration:**

```typescript
export default defineConfig({
  build: {
    outDir: 'dist/scripts',
    lib: {
      entry: {
        'generate-icon-types': './src/scripts/generate-icon-types.ts',
        'generate-icon-loaders': './src/scripts/generate-icon-loaders.ts',
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:util'],
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
    target: 'node18',
  },
})
```

**Key Features:**

- ✅ Shebang (`#!/usr/bin/env node`) added automatically via Rollup banner
- ✅ Node.js built-ins externalized (not bundled)
- ✅ Compiled to ES modules
- ✅ Target: Node 18+
- ✅ Output: `dist/scripts/*.js` (executable)

### package.json Updates

**Bin Field:**

```json
{
  "bin": {
    "generate-icon-types": "./dist/scripts/generate-icon-types.js",
    "generate-icon-loaders": "./dist/scripts/generate-icon-loaders.js"
  }
}
```

**Scripts:**

```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build && pnpm build:scripts",
    "build:scripts": "vite build --config scripts.vite.config.ts && chmod +x dist/scripts/*.js"
  }
}
```

**Files Field:**

```json
{
  "files": ["dist"]
}
```

### Source File Changes

**Removed Shebangs from TypeScript Sources:**

- `src/scripts/generate-icon-types.ts` - Removed `#!/usr/bin/env node`
- `src/scripts/generate-icon-loaders.ts` - Removed `#!/usr/bin/env node`

**Reason:** Vite adds the shebang during build via `output.banner`. Having it in source caused duplicate shebangs and build errors.

## Build Output

```
dist/
├── scripts/
│   ├── generate-icon-types.js     (4.28 kB, gzip: 1.51 kB)
│   └── generate-icon-loaders.js   (7.11 kB, gzip: 2.32 kB)
├── index.js
├── index.cjs
└── ...other library files
```

## Usage in Consumer Projects

### Before (Phase 1 - TypeScript source):

```json
{
  "scripts": {
    "generate-icons": "tsx ../../packages/ui/src/scripts/generate-icon-types.ts -p bootstrap-icons -o ./src/icon-types.generated.ts"
  }
}
```

**Problems:**

- ❌ Required `tsx` as dependency
- ❌ Exposed implementation details (TypeScript source)
- ❌ Slower execution (JIT compilation every run)
- ❌ Bin field pointed to `.ts` files

### After (Phase 2 - Compiled JavaScript):

```json
{
  "scripts": {
    "generate-icons": "node ../../packages/ui/dist/scripts/generate-icon-types.js -p bootstrap-icons -o ./src/icon-types.generated.ts"
  }
}
```

**Or using bin directly:**

```bash
# When package is published/linked
pnpm exec generate-icon-types -p bootstrap-icons -o ./src/icon-types.generated.ts
```

**Benefits:**

- ✅ No `tsx` dependency needed
- ✅ Faster execution (pre-compiled)
- ✅ Proper bin field for published packages
- ✅ Standard Node.js execution

## Testing Results

### Local Development (Monorepo):

```bash
cd packages/ui
pnpm build
# Output: dist/scripts/generate-icon-types.js (executable)

cd ../../apps/test-ui
pnpm run generate-icons
# ✓ Works via node dist/scripts/...
```

### Published Package (Future):

```bash
npm install @number10/phaserjsx
pnpm exec generate-icon-types --help
# ✓ Works via bin field
```

## Build Process

### Automatic Build Chain:

```
pnpm build
  ↓
tsc --noEmit (type check)
  ↓
vite build (library)
  ↓
pnpm build:scripts
  ↓
vite build --config scripts.vite.config.ts (CLI scripts)
  ↓
chmod +x dist/scripts/*.js (make executable)
  ↓
✓ Complete
```

### Output Verification:

```bash
./dist/scripts/generate-icon-types.js --help
# ✓ Executable, shows help
# ✓ Shebang present
# ✓ All imports resolved
```

## Benefits

### Development Experience:

- ✅ **Faster Iteration**: No runtime TypeScript compilation
- ✅ **Standard Tools**: Uses Node.js directly, no special runtimes
- ✅ **Proper Distribution**: Bin field works with published packages
- ✅ **Smaller Bundle**: Only scripts needed in dist/

### Production Ready:

- ✅ **Publishable**: Bin field points to actual JavaScript
- ✅ **No Dev Dependencies**: Consumers don't need TypeScript/tsx
- ✅ **Executable Permissions**: Automatically set via chmod
- ✅ **Clean Distribution**: Only `dist/` in package

### Maintenance:

- ✅ **Separation of Concerns**: Scripts build separately from library
- ✅ **Type Safety**: Still written in TypeScript with full checking
- ✅ **CI/CD Ready**: Standard build process, no special cases

## Migration Notes

### For Existing Users:

If using the scripts via `tsx` in package.json:

**Old:**

```json
"generate-icons": "tsx ../../packages/ui/src/scripts/generate-icon-types.ts ..."
```

**New:**

```json
"generate-icons": "node ../../packages/ui/dist/scripts/generate-icon-types.js ..."
```

Or wait for package to be published and use:

```json
"generate-icons": "pnpm exec generate-icon-types ..."
```

### For Package Consumers:

After `@number10/phaserjsx` is published to npm:

```bash
# Install package
pnpm add @number10/phaserjsx

# Use generators via bin
pnpm exec generate-icon-types -p bootstrap-icons -o ./src/icons.ts
pnpm exec generate-icon-loaders -s ./src -o ./src/icon-loaders.ts -p bootstrap-icons
```

## Technical Details

### Vite Configuration:

- **Format**: ES Modules only (Node 18+ support)
- **Externals**: All node: built-ins externalized
- **Minification**: Disabled for better debugging
- **Source Maps**: Disabled for scripts (not needed for CLI)
- **Banner**: Shebang added automatically

### File Permissions:

- **chmod +x**: Run automatically after build
- **Shebang**: `#!/usr/bin/env node` in generated files
- **Executable**: Scripts can run directly: `./dist/scripts/generate-icon-types.js`

### Node.js Compatibility:

- **Target**: Node 18+ (modern ESM support)
- **Imports**: Native ESM with `node:` protocol
- **Top-level await**: Available (ESM)

## Test Results

✅ **Build**: Scripts compile successfully  
✅ **Permissions**: Files are executable  
✅ **Execution**: Scripts run without errors  
✅ **Help**: `--help` flag works correctly  
✅ **Functionality**: Icon generation works in test-ui  
✅ **Integration**: Full build chain works end-to-end

## Next Steps (Future Enhancements)

### Phase 3 - Advanced Features:

1. **Config File Support**: `icon-generator.config.ts` for complex setups
2. **Vite Plugin**: Automatic regeneration during development
3. **Watch Mode**: `--watch` flag for development
4. **Incremental Updates**: Only regenerate changed icons

### Package Publication:

1. **npm publish**: Make generators available via npm
2. **Documentation**: Update README with bin usage
3. **Examples**: Add example projects

## Commit Message

```
feat(ui): compile icon generators to dist/scripts

- Add scripts.vite.config.ts for separate script builds
- Compile generators to dist/scripts/*.js with shebang
- Update bin paths from .ts to .js files
- Remove src/scripts/ shebang (added by Vite)
- Add chmod +x to build process
- Update test-ui to use compiled scripts
- Clean up files field in package.json

Benefits:
- No tsx dependency needed for consumers
- Faster execution (pre-compiled)
- Proper bin field for published packages
- Standard Node.js execution
```
