# Réseaux sociaux : Instagram

Branche `feature/reseaux-sociaux` · 2026-11-23

## Ce qui a été fait
Baptiste a créé son compte Instagram professionnel, @bsandoz_.
- `contact.reseaux` (`front/src/data/navigation.ts`) : liste des réseaux de l'entreprise (Instagram aujourd'hui, Facebook quand la Page existera).
- Pied de page, colonne Contact : « Instagram » avec une icône au trait dessinée en code, ouvert dans un nouvel onglet (`rel="me"`).
- Données structurées de l'entreprise : le compte rejoint `sameAs` (relie le site et le compte pour Google et les assistants IA) ; ligne ajoutée à `llms.txt`.

## Tests
- `Footer.test.tsx` : lien Instagram, adresse, nouvel onglet.
- `seo.test.ts` : `sameAs` contient le portfolio et Instagram.

## Fichiers principaux
- `front/src/data/navigation.ts`, `front/src/components/Footer/Footer.tsx`, `Footer.module.css`, `front/src/data/seo.ts`, `front/src/seo/llms.ts`

## Reste ouvert
- Page Facebook : ajouter une ligne à `contact.reseaux` (l'icône existe déjà).
