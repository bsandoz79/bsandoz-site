# Prix et référencement

Source unique des prix, calcul d'une estimation, sitemap, données structurées. Du code sans serveur.

## Fichiers à copier
| Pour | Fichiers de `front/src/` |
| --- | --- |
| Prix et estimation | `data/offres.ts`, `data/calculs.ts`, et leurs tests |
| Titres et description des pages | `components/PageMeta/`, `data/seo.ts`, `data/pages.ts`, `data/navigation.ts`, `data/faq.ts`, `data/offres.ts` |
| Modifier les prix sans redéployer (facultatif, demande le back-office de l'[espace client](espace-client.md)) | `data/prixEnLigne.ts`, avec le `main.tsx` de `front/src/`, et `pages/Admin/PrixAdmin.tsx` |
| `sitemap.xml` et `robots.txt` au build | la fonction `fichiersSeo` de `front/vite.config.ts` |

Blocs utiles : `PriceSummary`, `OptionCard`, `SitePreview`. Voir [Blocs](blocs.md).

## Réglages
- **Prix** : `data/offres.ts` contient **mes** formules et options. Les remplacer toutes par celles du client, puis adapter les tests.
- **Référencement** : `site` dans `data/pages.ts` (nom, adresse), `contact` dans `data/navigation.ts`, la liste des pages. Les données structurées de `data/seo.ts` me décrivent : à réécrire pour son activité.

## Base de données, mails
Aucun, sauf pour modifier les prix depuis le back-office : table `catalogue_prix` (module `Catalogue`).

## Domaine
`site.url` doit être l'adresse finale du site.

## Vérifications finales
- [ ] `npm run test` et `npm run build` passent.
- [ ] `dist/sitemap.xml` ne contient que des adresses du client.
- [ ] Aucun de mes prix : voir [Vérifications finales](commun.md#vérifications-finales).

## Selon la façon de livrer
- **Autonome** : sans back-office, les prix sont dans le code et un changement demande de reconstruire le site : le lui expliquer, ou prévoir une intervention.
- **Je gère** : ces changements passent par moi.

## Modifier textes et images sur les pages
Pour offrir aussi l'édition par bloc chez un client :
- **API** : copier `src/Contenu/`, `src/BackOffice/ContenusController.php`, `config/packages/contenu.yaml`, déclarer la correspondance `Contenu` dans `doctrine.yaml`, et ajouter la migration `Version20261106140000.php` ;
- **site** : copier `app/edition.ts`, `app/image.ts`, `data/blocs.ts` (à refaire selon les blocs du client), `data/contenusEnLigne.ts`, `data/medias.ts` et `components/BlocModifiable/` ;
- **vérifier** : un compte autorisé voit le bouton « Modifier », un visiteur non, et une image envoyée s'affiche ;
- **sauvegardes** : les images sont dans `public/medias/` de l'API, à sauvegarder avec la base.
