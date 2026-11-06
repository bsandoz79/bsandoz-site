# Déploiement

## Intégration continue (`.github/workflows/ci.yml`)
À chaque push, sur toutes les branches :
- **blocs** : lint, tests, build de la bibliothèque `@bsandoz79/blocs` ;
- **front** : lint, tests, build du site ;
- **api** : PHP 8.3, `composer install`, vérification du conteneur et de la configuration YAML, connexion à une base MySQL 8.0 de test, validation Doctrine, tests PHPUnit, construction du cache de production.

## Déploiement continu (`.github/workflows/deploy.yml`)
À chaque push sur `main` : tests, build, puis envoi du dossier `front/dist/` sur o2switch en FTPS.
Le FTP est utilisé plutôt que le SSH car l'accès SSH d'o2switch se limite aux adresses IP autorisées, alors que celles de GitHub Actions changent.

L'envoi (site et API, `deploy-api.yml`) utilise **lftp** en FTPS (canal de commande et canal de données chiffrés, certificat vérifié). L'action `FTP-Deploy-Action` échouait chez o2switch avec « ECONNRESET (data socket) », car le serveur exige la réutilisation de la session TLS sur le canal de données. Le mot de passe passe par la variable `LFTP_PASSWORD`, jamais par la ligne de commande. Aucun fichier n'est supprimé côté serveur : les anciens fichiers `assets/` restent, sans gêner.

Exemple (préversion) : serveur `ftp.saba3655.odns.fr`, compte `deploy-preview@bsandoz.fr` limité au dossier `preview.bsandoz.fr`, `FTP_SERVER_DIR` = `/`.

## Secrets GitHub à créer
Dépôt → Settings → Secrets and variables → Actions → New repository secret :

| Secret | Valeur |
| --- | --- |
| `FTP_SERVER` | serveur FTP o2switch (ex. `muguet.o2switch.net`) |
| `FTP_USERNAME` | un compte FTP dédié, créé dans cPanel → Comptes FTP |
| `FTP_PASSWORD` | son mot de passe |
| `FTP_SERVER_DIR` | dossier cible, terminé par `/` (ex. `/` si le compte FTP pointe déjà sur `preview.bsandoz.fr`) |

Conseil : créer un compte FTP limité au dossier `preview.bsandoz.fr` (puis `bsandoz.fr` pour la production).
Sans ces secrets, le workflow passe mais n'envoie rien.

## Publication de la bibliothèque de blocs (`.github/workflows/blocs-publication.yml`)
Pousser une étiquette `blocs-vX.Y.Z` identique à la version de `packages/blocs/package.json` : tests, build, puis publication privée sur GitHub Packages (jeton fourni par GitHub, aucun secret à créer).

## Versions et retour à une version précédente
Chaque version validée est figée par une étiquette git et garde une branche de maintenance :

| Version | Étiquette | Branche | Contenu |
| --- | --- | --- | --- |
| V1 | `v1.0.0` | `release/v1` | site vitrine et configurateur (front seul) |
| V2 | `v2.0.0` | `release/v2` | + page Rendez-vous, API Symfony (module Booking), bibliothèque de blocs, pré-devis |
| V3 | `v3.0.0` | `release/v3` | + comptes, espace client, fil de messages (IMAP), rappels, back-office |

Exemples ci-dessous avec la V1 ; remplacer par `v2.0.0` / `release/v2` ou `v3.0.0` / `release/v3` pour les suivantes.

**Remettre une version en ligne** (sans toucher à `main`) :
1. GitHub → onglet **Actions** → **Déploiement o2switch** → **Run workflow**.
2. Dans « Use workflow from », choisir **Tags → v1.0.0** (ou la branche `release/v1` si un correctif y a été ajouté).
3. Lancer : le site de cette version est reconstruit et renvoyé sur o2switch.

Ce workflow ne déploie que le site (`front/dist/`). L'API a son propre workflow, lancé à la main : **Déploiement de l'API**. Pas-à-pas complet : `docs/mise-en-ligne.md`.

**Corriger une version** : partir de sa branche (`git switch release/v1`, puis `git switch -c fix/<nom>`), fusionner le correctif dans `release/v1`, étiqueter `v1.0.1`, puis redéployer comme ci-dessus.

