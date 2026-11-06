# Chiffre d'affaires dans les statistiques

Branche `feature/ca-statistiques` · 2026-11-06

## Ce qui a été fait
- **API** : `GET /backoffice/demandes` donne, pour chaque demande, `devis` (`total`, `statut`, `accepteLe`).
- **Statistiques** : CA du mois (devis acceptés ce mois-ci), CA signé (tous les devis acceptés), devis en attente (envoyés, pas encore acceptés). Trois chiffres de plus, soit neuf au total, sur trois colonnes.

## Tests
- `PlanningAdmin.test.tsx` : calcul et affichage depuis de vrais devis.
- `DemandesBackOfficeTest.php` : montant et état du devis dans la liste.

## Reste ouvert
- Le calcul porte sur les devis acceptés, pas sur les paiements encaissés : le site ne suit pas les paiements.
- La liste des demandes a une limite (`LISTE_MAX`) : au-delà, les plus anciennes ne comptent plus dans le CA signé.
