# GitHub Copilot Instructions

## Code Style & Language

- **All code comments MUST be in English** - no exceptions
- **All JSDoc comments MUST be in English**
- **Variable names, function names, class names**: English only
- **Chat/conversation**: Can be in any language requested by the user (e.g., German, English)

## Documentation Requirements

- **JSDoc headers are MANDATORY** for all:
  - Functions (including arrow functions)
  - Classes
  - Interfaces
  - Type definitions
  - Exported constants
- Include `@param`, `@returns`, `@throws` where applicable
- Add brief description of purpose

Example:

```typescript
/**
 * Generates IPC channel definitions from schema
 * @param schema - The IPC schema configuration
 * @returns Generated TypeScript code as string
 * @throws {ValidationError} If schema is invalid
 */
export function generateIpcCode(schema: IpcSchema): string {
  // implementation
}
```

## Response Style

- **Keep responses concise and to the point**
- **Omit unnecessary explanations** unless explicitly requested
- **No boilerplate comments** like "here's the code" or "I've added..."
- **Show, don't tell** - provide working code directly
- **Remove redundant information**
- Focus on what matters

## Code Generation

- Use **TypeScript strict mode** features
- Prefer **const** over let
- Use **arrow functions** for callbacks
- Implement **proper error handling**
- Follow **functional programming** principles where appropriate
- **No any types** unless absolutely necessary (use unknown instead)
- Use **explicit return types** for functions
- When you did code changes,always provide a short commit message summarizing the changes made can be used by copy paste into commit

## Testing

- Generate **Vitest tests** when creating new functions
- Include **edge cases and error scenarios**
- Use **descriptive test names**

## Project-Specific

- This is a **TypeScript/Electron monorepo**
- Uses **pnpm** for package management
- Uses **Vite** for building
- Uses **Vitest** for testing
- **electron-ipc** package: Code generator library (publishable)
- **test-app** package: Electron test environment (private)

## Commits

- Follow **Conventional Commits** format
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- Keep commit messages **concise and clear**
