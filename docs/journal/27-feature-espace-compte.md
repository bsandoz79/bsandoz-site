# Mon compte, confidentialité et zone danger

Branche `feature/espace-compte` · 2026-11-05

## Ce qui a été fait
- **API, module Auth** :
  - le compte a des coordonnées (entreprise, téléphone, adresse) et une préférence de notifications par mail ;
  - deux nouveaux usages de lien, valables 1 h : changement d'e-mail (le lien porte la nouvelle adresse et part à celle-ci) et suppression du compte ;
  - `MonCompte` : modifier ses coordonnées ; changer d'e-mail (refusé si l'adresse est identique ou déjà prise, contrôlé à la demande et à la confirmation ; l'ancienne adresse est prévenue) ; supprimer le compte (compte, liens et sessions effacés, mail de confirmation, événement `CompteSupprime`) ;
  - `POST /auth/compte`, `/auth/email`, `/auth/email/confirmer`, `/auth/suppression`, `/auth/suppression/confirmer` ;
  - l'adresse du compte devient modifiable : `Compte::email()` remplace la propriété publique.
- **Liaisons** :
  - `DonneesApresSuppression` : à la suppression du compte, les rendez-vous sont effacés ; ceux à venir sont d'abord annulés (créneau libéré, professionnel prévenu) ;
  - `GET /espace/donnees` : fichier JSON de toutes ses données (compte, appareils, rendez-vous), sans aucun secret.
- **Site** :
  - sections « Mon compte », « Confidentialité et préférences » (état de la localisation et aide pour la réactiver, notifications, téléchargement des données) et « Zone danger » (deux temps, puis lien par mail), comme la maquette ;
  - pages `/mon-espace/email` (confirmation, une seule fois) et `/mon-espace/suppression` (rien n'est supprimé sans clic explicite) ;
  - politique de confidentialité complétée : espace client, cookie de session strictement nécessaire.
- **Base** : migration des nouvelles colonnes (`auth_compte`, `auth_lien`).

## À quoi ça sert
La personne garde la main sur ses informations (correction, portabilité, effacement), comme le prévoit le RGPD et la maquette de l'espace client.

## Comment l'utiliser
Connecté, dans `/mon-espace`. Points d'entrée : `api/src/Auth/README.md` et `docs/api.md`.

## Tests
- **unitaires** : `MonCompteTest` (10 tests) : coordonnées valides et invalides, changement d'e-mail par la nouvelle adresse, refus (identique, déjà prise, invalide, prise entre-temps), lien qui n'ouvre pas de session et expire, usages non demandables sans connexion, suppression confirmée, lien de suppression inutilisable pour l'e-mail, invariant du lien.
- **fonctionnels** :
  - API, `EspaceCompteTest` (5 tests sur MySQL) : modifier son compte, changer d'e-mail de bout en bout, refus et 401, télécharger ses données sans secret, supprimer son compte (rendez-vous annulé puis effacé, session fermée, lien à usage unique) ;
  - site, `EspaceCompte.test.tsx` (12 tests) : coordonnées et erreurs par champ, changement d'e-mail et refus, localisation refusée, notifications, lien de téléchargement, zone danger en deux temps, confirmation de l'e-mail une seule fois (StrictMode) et ses erreurs, suppression seulement au clic et lien expiré.

Résultats : API 147 tests verts sur MySQL ; site 268 et bibliothèque 70 tests verts ; lint et builds verts.

## Fichiers principaux
- `api/src/Auth/Application/MonCompte.php`, `api/src/Auth/Infrastructure/Http/MonCompteController.php`, `CompteJson.php`, `api/src/Auth/Infrastructure/Evenement/CompteSupprime.php`
- `api/src/Liaisons/DonneesApresSuppression.php`, `EspaceDonneesController.php`
- `api/migrations/Version20261105202211.php`
- `front/src/pages/MonEspace/` : `MonCompteSection.tsx`, `Confidentialite.tsx`, `ZoneDanger.tsx`, `ConfirmerEmail.tsx`, `ConfirmerSuppression.tsx`
- `front/src/data/espace.ts`, `front/src/data/legal.ts`

## Reste ouvert
- **Après un changement d'e-mail**, les rendez-vous pris avec l'ancienne adresse n'apparaissent plus dans l'espace : ils sont retrouvés par adresse. Les rattacher au compte se fera avec les demandes de devis (module Prospect).
- **Préférence de notifications** : enregistrée, mais aucun rappel automatique n'existe encore (rappel la veille d'un rendez-vous à faire).
- **Durée de conservation** des données : toujours `[à compléter]` dans la politique de confidentialité.
