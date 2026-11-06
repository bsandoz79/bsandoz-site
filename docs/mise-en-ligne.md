# Mise en ligne de bsandoz.fr

Le pas-à-pas pour Baptiste, faisable en grande partie depuis un téléphone. On commence sur `preview.bsandoz.fr`, et on passe sur `bsandoz.fr` quand tout est bon. Les noms des menus d'o2switch sont à titre indicatif. Ce qui a été vérifié sur le vrai serveur est dans [Ce qui a été vérifié sur o2switch](#ce-qui-a-été-vérifié-sur-o2switch).

Rien ici ne doit être écrit dans le dépôt : les mots de passe vont dans les secrets GitHub ou dans `.env.local` sur le serveur.

## 1. Sur o2switch (cPanel)
1. **Sous-domaines** : créer `preview.bsandoz.fr` et `api.bsandoz.fr`. Le dossier de `api.bsandoz.fr` doit se terminer par **`/public`**, par exemple `/home/COMPTE/api.bsandoz.fr/public`.
2. **PHP** : version 8.3 pour ces deux domaines. Noter dans le terminal ce que répond `php -v` : si ce n'est pas 8.3, trouver le chemin du PHP 8.3 et l'utiliser dans toutes les commandes ci-dessous.
3. **HTTPS** : vérifier que le certificat est actif sur les deux sous-domaines.
4. **Base de données** : créer une base et un utilisateur limité à cette base. Noter dans phpMyAdmin la version exacte (MySQL ou MariaDB).
5. **Boîtes mail** : créer `no-reply@bsandoz.fr` (envoi), `reponses@bsandoz.fr` (réponses relevées automatiquement, à ne pas lire à la main) et vérifier `contact@bsandoz.fr`. Activer SPF et DKIM pour le domaine.
6. **Comptes FTP** : un pour `preview.bsandoz.fr`, un pour le dossier `/home/COMPTE/api.bsandoz.fr` (pas `public`).

## 2. Sur GitHub
Dépôt → Settings → Secrets and variables → Actions.

**Secrets** (New repository secret) :

| Secret | Valeur |
| --- | --- |
| `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` | compte FTP du site ; serveur : **`muguet.o2switch.net`** (nom du certificat FTP, pas `ftp.saba3655.odns.fr`) |
| `FTP_SERVER_DIR` | dossier du site, terminé par `/` (`/` si le compte pointe déjà dessus) |
| `API_FTP_SERVER`, `API_FTP_USERNAME`, `API_FTP_PASSWORD` | compte FTP de l'API ; serveur : **`muguet.o2switch.net`** |
| `API_FTP_SERVER_DIR` | dossier de l'API, terminé par `/` (`/` si le compte pointe déjà dessus) |

**Variables** (onglet Variables → New repository variable) :

| Variable | Valeur |
| --- | --- |
| `VITE_API_URL` | `https://api.bsandoz.fr` |
| `VITE_DEVIS_URL` | `https://api.bsandoz.fr/demandes` |

## 3. Envoyer l'API
Actions → **Déploiement de l'API** → Run workflow, sur `main`. Le premier envoi est long : plusieurs milliers de fichiers.

## 4. Régler l'API sur le serveur
Avec le gestionnaire de fichiers de cPanel, créer `.env.local` à la racine de l'API (à côté de `composer.json`, jamais dans `public`) :

```sh
APP_ENV=prod
APP_SECRET=          # 32 caractères au hasard. Ne plus jamais le changer : il signe les références des mails.
DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@localhost:3306/BASE?serverVersion=VERSION&charset=utf8mb4"
CORS_ALLOW_ORIGIN='^https://(preview\.)?bsandoz\.fr$'
MAILER_DSN=smtp://no-reply%40bsandoz.fr:MOT_DE_PASSE@SERVEUR_MAIL:465

BOOKING_EXPEDITEUR=no-reply@bsandoz.fr
BOOKING_PROFESSIONNEL_NOM="Baptiste Sandoz"
BOOKING_PROFESSIONNEL_EMAIL=contact@bsandoz.fr
BOOKING_URL_PUBLIQUE=https://api.bsandoz.fr

AUTH_URL_SITE=https://preview.bsandoz.fr
AUTH_EXPEDITEUR=no-reply@bsandoz.fr
AUTH_EXPEDITEUR_NOM="Baptiste Sandoz"
AUTH_COOKIE_SECURISE=1

BACKOFFICE_EMAILS=contact@bsandoz.fr

PROSPECT_EXPEDITEUR=no-reply@bsandoz.fr
PROSPECT_PROFESSIONNEL_NOM="Baptiste Sandoz"
PROSPECT_PROFESSIONNEL_EMAIL=contact@bsandoz.fr
PROSPECT_URL_SITE=https://preview.bsandoz.fr
PROSPECT_SIRET=
PROSPECT_BOITE_REPONSES=reponses@bsandoz.fr
PROSPECT_IMAP_HOTE=SERVEUR_MAIL
PROSPECT_IMAP_UTILISATEUR=reponses@bsandoz.fr
PROSPECT_IMAP_MOT_DE_PASSE=
```
- `VERSION` : par exemple `8.0.40`, ou `10.11.2-MariaDB`, selon l'étape 1.
- Dans `DATABASE_URL` et `MAILER_DSN`, encoder les caractères spéciaux du mot de passe. Le plus simple : un mot de passe long, en lettres et chiffres seulement.
- `SERVEUR_MAIL` et le port : ceux donnés par cPanel → Comptes de messagerie → Configurer le client de messagerie.

