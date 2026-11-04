# Journal des modifications

## [Non publié]
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
