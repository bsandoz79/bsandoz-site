# Mise en place chez un client

Branche `docs/mise-en-place-client` · 2026-11-06

## Ce qui a été fait
- `docs/mise-en-place/` : une page de choix, une page commune et 6 fiches (blocs, prix et référencement, devis par mail, rendez-vous, demandes de devis, espace client). Chacune donne les fichiers à copier, les réglages, la base, les mails, le domaine, les vérifications finales, et ce qui change selon la façon de livrer.
- Deux façons de livrer : client autonome (cas normal) ou « je gère pour lui » (à sa demande).
- Règle de `.claude/CLAUDE.md` nuancée en conséquence, et nouvelle règle : tenir ces fiches à jour.
- Notices corrigées : Auth (seconde migration oubliée), Prospect (étapes manquantes, mentions en dur).

## À quoi ça sert
Installer une fonctionnalité chez un client sans repartir de zéro ni rien oublier, et savoir d'avance ce que chaque façon de livrer implique.

## Comment l'utiliser
Commencer par `docs/mise-en-place/README.md`.

## Tests
Aucun test automatique ajouté : uniquement de la documentation. Pour que la doc dise vrai, la marche à suivre a été essayée dans des copies jetables (conteneurs Docker) :
- **chaque module seul**, sur MariaDB 10.11, dépendances inutiles retirées :
  - Booking : migration et schéma corrects, 47 tests sur 48 ; le dernier attend le mail d'activation d'une liaison ;
  - Auth : avec la notice d'origine, schéma incorrect. Avec les deux migrations, schéma correct et 89 tests verts (avec une doublure à la place du faux mailer rangé dans les tests de Booking, et `OuvrirCompte` rendu public pour les tests) ;
  - Prospect : migration et schéma corrects, 35 tests sur 40 ; les 5 autres attendent les liaisons.
- **API complète** : 185 tests verts sur MySQL 8.0 et sur MariaDB 10.11.
- **Apache en production**, sans dépendances de développement, avec l'origine d'un autre domaine :
  - Booking seul : réservation 201, même créneau 409, autre site sans autorisation CORS, `.env.local` non lisible, aucun détail technique sur une 404 ;
  - API complète : `/auth/moi` 401, `/auth/lien` 202, `/espace/demandes` 401, `/demandes` accepté et numéroté.
- **Site vierge** avec les seuls fichiers listés : build et types corrects (`paths` documenté), plus aucune adresse `api.bsandoz.fr` dans le JavaScript quand `VITE_API_URL` est fixée, 67 tests copiés verts. Deux fichiers de test (`Devis`, `RendezVous`) demandent `app/routes` et ne se copient pas tels quels.
- **Vérification** : liens et ancres contrôlés, schémas affichés par Mermaid 11 dans Chrome.

Ces essais ont fait apparaître deux défauts bloquants, corrigés à part : voir [`fix/api-production`](29-fix-api-production.md).

Lancer les tests du dépôt : `npm run lint`, `npm run test`, `npm run build` ; API : voir `docs/api.md`.

## Fichiers principaux
- `docs/mise-en-place/`, `docs/fonctionnalites/mise-en-place-client.md`, `.claude/CLAUDE.md`, `api/src/Auth/README.md`, `api/src/Prospect/README.md`

## Reste ouvert
- Jamais essayé sur un vrai hébergement, ni avec un envoi réel de mails, ni connexion dans un navigateur sur un autre domaine, ni en mode « je gère pour lui ».
- `DevisPdf.php` : mentions écrites en dur (activité, TVA). Elles devraient devenir des réglages.
- Espace client avec deux modules seulement : les liaisons et la page supposent les trois.
- Tests de l'API non copiables seuls : le faux mailer est rangé dans les tests de Booking, et plusieurs tests supposent les liaisons.
- CGV du site : ne parlent pas encore du mode « je gère pour lui » ; contrat, prix et article 28 du RGPD à rédiger.
- Conditions de l'hébergeur pour héberger des tiers, et cloisonnement entre clients : à décider.
