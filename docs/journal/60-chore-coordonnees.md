# Coordonnées

Branche `chore/coordonnees` · 2026-11-06

## Ce qui a été fait
- **Téléphone** 07 69 28 78 37 (`contact.phone`) : cliquable dans le pied de page et le bloc de contact, repris dans les mentions légales et les données structurées.
- **Adresse** 319 rue de Rouen, 80000 Amiens (`contact.adresse`) : mentions légales et données structurées (`streetAddress`, `postalCode`).
- **SIRET** : « en cours d'immatriculation ».

## Tests
- `Footer.test.tsx` (téléphone affiché et cliquable, absent s'il est vide), `seo.test.ts` (adresse complète et téléphone), `Legal.test.tsx` (éditeur).
- Lancer : `npm run test -w front -- Footer seo Legal`.

## Reste ouvert
Encore « à compléter » :
- statut juridique ;
- adresse et téléphone de l'hébergeur (o2switch) ;
- acompte et moyens de paiement ;
- transfert de propriété ;
- rétractation et médiateur ;
- durée de conservation des demandes ;
- parcours sur la page À propos ;
- éléments des réalisations.
