# IndexNow : prévenir Bing à chaque mise en ligne

Branche `feature/indexnow` · 2026-11-23

## Ce qui a été fait
Bing Webmaster Tools indiquait les pages « découvertes mais pas explorées ». Bing alimente ChatGPT et Copilot : plus il lit vite le site, plus vite les IA le connaissent.
- Clé IndexNow publique (`INDEXNOW_CLE`, `front/src/data/seo.ts`) servie dans `/<clé>.txt`, générée au build avec `indexnow.json` (toutes les pages du sitemap).
- Déploiement : après l'envoi FTP, `front/scripts/indexnow.mjs` annonce les pages à `api.indexnow.org`. `indexnow.json` n'est pas envoyé sur le serveur. Un refus donne un avertissement, jamais un échec.

## Tests
- `data/seo.test.ts` : clé valide (32 caractères hexadécimaux), hôte, emplacement de la clé, toutes les pages du sitemap et rien de l'espace client.

## Fichiers principaux
- `front/src/data/seo.ts`, `front/vite.config.ts`, `front/scripts/indexnow.mjs`, `.github/workflows/deploy.yml`, `docs/fonctionnalites/seo.md`

## Reste ouvert
- Vérifier dans Bing Webmaster Tools → IndexNow que les adresses arrivent.
