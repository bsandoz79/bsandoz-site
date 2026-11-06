# Crayon sur les prix

Branche `feature/edition-en-page` · 2026-11-06

## Ce qui a été fait
- `app/edition.ts` : `useEdition()` dit si le compte connecté peut modifier le site. Un visiteur sans session ne déclenche aucun appel. La décision vient de l'API (`/backoffice/demandes`).
- `components/PrixModifiable` : un crayon à côté du prix, un champ sur place, Entrée pour enregistrer, Échap pour annuler. Le prix change sans recharger la page.
- Prix concernés : les trois formules (accueil et Tarifs) et la page supplémentaire.
- Aucun changement d'API ni nouveau déploiement de l'API : tout s'appuie sur `POST /backoffice/prix` et sa garde.

## Tests
- `PrixModifiable.test.tsx` :
  - visiteur : pas de crayon, aucun appel ;
  - compte sans le rôle : pas de crayon ;
  - session expirée : pas de crayon, et la note est effacée ;
  - bon rôle : enregistrement et prix mis à jour ;
  - retour au prix du code ;
  - Échap et Annuler ;
  - montant invalide et échec de l'API.
- Lancer : `npm run test -w front -- PrixModifiable`.
- Manuel, dans Chrome avec une API simulée : crayon visible, champ, envoi `{"prix":{"formule.vitrine":129}}`, prix affiché à jour. **Pas encore essayé avec un vrai compte sur le serveur.**

## Reste ouvert
- Textes et images : `feature/edition-textes`, avec un stockage dans l'API.
- Les prix écrits dans le code (heure, suivi mensuel, SEO seul) et les options du simulateur n'ont pas de crayon.
