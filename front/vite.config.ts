import react from '@vitejs/plugin-react'
import { createServer, defineConfig, type Plugin } from 'vite'

type ModuleSeo = { genererSitemap: () => string; robotsTxt: () => string }

/**
 * Génère sitemap.xml et robots.txt au build, à partir de la liste des pages (src/data/seo.ts).
 * Le module TypeScript est chargé par un serveur Vite éphémère, sans le copier dans la configuration.
 */
function fichiersSeo(): Plugin {
  return {
    name: 'bsandoz-fichiers-seo',
    apply: 'build',
    async generateBundle() {
      const serveur = await createServer({
        configFile: false,
        logLevel: 'silent',
        server: { middlewareMode: true, hmr: false },
        appType: 'custom',
      })
      try {
        const seo = (await serveur.ssrLoadModule('/src/data/seo.ts')) as ModuleSeo
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: seo.genererSitemap() })
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: seo.robotsTxt() })
      } finally {
        await serveur.close()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fichiersSeo()],
})
