# Votre photo et un accueil à la première personne

Branche `feature/hero-photo` · 2026-11-06

## Ce qui a été fait
- **Texte du haut de l'accueil**, dans l'esprit de la référence mais avec vos mots et uniquement des faits :
  - accroche « Création de sites internet sur mesure · Amiens » ;
  - titre « Je crée le site qui travaille pour vous, même quand vous êtes sur le terrain. » (la promesse du cahier des charges, à la première personne) ;
  - paragraphe qui vous présente, avec le prix de départ lu dans les formules (« à partir de 99 € »).
- **Votre photo**, reprise de votre portfolio (`pdp1.jpg`, convertie en WebP : portrait 15 Ko, vignette 3 Ko) :
  - sur ordinateur, à droite, dans un cadre en arche avec un liseré dégradé rose et votre nom ; le téléphone de démonstration est posé devant ;
  - sur téléphone, en vignette ronde avec votre nom et votre métier, tout en haut ;
  - page À propos : la photo remplace l'emplacement « [photo à compléter] ».
- Le bouton du téléphone de démonstration tient sur une ligne.

## Tests
- **fonctionnels** : l'accueil montre le nom, le métier et le prix de départ (lu dans les formules) ; la page À propos montre la photo avec son texte alternatif.
- **manuel** : captures du haut de l'accueil à 1 280 px et 390 px.

Résultats : site 367 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/assets/baptiste/`, `front/src/data/accueil.ts`, `front/src/data/pages.ts`, `front/src/data/apropos.ts`
- `front/src/pages/Home/sections/Hero.*`, `HeroDemo.*`, `front/src/pages/APropos/`
