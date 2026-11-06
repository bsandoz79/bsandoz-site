# Édition par bloc : textes, prix, images

Branche `feature/edition-blocs` · 2026-11-06

## Ce qui a été fait
- **Sur le site** :
  - connecté avec un compte du back-office, un bouton « Modifier » apparaît sur chaque bloc de l'accueil, les 3 formules et les compléments ;
  - il ouvre un panneau latéral avec tout ce que le bloc contient (textes, prix, images) ;
  - « Enregistrer » envoie tout d'un coup et la page change sur place ;
  - pour un visiteur, rien n'est ajouté à la page et aucun appel supplémentaire ne part.
- **Registre** `data/blocs.ts` : ce que contient chaque bloc.
- **Images** : réduites à 1 600 px et converties en WebP dans le navigateur, puis envoyées.
- **API**, nouveau module `Contenu` :
  - table `contenu_personnalise`, migration `Version20261106140000` ;
  - `GET /contenus`, public ;
  - `POST /backoffice/contenus` et `POST /backoffice/images`, réservés au back-office, en JSON seulement.
- **Sécurité des images** : type lu dans le fichier, JPEG, PNG ou WebP uniquement, 5 Mo au plus, nom tiré au hasard. Un script PHP ou un SVG est refusé.
- Le composant `PrixModifiable` est retiré : ses prix sont dans les blocs.

## Tests
- **Site** : `BlocModifiable.test.tsx` (visiteur, compte sans le rôle, session expirée, texte et prix, retour au code, image, annulation, erreurs, registre). 443 tests verts. Lancer : `npm run test -w front`.
- **API** : `ContenuTest.php` (clés, longueur, tout ou rien, vraies et fausses images), `ContenusBackOfficeTest.php` (public, droits, refus d'un formulaire, modification partielle, tout ou rien, envoi d'image). 307 tests verts avec MySQL 8 (2 sautés : serveur IMAP de test absent). Migrations jouées sur une base neuve et schéma conforme. Lancer : `docker run --rm -v "$PWD:/app" -w /app composer:2 php bin/phpunit` dans `api/`.
- **Manuel**, dans Chrome avec une API simulée :
  - 15 boutons « Modifier » sur l'accueil ;
  - panneau affiché, badge modifié, envoi correct, page à jour, valeur toujours là après rechargement.

**Pas encore essayé avec le vrai serveur** : il faut d'abord déployer l'API et lancer la migration. L'envoi réel d'une image reste à essayer.

## Reste ouvert
- Déployer l'API : Actions, puis `cache:clear` et `doctrine:migrations:migrate` sur le serveur.
- Autres pages : `feature/edition-autres-pages`.
- Prix écrits dans le code (heure, suivi mensuel, SEO seul).
