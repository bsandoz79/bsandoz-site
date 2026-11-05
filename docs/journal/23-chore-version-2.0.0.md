# Version 2.0.0

Branche `chore/version-2.0.0` · 2026-11-05

## Ce qui a été fait
Version 2.0.0 (`front/package.json`), CHANGELOG figé, étiquette `v2.0.0` et branche de maintenance `release/v2`. La procédure de retour à une version, dans `docs/deploiement.md`, couvre maintenant la V1 et la V2.

Contenu de la V2 :
- bloc `Calendar` et page Rendez-vous ;
- API Symfony modulaire avec le module Booking (réservation, créneau pris refusé, mails et `.ics`, annulation) ;
- bibliothèque `@bsandoz79/blocs` et livraison de blocs par copie ;
- pré-devis automatique par mail.

## À quoi ça sert
Point d'étape avant la V3 (comptes, espace client, back-office) : on peut revenir à la V2, la consulter ou la corriger sans toucher à `main`.

## Comment l'utiliser
Voir « Versions et retour à une version précédente » dans `docs/deploiement.md`.

## Tests
- **vérification** : sur le commit étiqueté, après réinstallation propre des dépendances (`npm ci`), le lint, les tests (bibliothèque et site), les deux builds et PHPUnit passent.

Lancer : `npm ci && npm run lint && npm run test && npm run build`, puis PHPUnit (voir `docs/api.md`).

## Fichiers principaux
- `front/package.json`, `package-lock.json`
- `docs/CHANGELOG.md`, `docs/deploiement.md`

## Reste ouvert
- L'API n'est pas encore en ligne (`api.bsandoz.fr`) : variables du serveur, migration, et déploiement à automatiser.
