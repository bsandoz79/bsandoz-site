# Prix et référencement

Source unique des prix, calcul d'une estimation, sitemap, données structurées. Du code sans serveur.

## Fichiers à copier
| Pour | Fichiers de `front/src/` |
| --- | --- |
| Prix et estimation | `data/offres.ts`, `data/calculs.ts`, et leurs tests |
| Titres et description des pages | `components/PageMeta/`, `data/seo.ts`, `data/pages.ts`, `data/navigation.ts`, `data/faq.ts`, `data/offres.ts` |
| `sitemap.xml` et `robots.txt` au build | la fonction `fichiersSeo` de `front/vite.config.ts` |

Blocs utiles : `PriceSummary`, `OptionCard`, `SitePreview`. Voir [Blocs](blocs.md).

## Réglages
- **Prix** : `data/offres.ts` contient **mes** formules et options. Les remplacer toutes par celles du client, puis adapter les tests.
- **Référencement** : `site` dans `data/pages.ts` (nom, adresse), `contact` dans `data/navigation.ts`, la liste des pages. Les données structurées de `data/seo.ts` me décrivent : à réécrire pour son activité.

## Base de données, mails
Aucun.

## Domaine
`site.url` doit être l'adresse finale du site.

## Vérifications finales
- [ ] `npm run test` et `npm run build` passent.
- [ ] `dist/sitemap.xml` ne contient que des adresses du client.
- [ ] Aucun de mes prix : voir [Vérifications finales](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : les prix sont dans le code, un changement demande de reconstruire le site. Le lui expliquer, ou prévoir une intervention.
- **Je gère** : ces changements passent par moi.
