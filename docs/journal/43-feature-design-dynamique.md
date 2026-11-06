# Un accueil plus dynamique, téléphone façon smartphone récent

Branche `feature/design-dynamique` · 2026-11-06

## Ce qui a été fait
- **Téléphone de démonstration** (haut de l'accueil, grands écrans), redessiné façon smartphone récent, sans logo ni marque :
  - bords fins et très arrondis, effet métal sombre en bleu nuit ;
  - îlot noir en haut de l'écran, barre d'état « 9:41 » avec réseau et batterie ;
  - boutons sur la tranche, ombre profonde ;
  - halo rose qui « respire » derrière.
- **Haut de l'accueil** : lueurs douces rose et bleu marine en fond.
- **Bande « En bref »** sous le haut de l'accueil, en bleu marine, avec des chiffres en dégradé rose et uniquement des faits du site :
  - le délai d'un site vitrine, repris des offres (« 3 jours ») ;
  - un seul interlocuteur ;
  - une réponse sous 24 h ;
  - le déplacement gratuit jusqu'à 50 km.
- **Boutons** (bloc `Button`, donc tout le site) : ils se soulèvent au survol, et le bouton principal gagne un halo rose.
- **Animations** dans `styles/animations.css` (nouvelle classe `anim-respire`), coupées si l'utilisateur réduit les animations. **Variables** ajoutées dans `tokens.css` : ombre du téléphone, ombre rose, îlot, tranche, voile bleu marine. Aussi dans les valeurs par défaut de la bibliothèque pour `--shadow-rose`.
- Essayé puis abandonné : le dégradé sur les mots qui tournent. Le mot animé n'en hérite pas et devenait invisible ; le rose plein est conservé.

## Tests
- **fonctionnels** : `Home.test.tsx` vérifie que la bande « En bref » reprend le délai réel des offres, la réponse sous 24 h et les 50 km.
- **manuel** : captures du haut de l'accueil à 1 280 px et 390 px.

Résultats : site 358 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/pages/Home/sections/HeroDemo.*`, `Hero.module.css`, `Chiffres.*`, `front/src/data/accueil.ts`
- `packages/blocs/src/Button/Button.module.css`, `packages/blocs/src/styles/base.css`
- `front/src/styles/tokens.css`, `front/src/styles/animations.css`

## Reste ouvert
- Les avis clients : à afficher seulement quand vous aurez de vrais avis (rien n'est inventé).
