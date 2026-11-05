# Journal des modifications

## [Non publié]
### Ajouté (comptes)
- API, module Auth : domaine et cas d'usage (compte ouvert automatiquement puis activé par lien, liens à usage unique stockés hachés : activation 7 jours, connexion 15 minutes, mot de passe 1 heure ; connexion par mot de passe sans révéler si l'adresse existe ; sessions de 30 jours glissants, appareils connectés, déconnexion des autres ; changement de mot de passe qui ferme toutes les sessions).
- API : dépendances `symfony/password-hasher` (hachage des mots de passe) et `symfony/rate-limiter` (limitation des tentatives).
### Modifié
- `.gitattributes` : fins de ligne LF partout, fichiers images en binaire (plus d'avertissements « LF will be replaced by CRLF » ni de faux changements sous Windows).

## [2.0.0] – 2026-11-05
V2 : rendez-vous en ligne et API. Étiquette git : `v2.0.0`, branche de maintenance `release/v2`.
Le site (front) reste déployé comme en V1 ; l'API (`api/`) est prête mais pas encore mise en ligne sur `api.bsandoz.fr`.

### Ajouté (pré-devis)
- Pré-devis automatique dans l'accusé de réception d'une demande de devis : formule conseillée, fourchette de prix, délai et 3 options suggérées au plus (celles qui complètent un pack d'abord), calculés avec les prix du configurateur (`src/data/predevis.ts`). La configuration de « Composer mon site » l'emporte sur les besoins cochés. Le pré-devis figure aussi dans le mail reçu par Baptiste.
- Page de confirmation du devis : annonce la première estimation par e-mail.

### Ajouté (module Booking)
- API : module Booking autonome branché de bout en bout : `POST /rendez-vous` (201, 400 avec les erreurs, 409 si le créneau est pris), lien du mail `GET /rendez-vous/{jeton}` (page sans effet) et `POST /rendez-vous/{jeton}/annuler` (le créneau redevient libre).
- E-mails de confirmation et d'annulation à la personne et au professionnel, avec fichier `.ics` (ajout ou retrait de l'agenda).
- Base : table `booking_rendez_vous` (correspondance Doctrine en XML, migration).
- Réglages par installation (`config/packages/booking.yaml`, variables `BOOKING_*`) et notice d'installation dans l'API d'un client.
- CI : migrations appliquées sur une base vide, puis schéma validé.

### Corrigé
- CI de l'API : `api/.env.test` (classe du noyau pour PHPUnit, sans secret) n'était pas versionné, les tests échouaient sur GitHub.

### Ajouté
- Livraison de blocs à un client : `npm run livrer -- <Blocs> --vers <dossier>` copie les sources des blocs, leurs dépendances, les styles de base, un index et une note de livraison ; le site livré ne dépend plus de la bibliothèque. CGV : site livré complet et autonome, clause sur les briques réutilisées à compléter. Plan : module Booking autonome, installable dans l'API de chaque client.
- Bibliothèque de blocs `@bsandoz79/blocs` (`packages/blocs`) : les 15 blocs, autonomes (styles de base et variables par défaut, animations propres, classes préfixées `bsb-`, types), installable par d'autres sites ; espace de travail npm à la racine ; CI de la bibliothèque et publication sur GitHub Packages par étiquette `blocs-vX.Y.Z`.
- Fiches par fonctionnalité (`docs/fonctionnalites/`) : à quoi ça sert, chemin des fichiers et des données, comment l'appeler, réutilisabilité, schéma Mermaid, tests ; vue d'ensemble de l'architecture.
- Journal des branches (`docs/journal/`) : une fiche par branche (ce qui a été fait, à quoi ça sert, utilisation, tests et comment les lancer, points ouverts) ; nouvelle règle « une fiche avant chaque push » dans `.claude/CLAUDE.md`.
- API (V2) : squelette Symfony 7.4 dans `api/` (Doctrine, migrations, PHPUnit), PHP 8.3 visé ; valeurs de développement dans `api/.env.dist` (sans secret).
- API : base MySQL (MySQL 8.0 en développement via Docker), correspondances Doctrine par module.
- API : structure modulaire à cœur hexagonal (Shared, Auth, Prospect, Booking, Notification), route `/sante`, test d'indépendance du domaine.
- CI : job `api` (PHP 8.3, base MySQL de test, conteneur, YAML, Doctrine, PHPUnit).
- Bloc réutilisable `Calendar` (calendrier mensuel, jours indisponibles, motif ARIA « grid » piloté au clavier) et fonctions de dates sans fuseau horaire.
- Rendez-vous : lieux, disponibilités (à confirmer : lundi au vendredi, créneaux de la maquette, de demain à 60 jours), zone de 50 km autour d'Amiens ; logique pure (jours et créneaux réservables, distance à vol d'oiseau, vérification de l'adresse par le géocodage de l'IGN, validation).
- Page Rendez-vous (`/rendez-vous`) : choix « en ligne » ou « de vive voix », lieu, vérification de l'adresse et de la zone de 50 km, calendrier et créneaux d'une heure, coordonnées et consentement, récapitulatif ; réservation envoyée à l'API (`POST /rendez-vous`, branchée par le module Booking), créneau déjà pris signalé. Politique de confidentialité complétée (rendez-vous, géocodage de l'IGN).

