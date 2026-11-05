# Module Booking (rendez-vous côté API)

Branche `feature/booking` · 2026-11-05

## Ce qui a été fait
- **Domaine et cas d'usage** : rendez-vous, créneau, contact, lieu, règle de disponibilité (jours travaillés, créneaux, délai, horizon, fuseau) ; `ReserverRendezVous` (validation, créneau réservable et libre, enregistrement, notifications) et `AnnulerRendezVous`.
- **Infrastructure** :
  - `POST /rendez-vous` (201, 400 avec les erreurs par champ, 409 si le créneau est pris ou hors règles) ;
  - `GET /rendez-vous/{jeton}` : page du lien reçu par mail, sans effet (un robot qui ouvre le lien n'annule rien) ;
  - `POST /rendez-vous/{jeton}/annuler` : annulation, le créneau redevient libre ;
  - Doctrine en XML (le domaine reste sans annotation), table `booking_rendez_vous` et sa migration ;
  - e-mails de confirmation et d'annulation, à la personne et au professionnel, avec fichier `.ics` (RFC 5545 : heures UTC, CRLF, échappement, lignes pliées) ;
  - réglages par installation dans `config/packages/booking.yaml` et variables `BOOKING_*`.
- **Correctif** : les adaptateurs lisent leurs réglages par `#[Autowire]`. La déclaration dans `booking.yaml` était écrasée par `services.yaml`, chargé après, et le conteneur ne se construisait plus (les tests `/sante` échouaient).
- **CI** : migrations appliquées sur une base vide, puis schéma validé.
- **Docs** : notice du module (installation chez un client), fiche [Module Booking](../fonctionnalites/booking.md), fiches API et Rendez-vous, `docs/api.md`.

## À quoi ça sert
La page `/rendez-vous` du site envoie déjà ses réservations à `POST {VITE_API_URL}/rendez-vous` : elles sont maintenant enregistrées, un créneau ne peut plus être pris deux fois, et chacun reçoit un e-mail avec l'événement à ajouter à son agenda. Le module s'installe aussi dans l'API d'un client (kit de réservation).

## Comment l'utiliser
```sh
# depuis api/ : base, migration, serveur
docker compose up -d database
php bin/console doctrine:migrations:migrate
curl -X POST http://localhost:8000/rendez-vous -H 'Content-Type: application/json' \
  -d '{"lieu":"visio","jour":"2026-11-17","creneau":"14:00","nom":"Marie Dupont","email":"marie@exemple.fr","telephone":"0612345678","activite":"Detailing","message":""}'
```
Installation chez un client : `api/src/Booking/README.md`.

## Tests
- **unitaires** : domaine, cas d'usage (doublures des ports), `FichierIcsTest` (6 tests), `NotificationsParMailTest` (3 tests, faux mailer).
- **fonctionnels** : `RendezVousHttpTest` (6 tests sur MySQL) : réservation et mails, créneau pris, données invalides, corps non JSON, lien du mail puis annulation qui libère le créneau, lien inconnu. Ignorés sans base joignable.
- **architecture** : `DomaineIndependantTest` (le domaine n'importe ni Symfony ni Doctrine).
- **CI** : conteneur, YAML, migrations sur base vide, schéma validé, PHPUnit.

Résultat : 48 tests, 179 assertions, tous verts sur MySQL 8.0 ; sans base, 42 verts et 6 ignorés.

Lancer : `cd api && docker run --rm -v "$PWD:/app" -w /app -e APP_CACHE_DIR=/tmp/cache composer:2 php bin/phpunit` (sans base). Avec MySQL : voir `docs/api.md`, section Migrations.

## Fichiers principaux
- `api/src/Booking/` (Domain, Application, Infrastructure, README)
- `api/config/packages/booking.yaml`, `api/config/packages/doctrine.yaml`, `api/config/services.yaml`, `api/.env.dist`
- `api/migrations/Version20261105185043.php`
- `api/tests/Booking/`
- `.github/workflows/ci.yml`

## Reste ouvert
- **À confirmer** : jours travaillés et heures des créneaux (`booking.yaml`, identiques à ceux du front), adresse `BOOKING_PROFESSIONNEL_EMAIL` (`contact@bsandoz.fr` dans `.env.dist`).
- **Mise en ligne** de l'API sur `api.bsandoz.fr` : `MAILER_DSN` (SMTP o2switch), `CORS_ALLOW_ORIGIN` (adresse du site), `BOOKING_URL_PUBLIQUE`, `DATABASE_URL` dans `.env.local`, puis migration.
- **Deux réservations simultanées** du même créneau : la vérification se fait avant l'enregistrement, sans verrou. C'est acceptable pour un seul agenda peu sollicité, mais il faudra une contrainte en base ou un verrou si le module sert un client à fort trafic.
- **Déplacer** un rendez-vous = annuler puis reprendre un créneau (pas de déplacement en un clic).
- Les créneaux déjà pris ne sont pas encore renvoyés au front : il ne les découvre qu'au moment de confirmer (409).
