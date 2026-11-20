# Moyens de paiement

Branche `feature/moyens-paiement` · 2026-11-20

## Ce qui a été fait
Demande de Baptiste : une ligne avec les moyens de paiement (Visa, etc.), sur le modèle d'une capture d'un autre site. Moyens retenus, ceux qu'il accepte vraiment : carte par Stripe (Visa, Mastercard, American Express), Apple Pay et Google Pay (proposés par la page de paiement Stripe), virement bancaire. Rien d'autre de la capture (paiement en plusieurs fois par carte, remboursement) n'a été repris.
- Bloc réutilisable `MoyensPaiement` : petites cartes blanches, marques dessinées en texte et formes simples (pas les logos officiels), liste nommée pour les lecteurs d'écran.
- Accueil : ligne discrète juste sous « à partir de … ». Pied de page : version petite, à côté des droits et des liens légaux.
- FAQ « Comment se passe le paiement ? » : phrase sur les moyens acceptés. Conditions de vente : « Moyens de paiement » rempli (n'est plus « à compléter »).
- Source unique : `front/src/data/paiement.ts`.

## Tests
- `MoyensPaiement.test.tsx` : ordre et noms lus, seulement les moyens demandés, titre, mention, taille petite. `npm run test -w @bsandoz79/blocs`.
- `livraison.test.ts` : la bibliothèque compte 18 blocs.

## Fichiers principaux
- `packages/blocs/src/MoyensPaiement/*`, `front/src/data/paiement.ts`, `front/src/pages/Home/sections/Hero.tsx`, `front/src/components/Footer/Footer.tsx`, `front/src/data/faq.ts`, `front/src/data/legal.ts`

## Reste ouvert
- Le paiement lui-même (lien de paiement Stripe ou RIB dans le devis) se fait hors du site.
