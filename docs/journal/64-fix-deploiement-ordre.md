# Page blanche après déploiement

Branche `fix/deploiement-ordre` · 2026-11-06

## Ce qui s'est passé
preview.bsandoz.fr affichait une page blanche :
- `index.html` demandait `assets/index-Cv--LMIz.js`, qui n'était pas sur le serveur ;
- le serveur renvoyait alors `index.html`, à cause de son renvoi vers la page d'accueil pour les adresses inconnues ;
- le navigateur ne pouvait donc pas lancer le site.

**Cause** : plusieurs fusions rapprochées dans `main`. Le workflow annulait le déploiement en cours (`cancel-in-progress: true`), et l'envoi pouvait être coupé après `index.html` mais avant les nouveaux fichiers.

## Ce qui a été fait (`.github/workflows/deploy.yml`)
- Les déploiements ne sont plus annulés : ils attendent leur tour (`cancel-in-progress: false`).
- L'envoi se fait en deux temps : d'abord tout sauf `index.html` (`mirror --exclude-glob index.html`), puis `index.html` seul (`put`). La page en ligne ne pointe jamais vers un fichier absent.

## Tests
- Vérification après le déploiement : les fichiers JS et CSS demandés par la page en ligne répondent avec le bon type (`text/javascript`, `text/css`) et non avec la page HTML. Voir la commande dans `docs/deploiement.md`.

## Reste ouvert
- Le navigateur affiche « Non sécurisé » sur preview.bsandoz.fr : l'adresse est ouverte en `http://`. Il faudrait rediriger vers `https://` (réglage « Forcer HTTPS » dans cPanel, ou une règle dans `.htaccess`).
