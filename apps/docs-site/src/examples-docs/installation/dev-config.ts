/**
 * Development mode configuration
 */
import { DevConfig } from '@phaserjsx/ui'

// In your game initialization
DevConfig.debug.enabled = true // Enable debug mode
DevConfig.warnings.missingKeys = true // Warn about missing keys
DevConfig.warnings.unnecessaryRemounts = true // Warn about unnecessary remounts

export { DevConfig }
