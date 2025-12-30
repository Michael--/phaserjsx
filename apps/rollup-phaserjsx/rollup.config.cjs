const path = require('path')
const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')

module.exports = {
  input: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    file: path.resolve(__dirname, 'dist/bundle.js'),
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      browser: true,
      extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      sourceMap: true,
    }),
  ].filter(Boolean),
}
