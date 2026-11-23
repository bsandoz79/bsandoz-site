import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { createServer, defineConfig, type Plugin } from 'vite'

type ModuleSeo = { genererSitemap: () => string; robotsTxt: () => string; INDEXNOW_CLE: string; requeteIndexNow: () => object }
type ModuleLlms = { genererLlmsTxt: () => string }

/**
 * Génère sitemap.xml, robots.txt, llms.txt (résumé pour les assistants IA) et les fichiers IndexNow au build, à partir de la liste des pages (src/data/seo.ts).
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
        // IndexNow : fichier de la clé (public) et liste des pages à annoncer, lue par le déploiement (scripts/indexnow.mjs).
        this.emitFile({ type: 'asset', fileName: `${seo.INDEXNOW_CLE}.txt`, source: seo.INDEXNOW_CLE })
        this.emitFile({ type: 'asset', fileName: 'indexnow.json', source: JSON.stringify(seo.requeteIndexNow()) })
        const llms = (await serveur.ssrLoadModule('/src/seo/llms.ts')) as ModuleLlms
        this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llms.genererLlmsTxt() })
      } finally {
        await serveur.close()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fichiersSeo()],
  resolve: {
    // Dans ce dépôt, le site utilise directement les sources de la bibliothèque de blocs
    // (un site client, lui, installe le paquet publié @bsandoz79/blocs).
    alias: { '@bsandoz79/blocs': fileURLToPath(new URL('../packages/blocs/src/index.ts', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
})
