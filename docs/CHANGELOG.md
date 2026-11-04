# Journal des modifications

## [Non publié]
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
