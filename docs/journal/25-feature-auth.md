# Comptes et connexion (module Auth)

Branche `feature/auth` · 2026-11-05

## Ce qui a été fait
- **API, module Auth** (hexagonal, autonome comme Booking) :
  - compte ouvert automatiquement (« en attente »), activé par un lien reçu par mail ;
  - liens à usage unique : activation 7 jours, connexion sans mot de passe 15 minutes, mot de passe 1 heure ;
  - connexion par mot de passe (12 caractères au moins, hachage Argon2id ou bcrypt) ;
  - sessions de 30 jours glissants dans un cookie `HttpOnly` et `SameSite=Lax`, liste des appareils connectés, déconnexion des autres et déconnexion ;
  - 8 points d'entrée `/auth/…`, 3 tables (migration).
- **Sécurité** :
  - secrets jamais stockés (empreinte SHA-256) ni renvoyés par l'API ;
  - un nouveau lien annule les précédents ;
  - changer de mot de passe ferme toutes les sessions et envoie un mail ;
  - pas d'énumération des comptes ;
  - 5 essais par quart d'heure (429) ;
  - corps JSON obligatoire (415), CORS avec cookies limité au site, `Cache-Control: no-store`.
- **Liaison** : au premier rendez-vous, un compte est ouvert et le lien d'activation part. Booking publie l'événement `RendezVousReserve`, `src/Liaisons/CompteApresRendezVous.php` l'écoute. Les deux modules ne se connaissent pas, et un échec n'empêche pas la réservation.
- **Site** :
  - `/mon-espace/connexion` : mot de passe, ou lien reçu par mail ;
  - `/mon-espace/lien` : le lien n'est consommé que par un POST, une seule fois ;
  - `/mon-espace/mot-de-passe` : demande du lien, puis choix du mot de passe ;
  - `/mon-espace` : compte, sécurité, appareils, déconnexion ;
  - pages privées exclues du sitemap et des robots, lien « Espace client » dans le pied de page ;
  - appels à l'API regroupés dans `src/app/api.ts`.
- **Dépendances** : `symfony/password-hasher`, `symfony/rate-limiter`.

## À quoi ça sert
Première brique de la V3 : sans inscription, chaque client a un espace où viendront ses demandes, ses devis et ses rendez-vous (branche suivante).

## Comment l'utiliser
- En développement :
  - API : `cd api && docker compose up -d database`, `php bin/console doctrine:migrations:migrate`, `php -S localhost:8000 -t public` ;
  - site : `VITE_API_URL=http://localhost:8000 npm run dev -w front`.
- Mise en ligne : variables `AUTH_*` et `CORS_ALLOW_ORIGIN` (voir `docs/deploiement.md`), puis la migration.
- Détails des points d'entrée et installation chez un client : `api/src/Auth/README.md`.

## Tests
- **unitaires** :
  - API : domaine (14 tests), cas d'usage (19 tests, horloge réglable), appareils, hachage, secrets et mails (15 tests) ;
  - site : règle du mot de passe.
- **fonctionnels** :
  - `AuthHttpTest` (13 tests sur MySQL avec le vrai cookie) : activation, lien à usage unique, non-énumération, mot de passe, 429, 415, appareils, déconnexion, mot de passe qui déconnecte tout, CORS ;
  - `CompteApresRendezVousTest` (2 tests) ;
  - `MonEspace.test.tsx` (17 tests, API simulée) : connexion, erreurs, panne, lien utilisé une seule fois même en StrictMode, mot de passe, espace, appareils, déconnexion.
- **architecture** : le domaine Auth ne dépend ni de Symfony ni de Doctrine.
- **CI** : migrations sur base vide, schéma validé.

Résultats : API 127 tests verts sur MySQL (21 ignorés sans base) ; site 249 et bibliothèque 70 tests verts ; lint et builds verts.

Lancer : `npm run test -w front` ; API : voir `docs/api.md`.

## Fichiers principaux
- `api/src/Auth/`, `api/src/Liaisons/`, `api/src/Booking/Infrastructure/Evenement/`
- `api/config/packages/auth.yaml`, `doctrine.yaml`, `nelmio_cors.yaml`, `api/.env.dist`, `api/migrations/Version20261105195537.php`
- `api/tests/Auth/`, `api/tests/Liaisons/`, `api/tests/AvecBaseDeDonnees.php`
- `front/src/pages/MonEspace/`, `front/src/app/api.ts`, `front/src/data/espace.ts`

## Reste ouvert
- **Demande de devis** : elle passe encore par `devis.php` (sans l'API), donc elle n'ouvre pas de compte. Ce sera fait quand les demandes passeront par l'API (module Prospect, espace client complet).
- **Changement d'e-mail** avec confirmation : prévu avec « Mon compte » dans l'espace client complet.
- **Nettoyage** des liens et sessions expirés : une commande planifiée sera utile une fois en production.
- **Mise en ligne** : variables du serveur et migration ; le cookie fonctionne entre `bsandoz.fr` et `api.bsandoz.fr` (même site).
