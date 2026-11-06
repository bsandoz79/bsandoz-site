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
| 20 | [Livraison de blocs à un client](20-feature-livraison-blocs.md) | `feature/livraison-blocs` | 2026-11-05 |
| 21 | [Module Booking (rendez-vous côté API)](21-feature-booking.md) | `feature/booking` | 2026-11-05 |
| 22 | [Pré-devis automatique par mail](22-feature-predevis.md) | `feature/predevis` | 2026-11-05 |
| 23 | [Version 2.0.0](23-chore-version-2.0.0.md) | `chore/version-2.0.0` | 2026-11-05 |
| 24 | [Fins de ligne](24-chore-fins-de-ligne.md) | `chore/fins-de-ligne` | 2026-11-05 |
| 25 | [Comptes et connexion (module Auth)](25-feature-auth.md) | `feature/auth` | 2026-11-05 |
| 26 | [Mes rendez-vous dans l’espace client](26-feature-espace-rendez-vous.md) | `feature/espace-rendez-vous` | 2026-11-05 |
| 27 | [Mon compte, confidentialité et zone danger](27-feature-espace-compte.md) | `feature/espace-compte` | 2026-11-05 |
| 28 | [Demandes de devis et devis dans l’espace client](28-feature-demandes-devis.md) | `feature/demandes-devis` | 2026-11-05 |
| 29 | [API en production](29-fix-api-production.md) | `fix/api-production` | 2026-11-06 |
| 30 | [Mise en place chez un client](30-docs-mise-en-place-client.md) | `docs/mise-en-place-client` | 2026-11-06 |
| 31 | [Fil de messages synchronisé avec les mails](31-feature-fil-messages.md) | `feature/fil-messages` | 2026-11-06 |
| 32 | [Back-office : demandes et devis](32-feature-back-office.md) | `feature/back-office` | 2026-11-06 |
| 33 | [Back-office : prix](33-feature-back-office-prix.md) | `feature/back-office-prix` | 2026-11-06 |
| 34 | [Back-office : disponibilités](34-feature-back-office-disponibilites.md) | `feature/back-office-disponibilites` | 2026-11-06 |
| 35 | [Rappels et préférence de notification](35-feature-rappels.md) | `feature/rappels` | 2026-11-06 |
| 36 | [Préparation de la mise en ligne](36-chore-mise-en-ligne.md) | `chore/mise-en-ligne` | 2026-11-06 |
| 37 | [Version 3.0.0](37-chore-version-3.0.0.md) | `chore/version-3.0.0` | 2026-11-06 |
| 38 | [Déploiement FTPS avec lftp](38-fix-deploiement-ftps.md) | `fix/deploiement-ftps` | 2026-11-06 |
| 39 | [Rendez-vous en étapes et barre mobile](39-feature-rdv-etapes.md) | `feature/rdv-etapes` | 2026-11-06 |
| 40 | [Navigation qui se cache au défilement, pied de page sombre](40-feature-nav-pied-de-page.md) | `feature/nav-pied-de-page` | 2026-11-06 |
| 41 | [Une page par réalisation, avec les vraies captures](41-feature-realisation-detail.md) | `feature/realisation-detail` | 2026-11-06 |
| 42 | [Formulaire de contact rapide et champs modernisés](42-feature-formulaires.md) | `feature/formulaires` | 2026-11-06 |
| 43 | [Un accueil plus dynamique, téléphone façon smartphone récent](43-feature-design-dynamique.md) | `feature/design-dynamique` | 2026-11-06 |
| 44 | [Prix d'une page supplémentaire sous chaque formule](44-feature-tarif-page-sup.md) | `feature/tarif-page-sup` | 2026-11-06 |
| 45 | [Thème nuit et thème clair](45-feature-theme-nuit.md) | `feature/theme-nuit` | 2026-11-06 |
| 46 | [Filtre des réalisations](46-feature-filtre-realisations.md) | `feature/filtre-realisations` | 2026-11-06 |
| 47 | [Téléphone : fond de page et marges](47-fix-mobile-fond-marges.md) | `fix/mobile-fond-marges` | 2026-11-06 |
| 48 | [Cartes de projets compactes et cliquables](48-feature-cartes-projets.md) | `feature/cartes-complements` | 2026-11-06 |
| 49 | [Votre photo et un accueil à la première personne](49-feature-hero-photo.md) | `feature/hero-photo` | 2026-11-06 |
| 50 | [Onglets seulement en haut de page, étapes du rendez-vous centrées](50-feature-defilement-nav-rdv.md) | `feature/defilement-nav-rdv` | 2026-11-06 |
| 51 | [Photo de la section « Pourquoi travailler avec moi »](51-fix-photo-pourquoi.md) | `fix/photo-pourquoi` | 2026-11-06 |
| 52 | [Carte des zones d'intervention](52-feature-carte-zones.md) | `feature/carte-zones` | 2026-11-06 |
| 53 | [Bouton « revenir en haut »](53-feature-retour-haut.md) | `feature/retour-haut` | 2026-11-06 |
| 54 | [Reflet lumineux](54-feature-reflet.md) | `feature/reflet` | 2026-11-06 |
| 55 | [FAQ sur l'accueil](55-feature-faq-accueil.md) | `feature/faq-accueil` | 2026-11-06 |
| 56 | [Bandeau des services tiers et carte directe](56-feature-bandeau-cookies.md) | `feature/bandeau-cookies` | 2026-11-06 |
| 57 | [Position du visiteur sur la carte](57-feature-carte-position.md) | `feature/carte-position` | 2026-11-06 |
| 58 | [Ordre de la fin de l'accueil](58-feature-ordre-accueil.md) | `feature/ordre-accueil` | 2026-11-06 |
| 59 | [Compléments et simulateur sur les trois formules](59-feature-tarifs-complements.md) | `feature/tarifs-complements` | 2026-11-06 |
| 60 | [Coordonnées](60-chore-coordonnees.md) | `chore/coordonnees` | 2026-11-06 |
| 61 | [Zones Amiens et Abbeville, frais kilométriques](61-feature-frais-kilometriques.md) | `feature/frais-kilometriques` | 2026-11-06 |
| 62 | [Compléments en pointillés, calcul des frais visible](62-style-complements-pointilles.md) | `style/complements-pointilles` | 2026-11-06 |
| 63 | [Photo en ouverture de rideau](63-feature-photo-rideau.md) | `feature/photo-rideau` | 2026-11-06 |
| 64 | [Page blanche après déploiement](64-fix-deploiement-ordre.md) | `fix/deploiement-ordre` | 2026-11-06 |
| 65 | [Deux compléments, référencement seul à part](65-style-complements-seo.md) | `style/complements-seo` | 2026-11-06 |
| 66 | [Message des frais kilométriques](66-style-message-frais.md) | `style/message-frais` | 2026-11-06 |
| 67 | [Le devis reprend la dernière estimation](67-fix-devis-depuis-estimation.md) | `fix/devis-depuis-estimation` | 2026-11-06 |
