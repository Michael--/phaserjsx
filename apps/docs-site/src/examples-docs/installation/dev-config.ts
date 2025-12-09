/**
 * Development mode configuration
 */
import { DevConfig } from '@number10/phaserjsx'

// In your game initialization
DevConfig.debug.enabled = true // Enable debug mode
DevConfig.warnings.missingKeys = true // Warn about missing keys
DevConfig.warnings.unnecessaryRemounts = false // Warn about unnecessary remounts

export { DevConfig }