Puis dans le terminal de cPanel :
```sh
cd ~/api.bsandoz.fr
mkdir -p var
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
php bin/console backoffice:ouvrir-acces contact@bsandoz.fr "Baptiste Sandoz"
```
Le dernier envoie le lien d'activation : c'est le premier vrai test des mails.

## 5. Tâches planifiées (cPanel → Tâches Cron)
Remplacer `COMPTE`.
```sh
*/5 * * * *  cd /home/saba3655/api.bsandoz.fr && /opt/cpanel/ea-php83/root/usr/bin/php bin/console prospect:relever-mails
0 11 * * *   cd /home/saba3655/api.bsandoz.fr && /opt/cpanel/ea-php83/root/usr/bin/php bin/console booking:envoyer-rappels
```
Le fuseau du serveur peut ne pas être celui de Paris : c'est sans effet sur le choix du lendemain.

## 6. Envoyer le site
Tout envoi sur `main` déploie le site. Pour le relancer sans rien changer : Actions → **Déploiement o2switch** → Run workflow.

## 7. Vérifier
Sur téléphone :
- [ ] `https://api.bsandoz.fr/sante` affiche `{"statut":"ok"}`.
- [ ] `https://api.bsandoz.fr/.env.local` répond 404. **Sinon, arrêter tout de suite** : le dossier public est mal réglé et les mots de passe sont lisibles.
- [ ] Le mail d'activation est arrivé (indésirables compris). Choisir un mot de passe solide. Aller sur `/admin`.
- [ ] Envoyer une demande sur `/devis` avec une autre adresse : accusé reçu, demande visible dans `/admin`.
- [ ] Depuis cette autre adresse : activer le compte, **actualiser la page et rester connecté**.
- [ ] Depuis `/admin`, répondre. Le client reçoit le mail, y répond depuis sa boîte, et la réponse arrive dans le fil en 5 minutes.
- [ ] Établir un devis, l'accepter côté client, télécharger le PDF.
- [ ] Prendre un rendez-vous : mail et `.ics` reçus, lien d'annulation qui marche.
- [ ] Tester les mails sur Gmail et Outlook si possible : le retrait des citations n'a jamais été essayé sur de vrais logiciels.
- [ ] Rien ne part en indésirables.

## 8. Remplir le back-office
Dans `/admin`, onglet **Disponibilités** : les vrais jours, créneaux et congés. Les valeurs actuelles viennent de la maquette.

## 9. Passer sur bsandoz.fr
1. Faire pointer le compte FTP du site, ou `FTP_SERVER_DIR`, sur le dossier de `bsandoz.fr`.
2. Dans `.env.local` : `AUTH_URL_SITE=https://bsandoz.fr` et `PROSPECT_URL_SITE=https://bsandoz.fr`. Si `preview` ne sert plus, `CORS_ALLOW_ORIGIN='^https://bsandoz\.fr$'`.
3. `php bin/console cache:clear`, puis Actions → Déploiement o2switch → Run workflow.
4. Refaire les vérifications ci-dessus.

## Mettre à jour plus tard
1. Actions → Déploiement de l'API → Run workflow.
2. Dans le terminal, depuis `~/api.bsandoz.fr` : `/opt/cpanel/ea-php83/root/usr/bin/php bin/console cache:clear`, puis `/opt/cpanel/ea-php83/root/usr/bin/php bin/console doctrine:migrations:migrate`.

Ne pas changer `APP_SECRET`. Prévoir une sauvegarde automatique de la base : elle contient les comptes et les devis.

## Ce qui a été vérifié sur o2switch
- **Images envoyées depuis le site** : dans `~/api.bsandoz.fr/public/medias/`. Elles ne sont pas dans le dépôt : à inclure dans les sauvegardes.
Constaté le 6 novembre 2026, à la première mise en ligne de l'API :
- **PHP du terminal** : la commande `php` y est en 8.1, indépendamment du réglage du site. Toutes les commandes passent par `/opt/cpanel/ea-php83/root/usr/bin/php` (extensions `pdo_mysql`, `mbstring`, `intl`, `ctype`, `iconv`, `openssl` présentes).
- **PHP du site** : il se règle à part dans cPanel. En 8.1, l'API répond 500 avec « Your Composer dependencies require a PHP version >= 8.2.0 ».
- **Base** : MariaDB 11.4 (`serverVersion=11.4.13-MariaDB`), les 9 migrations passent.
- **Serveur de mail** : `muguet.o2switch.net`, port 465, certificat valide. `mail.bsandoz.fr` a un certificat à un autre nom : ne pas l'utiliser.
- **Sous-domaine** : `api.bsandoz.fr`, racine `api.bsandoz.fr/public`. `.env.local` et `.env.dist` répondent 403, `composer.json` 404.
- **Le déploiement de l'API** ne part pas tout seul : il se lance à la main, dans Actions.
- **`bin/console` sans aucun message** veut dire qu'une erreur est masquée. Relancer avec `php -d display_errors=1`. Exemple rencontré : un retour à la ligne glissé au collage dans `MAILER_DSN`.
- **`BACKOFFICE_EMAILS`** donne l'accès selon l'adresse du compte. Changer l'adresse de son compte coupe l'accès au back-office : mettre la nouvelle adresse dans cette liste, puis `cache:clear`.

## Ce qui n'a pas encore été essayé
La relève des réponses par IMAP (`reponses@bsandoz.fr`) et le parcours complet du point 7. Le reste a d'abord tourné dans Docker et dans Chrome, sur `localhost` : voir `docs/journal/36-chore-mise-en-ligne.md`.
