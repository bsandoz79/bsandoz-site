# Module Prospect

Demandes de devis et devis (V3) : la demande envoyée depuis le site est numérotée et suivie de « Reçue » à « Livré » ; le devis, établi par le professionnel, est accepté par le client depuis son espace et téléchargé en PDF. Module **autonome** (installable dans l'API d'un client). Fil de messages : plus tard (IMAP).

## Couches
- `Domain/` : `Demande` (numéro « 2026-014 » par année, statut, récapitulatif, pré-devis), `Demandeur`, `StatutDemande` (Reçue → En étude → Devis envoyé → Accepté → En cours → Livré), `Devis` (lignes, total, un par demande), `LigneDevis`, `PieceJointe` (photos, jamais stockées) et les ports.
- `Application/` : `EnregistrerDemande`, `EtablirDevis` (professionnel, pour le back-office), `AccepterDevis` (la seule demandeuse).
- `Infrastructure/` :
  - `Http/DemandeController.php` : `POST /demandes`, même contrat que l'ancien script `devis.php` ;
  - `Doctrine/` : tables `prospect_demande`, `prospect_devis` ;
  - `Mail/` : accusé de réception (avec le pré-devis), demande au professionnel (avec les photos), devis prêt, devis accepté ;
  - `Pdf/DevisPdf.php` : devis en PDF (dompdf, texte échappé, aucune ressource extérieure, SIRET « [à compléter] » tant qu'il n'est pas renseigné) ;
  - `Evenement/DemandeEnregistree.php` : publié après chaque demande.

## Points d'entrée
| Méthode | Adresse | Corps | Réponses |
| --- | --- | --- | --- |
| POST | `/demandes` | multipart : `nom`, `email`, `telephone`, `entreprise`, `titre`, `recapitulatif`, `predevis`, `site_web` (piège, vide), `photos[]` (3 au plus, JPEG/PNG/WebP, 5 Mo) | 200 `{ ok, numero }` · 400 `{ ok: false, erreurs }` · 429 (3 par heure et par adresse IP) |

Les pages de l'espace client (« Mes demandes ») sont servies par la liaison `src/Liaisons/EspaceDemandesController.php` : `GET /espace/demandes`, `POST /espace/demandes/{id}/devis/accepter`, `GET /espace/demandes/{id}/devis.pdf`.

## Réglages
`config/packages/prospect.yaml` et variables : `PROSPECT_EXPEDITEUR`, `PROSPECT_PROFESSIONNEL_NOM`, `PROSPECT_PROFESSIONNEL_EMAIL`, `PROSPECT_URL_SITE` (lien « espace client » des mails), `PROSPECT_SIRET` (vide = « [à compléter] »).

## Installer le module dans l'API d'un client
Marche à suivre complète, site compris : [`docs/mise-en-place/demandes-de-devis.md`](../../../docs/mise-en-place/demandes-de-devis.md).

1. Copier `src/Prospect/` et `config/packages/prospect.yaml` ; déclarer la correspondance `Prospect` dans `doctrine.yaml`.
2. `config/services.yaml` : exclure les domaines des services (`exclude: ['../src/*/Domain/', '../src/Kernel.php']`).
3. Dépendances : `symfony/mailer`, `symfony/uid`, `symfony/rate-limiter`, `doctrine/orm`, `dompdf/dompdf`, `nelmio/cors-bundle` (si le site est sur un autre domaine).
4. Migration `migrations/Version20261105203915.php`.
5. Faire pointer le formulaire de demande du site vers `POST /demandes`.
6. Adapter ce qui est écrit en dur : mentions de `Pdf/DevisPdf.php` (activité, TVA) et, sans espace client, la phrase de suivi de l'accusé de réception (`Mail/NotificationsProspectParMail.php`).

## Tests
- `tests/Prospect/ProspectTest.php` : numérotation, statuts, demande invalide, devis établi puis accepté, seule la demandeuse accepte, pas deux fois, un devis par demande, lignes invalides.
- `tests/Prospect/Infrastructure/DevisPdfTest.php` : contenu, échappement, SIRET, vrai PDF, montants.
- `tests/Prospect/Infrastructure/DemandesHttpTest.php` (MySQL) : demande avec photo, piège anti-robots, données et photo refusées, 429, « Mes demandes » de bout en bout (devis, PDF, acceptation, 409), demande d'une autre personne (404), non connecté, suppression du compte et export.
