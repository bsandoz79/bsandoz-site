# Être trouvé par les assistants IA (llms.txt)

Branche `feature/llms-txt` · 2026-11-23

## Ce qui a été fait
Demande de Baptiste : apparaître dans les recherches faites avec une IA (ChatGPT, Claude, Perplexity, réponses IA de Google).
- Vérifié : les robots GPTBot, ClaudeBot et PerplexityBot reçoivent bien les pages (code 200, texte complet grâce aux pages lisibles sans JavaScript) ; robots.txt ne les bloque pas.
- Nouveau fichier `llms.txt` (format llmstxt.org), généré au build par `front/src/seo/llms.ts` à partir des données du site : présentation, coordonnées, formules et prix de départ, informatique sur place, pages par métier, réalisations, questions fréquentes.
- `.htaccess` : fichiers `.txt` servis en UTF-8.

## Tests
- `seo/llms.test.ts` (3) : format (titre, résumé), coordonnées, formules, réalisations, aucune page de l'espace client.

## Fichiers principaux
- `front/src/seo/llms.ts`, `front/vite.config.ts`, `front/public/.htaccess`, `docs/fonctionnalites/seo.md`

## Reste ouvert
- Hors du code (le plus efficace) : Bing Webmaster Tools (utilisé par ChatGPT et Copilot), Google Search Console, fiche Google Business Profile, inscriptions dans des annuaires, avis clients.
