# Réseaux sociaux : Page Facebook

Branche `feature/reseaux-facebook` · 2026-11-23

## Ce qui a été fait
Baptiste a créé sa Page Facebook, bsandoz.
- `contact.reseaux` (`front/src/data/navigation.ts`) : ajout de la Page (https://www.facebook.com/bsandoz).
- Pied de page, colonne Contact : « Facebook » sous « Instagram », avec l'icône au trait déjà prévue, ouvert dans un nouvel onglet.
- Données structurées (`sameAs`) et `llms.txt` : la Page s'ajoute toute seule, à partir de la même liste.

## Tests
- `Footer.test.tsx` : lien Facebook, adresse, nouvel onglet.
- `seo.test.ts` : `sameAs` contient aussi la Page Facebook.

## Fichiers principaux
- `front/src/data/navigation.ts`, `front/src/components/Footer/Footer.test.tsx`, `front/src/data/seo.test.ts`
