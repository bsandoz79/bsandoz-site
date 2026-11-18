# Déroulé avec durées, retouches à volonté et 30 jours d'ajustements

Branche `feature/deroule-durees` · 2026-11-18

## Ce qui a été fait
Inspiré de la page de vente de Roselyn Pro (sans reprendre ses textes), à la demande de Baptiste, avec ses propres délais :
- **« Comment ça se passe »** (accueil) : chaque étape affiche son temps : quelques minutes, sous 24 h, **5 à 7 jours ouvrés** pour le premier aperçu privé d'un site vitrine, le jour où vous validez.
- **Retouches à volonté** avant la mise en ligne (remplace « 1 série » et « 2 séries » de retouches sur les formules Vitrine et Vitrine+).
- **30 jours d'ajustements** offerts après la mise en ligne : étape 4, « Ce que vous recevez à la livraison », et la FAQ.
- FAQ : délai du premier aperçu, nouvelle question « Combien de retouches ai-je droit ? ».

## À quoi ça sert
Dire au visiteur combien de temps prend chaque étape et le rassurer sur le résultat.

## Comment l'utiliser
Textes dans `front/src/data/accueil.ts` (`methode`, `livraison`), `offres.ts` et `faq.ts`.

## Tests
- `Home.test.tsx` : chaque étape affiche sa durée, « 5 à 7 jours ouvrés » et « Retouches à volonté » présents.

Lancer : `npm run test -w front -- Home`

## Fichiers principaux
- `front/src/data/accueil.ts`, `offres.ts`, `faq.ts`
- `front/src/pages/Home/sections/Methode.tsx`, `Methode.module.css`

## Reste ouvert
- Les autres idées validées suivent sur leurs branches : paiement en plusieurs fois, comparatif, « vos réponses → votre site », exemples par métier, maquette gratuite.
