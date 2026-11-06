# Bandeau des services tiers et carte directe

Branche `feature/bandeau-cookies` · 2026-11-06

## Ce qui a été fait
- **Polices hébergées avec le site** (paquets Fontsource, importés dans `main.tsx`) : plus aucun appel à Google Fonts. Le bandeau ne concerne donc plus que la carte OpenStreetMap.
- **Bandeau discret en bas de l'écran** (`components/BandeauCookies`), qui ne bloque pas la page. Il propose « Refuser » et « Accepter », avec le même poids visuel, une croix et un lien « En savoir plus » vers la politique de confidentialité.
- **Stockage du choix** (`app/consentement.ts`) :
  - un choix fait avec les boutons est gardé 6 mois, puis redemandé ;
  - fermer avec la croix ne garde rien : le bandeau revient au prochain chargement de la page.
- **Changer d'avis** : le bouton « Services tiers » du pied de page rouvre le bandeau.
- **La carte s'affiche sans clic.** Leaflet et les tuiles se chargent quand la carte approche de l'écran pendant le défilement. Si le visiteur a refusé, la carte n'est pas chargée ; un bouton « Afficher la carte quand même » vaut acceptation.
- **Politique de confidentialité** mise à jour (polices, carte, durée du choix, lien du pied de page).
- **Lint propre** : `barreMobileVisible` est déplacé dans `MobileBar/visibilite.ts`.

## Tests
- **Unitaires**, `app/consentement.test.ts` :
  - première visite ;
  - accepter et refuser, choix gardé au rechargement ;
  - croix temporaire ;
  - choix de plus de 6 mois redemandé ;
  - valeur abîmée ;
  - réouverture.
- **Fonctionnels** :
  - `BandeauCookies.test.tsx` : affichage, aucune fenêtre bloquante, les deux choix, croix seulement pour la visite, place au-dessus de la barre mobile ;
  - `CarteZones.test.tsx` : chargement à l'approche sans clic (observateur simulé), pas de chargement après un refus puis « Afficher quand même », choix d'une ville ;
  - `Footer.test.tsx` : « Services tiers » rouvre le bandeau ;
  - `Legal.test.tsx` : texte sur les polices.
- **Lancer** : `npm run test -w front -- consentement BandeauCookies CarteZones Footer Legal`.
- **Manuel** (navigateur réel) :
  - avant le défilement, aucune requête vers OpenStreetMap (la seule requête externe est notre API des prix) ;
  - après le défilement, les tuiles se chargent ;
  - après « Refuser », aucune requête OpenStreetMap, et le bandeau ne revient pas au rechargement.

## Reste ouvert
- Prochaine branche : `feature/carte-position` (demande de position à l'arrivée sur la carte).
