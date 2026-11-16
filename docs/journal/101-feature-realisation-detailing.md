# Réalisation Perfect Clean (detailing auto)

Branche `feature/realisation-detailing` · 2026-11-16

## Ce qui a été fait
- Baptiste a demandé d'ajouter les photos de la démo de detailing et un lien vers demo.bsandoz.fr. Le projet est dans `../bsandoz-booking`.
- **Captures** : six écrans en 1 280 × 720, convertis en WebP (22 à 68 Ko) :
  - accueil ;
  - prestations ;
  - réservation (choix de la formule) ;
  - zone d'intervention ;
  - carte de fidélité ;
  - espace professionnels.
- **Comment elles ont été prises** : la protection d'o2switch a bloqué les captures du site en ligne (429). Elles ont donc été prises sur la démo servie en local (`vite preview` du `dist` de `apps/detailing/front`), sans appel vers l'extérieur. Conséquence : le fond de carte de la zone est gris, mais les cercles et les tarifs sont lisibles.
- **Fiche** : titre « Perfect Clean ».
  - Textes tirés du cahier des charges et du journal de `bsandoz-booking`.
  - Lien « Essayer la démo en ligne ».
  - L'ancien titre parlait d'acompte ; la démo propose maintenant le paiement en ligne de la totalité, ou sur place.

## Tests
- `Realisations.test.tsx` : page Perfect Clean (titre, capture, fonctionnalités, lien vers la démo, plus de « [à compléter] »).
- `RealisationCard.test.tsx` : l'aperçu provisoire est testé avec une réalisation fictive.
- `Metier.test.tsx` : la page Artisan montre « Perfect Clean ».
- Résultats : 350 tests pour le site, 80 pour les blocs.
- Vérifié dans Chrome.
- Lancer : `npm run test -w front -- Realisation`.

## Reste ouvert
- Refaire la capture de la zone avec le fond de carte, si Baptiste le souhaite. Il faudrait autoriser les tuiles de carte, ou prendre la capture à la main sur le site en ligne.
