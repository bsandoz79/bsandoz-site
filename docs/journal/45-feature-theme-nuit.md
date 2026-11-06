# Thème nuit et thème clair

Branche `feature/theme-nuit` · 2026-11-06

## Ce qui a été fait
- **Thème nuit par défaut**, inspiré des couchers de soleil néon (palette seulement, aucun logo ni visuel de jeu) :
  - fond bleu nuit et panneaux plus sombres teintés de violet ;
  - rose magenta pour les boutons, rose clair pour les textes d'accent ;
  - lueurs orangée, rose et violette en haut de page.
- **Thème clair** au choix, par un bouton soleil ou lune dans l'en-tête (en fin de barre sur ordinateur, à côté du menu sur téléphone). Le choix est gardé dans le navigateur (stockage local, aucun cookie) et appliqué avant l'affichage, sans flash.
- **Mise en œuvre** :
  - mêmes noms de variables, avec d'autres valeurs sous `:root[data-theme='nuit']` ;
  - variables de rôle `--color-accent-texte` et `--color-rose-hover`, et `--fond-page` ;
  - 14 usages réaffectés (rose comme texte, rose foncé comme fond au survol, bleu marine comme texte ou bordure) ;
  - 5 couleurs encore écrites en dur remplacées par une variable ;
  - `color-scheme` adapté pour les champs natifs et les barres de défilement ;
  - couleur de la barre du navigateur sur téléphone selon le thème.
- **Politique de confidentialité** : le choix de thème est mentionné parmi les données gardées dans le navigateur.

## Tests
- **unitaires** : `ThemeToggle.test.tsx` (nuit par défaut, bascule dans les deux sens, attribut, stockage, couleur de barre, valeur gardée reprise, valeur inconnue ignorée).
- **contrastes** : 15 paires calculées par thème (WCAG), toutes AA (texte ≥ 4,5, éléments graphiques ≥ 3).
- **manuel** : captures de 6 pages en thème nuit et de l'accueil en thème clair.

Résultats : site 362 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/styles/tokens.css`, `front/src/styles/base.css`, `front/index.html`
- `front/src/app/theme.ts`, `front/src/components/ThemeToggle/`, `front/src/components/Header/`
- composants retouchés pour les rôles : Footer, MobileBar, ContactRapide, Hero, NotFound, Realisation, RealisationCard, APropos, Composer, Metier ; bibliothèque : Button, TextField

## Reste ouvert
- Les polices viennent encore de Google Fonts : les héberger sur le site supprimerait le dernier service tiers (en attente de votre accord).
