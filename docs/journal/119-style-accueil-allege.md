# Accueil allégé, un seul formulaire

Branche `style/accueil-allege` · 2026-11-18

## Ce qui a été fait
Retour de Baptiste après les ajouts inspirés de Roselyn Pro : « ça fait beaucoup, pas forcément beau, le formulaire fait doublon ». L'accueil passe de 12 blocs à 9, environ un tiers plus court :
- **Un seul formulaire** (bas de page et page Devis) : « Vous souhaitez : Un devis / Une maquette gratuite d'abord ». Avec la maquette : promesse (72 h ouvrées), ville, « ce que vous faites en deux phrases », style ; téléphone facultatif ; demande « Maquette gratuite · métier ». Le formulaire séparé `MaquetteGratuite` est supprimé.
- **Réalisations** : les 3 premières seulement sur l'accueil ; les autres et les exemples d'outils restent sur la page Réalisations.
- **Retirés** : « Ce que vous recevez à la livraison » (redit par le comparatif et la FAQ ; les 30 jours d'ajustements restent dans l'étape 4) et « Vous parlez de votre métier, j'en fais les textes » (le comparatif le dit en une ligne).
- **Comparatif** plus sobre : plus de colonne colorée, titre « Avec moi » en couleur d'accent et réponses en gras.

## À quoi ça sert
Un accueil plus court et plus clair : chaque idée dite une fois, un seul endroit pour écrire.

## Comment l'utiliser
Rien à faire. Textes du formulaire dans `front/src/data/contact.ts` (`demande`, `maquette`).

## Tests
- `ContactRapide.test.tsx` : règles de la maquette (ville, téléphone facultatif mais vérifié), contenu envoyé, parcours complet « maquette ».
- `Home.test.tsx` : ordre des blocs, 3 réalisations sans exemples, un seul formulaire, 30 jours dans la méthode.

Lancer : `npm run test -w front -- ContactRapide Home`

## Fichiers principaux
- `front/src/components/ContactRapide/` (`ContactRapide.tsx`, `contact.ts`, `.module.css`)
- `front/src/pages/Home/Home.tsx`, `sections/Realisations.tsx`, `sections/Comparatif.module.css`
- `front/src/data/accueil.ts`, `blocs.ts`, `contact.ts`, `front/src/seo/prerendu.ts`

## Reste ouvert
- Rien.
