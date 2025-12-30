const http = require('http')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const PORT = Number.parseInt(process.env.PORT || '1238', 10)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const ext = path.extname(filePath)
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream')
    res.end(data)
  })
}

function resolvePath(urlPath) {
  if (urlPath === '/' || urlPath === '/index.html') {
    return path.join(ROOT_DIR, 'index.html')
  }

  if (urlPath.startsWith('/dist/')) {
    return path.join(ROOT_DIR, urlPath)
  }

  return path.join(ROOT_DIR, urlPath)
}

const server = http.createServer((req, res) => {
  const requestPath = (req.url || '/').split('?')[0]
  const filePath = resolvePath(requestPath)
  sendFile(res, filePath)
})

server.listen(PORT, () => {
  console.log(`[rollup-dev] Server running at http://localhost:${PORT}`)
})

const rollupProcess = spawn('rollup', ['-c', '-w'], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  shell: true,
})

function shutdown() {
  server.close(() => {
    if (rollupProcess) {
      rollupProcess.kill('SIGTERM')
    }
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
