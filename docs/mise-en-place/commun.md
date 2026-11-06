# Commun à toutes les fiches

Exemple : le client a le domaine `client.fr`. Remplacer partout.

## Le site
1. Partir d'un projet React + Vite + TypeScript, avec `react-router-dom`.
2. Livrer les blocs de la fiche : `npm run livrer -- <Blocs> --vers <projet>/src/blocs`.
3. Copier les fichiers listés dans la fiche, **au même endroit** (`front/src/…` → `<projet>/src/…`), ainsi que `front/src/styles/` et `front/src/index.css`.
4. Les pages copiées importent `@bsandoz79/blocs`. Faire pointer ce nom vers la copie, sans rien installer :
   ```ts
   // vite.config.ts
   resolve: { alias: { '@bsandoz79/blocs': fileURLToPath(new URL('./src/blocs/index.ts', import.meta.url)) } }
   ```
   ```jsonc
   // tsconfig, dans compilerOptions
   "paths": { "@bsandoz79/blocs": ["./src/blocs/index.ts"] }
   ```
5. À l'entrée du site, importer `./blocs/styles/base.css` puis `./index.css`. Refaire `styles/tokens.css` aux couleurs du client.
6. Déclarer les routes des pages copiées. Copier `front/public/.htaccess` dans `public/` (adresses des pages, HTTPS obligatoire).
7. Remplacer ce qui est à moi : `site` dans `data/pages.ts`, `contact` dans `data/navigation.ts`, `components/PageMeta/formatTitle.ts`, et les textes de `data/`.
8. Construire avec l'adresse de **son** API, si la fiche en utilise une : `VITE_API_URL=https://api.client.fr npm run build`. Sans cette variable, le site appelle `api.bsandoz.fr`.
9. Envoyer le contenu de `dist/` dans le dossier public de `client.fr`.

## L'API
PHP 8.3 avec `pdo_mysql`, `ctype`, `iconv`, plus `dom` et `mbstring` pour les devis en PDF. `intl` est facultative (mais recommandée : date des mails mieux écrite). Si l'hébergement n'a pas Composer, préparer les fichiers sur le poste.

1. Copier `api/` sans `var/`, `tests/`, `compose*.yaml`, `phpunit.dist.xml` ni `.env.local`.
2. Retirer ce qui ne sert pas, selon la fiche :
   - les dossiers `src/<Module>` et les fichiers `config/packages/<module>.yaml` ;
   - leur bloc dans `config/packages/doctrine.yaml` (sous `mappings`) ;
   - leurs migrations ;
   - `src/Liaisons/` et `src/BackOffice/`, sauf pour l'espace client ;
   - le bloc `when@test` de `config/services.yaml` si Prospect est retiré.
3. Retirer les dépendances inutiles (liste dans la fiche) : `composer remove --no-scripts <paquets>`.
4. Installer pour la production :
   ```sh
   # sur le poste, avec Docker (sous Git Bash : MSYS_NO_PATHCONV=1 et $(pwd -W))
   docker run --rm -v "$PWD:/app" -w /app composer:2 composer install --no-dev --optimize-autoloader --no-scripts
   ```
5. Envoyer les fichiers sur le serveur. Le dossier public du domaine `api.client.fr` doit être **`public/`**, jamais la racine du projet : sinon `.env.local` et ses mots de passe seraient lisibles par tous. Le dossier `var/` doit être accessible en écriture.
6. Écrire `.env.local` sur le serveur, jamais dans git :
   ```sh
   APP_ENV=prod
   APP_SECRET=          # php -r "echo bin2hex(random_bytes(16));" : une valeur différente par client
   DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@localhost:3306/BASE?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
   CORS_ALLOW_ORIGIN='^https://(www\.)?client\.fr$'
   MAILER_DSN=smtp://no-reply%40client.fr:MOT_DE_PASSE@mail.client.fr:465
   ```
   plus les variables de la fiche. **Toutes sont obligatoires** : `.env.dist` contient mes adresses, et une variable oubliée enverrait les mails de ses clients chez moi.
7. Sur le serveur :
   ```sh
   php bin/console cache:clear
   php bin/console doctrine:migrations:migrate
   ```

