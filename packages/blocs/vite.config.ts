import react from '@vitejs/plugin-react'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * Place les styles de base (variables par défaut, .sr-only) en tête de dist/blocs.css.
 * Ils ne sont pas importés par le code : les types publiés restent ainsi sans import CSS.
 */
function stylesDeBase(): Plugin {
  return {
    name: 'bsandoz-styles-de-base',
    apply: 'build',
    enforce: 'post',
    writeBundle(options) {
      const fichier = join(options.dir ?? 'dist', 'blocs.css')
      if (!existsSync(fichier)) this.error(`${fichier} introuvable : les styles de base ne peuvent pas être ajoutés.`)
      const base = readFileSync(new URL('./src/styles/base.css', import.meta.url), 'utf8')
      writeFileSync(fichier, `${base}\n${readFileSync(fichier, 'utf8')}`)
    },
  }
}

// Bibliothèque : un seul module ES (dist/blocs.js) et une feuille de styles (dist/blocs.css).
// React reste une dépendance du site qui utilise les blocs (peerDependency), jamais embarqué.
export default defineConfig({
  plugins: [react(), stylesDeBase()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'blocs', cssFileName: 'blocs' },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
    emptyOutDir: true,
  },
  css: {
    // Classes préfixées pour ne jamais entrer en conflit avec les styles du site.
    modules: { generateScopedName: 'bsb-[local]-[hash:base64:5]' },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
