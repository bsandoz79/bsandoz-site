# Blocs

Composants d'interface (bouton, calendrier, carte, sélecteur…), copiés dans le site du client. Liste : [docs/blocs.md](../blocs.md).

## Fichiers à copier
```sh
npm run livrer -- --liste
npm run livrer -- Calendar OptionCard --vers ../site-client/src/blocs
```
La commande copie aussi ce dont les blocs ont besoin, les styles de base, un `index.ts` et `LIVRAISON.md`. Ajouter `--avec-tests` pour livrer leurs tests.

## Réglages
```tsx
import './blocs/styles/base.css';            // une fois, à l'entrée du site
import { Calendar, OptionCard } from './blocs';
```
Couleurs et typographie : variables de `styles/base.css`, à adapter au client.

## Base de données, mails, domaine
Aucun.

## Vérifications finales
- [ ] `npm run build` passe.
- [ ] Les blocs se pilotent au clavier ; les animations s'arrêtent si l'appareil le demande.
- [ ] `package.json` ne contient pas `@bsandoz79/blocs`.

## Selon la façon de livrer
Aucune différence : le code est dans le projet du client. Si je gère pour lui, je construis et j'envoie le site moi-même.
