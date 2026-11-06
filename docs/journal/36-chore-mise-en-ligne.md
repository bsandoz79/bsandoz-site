# Préparation de la mise en ligne

Branche `chore/mise-en-ligne` · 2026-11-06

## Ce qui a été fait
- `docs/mise-en-ligne.md` : le pas-à-pas complet, de o2switch à `bsandoz.fr`.
- Workflow manuel **Déploiement de l'API** : installe les dépendances de production et envoie l'API par FTP. Il se lance depuis un téléphone.
- Workflow **Déploiement o2switch** : le site est construit avec les variables `VITE_API_URL` et `VITE_DEVIS_URL` du dépôt.
- Une variable vide compte désormais comme absente : le site garde son adresse par défaut.

## À quoi ça sert
Mettre l'API en ligne sans Docker ni poste de travail.

## Comment l'utiliser
Suivre `docs/mise-en-ligne.md`.

## Tests
- **parcours complet dans Chrome**, juste avant la version 3.0.0 : site construit, API en mode production sans dépendances de développement, mails réels sur un serveur de test (GreenMail). Demande, accusé, activation, cookie conservé au rechargement, fil, refus du back-office pour un client, devis, réponse par mail relevée en IMAP, expéditeur inconnu écarté, acceptation, PDF, statut, prix, disponibilités : 35 étapes sur 35, aucune erreur JavaScript.
- **lint, tests, build et PHPUnit** : relancés.

Ce parcours a tourné sur `localhost`. Le script n'est pas dans le dépôt.

## Fichiers principaux
- `docs/mise-en-ligne.md`, `.github/workflows/deploy-api.yml`, `.github/workflows/deploy.yml`, `front/src/app/api.ts`, `front/src/data/devis.ts`

## Reste ouvert
- Les workflows n'ont jamais tourné avec de vrais secrets : le premier lancement servira de test.
- Le terminal de cPanel, le PHP de la ligne de commande et les chemins sont à confirmer sur le vrai compte.
- Sauvegarde automatique de la base à mettre en place.
