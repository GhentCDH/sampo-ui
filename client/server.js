const express = require('express')
const path = require('path')
const fs = require('fs').promises // Use promises for async file checks
const app = express()

// Serve the configs directory at /configs
const configsPath = '/app/configs'
app.use('/configs', async (req, res, next) => {
  const filePath = path.join(configsPath, req.path)
  try {
    const stats = await fs.stat(filePath)
    if (stats.isFile()) {
      console.log(`Serving file: ${filePath}`)
      return express.static(configsPath)(req, res, next)
    } else {
      console.log(`Requested path is not a file: ${filePath}`)
      next()
    }
  } catch (err) {
    console.log(`File not found or inaccessible: ${filePath}`)
    console.error(`Error accessing ${filePath}:`, err.message)
    next()
  }
})

// Serve the React app build from dist/public
const staticPath = path.join(__dirname, 'dist/public')
app.use(express.static(staticPath, {
  index: false // Prevent serving index.html for non-/* routes
}))
console.log(`Serving static files from: ${staticPath}`)

// Handle SPA routing by serving index.html for all other routes
app.get('*', async (req, res, next) => {
  const indexPath = path.join(__dirname, 'dist/public', 'index.html')
  try {
    await fs.access(indexPath)
    console.log(`Serving index.html for path: ${req.path}`)
    res.sendFile(indexPath)
  } catch (err) {
    console.error(`index.html not found at: ${indexPath}`)
    next(new Error(`index.html not found: ${err.message}`))
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`, err.stack)
  res.status(500).send('Internal Server Error')
})

// Start the server
const port = 8080
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`)
})
