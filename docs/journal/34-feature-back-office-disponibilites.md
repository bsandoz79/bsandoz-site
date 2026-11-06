# Back-office : disponibilités

Branche `feature/back-office-disponibilites` · 2026-11-06

## Ce qui a été fait
- Onglet « Disponibilités » de `/admin` : jours travaillés, créneaux, jours fermés (congés).
- Booking : disponibilités enregistrées en base. Tant que rien n'est réglé, `booking.yaml` s'applique. Jour fermé refusé à la réservation.
- `GET /rendez-vous/disponibilites` (public) : le calendrier du site les lit à l'ouverture de la page.

## À quoi ça sert
Poser ses congés ou changer ses horaires sans toucher au code. Il n'y a plus à garder deux réglages identiques : `data/rendezvous.ts` ne sert plus que de repli si l'API ne répond pas.

## Comment l'utiliser
`/admin`, onglet « Disponibilités », puis « Enregistrer les disponibilités ». Les rendez-vous déjà pris ne sont pas annulés.

## Tests
- **fonctionnels** : `api/tests/BackOffice/DisponibilitesBackOfficeTest.php` (HTTP + MySQL : droits, réglage appliqué à la réservation, tout ou rien), `front/src/pages/Admin/DisponibilitesAdmin.test.tsx`.
- **unitaires** : validation du domaine, `front/src/pages/RendezVous/reservation.test.ts` (jour fermé, API en panne ou illisible).

Lancer : `npm run test -w front` ; API : voir `docs/api.md`.

## Fichiers principaux
- `api/src/Booking/Domain/Disponibilites.php`, `api/src/Booking/Infrastructure/Systeme/FabriqueRegle.php`, `api/src/BackOffice/DisponibilitesController.php`, `front/src/pages/Admin/DisponibilitesAdmin.tsx`, `front/src/pages/RendezVous/reservation.ts`

## Reste ouvert
- Durée des rendez-vous, délai et horizon restent dans `booking.yaml`.
- Le calendrier ne grise pas encore les créneaux déjà pris : ils sont refusés au moment de confirmer.
- Fermer un jour n'annule ni ne signale les rendez-vous déjà pris ce jour-là.
- Les vrais horaires restent à saisir par Baptiste.
