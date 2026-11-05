# Module Auth

Comptes clients (V3) : compte ouvert automatiquement et activé par un lien reçu par mail, connexion par lien (sans mot de passe) ou par mot de passe, changement du mot de passe par un lien valable 1 h, sessions et appareils connectés. Module **autonome** : il s'installe tel quel dans l'API d'un client.

## Couches
- `Domain/` : `Compte` (en attente → actif), `Lien` (usage unique : activation 7 jours, connexion 15 min, mot de passe 1 h), `Session` (30 jours sans activité), `PolitiqueMotDePasse` (12 à 200 caractères), `Email`, `Secret` (empreinte SHA-256) et les ports. Aucune dépendance à Symfony ni à Doctrine.
- `Application/` : `OuvrirCompte`, `DemanderLien`, `UtiliserLien`, `SeConnecter`, `DefinirMotDePasse`, `Sessions` (session courante, déconnexion, appareils, déconnecter les autres).
- `Infrastructure/` :
  - `Http/AuthController.php` : points d'entrée JSON, cookie de session ; `Http/Appareil.php` : « Firefox sur Windows » d'après le User-Agent.
  - `Http/SessionDeLaRequete.php` : session de la personne qui fait la requête (lecture du cookie), pour protéger d'autres points d'entrée.
  - `Doctrine/` : dépôts et correspondances XML (tables `auth_compte`, `auth_lien`, `auth_session`).
  - `Mail/NotificationsCompteParMail.php` : mails des liens et de confirmation.
  - `Systeme/` : horloge, aléatoire (UUID v7, secrets de 256 bits), hachage natif (Argon2id ou bcrypt).

## Sécurité
- Les secrets (liens, sessions) ne sont **jamais stockés** : seule leur empreinte SHA-256 l'est. Ils ne sont jamais renvoyés par l'API : les liens partent par mail, la session tient dans un cookie `HttpOnly`, `SameSite=Lax`, `Secure` en production.
- Les liens des mails mènent **au site**, qui confirme par une requête `POST` : un antivirus qui « visite » les liens ne consomme rien.
- Un nouveau lien annule les précédents du même usage ; changer de mot de passe ferme toutes les sessions et envoie un mail de confirmation.
- Pas d'énumération des comptes : demander un lien répond toujours `202`, la connexion répond « E-mail ou mot de passe incorrect » et vérifie un mot de passe même si le compte n'existe pas.
- Limitation : 5 connexions par quart d'heure et 5 liens par heure, par adresse IP et e-mail (`429`).
- Requêtes qui modifient quelque chose : corps JSON obligatoire (`415` sinon) ; depuis un autre site, le navigateur doit alors demander la permission CORS, accordée seulement au site (`CORS_ALLOW_ORIGIN`, avec cookies).

## Points d'entrée
| Méthode | Adresse | Corps | Réponses |
| --- | --- | --- | --- |
| POST | `/auth/lien` | `{ email, usage: "connexion" \| "mot_de_passe" }` | 202 · 400 · 429 |
| POST | `/auth/lien/utiliser` | `{ jeton }` (activation ou connexion) | 200 `{ compte }` + cookie · 410 lien expiré ou déjà utilisé |
| POST | `/auth/connexion` | `{ email, motDePasse }` | 200 `{ compte }` + cookie · 401 · 429 |
| POST | `/auth/mot-de-passe` | `{ jeton, motDePasse }` | 204 · 400 `{ erreurs }` · 410 |
| GET | `/auth/moi` | — | 200 `{ compte }` · 401 |
| POST | `/auth/deconnexion` | `{}` | 204 (cookie effacé) |
| GET | `/auth/appareils` | — | 200 `{ appareils: [{ id, appareil, connecteLe, derniereActivite, courant }] }` · 401 |
| POST | `/auth/appareils/deconnecter-les-autres` | `{}` | 200 `{ deconnectes }` · 401 |

`compte` : `{ id, email, nom, statut: "en_attente" | "actif", motDePasse: bool, motDePasseModifieLe }`.

Liens des mails : `{AUTH_URL_SITE}/mon-espace/lien?jeton=…` (activation, connexion) et `{AUTH_URL_SITE}/mon-espace/mot-de-passe?jeton=…`.

## Réglages
`config/packages/auth.yaml` (paramètres, limites d'essais, ports) et variables d'environnement : `AUTH_URL_SITE`, `AUTH_EXPEDITEUR`, `AUTH_EXPEDITEUR_NOM`, `AUTH_COOKIE_SECURISE` (forcé à vrai en production), plus `MAILER_DSN` et `CORS_ALLOW_ORIGIN`.

## Installer le module dans l'API d'un client
1. Copier `src/Auth/` et `config/packages/auth.yaml`.
2. `config/services.yaml` : exclure les domaines des services (`exclude: ['../src/*/Domain/', '../src/Kernel.php']`).
3. `config/packages/doctrine.yaml` : déclarer la correspondance `Auth` (`dir: src/Auth/Infrastructure/Doctrine/mapping`, `prefix: App\Auth\Domain`).
4. `config/packages/nelmio_cors.yaml` : `allow_credentials: true`.
5. Dépendances : `symfony/mailer`, `symfony/uid`, `symfony/password-hasher`, `symfony/rate-limiter`, `doctrine/orm`, `nelmio/cors-bundle`.
6. Migration `migrations/Version20261105195537.php`, puis `doctrine:migrations:migrate`.
7. Ouvrir les comptes là où c'est utile : appeler `OuvrirCompte` (voir `src/Liaisons/CompteApresRendezVous.php`).

## Tests
- `tests/Auth/Domain`, `tests/Auth/Application` : règles et cas d'usage avec des doublures (horloge réglable, mails enregistrés).
- `tests/Auth/Infrastructure/AppareilEtMailsTest.php` : appareils, hachage, secrets, mails.
- `tests/Auth/Infrastructure/AuthHttpTest.php` : parcours HTTP complets sur MySQL avec le vrai cookie (activation, lien à usage unique, non-énumération, mot de passe, 429, 415, appareils, déconnexion, CORS).
