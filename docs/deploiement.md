# Déploiement

## Intégration continue (`.github/workflows/ci.yml`)
À chaque push, sur toutes les branches : lint, tests, build du front.

## Déploiement continu (`.github/workflows/deploy.yml`)
À chaque push sur `main` : tests, build, puis envoi du dossier `front/dist/` sur o2switch en FTPS.
Le FTP est utilisé plutôt que le SSH car l'accès SSH d'o2switch se limite aux adresses IP autorisées, alors que celles de GitHub Actions changent.

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

## Routes
`front/public/.htaccess` renvoie toutes les routes vers `index.html` et force le HTTPS.
