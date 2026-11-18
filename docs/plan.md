# Plan de développement

Une ligne = une branche. Chaque branche : commits « un ajout = un commit », tests, doc et CHANGELOG à jour, lint + tests + build verts, push, fusion dans `main`, puis branche suivante. Cocher au fur et à mesure.

## V1 – site vitrine + configurateur (front seul)
- [x] `chore` initialisation, règles, tests, CSS segmenté, CI/CD
- [x] `feature/routing` : React Router, pages vides, page 404, titres et meta par page
- [x] `feature/layout` : blocs `Button`, `Container` ; composants `Header` (menu + onglets Sites & applis / Informatique, menu mobile), `Footer`, barre mobile « Estimer »
- [x] `feature/home` : accueil complet (hero + mots qui tournent, bande des métiers, problèmes, offres, réalisations, méthode, pourquoi moi, appel à l'action) – blocs `RotatingWords`, `Marquee`, `Card`, `Reveal` (apparition au défilement)
- [x] `feature/pricing-data` : `src/data/offres.ts` (formules, options, listes par métier, sous-questions, packs, marché) + fonctions de calcul pures (`calculerEstimation`, `packsActifs`, `suggestions`, `comparaisonMarche`) entièrement testées
- [x] `feature/tarifs` : page Tarifs
- [x] `feature/configurateur` : bloc `OptionCard`, `ChoiceChips`, `PriceSummary` (créés dès `feature/tarifs`) ; page `/composer` avec étapes, packs, marché
- [x] `feature/apercu` : bloc `SitePreview` (aperçu en direct), masqué sous 1 000 px
- [x] `feature/informatique` : onglet et page Informatique sur place (réseau « Bientôt disponible »)
- [x] `feature/metiers` : 4 pages métier
- [x] `feature/realisations-apropos-faq`
- [x] `feature/devis-front` : parcours en 5 étapes, envoi par mail (service d'envoi simple ou script PHP sur o2switch), sauvegarde locale
- [x] `feature/legal-seo` : mentions légales, CGV, confidentialité, données structurées, sitemap, robots.txt
- [ ] Mise en ligne sur `preview.bsandoz.fr` puis `bsandoz.fr`

## V2 – rendez-vous et API
- [x] `api` Symfony : structure modulaire, base MySQL, CI
- [x] `feature/paquet-blocs` : bibliothèque `@bsandoz79/blocs` (espace de travail npm, blocs déplacés, styles par défaut, CI, publication GitHub Packages)
- [x] `feature/livraison-blocs` : commande `npm run livrer` (copie de blocs dans le projet d'un client, sans dépendance), clause CGV à compléter
- [x] bloc `Calendar` réutilisable + page Rendez-vous (créneaux d'1 h, 50 km, visio, téléphone)
- [x] module Booking **autonome**, installable dans l'API de chaque client (son hébergement, sa base, son domaine) : réservation, créneau pris refusé, mails de confirmation, .ics
- [x] pré-devis automatique par mail

## V3 – espace client et back-office
- [x] Auth (compte créé automatiquement, lien d'activation, mot de passe par lien mail)
- [x] Espace client complet (demandes, devis à accepter, compte, sécurité, confidentialité, zone danger), en plusieurs branches :
  - [x] `feature/espace-rendez-vous` : mes rendez-vous (liste, ajouter à l'agenda, annuler, déplacer)
  - [x] `feature/espace-compte` : mon compte (coordonnées, changement d'e-mail confirmé), confidentialité (préférences, téléchargement des données), zone danger (suppression confirmée par mail)
  - [x] `feature/demandes-devis` : demandes de devis enregistrées par l'API (module Prospect, compte ouvert), suivi du statut, devis à accepter et PDF
- [x] `docs/mise-en-place-client` : doc d'installation de chaque fonctionnalité copiable sur le site d'un client, client autonome ou « je gère pour lui »
- [x] `feature/fil-messages` : fil de messages synchronisé avec les mails (IMAP)
- [x] `feature/rappels` : rappel la veille d'un rendez-vous, préférence de notification du compte
- [x] Back-office, en plusieurs branches :
  - [x] `feature/back-office` : demandes et devis
  - [x] `feature/back-office-prix` : prix
  - [x] `feature/back-office-disponibilites` : disponibilités

## V4 – retours du 2026-11-06
- [x] `feature/carte-zones` : carte des zones d'intervention (Amiens, Abbeville, Arras, Beauvais, 50 km)
- [x] `feature/retour-haut` : bouton « revenir en haut »
- [x] `feature/reflet` : reflet lumineux sur « Estimer mon projet » et les cartes de tarifs
- [x] `feature/faq-accueil` : FAQ en bas de l'accueil avant la carte, 3 questions puis « Voir plus » (+3), le lien du menu mène à l'ancre
- [x] `feature/bandeau-cookies` : bandeau discret en bas, non bloquant ; carte affichée directement au défilement
- [x] `feature/carte-position` : demande de position quand la carte apparaît, point sur la carte, message dans la zone / hors zone (frais kilométriques), bouton pour réactiver
- [x] `feature/accueil-autonomie` : accueil recentré sur « un site que vous modifiez vous-même », bande des métiers, réalisations qui défilent (bloc `Showcase`), ce que vous recevez à la livraison
- [x] `chore/retrait-simulation` : estimation retirée ; le devis devient un formulaire court (accueil et `/devis`), activité avec « Autre » à préciser
- [x] `feature/estimation-retour` : estimation remise en second plan (métier tapé avec suggestions, options incluses selon la formule, aperçu « squelette », validation en demande de devis) ; bloc `Autocomplete`
- [x] `feature/nav-estimation` : « Estimer » dans la barre (simple lien) ; « Métiers » et « Portfolio » passent dans le pied de page
- [x] `chore/prix-unique` : un seul prix « à partir de 390 € » ; tarifs et estimation retirés
- [x] `feature/edition-sur-place` : édition dans la page (cadres, bulle, barre d'enregistrement) à la place du panneau latéral
- [x] `feature/exemples-outils` : maquettes d'outils (marquées « Exemple ») dans la vitrine des réalisations
- ~~`feature/composer-etapes`~~ : sans objet (estimation retirée) : le configurateur s'affiche étape par étape et centre chaque nouvelle étape
- [x] `feature/ordre-accueil` : fin de l'accueil Questions → Carte → Contact ; pas d'appel du pied de page sur l'accueil
- [x] `feature/frais-kilometriques` : zones Amiens et Abbeville, frais au-delà de 50 km (2,50 €/L, 7,5 L/100), dus même sans devis
- [x] `feature/theme-rideau` : changement de thème en rideau, de gauche à droite
- [x] `fix/devis-sans-besoins` : depuis une estimation, le devis ne repose plus la question des besoins
- [x] `style/sans-liseres` : nouvel état « choisi » des pastilles et cartes ; bouton « Confirmer le rendez-vous » en bas du formulaire
- [x] `style/moins-ia` : moins d'effets, titres simples, sans formules toutes faites
- [x] `fix/devis-sans-anciens-essais` : une nouvelle estimation donne un devis neuf (rien des essais précédents, sauf les coordonnées)
- [x] `fix/estimer-bon-onglet` : « Estimer » ouvre le bon onglet ; une seule barre d'onglets sur la page Estimer
- [x] `fix/devis-depuis-estimation` : le devis reprend la dernière estimation (choix pré-cochés, première question à remplir), une nouvelle simulation remplace l'ancienne
- [x] `style/message-frais` : message de position sans trait rose (cadre arrondi, icône) ; frais du rendez-vous en couleur normale
- [x] `style/complements-seo` : deux compléments seulement, référencement seul dans un encart à part
- [x] `style/complements-pointilles` : compléments en cadres pointillés, prix à droite ; calcul des frais kilométriques affiché en petit
- [x] `feature/photo-rideau` : apparition en rideau de la photo au premier passage
- ~~`feature/devis-chat`~~ : abandonné à la demande de Baptiste (trop « IA »)
- ~~`feature/realisations-similaires`~~ : sans objet (estimation retirée) : dans le configurateur et le devis, les réalisations du même métier
- [x] `feature/frais-aller-retour` : frais kilométriques aller-retour, indiqués dans les mails du rendez-vous ; suivi mensuel = maintenance et mises à jour
- [x] `fix/lien-rendez-vous-mail` : le lien « rendez-vous » du mail de devis mène à une page 404
- [x] `feature/autre-activite` : champ pour préciser l'activité quand on choisit « Autre activité »
- [x] `feature/adresse-devis` : le devis demande une adresse, pour estimer les frais kilométriques
- [ ] `feature/avis-google` : **en attente** : pas encore de fiche Google, donc pas d'avis (aucun avis n'est inventé)
- [x] `feature/disponibilites-admin` : jours, heures et congés réglés d'un clic
- [x] `feature/lien-espace-client` : lien « Espace client » visible dans l'en-tête
- [x] `feature/composer-memoire` : le configurateur oublie d'une visite à l'autre, avec « Reprendre là où vous en étiez ? »
- [x] `feature/alterno` : projet Alterno dans les réalisations
- [x] `feature/cibles` : cartes retirées à la demande de Baptiste. Ces besoins passent par une demande de devis ; une page viendra quand un projet de ce type sera terminé. Besoins visés : photographes (galerie et vente de photos), PME (CRM sur mesure), restauration (carte par QR code), charcutiers (logiciel interne : stocks, DLC…)
- [x] `feature/tarifs-complements` : 29 €/h, suivi 29 €/mois, SEO seul à −20 % du marché, compléments à part, « à partir de », simulateur sur les trois formules
- [ ] `feature/plaquette-pdf` : plaquette PDF des services et tarifs, générée depuis les prix du back-office
- [x] `feature/edition-en-page` : crayon sur les prix, visible seulement par un compte du back-office
- [x] `feature/edition-blocs` : bouton « Modifier » sur chaque bloc de l'accueil et sur les formules : textes, prix, images, module API `Contenu`
- [x] `feature/agenda-rdv` : ajouter le rendez-vous à Google, Outlook ou Apple, depuis la confirmation et les mails
- [x] `feature/planning-admin` : planning des rendez-vous et statistiques dans le back-office
- [ ] `feature/edition-autres-pages` : mêmes blocs sur les autres pages (métiers, réalisations, À propos…)
- [ ] `chore/a-completer` : remplir les « [à compléter] » avec les informations fournies

## Inspiré de Roselyn Pro (validé le 18/11/2026)
- [x] `feature/deroule-durees` : durée de chaque étape, retouches à volonté, 30 jours d'ajustements
- [x] `feature/paiement-plusieurs-fois` : 3 ou 4 fois sans frais pour Vitrine+ et Fonctionnel
- [x] `feature/comparatif` : plateforme à abonnement, moi, agence web
- [x] `feature/reponses-site` : ce que vous me dites → ce que ça donne sur votre site
- [ ] `feature/exemples-metier` : réalisations et exemples filtrés par métier
- [ ] `feature/maquette-gratuite` : maquette de la page d'accueil envoyée sous 72 h ouvrées
