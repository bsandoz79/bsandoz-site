# Journal des modifications

## [Non publié]
### Corrigé (téléphone)
- Fond de page fixe réservé aux ordinateurs (saccades et fond qui saute sur iPhone) ; marges entre sections plus courtes sur téléphone.

### Corrigé
- Page blanche sur preview.bsandoz.fr après des déploiements rapprochés. `index.html` est maintenant envoyé en dernier, après les fichiers qu'il utilise, et un déploiement n'est plus jamais annulé en cours.

### Modifié (design)
- Compléments réduits à deux cadres pointillés : page supplémentaire et suivi mensuel (avec le tarif horaire). Le référencement Google seul a son propre encart, mis en avant : badge « − 20 % », prix du marché barré, source, bouton « Faire le point sur mon site ».
- Photo de Baptiste (accueil, À propos) : elle apparaît en ouverture de rideau la première fois qu'on arrive dessus en défilant (composant `Rideau`, animation `anim-rideau`) ; coupée si les animations sont réduites.
- Compléments présentés en cadres pointillés, nom et détail à gauche, prix à droite (deux colonnes sur ordinateur). Le calcul des frais kilométriques est affiché en petit sous le message de la carte et de la page Rendez-vous (« Calcul : 48 km × 0,1875 € = 9,00 € (2,50 € le litre × 7,5 L aux 100 km) »).
- Zones d'intervention : Amiens et Abbeville seulement, sans frais à 50 km. Au-delà, seuls les kilomètres en plus sont facturés (2,50 € le litre, 7,5 L aux 100 km, soit 0,1875 € par km), et ces frais sont dus même sans devis à la suite.
  - La page Rendez-vous accepte maintenant les adresses lointaines et annonce les frais ; la carte aussi.
  - Les CGV ont une nouvelle section « Déplacements ».
- Coordonnées renseignées :
  - le téléphone (07 69 28 78 37), affiché dans le pied de page et le contact ;
  - l'adresse (319 rue de Rouen, 80000 Amiens), dans les mentions légales et les données structurées ;
  - la mention « SIRET en cours d'immatriculation ».
- Tarifs :
  - intervention à **29 € de l'heure** ;
  - **suivi mensuel à 29 € par mois** (hébergement et maintenance) ;
  - **référencement Google seul à 400 €** (20 % sous le bas de la fourchette du marché, source affichée).
- Ces compléments et la page supplémentaire sont présentés à part, dans un bloc « Les compléments » sous les trois formules (accueil et Tarifs).
- Vitrine et Vitrine+ sont affichées « à partir de », comme le Fonctionnel.
- Le simulateur de la page Tarifs n'est plus bloqué sur le Fonctionnel : on choisit d'abord la formule.
- Fin de l'accueil réordonnée : Questions fréquentes → Carte → Formulaire de contact (la page se termine par l'action). Le bandeau « Un projet en tête ? » du pied de page n'est plus affiché sur l'accueil (doublon avec le formulaire juste au-dessus).
- Carte : la position du visiteur est demandée quand la carte apparaît à l'écran.
  - Si elle est donnée : un point « Vous êtes ici » et la distance à la zone la plus proche. Dans la zone, « je peux venir chez vous » ; hors zone, un message rassurant (frais kilométriques). La position n'est jamais envoyée.
  - Si elle est refusée : la carte reste normale, et un bouton discret « Me situer sur la carte » permet de réessayer.
- Bandeau des services tiers : une bande discrète en bas de l'écran, qui ne bloque pas la page. « Accepter » et « Refuser » ont le même poids.
  - Le choix est gardé 6 mois ; la croix ferme le bandeau pour la visite seulement.
  - Le lien « Services tiers » du pied de page rouvre le bandeau.
