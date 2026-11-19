# Dix personas : une page pour chaque grand métier

Branche `feature/personas` · 2026-11-19

## Ce qui a été fait
Revue de 10 personas (bâtiment, beauté, restaurant, commerce, santé, professions libérales, cours, gîtes, associations, événementiel) : le site parlait bien à 3 ou 4 profils seulement. Choix de Baptiste : tout.
- **7 nouvelles pages métier** (même modèle que les autres : promesse, fonctions utiles, exemple fictif) : `/site-batiment`, `/site-beaute`, `/site-profession-liberale`, `/site-cours-coaching`, `/site-gite`, `/site-association`, `/site-evenementiel`.
- **Page artisan recentrée** sur les services à domicile (detailing, ménage, réparation, jardinage) ; le bâtiment a sa page. L'adresse `/site-artisan` ne change pas.
- **Santé** : « Vous utilisez déjà Doctolib ? Votre site met en avant votre bouton Doctolib. »
- **Associations** : « Tarif adapté aux associations : demandez-le dans votre devis » (aucun chiffre tant que Baptiste n'en fixe pas).
- **Bande des métiers de l'accueil cliquable** : chaque métier mène à sa page ; la bande s'arrête au survol et au clavier (bloc `Marquee` : `renderItem`).
- **Catégories du configurateur et du devis** : 12 au lieu de 5 ; les métiers tapés sont rangés dans la bonne (Plombier → bâtiment, Avocat → professions libérales, Kebab → restaurant…), avec les fonctions proposées en conséquence.
- Pied de page « Sites par métier » : les 11 pages. Pages lues par Google sans JavaScript et plan du site : automatiquement.

## Tests
- `Metier.test.tsx` : les 11 pages (public, nombre de fonctions, exemple fictif), Doctolib, tarif associations sans chiffre.
- `Home.test.tsx` : liens de la bande des métiers. `Footer.test.tsx` : 11 pages métier. `Marquee.test.tsx` : rendu en liens, copie hors du clavier.

Lancer : `npm run test`

## Fichiers principaux
- `front/src/data/metiers.ts`, `pages.ts`, `offres.ts`, `apercu.ts`, `metiersConnus.ts`, `navigation.ts`, `accueil.ts`, `blocs.ts`
- `front/src/app/routes.tsx`, `front/src/pages/Home/sections/Metiers.tsx`, `packages/blocs/src/Marquee/`

## Reste ouvert
- Un exemple codé propre à chaque métier (comme la carte du kebab) : pour l'instant, l'aperçu générique.
- Tarif associations : à fixer par Baptiste s'il veut l'afficher.
