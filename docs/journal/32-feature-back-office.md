# Back-office : demandes et devis

Branche `feature/back-office` · 2026-11-06

## Ce qui a été fait
- Page `/admin` : liste des demandes filtrable, détail (coordonnées, demande, pré-devis), statut, devis, réponses et notes d'appel.
- API : `/backoffice/demandes…`, réservée aux adresses de `BACKOFFICE_EMAILS`. Commande `backoffice:ouvrir-acces` pour la première entrée.
- Règles du statut (`ChangerStatut`) pour qu'il reste vrai pour le client.
- Après la connexion, retour sur la page demandée (`?retour=/admin`), jamais vers un site extérieur.

## À quoi ça sert
Sans lui, établir un devis demandait du code : le parcours de la demande à la livraison peut maintenant se faire de bout en bout.

## Comment l'utiliser
Voir `docs/fonctionnalites/back-office.md`.

## Tests
- **fonctionnels** : `api/tests/BackOffice/DemandesBackOfficeTest.php`, `front/src/pages/Admin/Admin.test.tsx`.
- **unitaires** : `adresseDeRetour`.
- **CI** : relancés à chaque push.

Lancer : `npm run test -w front` ; API : voir `docs/api.md`.

## Fichiers principaux
- `api/src/BackOffice/`, `api/src/Prospect/Application/ChangerStatut.php`, `front/src/pages/Admin/`

## Reste ouvert
- Pas de mail au client quand le statut change : il le voit dans son espace.
- Pas de double authentification sur le back-office : le mot de passe doit être solide.
- Un accord donné par téléphone ne fait pas passer le devis en « accepté » : le client doit cliquer dans son espace.
