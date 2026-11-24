# Carte « Avant de partir » après 30 secondes

Branche `feature/relance-avant-de-partir` · 2026-11-24

## Ce qui a été fait
Baptiste voulait qu'un message s'affiche 30 secondes après l'arrivée d'un visiteur, pour l'inviter à demander une maquette ou à l'appeler avant de partir.
- **Carte `Relance`** (`components/Relance/`) : « Avant de partir · Donnez vie à votre idée », avec deux boutons : « Recevoir ma maquette gratuite » (vers `/devis?demande=maquette`) et « Appeler le 07 69 28 78 37 » (`tel:`). Une croix et la touche Échap la ferment.
- **Discrète** : en bas à droite sur ordinateur, en bas de l'écran sur téléphone (au-dessus de la barre « Demander »). Elle ne bloque pas la page et ne prend pas le focus.
- **Quand** : 30 secondes après l'arrivée, le temps comptant d'une page à l'autre. Elle attend que le bandeau des cookies soit fermé. Une seule ouverture, puis plus rien pendant 30 jours (date gardée dans `localStorage`, clé `bsandoz-relance`).
- **Où elle ne s'ouvre pas** : devis, rendez-vous, mentions légales, CGV, confidentialité, espace client et administration.
- **Formulaire** : `?demande=maquette` coche déjà « Une maquette gratuite d'abord ».
- Textes, délai et pages exclues dans `data/relance.ts`.

## Tests
- 6 tests : ouverture à 30 s et pas avant, liens maquette et téléphone, fermeture par la croix et Échap, pas de retour pendant 30 jours, pas sur la page de devis, attente du bandeau des cookies.
- Résultats : 401 tests ; lint et build sans erreur.
- Vérifié dans Chrome : absente à 29 s, présente à 31 s, sur ordinateur et sur téléphone.

## Fichiers principaux
- `front/src/components/Relance/` (composant, styles, tests), `front/src/data/relance.ts`
- `front/src/components/Layout/Layout.tsx`, `front/src/components/ContactRapide/ContactRapide.tsx`

## Reste ouvert
- Les textes de la carte ne sont pas encore modifiables sur place (ils le sont dans `data/relance.ts`).
