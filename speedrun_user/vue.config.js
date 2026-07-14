const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      devServer.app.post('/api/profile-data', (request, response) => {
        let body = ''

        request.on('data', chunk => {
          body += chunk
          if (body.length > 10 * 1024 * 1024) request.destroy()
        })

        request.on('end', () => {
          try {
            const data = JSON.parse(body)
            if (!data?.user || !Array.isArray(data?.runList)) {
              response.status(400).json({ saved: false, message: 'Invalid Speedrun export.' })
              return
            }

            const target = path.resolve(__dirname, 'public', 'src_user_export.json')
            fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
            response.json({ saved: true, path: 'public/src_user_export.json' })
          } catch (error) {
            response.status(400).json({ saved: false, message: error.message })
          }
        })
      })

      return middlewares
    }
  }
})
