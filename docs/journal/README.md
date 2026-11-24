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
| 68 | [« Estimer » ouvre le bon onglet](68-fix-estimer-bon-onglet.md) | `fix/estimer-bon-onglet` | 2026-11-06 |
| 69 | [Le devis ne garde plus les essais précédents](69-fix-devis-sans-anciens-essais.md) | `fix/devis-sans-anciens-essais` | 2026-11-06 |
| 70 | [État « choisi » et bouton de confirmation](70-style-sans-liseres.md) | `style/sans-liseres` | 2026-11-06 |
| 71 | [Un site plus sobre (« moins IA »)](71-style-moins-ia.md) | `style/moins-ia` | 2026-11-06 |
| 72 | [Plus de question « Besoins » après une estimation](72-fix-devis-sans-besoins.md) | `fix/devis-sans-besoins` | 2026-11-06 |
| 73 | [Changement de thème en rideau](73-feature-theme-rideau.md) | `feature/theme-rideau` | 2026-11-06 |
| 74 | [Réalisation Alterno](74-feature-alterno.md) | `feature/alterno` | 2026-11-06 |
| 75 | [Frais aller-retour, dans les mails du rendez-vous](75-feature-frais-aller-retour.md) | `feature/frais-aller-retour` | 2026-11-06 |
| 76 | [Lien « rendez-vous » du mail de devis](76-fix-lien-rendez-vous-mail.md) | `fix/lien-rendez-vous-mail` | 2026-11-06 |
| 77 | [Préciser « Autre activité »](77-feature-autre-activite.md) | `feature/autre-activite` | 2026-11-06 |
| 78 | [Adresse dans la demande de devis](78-feature-adresse-devis.md) | `feature/adresse-devis` | 2026-11-06 |
| 79 | [Configurateur : reprendre ou recommencer](79-feature-composer-memoire.md) | `feature/composer-memoire` | 2026-11-06 |
| 80 | [Espace client dans l'en-tête](80-feature-lien-espace-client.md) | `feature/lien-espace-client` | 2026-11-06 |
| 81 | [Mise en ligne de l'API : ce qui a été vérifié](81-chore-doc-serveur.md) | `chore/doc-serveur` | 2026-11-06 |
| 82 | [Disponibilités réglées d'un clic](82-feature-disponibilites-admin.md) | `feature/disponibilites-admin` | 2026-11-06 |
| 83 | [Crayon sur les prix](83-feature-edition-en-page.md) | `feature/edition-en-page` | 2026-11-06 |
| 84 | [Déploiement bloqué par des tests](84-fix-tests-url-devis.md) | `fix/tests-url-devis` | 2026-11-06 |
| 85 | [Édition par bloc : textes, prix, images](85-feature-edition-blocs.md) | `feature/edition-blocs` | 2026-11-06 |
| 86 | [Ajouter le rendez-vous à son agenda](86-feature-agenda-rdv.md) | `feature/agenda-rdv` | 2026-11-06 |
| 87 | [Planning et statistiques du back-office](87-feature-planning-admin.md) | `feature/planning-admin` | 2026-11-06 |
| 88 | [Cartes des autres besoins](88-feature-cibles.md) | `feature/cibles` | 2026-11-06 |
| 89 | [Parcours de la page À propos](89-chore-apropos-parcours.md) | `chore/apropos-parcours` | 2026-11-06 |
| 90 | [Chiffre d'affaires dans les statistiques](90-feature-ca-statistiques.md) | `feature/ca-statistiques` | 2026-11-06 |
| 91 | [Retrait des cartes des autres besoins](91-fix-retrait-cibles.md) | `fix/retrait-cibles` | 2026-11-07 |
| 92 | [Accueil : un site que vous modifiez vous-même](92-feature-accueil-autonomie.md) | `feature/accueil-autonomie` | 2026-11-07 |
| 93 | [Retrait de l'estimation, devis en formulaire court](93-chore-retrait-simulation.md) | `chore/retrait-simulation` | 2026-11-07 |
| 94 | [Bouton de rendez-vous et frais kilométriques](94-feature-bouton-rdv.md) | `feature/bouton-rdv` | 2026-11-07 |
| 95 | [Retour de l'estimation, plus simple et en second plan](95-feature-estimation-retour.md) | `feature/estimation-retour` | 2026-11-07 |
| 96 | [Barre de navigation : Estimer, sans Métiers](96-feature-nav-estimation.md) | `feature/nav-estimation` | 2026-11-07 |
| 97 | [Un seul prix : à partir de 390 €](97-chore-prix-unique.md) | `chore/prix-unique` | 2026-11-07 |
| 98 | [À propos : emplois pendant les études](98-chore-apropos-jobs.md) | `chore/apropos-jobs` | 2026-11-07 |
| 99 | [Édition sur place](99-feature-edition-sur-place.md) | `feature/edition-sur-place` | 2026-11-07 |
| 100 | [Exemples d'outils dans la vitrine](100-feature-exemples-outils.md) | `feature/exemples-outils` | 2026-11-07 |
| 101 | [Réalisation Perfect Clean (detailing auto)](101-feature-realisation-detailing.md) | `feature/realisation-detailing` | 2026-11-16 |
| 102 | [Perfect Clean : mise à jour](102-feature-maj-perfect-clean.md) | `feature/maj-perfect-clean` | 2026-11-16 |
| 103 | [Logo « SB »](103-feature-logo-sb.md) | `feature/logo-sb` | 2026-11-17 |
| 104 | [Réalisations en grille](104-feature-realisations-grille.md) | `feature/realisations-grille` | 2026-11-17 |
| 105 | [Barre de navigation pleine largeur](105-style-nav-pleine-largeur.md) | `style/nav-pleine-largeur` | 2026-11-17 |
| 106 | [Réalisation « Chope ton chargeur »](106-feature-realisation-choptonchargeur.md) | `feature/realisation-choptonchargeur` | 2026-11-17 |
| 107 | [Pages lisibles par Google sans JavaScript](107-feature-seo-pages-statiques.md) | `feature/seo-pages-statiques` | 2026-11-17 |
| 108 | [Page d'une réalisation sans cartes, et « Cadeaux »](108-style-realisation-sans-cartes.md) | `style/realisation-sans-cartes` | 2026-11-17 |
| 109 | [Nouveau logo « SB »](109-feature-nouveau-logo.md) | `feature/nouveau-logo` | 2026-11-18 |
| 110 | [Icône d'onglet : nouveau logo partout](110-fix-icone-onglet.md) | `fix/icone-onglet` | 2026-11-18 |
| 111 | [Plus d'éclair de page sans mise en forme](111-fix-flash-pages-statiques.md) | `fix/flash-pages-statiques` | 2026-11-18 |
| 112 | [Réalisation renommée « Shop ton chargeur »](112-fix-nom-shop-ton-chargeur.md) | `fix/nom-shop-ton-chargeur` | 2026-11-18 |
| 113 | [Déroulé avec durées, retouches à volonté](113-feature-deroule-durees.md) | `feature/deroule-durees` | 2026-11-18 |
| 114 | [Paiement en 3 ou 4 fois sans frais](114-feature-paiement-plusieurs-fois.md) | `feature/paiement-plusieurs-fois` | 2026-11-18 |
| 115 | [Comparatif : trois façons d'avoir un site](115-feature-comparatif.md) | `feature/comparatif` | 2026-11-18 |
| 116 | [Vos mots, vos textes](116-feature-reponses-site.md) | `feature/reponses-site` | 2026-11-18 |
| 117 | [Réalisations filtrées par métier](117-feature-exemples-metier.md) | `feature/exemples-metier` | 2026-11-18 |
| 118 | [Maquette gratuite de la page d'accueil](118-feature-maquette-gratuite.md) | `feature/maquette-gratuite` | 2026-11-18 |
| 119 | [Accueil allégé, un seul formulaire](119-style-accueil-allege.md) | `style/accueil-allege` | 2026-11-18 |
| 120 | [Page « Site pour restaurant, kebab ou snack »](120-feature-page-restaurant.md) | `feature/page-restaurant` | 2026-11-19 |
| 121 | [Thème clair par défaut](121-style-theme-clair.md) | `style/theme-clair` | 2026-11-19 |
| 122 | [L'informatique à domicile, une page à part](122-style-informatique-a-part.md) | `style/informatique-a-part` | 2026-11-19 |
| 123 | [« Vous gardez tout »](123-feature-vous-gardez-tout.md) | `feature/vous-gardez-tout` | 2026-11-19 |
| 124 | [Téléphone animé : mes sites qui défilent](124-feature-telephone-anime.md) | `feature/telephone-anime` | 2026-11-19 |
| 125 | [Téléphone : défilement, réservation jouée, sans encoche](125-feature-telephone-defilement.md) | `feature/telephone-defilement` | 2026-11-19 |
| 126 | [Comparatif : l'avantage saute aux yeux](126-style-comparatif-evident.md) | `style/comparatif-evident` | 2026-11-19 |
| 127 | [Dix personas : une page par grand métier](127-feature-personas.md) | `feature/personas` | 2026-11-19 |
| 128 | [Comparatif : « Avec moi » au milieu](128-style-comparatif-milieu.md) | `style/comparatif-milieu` | 2026-11-19 |
| 138 | [Carte « Avant de partir » après 30 secondes](138-feature-relance-avant-de-partir.md) | `feature/relance-avant-de-partir` | 2026-11-24 |
| 139 | [Croc's en réalisation, captures d'O'RDV et de Shop ton chargeur refaites](139-feature-realisations-crocs.md) | `feature/realisations-crocs` | 2026-11-24 |
