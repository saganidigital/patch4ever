import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localAdminApiPlugin() {
  return {
    name: 'local-admin-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) {
          process.env[k] = v
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const urlPath = (req.url || '').split('?')[0]
        const routes = {
          '/api/admin/login': () => import('./api/admin/login.js'),
          '/api/admin/session': () => import('./api/admin/session.js'),
          '/api/admin/logout': () => import('./api/admin/logout.js'),
        }

        const loader = routes[urlPath]
        if (!loader) return next()

        const wrappedRes = res
        wrappedRes.status = (code) => {
          res.statusCode = code
          return wrappedRes
        }
        wrappedRes.json = (data) => {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
          res.end(JSON.stringify(data))
          return wrappedRes
        }

        try {
          const mod = await loader()
          await mod.default(req, wrappedRes)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'Internal server error' }))
          console.error('[local-admin-api]', err)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localAdminApiPlugin()],
})
