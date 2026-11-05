# Mes rendez-vous dans l'espace client

Branche `feature/espace-rendez-vous` · 2026-11-05

## Ce qui a été fait
- **Plan** : la case « Espace client complet » est découpée en trois branches (rendez-vous, compte, demandes et devis).
- **API** :
  - Booking sait retrouver un rendez-vous par identifiant et les rendez-vous d'une adresse e-mail ;
  - Auth fournit `SessionDeLaRequete` (qui est connecté, d'après le cookie) ;
  - la liaison `src/Liaisons/EspaceRendezVousController.php` sert `GET /espace/rendez-vous` (rendez-vous de la personne connectée, avec « à venir »), `GET /espace/rendez-vous/{id}/agenda.ics` et `POST /espace/rendez-vous/{id}/annuler`. L'annulation passe par le même cas d'usage que le lien du mail : le créneau est libéré, la personne et le professionnel sont prévenus. Un rendez-vous passé ne s'annule plus (409), et celui d'une autre adresse répond 404.
- **Site** : section « Mes rendez-vous » de `/mon-espace`, comme la maquette (« Mardi 17 novembre · 14:00 – 15:00 », « Rendez-vous découverte · chez vous, … »). Boutons « Ajouter à l'agenda », « Déplacer » et « Annuler » ; l'annulation est confirmée en deux temps. Les rendez-vous passés et annulés sont listés en dessous.

## À quoi ça sert
La personne retrouve ses rendez-vous sans chercher le mail de confirmation, les ajoute à son agenda et les annule elle-même.

## Comment l'utiliser
Connecté, ouvrir `/mon-espace`. Côté API : voir `docs/api.md`.

## Tests
- **fonctionnels** :
  - API, `tests/Liaisons/EspaceRendezVousTest.php` (5 tests sur MySQL) : réserver, se connecter avec le lien d'activation, lister, `.ics`, annuler (2 mails, statut mis à jour), non connecté (401), rendez-vous d'une autre personne (404), rendez-vous passé (409), corps JSON exigé (415) ;
  - site, `MesRendezVous.test.tsx` (5 tests) : affichage, lien de l'agenda, annulation en deux temps, échec, aucun rendez-vous.
- **unitaires** : doublure en mémoire du dépôt Booking complétée (recherche par adresse, tri).

Résultats : API 132 tests verts sur MySQL ; site 254 et bibliothèque 70 tests verts ; lint et builds verts.

## Fichiers principaux
- `api/src/Liaisons/EspaceRendezVousController.php`, `api/src/Auth/Infrastructure/Http/SessionDeLaRequete.php`
- `api/src/Booking/Domain/RendezVousRepository.php`, `api/src/Booking/Infrastructure/Doctrine/DoctrineRendezVousRepository.php`
- `front/src/pages/MonEspace/MesRendezVous.tsx`, `compte.ts`, `front/src/data/espace.ts`

## Reste ouvert
- **Déplacer en une seule action** (choisir le nouveau créneau depuis l'espace) : aujourd'hui, on réserve un nouveau créneau puis on annule l'ancien.
- Les rendez-vous sont retrouvés **par adresse e-mail** : un rendez-vous pris avec une autre adresse n'apparaît pas.
