import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fetchBooks } from './server/books'
import { fetchStudents, fetchWords, fetchSummary } from './server/analytics'

/**
 * Serves the amber schema from Postgres under /api/* during `npm run dev`.
 * The browser can't speak the Postgres wire protocol, so the dev server
 * proxies it.
 */
function amberApi(env: Record<string, string>): Plugin {
  const routes: Record<string, () => Promise<unknown>> = {
    '/api/books': () => fetchBooks(env),
    '/api/students': () => fetchStudents(env),
    '/api/words': () => fetchWords(env),
    '/api/summary': () => fetchSummary(env),
  }

  return {
    name: 'amber-api',
    configureServer(server) {
      for (const [route, handler] of Object.entries(routes)) {
        server.middlewares.use(route, async (_req, res) => {
          res.setHeader('Content-Type', 'application/json')
          try {
            res.end(JSON.stringify(await handler()))
          } catch (e) {
            server.config.logger.error(`[amber-api] ${route}: ${(e as Error).message}`)
            res.statusCode = 500
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }))
          }
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  // Empty prefix so unprefixed PG* vars in .env.local load. These are read
  // here in the Node config, not injected into the client bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), amberApi(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
