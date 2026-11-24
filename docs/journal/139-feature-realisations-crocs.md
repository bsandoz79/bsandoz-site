# Croc's en réalisation, captures d'O'RDV et de Shop ton chargeur refaites

Branche `feature/realisations-crocs` · 2026-11-24

## Ce qui a été fait
Baptiste voulait ajouter Croc's à ses réalisations, et refaire les captures d'O'RDV (nouvelle barre de navigation et nouveaux filtres) et de Shop ton chargeur (nouveau design noir et titane, cartes avec note en couleur).
- **Croc's** (`/realisations/crocs`), en tête de liste, métier « Commerce et restauration », type « Sites web » : contexte, besoin, solution, 7 fonctionnalités, 6 captures (accueil, carte, mode modification du haut de page et de la carte, espace du patron, venir et horaires). Pas de lien vers le site : la démo est encore privée.
- **Captures de Croc's** : prises sur le site construit en local (`apps/crocs/front` de bsandoz-booking). Pour le mode modification et l'espace du patron, la session du patron est simulée dans le navigateur, avec la carte du site ; rien n'est modifié dans le projet. Les avis clients (Restaurant Guru) ne sont pas montrés : ils attendent l'accord du patron.
- **O'RDV** : accueil, résultats par catégorie, fiche d'un professionnel, réservation, connexion et inscription refaites sur le site en ligne (o-rdv.vercel.app), en évitant les comptes de test (« Bg Baptiste », « choco IT »). L'espace pro garde son ancienne capture (il faut un compte pro pour la refaire).
- **Shop ton chargeur** : les 7 captures refaites sur le site construit en local, légendes et fonctionnalités à jour (note en couleur, cartes épurées, design noir et titane, animations).

## Tests
- Compteurs de la page Réalisations (7 projets, 4 sites web, 3 en commerce et restauration), projet précédent de Christophe Poix Moto (Croc's), plan du site (une page de plus).
- Résultats : 401 tests ; lint et build sans erreur (27 pages lisibles sans JavaScript).
- Vérifié dans Chrome : liste des réalisations et page de Croc's.

## Fichiers principaux
- `front/src/data/realisations.ts`, `realisationsIds.ts`, `secteurs.ts`
- `front/src/assets/realisations/crocs/`, `ordv/`, `choptonchargeur/`

## Reste ouvert
- Demander au patron de Croc's s'il est d'accord pour apparaître dans les réalisations (photos de son snack, carte et prix pas encore validés).
- Capture de l'espace pro d'O'RDV à refaire avec un compte pro.
