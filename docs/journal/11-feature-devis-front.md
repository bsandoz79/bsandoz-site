# Demande de devis

Branche `feature/devis-front` · 2026-11-04

## Ce qui a été fait
Blocs `Stepper` et `TextField` ; parcours en 5 étapes avec brouillon, reprise du configurateur, récapitulatif, consentement ; script `api/devis.php` (mail à Baptiste, accusé de réception, anti-spam).

## À quoi ça sert
Recevoir des demandes complètes et exploitables, sans perdre le visiteur en route.

## Comment l’utiliser
Envoi en POST vers `/api/devis.php` (déposé sur o2switch). Voir `docs/deploiement.md`.

## Tests
- **unitaires** : `demande.test.ts` : validation par étape, photos, brouillon, récapitulatif.
- **fonctionnels** : `Devis.test.tsx` : parcours complet, erreurs, retour sans perte, envoi simulé, échec, limite d’envoi.
- **manuel** : Script PHP vérifié dans un conteneur PHP 8.3 (méthode, piège, données invalides). Envoi de mail réel à tester sur o2switch.

Lancer : `cd front && npm run test`

## Fichiers principaux
- `src/pages/Devis/`
- `front/public/api/devis.php`
- `src/data/devis.ts`

## Reste ouvert
- Créer `no-reply@bsandoz.fr` sur o2switch.
