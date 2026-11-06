# Back-office : prix

Branche `feature/back-office-prix` · 2026-11-06

## Ce qui a été fait
- Onglet « Prix » de `/admin` : modifier le prix des formules et des options.
- Nouveau module API `Catalogue` : il ne stocke que les prix modifiés (`GET /prix`, public ; `POST /backoffice/prix`, réservé).
- Le site applique ces prix à son chargement, avant les pages : `front/src/data/prixEnLigne.ts`, appelé par `front/src/main.tsx`.

## À quoi ça sert
Changer un prix sans toucher au code ni redéployer. **Les prix actuels ne changent pas** (99 €, 390 €, dès 989 €) tant qu'aucun n'est modifié ici.

## Comment l'utiliser
`/admin`, onglet « Prix », puis « Enregistrer les prix ». Le site suit au plus tard 5 minutes après, pour un visiteur déjà venu. Remettre le prix d'origine annule la modification.

## Tests
- **unitaires** : `front/src/data/prixEnLigne.test.ts` (prix annoncés, valeurs douteuses ignorées, cache, API en panne, API lente, cache illisible), `api/tests/Catalogue/CatalogueTest.php`.
- **fonctionnels** : `api/tests/BackOffice/PrixBackOfficeTest.php` (HTTP + MySQL), `front/src/pages/Admin/PrixAdmin.test.tsx`.
- **manuel** : site construit, ouvert dans Chrome avec une API simulée : `/tarifs` affiche 99 € sans modification et 120 € avec, sans erreur JavaScript.

Lancer : `npm run test -w front` ; API : voir `docs/api.md`.

## Fichiers principaux
- `api/src/Catalogue/`, `api/src/BackOffice/PrixController.php`, `front/src/data/prixEnLigne.ts`, `front/src/main.tsx`, `front/src/pages/Admin/PrixAdmin.tsx`

## Reste ouvert
- Le tarif horaire (`tarifHoraire`, CGV et FAQ) et les libellés des formules restent dans le code.
- Si l'API ne répond pas dans les 800 ms au premier chargement, le visiteur voit les prix du code ; le prix modifié s'applique à sa page suivante.
- Les moteurs de recherche et les aperçus de partage peuvent voir les prix du code. Le pré-rendu des pages, prévu au cahier des charges, n'existe pas encore.