## La base de données
Créer une base vide et un utilisateur limité à cette base. Indiquer la **vraie version** du serveur dans `serverVersion` :
- MariaDB : par exemple `10.11.2-MariaDB` (essayée) ;
- MySQL : par exemple `8.0.40` (essayée).

Prévoir les sauvegardes dès le premier jour. Autonome : à expliquer au client. Je gère : à ma charge.

## Les mails
1. Créer l'adresse d'envoi `no-reply@client.fr` et une adresse de réception `contact@client.fr`.
2. Dans le DNS de `client.fr`, activer SPF et DKIM pour le serveur qui envoie (DMARC conseillé). Sans cela, les mails partent en indésirables.
3. Dans `MAILER_DSN`, encoder les caractères spéciaux du mot de passe et le `@` de l'identifiant (`%40`). Le serveur et le port dépendent de l'hébergeur : l'exemple ci-dessus est à adapter.

**L'envoi réel n'a encore jamais été essayé.** Essayer d'abord avec une adresse à soi, et regarder les indésirables.

## Le domaine
| Adresse | Sert à |
| --- | --- |
| `client.fr` | le site |
| `api.client.fr` | l'API (si la fiche en utilise une) |

HTTPS actif sur les deux. Les variables `*_URL_*` de la fiche pointent sur ces adresses.

**Pourquoi `api.client.fr` et pas une adresse à moi ?** Le cookie de connexion est en `SameSite=Lax` : le navigateur ne le transmet à l'API que si elle est sur le même domaine que le site. Avec `client.fr` et `api.bsandoz.fr`, la personne ne resterait pas connectée. Les rendez-vous et les demandes de devis, eux, n'ont pas besoin du cookie : seul `CORS_ALLOW_ORIGIN` compte.

| | Autonome | Je gère pour lui |
| --- | --- | --- |
| DNS de `client.fr` | chez lui, vers son hébergement | chez lui, `client.fr` et `api.client.fr` vers mon serveur |
| Ajout sur le serveur | sur son compte | sur mon compte, en domaine supplémentaire, avec son propre dossier |

## Vérifications finales
Pour une API :
```sh
curl -i https://api.client.fr/sante                 # 200 {"statut":"ok"}
curl -I https://api.client.fr/.env.local            # 404
curl -s https://api.client.fr/inexistant | grep -ci "vendor/"   # 0 : aucun détail technique affiché
```
Sur un téléphone et un ordinateur :
- [ ] chaque page copiée s'affiche, et actualiser une page ne donne pas de 404 ;
- [ ] le parcours de la fiche marche de bout en bout, **avec une vraie boîte mail**, indésirables compris ;
- [ ] mentions légales et politique de confidentialité **du client** en ligne, adaptées à ce qui est installé ;
- [ ] pas de prix, d'avis ni de chiffres inventés : `[à compléter]` là où il manque une information.

Rien ne doit rester de moi :
```sh
grep -rl "api.bsandoz.fr" dist/                                # rien
grep -rniE "bsandoz|baptiste|amiens" src/data src/pages src/components
grep -rniE "bsandoz|baptiste|amiens" config src .env.local     # côté API, commentaires exceptés
```

Puis, selon la façon de livrer :
- **Autonome** : je lui remets le code, les accès et la fiche ; il change ses mots de passe ; je ne garde aucun accès.
- **Je gère** : contrat signé, sauvegarde automatique vérifiée par une vraie restauration, secrets rangés à part de ceux des autres clients.

## Mises à jour
Chaque client a sa copie : un correctif fait ici n'arrive pas tout seul chez lui.
- **Autonome** : seulement s'il le demande.
- **Je gère** : garder la liste des clients et de ce qu'ils ont reçu (`LIVRAISON.md`, commit de départ), et reporter les correctifs de sécurité chez chacun.

## Passer d'une façon à l'autre
**De « je gère » à « autonome »** :
1. Il prend un hébergement et une boîte d'envoi.
2. Je lui remets le code et une copie de la base.
3. On installe chez lui avec un nouveau `APP_SECRET` et de nouveaux mots de passe, puis on vérifie.
4. Il change son DNS.
5. J'efface sa base et ses fichiers chez moi.

**D'« autonome » à « je gère »** : le même chemin à l'envers, contrat signé d'abord.
