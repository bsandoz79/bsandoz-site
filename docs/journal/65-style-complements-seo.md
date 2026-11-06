# Deux compléments, référencement seul à part

Branche `style/complements-seo` · 2026-11-06

## Ce qui a été fait
- **Compléments** : deux cadres pointillés côte à côte, comme la capture de référence :
  - page supplémentaire (+ 50 €) ;
  - suivi mensuel (29 € / mois), avec « Sans suivi : 29 € de l'heure, à la demande » en détail.
- **Référencement Google seul** (`components/OffreSeo`, données `offreSeo()`) : un encart à part, différent du reste, sous les compléments (accueil et Tarifs). Il contient :
  - le badge « − 20 % sur le prix du marché » ;
  - « Vous avez déjà un site ? Faites-le remonter sur Google. » ;
  - le prix (400 €) en grand, et le prix du marché barré (500 – 1 200 €) avec sa source ;
  - le bouton « Faire le point sur mon site », vers le devis.

## Tests
- `Tarifs.test.tsx` :
  - deux compléments et leurs prix ;
  - encart du référencement : badge, prix, fourchette, source, lien ;
  - calcul à − 20 %.
- Lancer : `npm run test -w front -- Tarifs`.
- Manuel : captures sur ordinateur (thème nuit et clair) et sur mobile.

## Reste ouvert
Rien.
