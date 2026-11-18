# Paiement en 3 ou 4 fois sans frais

Branche `feature/paiement-plusieurs-fois` · 2026-11-18

## Ce qui a été fait
Inspiré de Roselyn Pro, choix de Baptiste : 3 ou 4 fois sans frais pour **Vitrine+** et **Fonctionnel** (Vitrine se paie en une fois).
- Accueil : « Sites à partir de 390 €. Le prix exact dans votre devis, sous 24 h, payable en 3 ou 4 fois sans frais. »
- FAQ « Comment se passe le paiement ? » : les formules concernées, échéances indiquées dans le devis.
- CGV, article Paiement : même règle.

## À quoi ça sert
Rendre un site de plusieurs pages plus facile à financer pour un artisan ou un indépendant.

## Comment l'utiliser
Indiquer les échéances (nombre, montants, dates) dans le devis envoyé au client. Aucun paiement en ligne n'est ajouté ici.

## Tests
- `Home.test.tsx` : la mention apparaît dans le haut de l'accueil ; toujours un seul prix affiché.

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/data/accueil.ts`, `faq.ts`, `legal.ts`

## Reste ouvert
- Encaisser les échéances : par virement ou avec un service de paiement (Stripe…), à choisir par Baptiste. Les moyens de paiement des CGV sont toujours « [à compléter] ».