- La carte s'affiche d'elle-même quand on approche en défilant, sans clic, sauf si le visiteur a refusé.
- Polices Inter et Plus Jakarta Sans hébergées avec le site (paquets Fontsource) : plus aucun appel à Google Fonts.
- FAQ déplacée en bas de l'accueil, juste avant la carte : 3 questions, puis 3 de plus à chaque « Voir plus ». Le lien « Questions fréquentes » mène à `/#faq`, l'ancienne adresse `/faq` y redirige ; données structurées FAQPage sur l'accueil.
- Reflet lumineux (effet verre) qui traverse le bouton « Estimer mon projet » du haut de l'accueil et les trois cartes de tarifs, environ toutes les 2 secondes ; coupé si les animations sont réduites.
- Bouton « revenir en haut » : rond, transparent, en bas à droite, visible une fois la page descendue ; au-dessus de la barre « Estimer » sur mobile.
- Carte des zones d'intervention en bas de l'accueil : cercles de 50 km autour d'Amiens, Abbeville, Arras et Beauvais, zoom sur la ville choisie ; chargée seulement au clic (OpenStreetMap), mentionnée dans la politique de confidentialité.
- Accueil, « Pourquoi travailler avec moi » : votre photo remplace l'emplacement « [photo à compléter] ».
- En remontant, seule la barre principale de l'en-tête revient : les onglets « Sites & applis / Informatique sur place » ne s'affichent qu'en haut de page.
- Rendez-vous : la page se centre sur chaque étape qui s'ouvre.
- Accueil à la première personne avec votre photo (grande à droite sur ordinateur, vignette et nom en haut sur téléphone) et le prix de départ ; photo aussi sur la page À propos.
- Cartes de projets plus courtes, résumé d'une phrase, et cliquables en entier.
- Réalisations : filtre Tout / Sites web / Applis & plateformes, gardé dans l'adresse (`?type=`).
- Thème nuit par défaut, inspiré des couchers de soleil néon (bleu nuit, lueurs rose, violet et orangé), et thème clair au choix par un bouton dans l'en-tête ; choix gardé dans le navigateur, appliqué avant l'affichage (pas de flash) ; contrastes AA vérifiés dans les deux thèmes.
- Tarifs : prix d'une page supplémentaire affiché sous chacune des trois formules (repris de l'option, modifiable dans le back-office).
- Accueil plus dynamique : téléphone de démonstration façon smartphone récent (îlot, barre d'état, bords fins, halo qui respire), lueurs en fond, bande « En bref » de chiffres clés réels ; boutons qui se soulèvent au survol avec un halo rose.
- Formulaire de contact rapide en bas de l'accueil (carte : formulaire à gauche, contact et engagements à droite), envoyé comme une demande de devis ; champs de saisie modernisés sur tout le site (fond teinté, halo rose au focus).
- Réalisations : une page par projet (`/realisations/<projet>`) qui n'affiche que lui (contexte, besoin, solution, fonctionnalités, captures, démo, projets voisins) ; liste en cartes avec les vraies captures (WebP) ; textes repris du portfolio ; pages de projets dans le plan du site.
- En-tête collé en haut : il se cache quand on descend et réapparaît dès qu'on remonte (visible en haut de page, menu ouvert ou focus clavier dedans).
- Pied de page refait : fond bleu marine avec une lueur rose, bande « Un projet en tête ? », colonnes compactes, mentions légales sur une ligne.

### Modifié (rendez-vous)
- Page Rendez-vous en étapes : la date et le créneau apparaissent quand le lieu est validé (adresse vérifiée dans les 50 km, bouton « Vérifier l'adresse »), les coordonnées et le bouton « Confirmer » quand le créneau est choisi.
- Barre mobile « Estimer » masquée sur la page Rendez-vous et dans l'espace client ; place réservée en bas de page pour qu'elle ne cache plus le pied de page.

### Corrigé (déploiement)
- Certificat FTPS d'o2switch : nom de serveur `muguet.o2switch.net` (celui du certificat) et certificats intermédiaires Let's Encrypt récupérés puis vérifiés avec les racines du système (`.github/scripts/chaine-ftps.sh`), sans jamais désactiver la vérification.
- Envoi sur o2switch par lftp en FTPS (session TLS réutilisée sur le canal de données), pour le site et pour l'API : l'action précédente échouait avec « ECONNRESET (data socket) » au premier envoi sur `preview.bsandoz.fr`.

## [3.0.0] – 2026-11-06
V3 : comptes, espace client, fil de messages, back-office. Étiquette git : `v3.0.0`, branche de maintenance `release/v3`.
Rien n'est encore en ligne : voir `docs/mise-en-ligne.md`.

### Ajouté (mise en ligne)
- `docs/mise-en-ligne.md` : le pas-à-pas complet. Workflow manuel `deploy-api.yml` (API envoyée par FTP, lançable depuis un téléphone). Le site est construit avec les variables `VITE_API_URL` et `VITE_DEVIS_URL` du dépôt.

### Ajouté (rappels)
- API : rappel par mail la veille d'un rendez-vous (`booking:envoyer-rappels`).

### Corrigé (notifications)
- La case « Rappels et notifications par mail » de l'espace client n'agissait sur rien : décochée, plus de rappel ni de mail « nouveau message ».

### Ajouté (back-office : disponibilités)
- Site : onglet « Disponibilités » de `/admin` (jours, créneaux, jours fermés) ; le calendrier de `/rendez-vous` les suit, avec repli sur `data/rendezvous.ts`.
- API, module Booking : disponibilités en base (`booking_disponibilites`), valeurs de `booking.yaml` tant que rien n'est réglé, jour fermé refusé ; `GET /rendez-vous/disponibilites`, `POST /backoffice/disponibilites`.

### Ajouté (back-office : prix)
- Site : onglet « Prix » de `/admin` ; le site applique les prix modifiés à son chargement, avec repli sur ceux du code (`data/prixEnLigne.ts`). Les prix actuels ne changent pas.
- API : module `Catalogue` (`GET /prix`, `POST /backoffice/prix`), table `catalogue_prix`.

### Ajouté (back-office : demandes et devis)
- Site : page `/admin` (réservée, non indexée) : demandes, statut, devis confirmé avant l'envoi, réponses et notes d'appel. Après la connexion, retour sur la page demandée.
- API : `/backoffice/demandes…`, réservé aux adresses de `BACKOFFICE_EMAILS` ; commande `backoffice:ouvrir-acces` ; règles du statut (`ChangerStatut`).

### Ajouté (fil de messages)
- Site : « Nos échanges » dans chaque demande de l'espace client (messages, réponses par mail, notes d'appel). Politique de confidentialité complétée.
- API, module Prospect : messages d'une demande (`POST /espace/demandes/{id}/messages`, 20 par heure), prévenir l'autre personne par mail ; référence signée dans l'objet des mails ; `prospect:relever-mails` relève la boîte en IMAP et rattache les réponses (expéditeur vérifié, citations et signatures retirées, réponses automatiques ignorées, doublons refusés). Fil inclus dans l'export et effacé avec la demande. Table `prospect_message`.
- API : dépendance `zbateson/mail-mime-parser` (lecture des mails, PHP pur). CI : serveur IMAP de test GreenMail.

### Ajouté (mise en place chez un client)
- `docs/mise-en-place/` : une fiche par fonctionnalité copiable (blocs, prix et référencement, devis par mail, rendez-vous, demandes de devis, espace client) et une page commune : fichiers à copier, réglages, base, mails, domaine, vérifications finales. Deux façons de livrer : client autonome, ou « je gère pour lui » à sa demande.

### Modifié (mise en place chez un client)
- Règle du projet nuancée : un site livré ne dépend pas de nous, sauf si le client demande que je gère pour lui.

### Corrigé (notices d'installation)
- Auth : la seconde migration manquait dans la notice (base incomplète). Prospect : étapes manquantes, mentions écrites en dur signalées.

### Corrigé (API en production)
- `cache:clear` échouait en production (« Cannot generate lazy ghost ») : les 6 entités du domaine ne sont plus `final`. La CI construit désormais le cache de production.
- `api/public/.htaccess` ajouté : sans lui, Apache répondait 404 sur toutes les adresses de l'API.

### Ajouté (demandes et devis)
- Site : section « Mes demandes » de l'espace client (avancement de Reçue à Livré, devis détaillé, acceptation en deux temps, PDF), comme la maquette ; la demande envoie aussi téléphone, entreprise et un titre lisible ; adresse d'envoi réglable au build (`VITE_DEVIS_URL`, `devis.php` par défaut).
- API : `POST /demandes` (même contrat que `devis.php` : piège anti-robots, 3 par heure par adresse IP, photos vérifiées et jointes au mail), accusé de réception avec le pré-devis, compte client ouvert à la première demande (liaison `CompteApresDemande`) ; « Mes demandes » (`GET /espace/demandes`, acceptation du devis, devis en PDF avec dompdf). Suppression du compte : demandes et devis effacés ; export : demandes et devis inclus. Tables `prospect_demande`, `prospect_devis`.
- API, module Prospect : domaine et cas d'usage des demandes de devis (numéro « 2026-014 » par année, statuts Reçue → En étude → Devis envoyé → Accepté → En cours → Livré) et des devis (lignes, total, un devis par demande, acceptation par la seule demandeuse).
- API : dépendance `dompdf/dompdf` (devis en PDF, en PHP pur, compatible o2switch).

### Ajouté (espace client : compte)
- Site : sections « Mon compte » (coordonnées, changement d'e-mail), « Confidentialité et préférences » (état de la localisation et aide pour la réactiver, notifications par mail, téléchargement de ses données) et « Zone danger » (suppression en deux temps puis par le lien du mail) ; pages `/mon-espace/email` (confirmation de la nouvelle adresse, une seule fois) et `/mon-espace/suppression` (rien n'est supprimé sans clic). Politique de confidentialité complétée (espace client, cookie de session).
- API : coordonnées et préférences du compte (`POST /auth/compte`), changement d'e-mail confirmé par un lien envoyé à la nouvelle adresse (l'ancienne est prévenue), suppression du compte confirmée par mail (compte, liens, sessions et rendez-vous effacés ; un rendez-vous à venir est d'abord annulé), téléchargement de ses données en JSON (`GET /espace/donnees`, sans aucun secret). Migration des nouvelles colonnes.

### Ajouté (espace client : rendez-vous)
- Site : section « Mes rendez-vous » dans `/mon-espace` (à venir : ajouter à l'agenda, déplacer, annuler avec confirmation ; passés et annulés).
- API : « Mes rendez-vous » pour la personne connectée (`GET /espace/rendez-vous`, fichier `.ics` à ajouter à l'agenda, annulation `POST /espace/rendez-vous/{id}/annuler` qui libère le créneau et prévient par mail) ; un rendez-vous d'une autre adresse répond 404, un rendez-vous passé ne s'annule plus (409). Booking : recherche par identifiant et par adresse e-mail.

### Ajouté (comptes)
- Site : espace client `/mon-espace` (compte, mot de passe par lien sécurisé, appareils connectés, déconnexion des autres, déconnexion), connexion par mot de passe ou par lien reçu par mail, pages du lien et du mot de passe ; pages exclues du sitemap et des robots ; lien « Espace client » dans le pied de page. Appels à l'API regroupés dans `src/app/api.ts` (cookie inclus).
- API, module Auth branché : points d'entrée `/auth/…` (liens par mail, connexion, mot de passe, compte connecté, appareils, déconnexion), cookie de session `HttpOnly` et `SameSite=Lax`, limitation des essais (429), corps JSON obligatoire (415), CORS avec cookies pour le site, tables `auth_compte`, `auth_lien`, `auth_session` (migration).
- Compte client ouvert automatiquement au premier rendez-vous, avec un lien d'activation par mail (`src/Liaisons/CompteApresRendezVous.php`, événement `RendezVousReserve` publié par Booking).
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
