# Comparatif : trois façons d'avoir un site

Branche `feature/comparatif` · 2026-11-18

## Ce qui a été fait
Idée reprise de Roselyn Pro, avec des textes propres : une section de l'accueil (après « Ce que vous recevez à la livraison ») compare **plateforme à abonnement**, **moi** et **agence web** sur six critères : qui fait le site, les textes, le prix, les modifications, si vous partez, votre contact.
- Vrai tableau (en-têtes de colonnes et de lignes) sur grand écran ; sur téléphone, un bloc par critère, chaque valeur précédée du nom de sa colonne.
- Colonne « Avec moi » sur fond rose léger.
- Aucun chiffre sur les concurrents (« Selon le contrat », « Sur devis ») et une note : les pratiques varient, lire le contrat. Aucun prix : l'accueil n'en montre qu'un.
- Bloc modifiable depuis le back-office (titre, introduction, chaque case, note) ; la durée des étapes de « Comment ça se passe » devient aussi modifiable.

## À quoi ça sert
Répondre à « pourquoi pas Wix ou une agence ? » avant que le visiteur se pose la question.

## Comment l'utiliser
Textes dans `front/src/data/accueil.ts` (`comparatif`), ou bouton « Modifier » sur le bloc une fois connecté.

## Tests
- `Home.test.tsx` : ordre des sections, en-têtes de colonnes et de lignes, propriété du site, aucun prix dans le tableau.
- **manuel** : vérifié dans Chrome sur ordinateur et téléphone (thème sombre).

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/pages/Home/sections/Comparatif.tsx`, `Comparatif.module.css`
- `front/src/data/accueil.ts`, `front/src/data/blocs.ts`

## Reste ouvert
- Rien.
