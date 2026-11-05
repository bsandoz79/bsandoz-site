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

## Versions et retour à la V1
Chaque version validée est figée par une étiquette git (`v1.0.0`) et garde une branche de maintenance (`release/v1`).

**Remettre la V1 en ligne** (sans toucher à `main`) :
1. GitHub → onglet **Actions** → **Déploiement o2switch** → **Run workflow**.
2. Dans « Use workflow from », choisir **Tags → v1.0.0** (ou la branche `release/v1` si un correctif y a été ajouté).
3. Lancer : le site V1 est reconstruit et renvoyé sur o2switch.

**Corriger la V1** : partir de `release/v1` (`git switch release/v1`, puis `git switch -c fix/<nom>`), fusionner le correctif dans `release/v1`, étiqueter `v1.0.1`, puis redéployer comme ci-dessus.

**Consulter la V1 sur son poste** : `git switch --detach v1.0.0`, puis `npm run dev` dans `front/` (revenir ensuite avec `git switch main`).

## Envoi des demandes de devis (`front/public/api/devis.php`)
Le script est copié avec le site (`dist/api/devis.php`) et utilise la fonction `mail()` d'o2switch : aucun service externe, aucun secret.
- Destinataire : `contact@bsandoz.fr` ; expéditeur : `no-reply@bsandoz.fr` (adresse à créer dans cPanel pour une bonne délivrabilité, avec SPF/DKIM actifs).
- Le client reçoit un accusé de réception avec le récapitulatif de sa demande.
- Anti-spam : champ piège `site_web`, 1 envoi par minute et 3 par heure par adresse IP (empreinte stockée dans le dossier temporaire du serveur).
- Photos : 3 au plus, 5 Mo chacune, JPEG / PNG / WebP vérifiés sur le contenu.
- En développement (`npm run dev`), PHP n'est pas servi : l'envoi échoue et le parcours affiche le message d'erreur prévu.
- Le lien de suivi de la demande viendra avec l'API (V2).

## Attention au YAML
Dans un fichier de workflow, une valeur sans guillemets ne doit pas contenir « : » suivi d'une espace (YAML y voit une nouvelle clé et GitHub refuse le fichier : « Fichier de workflow invalide »). Mettre la valeur entière entre guillemets ou utiliser un bloc `run: |`.

## Routes
`front/public/.htaccess` renvoie toutes les routes vers `index.html` et force le HTTPS.
