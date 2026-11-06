# « Estimer » ouvre le bon onglet

Branche `fix/estimer-bon-onglet` · 2026-11-06

## Le problème
- Sur la partie sites, « Estimer mon projet » ouvrait le configurateur sur « Informatique sur place » si c'était le dernier onglet utilisé. Le configurateur reprend son état enregistré, et le lien ne précisait pas d'onglet.
- La page Estimer montrait deux barres « Sites & applis / Informatique sur place » : celle de l'en-tête et celle du configurateur. Elles pouvaient se contredire.

## Ce qui a été fait
- `lienEstimer(pathname)` (`data/navigation.ts`) : `?onglet=informatique` depuis Informatique sur place, `?onglet=web` ailleurs. Il est utilisé par l'en-tête, la barre mobile et le pied de page.
- Les liens « Estimer / Composer mon site » de l'accueil, des Tarifs et des réalisations mènent à `?onglet=web`.
- Sur `/composer`, la barre d'onglets de l'en-tête est retirée (classe `sansOnglets`, hauteur d'onglets à 0) : une seule barre reste, celle du configurateur.

## Tests
- `Header.test.tsx` :
  - lien vers `?onglet=web`, et `?onglet=informatique` depuis Informatique sur place ;
  - pas de barre d'onglets sur la page Estimer.
- `MobileBar.test.tsx` : même règle.
- `Footer.test.tsx`, `Home.test.tsx`, `Tarifs.test.tsx`, `Realisations.test.tsx` : nouvelles adresses.
- Lancer : `npm run test -w front -- Header MobileBar Footer Home Tarifs Realisations`.

## Reste ouvert
Rien.
