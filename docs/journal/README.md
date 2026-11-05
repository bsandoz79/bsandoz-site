# Journal des branches

Une fiche par branche poussée : ce qui a été fait, à quoi ça sert, comment l’utiliser, les tests et comment les lancer, ce qui reste ouvert. La fiche est écrite (ou complétée) avant chaque push.

## Modèle
```md
# Titre

Branche `type/nom` · AAAA-MM-JJ

## Ce qui a été fait
## À quoi ça sert
## Comment l’utiliser
## Tests
- **unitaires** : …
- **fonctionnels** : …
- **architecture / CI / manuel** : …
Lancer : `…`
## Fichiers principaux
## Reste ouvert
```

Types de tests :
- **unitaires** : une fonction ou un bloc seul (Vitest + Testing Library côté front, PHPUnit côté API) ;
- **fonctionnels** : un parcours complet dans une page, comme un visiteur (clic, clavier, envoi simulé) ;
- **architecture** : une règle de structure vérifiée automatiquement (ex. le domaine de l’API ne dépend pas de Symfony) ;
- **CI** : ce que GitHub relance à chaque push.

## Fiches
| N° | Fiche | Branche | Date |
| --- | --- | --- | --- |
| 01 | [Routes des pages](01-feature-routing.md) | `feature/routing` | 2026-11-04 |
| 02 | [En-tête, pied de page, barre mobile](02-feature-layout.md) | `feature/layout` | 2026-11-04 |
| 03 | [Page d’accueil](03-feature-home.md) | `feature/home` | 2026-11-04 |
| 04 | [Données de prix et calculs](04-feature-pricing-data.md) | `feature/pricing-data` | 2026-11-04 |
| 05 | [Page Tarifs](05-feature-tarifs.md) | `feature/tarifs` | 2026-11-04 |
| 06 | [Configurateur « Composer mon site »](06-feature-configurateur.md) | `feature/configurateur` | 2026-11-04 |
| 07 | [Aperçu en direct](07-feature-apercu.md) | `feature/apercu` | 2026-11-04 |
| 08 | [Page Informatique sur place](08-feature-informatique.md) | `feature/informatique` | 2026-11-04 |
| 09 | [Pages métier](09-feature-metiers.md) | `feature/metiers` | 2026-11-04 |
| 10 | [Réalisations, À propos, FAQ](10-feature-realisations-apropos-faq.md) | `feature/realisations-apropos-faq` | 2026-11-04 |
| 11 | [Demande de devis](11-feature-devis-front.md) | `feature/devis-front` | 2026-11-04 |
| 12 | [Pages légales et SEO](12-feature-legal-seo.md) | `feature/legal-seo` | 2026-11-04 |
| 13 | [Version 1.0.0](13-chore-version-1.0.0.md) | `chore/version-1.0.0` | 2026-11-05 |
| 14 | [API Symfony](14-feature-api-structure.md) | `feature/api-structure` | 2026-11-05 |
| 15 | [Calendrier et page Rendez-vous](15-feature-calendar-rdv.md) | `feature/calendar-rdv` | 2026-11-05 |
| 16 | [Correctif CI de l’API](16-fix-ci-api-env-test.md) | `fix/ci-api-env-test` | 2026-11-05 |
| 17 | [Journal des branches](17-docs-journal-des-branches.md) | `docs/journal-des-branches` | 2026-11-05 |
| 18 | [Fiches par fonctionnalité](18-docs-fonctionnalites.md) | `docs/fonctionnalites` | 2026-11-05 |
| 19 | [Bibliothèque de blocs @bsandoz79/blocs](19-feature-paquet-blocs.md) | `feature/paquet-blocs` | 2026-11-05 |
