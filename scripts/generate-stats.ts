import * as fs from 'fs'
import * as path from 'path'

/**
 * Recursively finds all TypeScript and TSX files in the given directory
 * @param dir - The directory to search in
 * @returns Array of file paths
 */
function findTsFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
      files.push(...findTsFiles(fullPath))
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Generates statistics for a single file
 * @param filePath - The path to the file
 * @returns Object with file stats
 */
function getFileStats(filePath: string): { file: string; lines: number; size: number } {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').length
  const size = fs.statSync(filePath).size
  return { file: filePath, lines, size }
}

/**
 * Main function to generate source statistics
 */
function generateStats() {
  const rootDir = path.resolve('.')
  const tsFiles = findTsFiles(rootDir)

  const stats = tsFiles.map(getFileStats).sort((a, b) => b.lines - a.lines)

  let markdown = '# Source Statistics\n\n'
  markdown += 'Statistics over all TypeScript and TSX source files.\n\n'
  markdown += '| File | Lines | Size (bytes) |\n'
  markdown += '|------|-------|--------------|\n'

  for (const stat of stats) {
    markdown += `| ${stat.file} | ${stat.lines} | ${stat.size} |\n`
  }

  const distDir = path.join(rootDir, 'dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
  }

  const outputPath = path.join(distDir, 'stats.md')
  fs.writeFileSync(outputPath, markdown, 'utf-8')

  console.log(`Statistics generated at ${outputPath}`)
}

// Run the script
generateStats()
