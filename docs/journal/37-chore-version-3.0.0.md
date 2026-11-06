# Version 3.0.0

Branche `chore/version-3.0.0` · 2026-11-06

## Ce qui a été fait
Version 3.0.0 (`front/package.json`), CHANGELOG figé, étiquette `v3.0.0` et branche de maintenance `release/v3`.

Contenu de la V3 :
- comptes et connexion : compte ouvert automatiquement, lien par mail ou mot de passe, appareils connectés ;
- espace client : rendez-vous, demandes, devis à accepter et PDF, compte, confidentialité, zone danger ;
- fil de messages synchronisé avec les mails (IMAP), notes d'appel ;
- rappel la veille d'un rendez-vous, préférence de notification respectée ;
- back-office `/admin` : demandes, devis, prix, disponibilités ;
- doc de mise en place chez un client, doc de mise en ligne.

## À quoi ça sert
Point d'étape : on peut revenir à la V3, la consulter ou la corriger sans toucher à `main`.

## Comment l'utiliser
Voir « Versions et retour à une version précédente » dans `docs/deploiement.md`, et `docs/mise-en-ligne.md` pour la mise en ligne.

## Tests
- **vérification** : sur le commit étiqueté, après réinstallation propre des dépendances (`npm ci`) : lint, tests, builds et PHPUnit.
- **parcours complet dans Chrome** : voir `docs/journal/36-chore-mise-en-ligne.md`.

Lancer : `npm ci && npm run lint && npm run test && npm run build`, puis PHPUnit (voir `docs/api.md`).

## Fichiers principaux
- `front/package.json`, `package-lock.json`, `docs/CHANGELOG.md`, `docs/deploiement.md`

## Reste ouvert
- V3 terminée côté code, mais **rien n'est en ligne** : voir `docs/mise-en-ligne.md`.
- Hors V3, encore prévu au cahier des charges : pré-rendu des pages publiques, mesure d'audience sans cookie tiers, fiche Google Business, créneaux qui tiennent compte du trajet, déplacement d'un rendez-vous en une seule action (aujourd'hui : en prendre un nouveau, puis annuler l'ancien).
- Contenus à fournir par Baptiste (mentions légales, SIRET, photos, études de cas) : restent `[à compléter]`.
