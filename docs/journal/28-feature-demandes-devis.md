# Demandes de devis et devis dans l'espace client

Branche `feature/demandes-devis` · 2026-11-05

## Ce qui a été fait
- **API, module Prospect** (hexagonal, autonome) :
  - `Demande` : numéro « 2026-014 » par année, statut Reçue → En étude → Devis envoyé → Accepté → En cours → Livré, récapitulatif, pré-devis ;
  - `Devis` : lignes, total, un par demande ;
  - cas d'usage `EnregistrerDemande`, `EtablirDevis` (pour le back-office) et `AccepterDevis` (la seule demandeuse).
- `POST /demandes` reprend exactement le contrat de `devis.php` :
  - formulaire multipart, piège anti-robots, 3 envois par heure et par adresse IP, photos vérifiées sur leur contenu et jointes au mail ;
  - mails : accusé de réception avec le pré-devis et le lien vers l'espace ; demande au professionnel avec les photos ;
  - événement `DemandeEnregistree`.
- **Devis PDF** (dompdf, PHP pur) : texte échappé, aucune ressource extérieure, « TVA non applicable, art. 293 B du CGI », SIRET « [à compléter] » tant qu'il n'est pas renseigné.
- **Liaisons** :
  - `CompteApresDemande` : compte ouvert à la première demande ;
  - `EspaceDemandesController` : `GET /espace/demandes`, acceptation, PDF ;
  - la suppression du compte efface aussi demandes et devis, et l'export les inclut.
- **Site** :
  - section « Mes demandes » de l'espace client, comme la maquette : avancement, devis détaillé, acceptation en deux temps, PDF ;
  - la demande envoie aussi téléphone, entreprise et un titre lisible ;
  - l'adresse d'envoi est réglable au build (`VITE_DEVIS_URL`), `devis.php` restant la valeur par défaut tant que l'API n'est pas en ligne.
- **Plan** : la case « Espace client complet » est cochée (ses trois branches sont faites).

## À quoi ça sert
La demande n'est plus un simple mail : elle est enregistrée, suivie, et le client accepte son devis en ligne.

## Comment l'utiliser
- Site : `VITE_DEVIS_URL=https://api.bsandoz.fr/demandes` au build, une fois l'API en ligne.
- API : `POST /demandes` ; espace client : `/mon-espace`. Détails dans `api/src/Prospect/README.md`.

## Tests
- **unitaires** :
  - `ProspectTest` (11 tests) : numérotation, statuts, demande invalide, devis établi puis accepté, seule la demandeuse, pas deux fois, un devis par demande, lignes invalides ;
  - `DevisPdfTest` (4 tests) : contenu, échappement, SIRET, vrai PDF, montants ;
  - site : `titreDemande` et les champs envoyés.
- **fonctionnels** :
  - `DemandesHttpTest` (8 tests sur MySQL) : demande avec photo et 3 mails, piège anti-robots, données et photo refusées, 429, « Mes demandes » de bout en bout (devis, PDF, acceptation, 409), demande d'une autre personne (404), non connecté, suppression et export ;
  - site, `MesDemandes.test.tsx` (4 tests).
- **architecture** : le domaine Prospect ne dépend ni de Symfony ni de Doctrine.

Résultats : API 185 tests verts sur MySQL (39 ignorés sans base) ; site 274 et bibliothèque 70 tests verts ; lint et builds verts.

## Fichiers principaux
- `api/src/Prospect/`, `api/config/packages/prospect.yaml`, `api/migrations/Version20261105203915.php`
- `api/src/Liaisons/CompteApresDemande.php`, `EspaceDemandesController.php`, `DonneesApresSuppression.php`, `EspaceDonneesController.php`
- `front/src/pages/MonEspace/MesDemandes.tsx`, `front/src/pages/Devis/demande.ts`, `front/src/data/devis.ts`

## Reste ouvert
- **Établir un devis** n'est possible que par le code (`EtablirDevis`) : l'écran viendra avec le back-office.
- **Fil de messages** (« Derniers échanges » de la maquette) : branche IMAP.
- **Mentions du devis** à valider : SIRET après immatriculation, durée de validité éventuelle.
- **Passage de `devis.php` à l'API** : à faire lors de la mise en ligne de l'API.
