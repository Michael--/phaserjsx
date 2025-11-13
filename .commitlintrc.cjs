// Commitlint configuration
// Enforces conventional commit format
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0], // Deactivate  100-character limit for body lines
  },
}
