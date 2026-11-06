# Module Booking

Rendez-vous : réservation d'un créneau, créneau déjà pris refusé, e-mails de confirmation avec fichier `.ics`, lien pour annuler. Module **autonome** : il s'installe tel quel dans l'API d'un client (son hébergement, sa base, son domaine).

## Couches
- `Domain/` : règles métier (rendez-vous, créneau, contact, lieu, règle de disponibilité, ports). Aucune dépendance à Symfony, Doctrine ou à un autre module.
- `Application/` : cas d'usage `ReserverRendezVous` et `AnnulerRendezVous`, qui pilotent le domaine par ses ports.
- `Infrastructure/` : adaptateurs.
  - `Http/RendezVousController.php` : points d'entrée HTTP.
  - `Doctrine/` : dépôt et correspondance XML (table `booking_rendez_vous`).
  - `Mail/` : e-mails (`NotificationsParMail`) et fichier `.ics` (`FichierIcs`, RFC 5545).
  - `Systeme/` : horloge et identifiants (UUID v7, jeton de 64 caractères hexadécimaux).

## Points d'entrée
| Méthode | Adresse | Rôle | Réponses |
| --- | --- | --- | --- |
| POST | `/rendez-vous` | réserver (JSON `{ lieu, adresse, jour, creneau, nom, email, telephone, activite, message }`) | 201 `{ id, statut, jour, creneau }` · 400 `{ erreurs }` · 409 créneau pris |
| GET | `/rendez-vous/{jeton}` | page « déplacer ou annuler » (lien du mail) ; n'a aucun effet | 200 · 404 |
| POST | `/rendez-vous/{jeton}/annuler` | annuler, puis page de confirmation | 200 · 404 |

`lieu` : `chezvous` (adresse obligatoire), `visio` ou `telephone`. `jour` : `AAAA-MM-JJ`, `creneau` : `HH:MM`.
Le jeton n'est jamais renvoyé par l'API : il part seulement dans l'e-mail de la personne.

## Réglages (`config/packages/booking.yaml`)
| Paramètre | Rôle |
| --- | --- |
| `booking.jours_travailles` | jours réservables, lundi = 0 … dimanche = 6 |
| `booking.creneaux` | heures de début des créneaux |
| `booking.duree_minutes` | durée d'un rendez-vous |
| `booking.delai_min_jours`, `booking.horizon_jours` | réservable à partir de J+n, jusqu'à J+n |
| `booking.fuseau` | fuseau horaire des créneaux |

Variables d'environnement (`.env.local` sur le serveur) : `BOOKING_EXPEDITEUR`, `BOOKING_PROFESSIONNEL_NOM`, `BOOKING_PROFESSIONNEL_EMAIL`, `BOOKING_URL_PUBLIQUE` (adresse publique de l'API, pour le lien du mail), plus `MAILER_DSN` et `CORS_ALLOW_ORIGIN` (adresse du site qui appelle l'API).

Les adaptateurs lisent leurs réglages par l'attribut `#[Autowire('%booking.…%')]` : le `services.yaml` de l'application n'a rien à déclarer pour eux.

## Installer le module dans l'API d'un client
Marche à suivre complète, site compris : [`docs/mise-en-place/rendez-vous.md`](../../../docs/mise-en-place/rendez-vous.md).

1. Copier `src/Booking/` et `config/packages/booking.yaml`, puis adapter les réglages.
2. `config/services.yaml` : exclure les domaines des services (`exclude: ['../src/*/Domain/', '../src/Kernel.php']`).
3. `config/packages/doctrine.yaml` : déclarer la correspondance sous `doctrine.orm.mappings` :
   ```yaml
   Booking:
       type: xml
       is_bundle: false
       dir: '%kernel.project_dir%/src/Booking/Infrastructure/Doctrine/mapping'
       prefix: 'App\Booking\Domain'
       alias: Booking
   ```
4. Dépendances : `symfony/mailer`, `symfony/uid`, `doctrine/orm`, `nelmio/cors-bundle` (si le site est sur un autre domaine).
5. Copier la migration `migrations/Version20261105185043.php` (ou `doctrine:migrations:diff`), puis `doctrine:migrations:migrate`.
6. Renseigner les variables d'environnement ci-dessus.

## Événement
Après une réservation réussie, le contrôleur publie `Infrastructure/Evenement/RendezVousReserve` (avec le rendez-vous). Une installation peut l'écouter, par exemple pour ouvrir un compte client, ou l'ignorer : le module n'en dépend pas.

## Tests
- `tests/Booking/Domain`, `tests/Booking/Application` : domaine et cas d'usage, avec des doublures des ports (sans base ni mails).
- `tests/Booking/Infrastructure/FichierIcsTest.php`, `NotificationsParMailTest.php` : fichier `.ics` et e-mails (faux mailer).
- `tests/Booking/Infrastructure/RendezVousHttpTest.php` : parcours HTTP complet sur MySQL (réserver, créneau pris, données invalides, lien du mail, annulation qui libère le créneau). Ignoré si aucune base n'est joignable.
