// lint-staged configuration
// Runs linters and formatters on staged files before commit
module.exports = {
  '*.{ts,tsx,js,json,md}': ['prettier -w'],
};
