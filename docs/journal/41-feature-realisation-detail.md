# Une page par réalisation, avec les vraies captures

Branche `feature/realisation-detail` · 2026-11-06

## Ce qui a été fait
- **Liste** (`/realisations`) : une grille de cartes. Chaque carte affiche la vraie capture de couverture dans un cadre de navigateur, avec un léger zoom au survol, ou l'illustration provisoire s'il n'y a pas de capture.
- **Page d'un projet** (`/realisations/<projet>`), qui n'affiche que ce projet :
  - un en-tête bleu marine (catégorie, titre, résumé, année et technologies en pastilles, bouton de démo s'il en existe une) ;
  - la couverture qui remonte sur l'en-tête ;
  - trois blocs : contexte, besoin, solution ;
  - « Ce que fait le site », les captures légendées (ouvertes en grand au clic) ;
  - le projet précédent et le suivant, le retour à la liste, l'appel « Composer mon site ».
  - Un projet inconnu affiche la page introuvable.
- **Contenu** repris du portfolio de Baptiste (rien d'inventé) : Christophe Poix Moto et O'RDV (contexte, besoin, solution, fonctionnalités, technologies, démo `o-rdv.vercel.app`). La démo detailing garde ses « [à compléter] » et annonce les captures à venir.
- **Captures** : 12 images du portfolio converties en WebP, 1 280 px de large au maximum (440 Ko au total), dans `front/src/assets/realisations/`.
- **Plan du site** : une page par réalisation. Les identifiants sont dans `data/realisationsIds.ts`, sans image, car `seo.ts` est aussi lu par la configuration de Vite.
- Les cartes de l'accueil et des pages métier mènent maintenant à la page du projet.

## Tests
- **fonctionnels** (`Realisations.test.tsx`) : la liste n'a que des cartes ; cliquer sur une carte n'affiche que ce projet (titre, onglet) ; contenu complet d'O'RDV (sections, technologies, captures, démo en `noopener`) ; « [à compléter] » et captures à venir pour la démo detailing ; projets précédent et suivant ; retour à la liste ; projet inconnu.
- **unitaires** : les identifiants du plan du site correspondent aux réalisations ; le sitemap contient les pages de projets.
- **manuel** : captures à 390 px et 1 280 px.

Résultats : site 348 et bibliothèque 70 tests verts ; lint et build verts ; `sitemap.xml` contient les 3 pages de projets.

## Fichiers principaux
- `front/src/pages/Realisation/` (nouvelle page), `front/src/pages/Realisations/`
- `front/src/components/RealisationCard/`, `front/src/data/realisations.ts`, `front/src/data/realisationsIds.ts`, `front/src/data/seo.ts`
- `front/src/assets/realisations/`

## Reste ouvert
- Les captures et le texte de la **démo detailing**.
- Alterno et Gestion nounou, présents dans le portfolio : à ajouter si vous le souhaitez.
