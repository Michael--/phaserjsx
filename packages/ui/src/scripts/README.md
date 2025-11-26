# Icon Generation Scripts

Parameterized CLI tools for generating TypeScript types and loaders for icon libraries.

## Scripts

### generate-icon-types

Generates TypeScript union types for all icons in an icon library.

**Usage:**

```bash
tsx generate-icon-types.ts \
  --package bootstrap-icons \
  --output ./src/types/icons.ts \
  --typeName IconType \
  --iconsPath icons
```

**Options:**

- `-p, --package <name>` - Icon package name (e.g. `bootstrap-icons`)
- `-o, --output <path>` - Output file path (e.g. `./src/types/icons.ts`)
- `-t, --typeName <name>` - TypeScript type name (default: `IconType`)
- `-i, --iconsPath <path>` - Relative path to icons in package (default: `icons`)

**Example:**

```bash
pnpm exec tsx generate-icon-types.ts \
  -p bootstrap-icons \
  -o ./src/components/icon-types.generated.ts
```

### generate-icon-loaders

Scans source code for icon usage and generates a loader registry.

**Usage:**

```bash
tsx generate-icon-loaders.ts \
  --source ./src \
  --output ./src/components/icon-loaders.generated.ts \
  --package bootstrap-icons \
  --componentName Icon
```

**Options:**

- `-s, --source <path>` - Source directory to scan (e.g. `./src`)
- `-o, --output <path>` - Output file path
- `-p, --package <name>` - Icon package name (e.g. `bootstrap-icons`)
- `-c, --componentName <name>` - Icon component name (default: `Icon`)
- `-i, --iconsPath <path>` - Relative path to icons in package (default: `icons`)

**Example:**

```bash
pnpm exec tsx generate-icon-loaders.ts \
  -s ./src \
  -o ./src/components/icon-loaders.generated.ts \
  -p bootstrap-icons
```

## Usage in package.json

```json
{
  "scripts": {
    "generate-icons": "tsx ../../packages/ui/scripts/generate-icon-types.ts -p bootstrap-icons -o ./src/components/icon-types.generated.ts",
    "generate-icon-loaders": "tsx ../../packages/ui/scripts/generate-icon-loaders.ts -s ./src -o ./src/components/icon-loaders.generated.ts -p bootstrap-icons"
  }
}
```

## As Installed Package

When `@phaserjsx/ui` is installed as an npm package:

```json
{
  "scripts": {
    "generate-icons": "generate-icon-types -p bootstrap-icons -o ./src/types/icons.ts",
    "generate-icon-loaders": "generate-icon-loaders -s ./src -o ./src/loaders/icons.ts -p bootstrap-icons"
  }
}
```

## Workflow

1. **Generate types** - All available icon names as TypeScript type

   ```bash
   pnpm run generate-icons
   ```

2. **Use icons in code**

   ```tsx
   <Icon type="heart-fill" size={32} />
   ```

3. **Generate loaders** - Scans code and creates registry

   ```bash
   pnpm run generate-icon-loaders
   ```

4. **Build** - Only used icons are bundled
   ```bash
   pnpm run build
   ```

## Benefits

- ✅ Type safety for all icons in the library
- ✅ Only used icons in the bundle
- ✅ Automatic code analysis
- ✅ Lazy loading + code-splitting
- ✅ Reusable for any icon library
