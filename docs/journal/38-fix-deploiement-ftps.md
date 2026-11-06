# Déploiement FTPS avec lftp

Branche `fix/deploiement-ftps` · 2026-11-06

## Ce qui a été fait
Premier déploiement réel sur `preview.bsandoz.fr` : la connexion FTPS réussissait, mais l'envoi échouait à l'ouverture du canal de données (`Error: Client is closed because read ECONNRESET (data socket)`). Le serveur FTP d'o2switch exige la réutilisation de la session TLS sur ce canal, ce que l'action `FTP-Deploy-Action` ne fait pas.

L'envoi du site (`deploy.yml`) et celui de l'API (`deploy-api.yml`) passent désormais par **lftp** :
- FTPS sur les deux canaux, certificat vérifié, mode passif ;
- 3 nouvelles tentatives en cas de coupure ;
- mot de passe transmis par la variable `LFTP_PASSWORD`, jamais dans la ligne de commande ;
- aucun fichier supprimé côté serveur ;
- pour l'API, mêmes exclusions qu'avant : `.git`, `var/`, `tests/`, `compose*.yaml`, `phpunit.dist.xml`, `.env.local`, `.env.dev`.

## À quoi ça sert
Mettre le site en ligne automatiquement à chaque push sur `main`.

## Comment l'utiliser
Rien ne change : mêmes secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`). Lancement à la main : onglet Actions → Déploiement o2switch → Run workflow.

## Tests
- **vérification** : YAML des deux workflows analysé ; exclusions de l'API vérifiées avec un vrai lftp vers un dossier local (Docker) ; script d'envoi exécuté à blanc (lftp remplacé par un affichage) avec un mot de passe contenant guillemet, virgule et `$` : les commandes sont correctes et le mot de passe n'apparaît pas.
- **CI** : le déploiement réel sur `preview.bsandoz.fr` est relancé par la fusion dans `main`.

## Fichiers principaux
- `.github/workflows/deploy.yml`, `.github/workflows/deploy-api.yml`, `docs/deploiement.md`

## Reste ouvert
- **Valider le premier envoi réel**, puis tester `https://preview.bsandoz.fr`.
- **Production** : second compte FTP (dossier `bsandoz.fr`) et secrets séparés.
