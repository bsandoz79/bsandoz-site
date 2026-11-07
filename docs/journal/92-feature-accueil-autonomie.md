# Accueil : un site que vous modifiez vous-même

Branche `feature/accueil-autonomie` · 2026-11-07

## Ce qui a été fait
- **Nouvelle promesse**, inspirée de la page de création de sites de Louis Verselle que Baptiste a montrée (structure seulement, textes propres) : « Un site à vous, que vous modifiez vous-même. »
- **Ordre de l'accueil** :
  1. haut de page ;
  2. bande des métiers qui ont besoin d'un site (avocats, couvreurs…), sous la question « Vous avez une entreprise, mais pas encore de site ? » ;
  3. ce que le client change seul ;
  4. réalisations qui défilent ;
  5. méthode ;
  6. ce que vous recevez à la livraison ;
  7. questions fréquentes, carte et contact.
- **Retirés de l'accueil** : chiffres clés, problèmes et solutions, formules, « Pourquoi travailler avec moi ». La photo en rideau reste sur la page À propos.
- Bouton principal : « Demander un devis ».
- **Nouveau bloc `Showcase`**, une vitrine qui défile :
  - bouton pause ;
  - arrêt au survol et au clavier ;
  - copie de boucle cachée et inerte ;
  - rangée à faire glisser si les animations sont réduites.

## Promesses tenues
Les textes ne promettent que ce que l'édition par bloc sait faire : textes, photos et prix. Pour une nouvelle page ou le menu, le site dit « Je m'en occupe ». Domaine et hébergement au nom du client, code remis : c'est la règle par défaut du projet (`docs/mise-en-place/README.md`).

## Tests
- `Home.test.tsx` : ordre des sections, bande des métiers, autonomie, vitrine (une seule liste lue, pause, lien), livraison, un seul reflet.
- `Showcase.test.tsx` : liste unique, copie inerte, pause, durée.
- Vérifié dans Chrome, ordinateur et mobile.
- Lancer : `npm run test`.

## Reste ouvert
- Retrait de l'estimation et devis en formulaire court : `chore/retrait-simulation`.
- Maquettes d'outils dans la vitrine : `feature/exemples-outils`.