## [1.0.0] – 2026-11-05
Première version complète du site vitrine et du configurateur (front seul). Étiquette git : `v1.0.0`.

### Corrigé
- Fourchette du Fonctionnel : son bas ne descend plus sous le prix plancher de 989 €.
- Workflow de déploiement invalide (« : » non protégé dans une commande `echo`, ligne 33) : il échouait à chaque push sur `main` sans rien lancer.

### Ajouté
- Cahier des charges, plan de développement et maquette de référence (`docs/`).
- Initialisation du front (React, Vite, TypeScript).
- Règles du projet (`.claude/CLAUDE.md`) et documentation de base.
- Configuration des tests : Vitest, Testing Library, jsdom (`npm run test`).
- Styles globaux segmentés : variables, bases, mise en page, animations.
- CI GitHub Actions (lint, tests, build) et déploiement FTPS sur o2switch depuis `main`.
- `.htaccess` : routes React et HTTPS forcé.
- Routes de toutes les pages publiques (contenu provisoire), page 404, titre et meta description par page.
- Bloc réutilisable `Button` (bouton ou lien, trois variantes, deux tailles) et `buttonClassName` pour habiller un lien de routeur.
- Bloc réutilisable `Container` (conteneur centré, balise et largeur au choix).
- Contenus de navigation, de contact et du pied de page dans `src/data/navigation.ts`.
- En-tête : onglets « Sites & applis » / « Informatique sur place », logo, menu avec sous-menu « Métiers », bouton « Estimer mon projet », menu repliable sur mobile (Échap, clic en dehors, fermeture au changement de page).
- Pied de page : présentation, e-mail, portfolio et pages légales.
- Barre « Estimer » fixe en bas de l'écran sur mobile, masquée sur les pages Composer et Devis.
- Mise en page commune : lien d'évitement « Aller au contenu », en-tête, pied de page et barre mobile sur toutes les pages.
- Bloc réutilisable `RotatingWords` (mots qui défilent, liste complète pour les lecteurs d'écran, figé si animations réduites).
- Bloc réutilisable `Marquee` (bande défilante, figée et sur plusieurs lignes si animations réduites).
- Bloc réutilisable `Card` (carte, fonds blanc / gris / bleu marine, effet de survol).
- Bloc réutilisable `Reveal` (apparition au défilement, visible d'emblée si animations réduites).
- Bloc réutilisable `SectionTitle` (sur-titre, titre, introduction).
- Polices Plus Jakarta Sans et Inter chargées ; animation `anim-pulse` pour le bouton principal.
- Données : formules et formatage des prix (`offres.ts`), réalisations (`realisations.ts`), textes de l'accueil (`accueil.ts`).
- Composant `RealisationCard` : carte d'une réalisation avec aperçu provisoire en attendant les captures.
- Page d'accueil complète : hero (mots qui tournent, écran de réservation de démonstration sur ordinateur), bande des métiers, problèmes → solutions, offres, réalisations, méthode en 4 étapes, « Pourquoi travailler avec moi », appel à l'action.
- Données de prix complètes (`offres.ts`) : métiers, options, listes par formule et par métier, précisions, packs offerts, prix du marché avec leur source.
- Calculs du configurateur (`calculs.ts`) : options disponibles, packs actifs, estimation détaillée (valeur, offert, total, fourchette, délai), suggestions, comparaison avec le marché.
- Bloc réutilisable `ChoiceChips` (choix unique en pastilles, vrais boutons radio).
- Bloc réutilisable `OptionCard` (carte à cocher avec description et prix, option désactivable).
- Bloc réutilisable `PriceSummary` (récapitulatif de prix, total annoncé aux lecteurs d'écran, lignes offertes barrées).
- Bloc `ChoiceChips` : variante « cartes » avec description et prix.
- Page Tarifs : trois formules avec contenu et délai, encadré « Pourquoi un site fonctionnel coûte plus cher ? », simulateur du Fonctionnel (activité, options, prix et fourchette en direct, packs offerts, suggestion), « Et après la mise en ligne ? ».
- Données de l'informatique sur place (`informatique.ts` : prestations, publics, « Bientôt disponible ») et textes du configurateur (`configurateur.ts`).
- Configurateur : choix mémorisés dans le navigateur (repris par le parcours de devis), formule préremplie par `?formule=`.
- Page Composer mon site (`/composer`) : onglets accessibles « Sites & applis » / « Informatique sur place », étapes qui s'ouvrent l'une après l'autre (type, activité, options, précisions, suggestions), estimation (valeur barrée, offert, fourchette, délai, détail), comparaison au marché avec sa source ; onglet informatique en « Tarif sur devis ».
- Bloc réutilisable `SitePreview` (aperçu dessiné d'un site d'exemple : navigateur, hero, sections, appli, résultat Google ; description lue par les lecteurs d'écran).
- Modèle de l'aperçu (`apercu.ts`) : entreprises d'exemple par métier, sections selon les options choisies ou offertes, description pour les lecteurs d'écran.
- Configurateur : aperçu en direct en colonne de droite (masqué sous 1 000 px), encadré « Bon à savoir » dans l'onglet informatique.
- Configurateur : `?onglet=informatique` ouvre directement l'onglet informatique.
- Page Informatique sur place : contexte Windows 10 / Linux, 8 prestations (réseau et NAS « Bientôt disponible »), déroulement en 3 étapes, « Tarif sur devis », accès direct à l'onglet informatique du configurateur.
- Configurateur : `?metier=` choisit l'activité (avec `?formule=`), lecture de l'adresse regroupée dans `etatDepuisAdresse`.
- Pages métier (artisan, commerce, restaurant, santé / bien-être) : promesse du cahier des charges, fonctions utiles avec leur prix, exemple de site fictif (aperçu), réalisation proche quand il y en a une, accès au configurateur préréglé.
- Page Réalisations : une étude de cas par projet (besoin, solution, captures), emplacements « [à compléter] » en attendant les informations réelles ; liens des cartes vers chaque étude.
- Mise en page : une adresse avec ancre (`#…`) descend jusqu'à l'élément visé.
- Page À propos : présentation, photo et parcours à compléter, lien vers le portfolio, les 4 valeurs, zone d'intervention, rendez-vous.
- Bloc réutilisable `Accordion` (questions dépliables sur `details` / `summary`, ancre par question).
- Page FAQ : délais, contenus à fournir, propriété du site, hébergement, modifications, WordPress, paiement ; réponses tirées des données (délais, prix), sans rien inventer.
- Bloc réutilisable `Stepper` (barre de progression et étapes, étape en cours annoncée).
- Bloc réutilisable `TextField` (champ ou zone de texte, aide et erreur reliées au champ).
- Demande de devis : données du parcours (`data/devis.ts`) et logique pure (validation par étape, photos, brouillon dans le navigateur, récapitulatif, préparation de l'envoi).
- Page Demande de devis (`/devis`) : 5 étapes avec progression, retour sans perte, brouillon gardé dans le navigateur, reprise de la configuration et de l'estimation du configurateur, erreurs expliquées, récapitulatif et consentement, champ piège anti-robots et délai entre deux envois.
- Script d'envoi `api/devis.php` (o2switch) : e-mail à Baptiste avec photos jointes, accusé de réception au client, champ piège, limite d'envois par adresse IP, contrôle des photos.
- SEO : `sitemap.xml` et `robots.txt` générés au build depuis la liste des pages (`data/seo.ts`), données structurées de l'entreprise, de la FAQ et des formules (faits établis seulement).
- SEO : adresse canonique sur chaque page, « noindex » sur les pages provisoires et la 404, données structurées affichées sur l'accueil, la FAQ et Tarifs (composant `StructuredData`).
- Pages légales (mentions légales, CGV, confidentialité) : faits établis seulement, mentions manquantes en « [à compléter] » (SIRET, adresse, acompte, conservation, médiateur) ; à faire relire avant la mise en ligne publique.