**Consulter une version sur son poste** : `git switch --detach v1.0.0`, puis `npm ci` et `npm run dev -w front` (revenir ensuite avec `git switch main`). Avant la V2, le front s'installait depuis `front/` (`npm ci` dans `front/`).

## Envoi des demandes de devis (`front/public/api/devis.php`)
Le script est copié avec le site (`dist/api/devis.php`) et utilise la fonction `mail()` d'o2switch : aucun service externe, aucun secret.
- Destinataire : `contact@bsandoz.fr` ; expéditeur : `no-reply@bsandoz.fr` (adresse à créer dans cPanel pour une bonne délivrabilité, avec SPF/DKIM actifs).
- Le client reçoit un accusé de réception avec le récapitulatif de sa demande.
- Anti-spam : champ piège `site_web`, 1 envoi par minute et 3 par heure par adresse IP (empreinte stockée dans le dossier temporaire du serveur).
- Photos : 3 au plus, 5 Mo chacune, JPEG / PNG / WebP vérifiés sur le contenu.
- En développement (`npm run dev`), PHP n'est pas servi : l'envoi échoue et le parcours affiche le message d'erreur prévu.
- Le lien de suivi de la demande viendra avec l'API (V2).

## API et espace client (à la mise en ligne de `api.bsandoz.fr`)
Le site appelle l'API à l'adresse `VITE_API_URL` (par défaut `https://api.bsandoz.fr`), avec le cookie de session. `bsandoz.fr` et `api.bsandoz.fr` sont le même site : le cookie `SameSite=Lax` circule.

Le dossier public du domaine de l'API doit être `api/public` : son `.htaccess` envoie toutes les adresses à `index.php` (sans lui, Apache répond 404 partout). Après chaque envoi : `php bin/console cache:clear`.

Dans `api/.env.local` sur le serveur (jamais versionné) :
- `CORS_ALLOW_ORIGIN='^https://bsandoz\.fr$'` : seul le site peut appeler l'API avec le cookie ;
- `AUTH_URL_SITE=https://bsandoz.fr` : les liens des mails mènent au site ;
- `AUTH_EXPEDITEUR`, `AUTH_EXPEDITEUR_NOM`, `MAILER_DSN` (SMTP o2switch) ;
- `AUTH_COOKIE_SECURISE=1` (de toute façon forcé en production) ;
- `PROSPECT_EXPEDITEUR`, `PROSPECT_PROFESSIONNEL_EMAIL`, `PROSPECT_URL_SITE=https://bsandoz.fr`, `PROSPECT_SIRET` (après immatriculation) ;
- `PROSPECT_BOITE_REPONSES`, `PROSPECT_IMAP_HOTE`, `PROSPECT_IMAP_UTILISATEUR`, `PROSPECT_IMAP_MOT_DE_PASSE` : boîte dédiée aux réponses, relevée en IMAP ;
- `BACKOFFICE_EMAILS=contact@bsandoz.fr` : adresses autorisées dans le back-office, puis une fois `php bin/console backoffice:ouvrir-acces contact@bsandoz.fr "Baptiste Sandoz"` ;
- puis `php bin/console doctrine:migrations:migrate`.

Tâches planifiées (cPanel → Tâches Cron) :
- toutes les 5 minutes : `php bin/console prospect:relever-mails` ;
- une fois par jour : `php bin/console booking:envoyer-rappels`.

Côté site, une fois l'API en ligne : ajouter `VITE_DEVIS_URL=https://api.bsandoz.fr/demandes` au build (variable `VITE_DEVIS_URL` du dépôt GitHub, lue par le workflow de déploiement) pour que les demandes de devis passent par l'API (enregistrement, compte client, suivi). Sans elle, `devis.php` reste utilisé.

En développement : API sur `http://localhost:8000`, site sur `http://localhost:5173` avec `VITE_API_URL=http://localhost:8000`, `AUTH_COOKIE_SECURISE=0` (valeurs de `api/.env.dist`).

## Attention au YAML
Dans un fichier de workflow, une valeur sans guillemets ne doit pas contenir « : » suivi d'une espace (YAML y voit une nouvelle clé et GitHub refuse le fichier : « Fichier de workflow invalide »). Mettre la valeur entière entre guillemets ou utiliser un bloc `run: |`.

## Routes
`front/public/.htaccess` renvoie toutes les routes vers `index.html` et force le HTTPS.
