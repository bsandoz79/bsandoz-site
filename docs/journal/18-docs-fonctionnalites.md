# Fiches par fonctionnalité

Branche `docs/fonctionnalites` · 2026-11-05

## Ce qui a été fait
Création de `docs/fonctionnalites/` : une vue d'ensemble et 12 fiches (navigation, prix et calculs, configurateur, aperçu, simulateur, demande de devis, rendez-vous, pages de contenu, SEO, blocs, API, déploiement et CI). Chaque fiche contient au moins un schéma Mermaid (14 au total). Nouvelle règle dans `.claude/CLAUDE.md` : la fiche de la fonctionnalité est créée ou mise à jour à chaque push.

## À quoi ça sert
Comprendre une fonctionnalité sans lire le code : par où passent les données, quel fichier fait quoi, comment l'appeler, ce qui est réutilisable.

## Comment l'utiliser
Commencer par `docs/fonctionnalites/README.md` (tableau des fiches), puis `00-vue-ensemble.md`. Les schémas s'affichent directement sur GitHub.

## Tests
- **vérification** : les 14 schémas analysés par Mermaid 11 dans Chrome (aucune erreur de syntaxe).
- Lint, tests et build du front relancés avant le push (documentation seulement).

## Fichiers principaux
- `docs/fonctionnalites/`
- `.claude/CLAUDE.md`

## Reste ouvert
- Décision sur la proposition « A » (bibliothèque de blocs partagée entre sites) : la fiche `blocs.md` sera mise à jour en conséquence.
