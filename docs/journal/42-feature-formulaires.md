# Formulaire de contact rapide et champs modernisés

Branche `feature/formulaires` · 2026-11-06

## Ce qui a été fait
- **Formulaire de contact rapide** en bas de l'accueil, inspiré de la référence sans la copier, en bleu marine et rose. Il remplace l'ancien encart final, dont les liens restent présents à côté du formulaire et dans le pied de page. Il se présente comme une carte :
  - à gauche : prénom et nom, téléphone, e-mail, « Votre besoin » (liste), « Votre projet », consentement RGPD, Envoyer ;
  - à droite, sur fond bleu marine : l'e-mail (et le téléphone une fois renseigné), trois engagements (réponse sous 24 h, un seul interlocuteur, prix affichés), le rendez-vous gratuit et le devis détaillé.
  - Il envoie **le même formulaire que la demande de devis**, à la même adresse (`devis.php` aujourd'hui, l'API `POST /demandes` ensuite) : même accusé de réception, même suivi. Rien à changer côté serveur.
  - Protections : champ piège anti-robots, un envoi par minute dans le navigateur, limite du serveur (message en cas de 429).
- **Champs de saisie modernisés** (bloc `TextField`, donc tous les formulaires du site : devis, rendez-vous, connexion, espace client) :
  - fond teinté qui blanchit au survol puis au focus ;
  - coins plus arrondis et hauteur de 48 px ;
  - halo rose au focus, en plus du contour ;
  - astérisque des champs obligatoires en rose ;
  - texte d'exemple discret.
  - La liste déroulante du contact est assortie.

## Tests
- **unitaires** : `validerContact` (champs manquants ou invalides, projet facultatif), `construireEnvoiContact` (contrat de la demande de devis, récapitulatif, piège).
- **fonctionnels** : `ContactRapide.test.tsx` (erreurs sans envoi, envoi et remerciement, échec qui garde les réponses, 429, liens de la colonne de droite) ; `Home.test.tsx` (le formulaire termine l'accueil, avec le lien vers le devis détaillé).
- **manuel** : captures à 390 px et 1 280 px, avec un champ en focus.

Résultats : site 357 et bibliothèque 70 tests verts ; lint et build verts.

## Fichiers principaux
- `front/src/components/ContactRapide/` (composant, `contact.ts`, styles, tests), `front/src/data/contact.ts`
- `packages/blocs/src/TextField/TextField.module.css`
- `front/src/pages/Home/Home.tsx` ; supprimés : `pages/Home/sections/AppelAction.*`

## Reste ouvert
- Le numéro de téléphone (`contact.phone`) : il s'affichera à côté du formulaire une fois renseigné.
