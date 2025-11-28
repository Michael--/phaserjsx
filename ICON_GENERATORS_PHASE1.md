# Icon Generators - Phase 1 Improvements

## Overview

Phase 1 migration completed: Icon generators are now more flexible and configurable while maintaining their current architecture.

## Changes Summary

### generate-icon-loaders.ts

**New Features:**

- ✅ **Multiple Component Names**: `--componentNames` option to scan for different component names
  - Supports patterns like `Icon`, `BootstrapIcon`, or any custom wrapper
  - Handles future renames gracefully
- ✅ **Validation**: `--typesFile` option for cross-checking icon usage
  - Loads available icons from generated types file
  - Warns about icons used in code but not available
  - Filters out invalid icons from generated loaders

**Usage Examples:**

```bash
# Single component name (default)
generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons

# Multiple component names
generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons \
  --componentNames Icon --componentNames BootstrapIcon --componentNames CustomIcon

# With validation
generate-icon-loaders -s ./src -o ./src/icon-loaders.generated.ts -p bootstrap-icons \
  --componentNames Icon --componentNames BootstrapIcon \
  -t ./src/icon-types.generated.ts
```

**CLI Options:**

- `-s, --source <path>` - Source directory to scan
- `-o, --output <path>` - Output file path
- `-p, --package <name>` - Icon package name
- `-i, --iconsPath <path>` - Relative path to icons in package (default: icons)
- `-c, --componentName <name>` - Single component name (default: Icon)
- `--componentNames <names...>` - Multiple component names (repeatable)
- `-t, --typesFile <path>` - Types file for validation

**Output Example:**

```
📁 Scanning directory: /path/to/src
🔍 Looking for components: Icon, BootstrapIcon
✓ Loaded 2078 available icons from ./src/icon-types.generated.ts
📄 Found 62 TypeScript files
⚠️  Found 1 icons not in types file:
   nonexistent-icon
✓ Found 12 unique icons
✓ Generated: /path/to/icon-loaders.generated.ts
✓ Registered 12 icon loaders
```

### generate-icon-types.ts

**New Features:**

- ✅ **Local Directory Support**: `--directory` option to scan local SVG folders
  - Alternative to npm package scanning
  - Works with any directory containing SVG files
  - No need to publish icons to npm

**Usage Examples:**

```bash
# From npm package (existing)
generate-icon-types -p bootstrap-icons -o ./src/icon-types.generated.ts

# From local directory (new)
generate-icon-types -d ./public/icons -o ./src/icon-types.generated.ts

# From local directory with custom type name
generate-icon-types -d ./assets/svg -o ./src/custom-icons.ts -t CustomIconType
```

**CLI Options:**

- `-p, --package <name>` - Icon package name (e.g., bootstrap-icons)
- `-d, --directory <path>` - Local directory with SVG files (alternative to --package)
- `-o, --output <path>` - Output file path
- `-t, --typeName <name>` - TypeScript type name (default: IconType)
- `-i, --iconsPath <path>` - Relative path to icons in package (default: icons)

## Benefits

### Flexibility

- ✅ Supports component name changes (Icon → BootstrapIcon)
- ✅ Scans multiple component variants simultaneously
- ✅ Works with local SVG directories
- ✅ No hardcoded patterns

### Validation

- ✅ Catches typos and invalid icon references at build time
- ✅ Prevents runtime errors from missing icons
- ✅ Clear warnings about what needs to be fixed

### Developer Experience

- ✅ Better error messages
- ✅ Comprehensive help text
- ✅ Flexible configuration
- ✅ Works out-of-the-box with existing setups

## test-ui Configuration

Updated `package.json` script in test-ui:

```json
{
  "scripts": {
    "generate-icons": "tsx ../../packages/ui/src/scripts/generate-icon-types.ts -p bootstrap-icons -o ./src/components/icon-types.generated.ts",
    "generate-icon-loaders": "tsx ../../packages/ui/src/scripts/generate-icon-loaders.ts -s ./src -o ./src/components/icon-loaders.generated.ts -p bootstrap-icons --componentNames Icon --componentNames BootstrapIcon -t ./src/components/icon-types.generated.ts"
  }
}
```

## Implementation Details

### Pattern Detection

The loader generator detects icons using multiple patterns:

1. **JSX type prop**: `<Icon type="calendar" />`, `<BootstrapIcon type="gear" />`
2. **Themed fallback**: `themed.actionIcon ?? 'default-icon'`
3. **Object literals**: `icon: 'name'`, `iconType: 'name'`

All patterns now work with multiple component names.

### Validation Logic

1. Parse types file for available icons (union type extraction)
2. Scan source code for used icons
3. Compare used vs. available
4. Warn about invalid icons
5. Generate loaders only for valid icons

### Type Safety

TypeScript still provides type safety at compile time:

```typescript
// ✅ Type error if icon doesn't exist in IconType
<Icon type="invalid-icon" />

// ⚠️ Warning at generation time if bypassed
<Icon type={'invalid-icon' as any} />
```

## Next Steps (Phase 2)

Future improvements could include:

1. **Config File**: `icon-generator.config.ts` for complex setups
2. **Custom Patterns**: User-defined regex patterns
3. **Build Integration**: Vite plugin for automatic regeneration
4. **Bin Paths**: Compile scripts to dist/ and update package.json bin field

## Testing

All tests passing:

- ✅ packages/ui build: Success
- ✅ Test suite: 247 passing | 1 skipped
- ✅ Icon generator: Multiple component names working
- ✅ Validation: Detecting invalid icons
- ✅ Local directory: Ready to use

## Commit Message

```
feat(ui): enhance icon generators with flexibility and validation

- Add --componentNames option to scan multiple component patterns
- Add --typesFile validation to detect invalid icon usage
- Add --directory option to scan local SVG folders
- Improve error messages and help text
- Support component renames (Icon → BootstrapIcon)
```
