# Un site plus sobre (« moins IA »)

Branche `style/moins-ia` · 2026-11-06

## Ce qui a été fait
- **Effets** :
  - le fond de la page est uni : les lueurs orangée, rose et violette du thème nuit sont retirées ;
  - les halos roses de l'accueil, des chiffres, du contact, du pied de page, des réalisations, de la carte et de l'encart SEO sont retirés ;
  - le téléphone et les bulles de l'accueil ne flottent plus ; le cercle qui respirait est supprimé ;
  - le halo qui pulse sur les boutons et les mots qui tournent sous le titre sont supprimés ;
  - le reflet ne reste que sur « Estimer mon projet » en haut de l'accueil (plus sur les cartes de prix) ;
  - le rideau sur la photo est gardé.
- **Titres** : les 15 petits titres en majuscules au-dessus des sections sont retirés, et les titres sont simplifiés :
  - « Ce qui vous fait perdre des clients », « Mes tarifs », « Mes réalisations » ;
  - « Comment ça se passe », « Pourquoi travailler avec moi », « Questions fréquentes » ;
  - pour le SEO : « Vous avez déjà un site ? ».
- **Formules toutes faites** :
  - « Bonne nouvelle : … » devient « Vous êtes dans ma zone, à 15 km d'Amiens : je viens chez vous sans frais. » ;
  - « Pas d'inquiétude » est retiré ;
  - les tirets longs sont remplacés par « : » ou des parenthèses.

## Tests
- `Home.test.tsx` :
  - nouveaux titres ;
  - reflet seulement sur le bouton principal, aucune animation `anim-pulse`, `anim-float` ou `anim-respire` ;
  - aucun petit titre en majuscules.
- `Tarifs.test.tsx` : pas de reflet sur les formules, nouveau titre de l'encart SEO.
- `CarteZones.test.tsx`, `Informatique.test.tsx` : nouveaux textes.
- Lancer : `npm run test -w front`.
- Manuel : captures de l'accueil, en haut et au milieu.

## Reste ouvert
- **Les textes, dans ta voix** : il reste des phrases génériques (titre du haut de page, arguments). Pour les rendre humaines, il faut tes mots : comment tu as commencé, un client aidé, ce qui t'agace chez les autres prestataires. Rien n'a été inventé.
