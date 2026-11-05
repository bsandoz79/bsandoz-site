# Calendrier et page Rendez-vous

Branche `feature/calendar-rdv` · 2026-11-05

## Ce qui a été fait
Bloc `Calendar` accessible ; page Rendez-vous (lieu, adresse vérifiée dans les 50 km, calendrier, créneaux d’une heure, coordonnées, récapitulatif).

## À quoi ça sert
Prendre un rendez-vous découverte gratuit en ligne.

## Comment l’utiliser
Disponibilités dans `src/data/rendezvous.ts` (à confirmer). Réservation envoyée à `POST /rendez-vous` de l’API.

## Tests
- **unitaires** : `Calendar.test.tsx`, `dates.test.ts`, `reservation.test.ts` (jours, créneaux, distance, géocodage, validation).
- **fonctionnels** : `RendezVous.test.tsx` : adresse dans ou hors zone, jours et créneaux, confirmation, créneau déjà pris.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/blocks/Calendar/`
- `src/pages/RendezVous/`
- `src/data/rendezvous.ts`

## Reste ouvert
- Disponibilités réelles à confirmer ; l’API de réservation arrive avec le module Booking.
