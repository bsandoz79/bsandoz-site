# Retrait de l'estimation, devis en formulaire court

Branche `chore/retrait-simulation` · 2026-11-07

## Ce qui a été fait
- **Retiré** :
  - la page Estimer (`/composer`), avec le configurateur des sites et de l'informatique ;
  - le simulateur de la page Tarifs ;
  - le pré-devis chiffré envoyé par mail ;
  - le brouillon et la fenêtre « reprendre là où vous en étiez ».
- `/composer` redirige vers `/devis`.
- **Un seul formulaire** (`ContactRapide`), en bas de l'accueil et sur `/devis` :
  - prénom et nom, entreprise (facultatif), e-mail, téléphone ;
  - domaine d'activité en pastilles, où « Autre » ouvre « Précisez votre activité » ;
  - le projet en quelques lignes ;
  - consentement.
- **Tous les boutons** « Estimer / Composer mon site » deviennent « Demander un devis » : en-tête, barre mobile, pied de page, Tarifs, pages métier, réalisations, Informatique sur place.
- **Tarifs** : prix de départ, puis « Votre projet a ses particularités ? » avec le bouton de devis.
- **Mail d'accusé** (API et `devis.php`) : « avec une proposition » au lieu de « une première estimation ».
- **Mentions** :
  - confidentialité : le stockage local ne garde plus de brouillon ;
  - aide des prix dans `/admin` : plus de configurateur.

## Tests
- `ContactRapide.test.tsx` et `Devis.test.tsx` réécrits ; en-tête, barre mobile, pied de page, Tarifs, pages métier, réalisations et Informatique mis à jour.
- Résultats :
  - site : 364 tests ;
  - blocs : 75 tests ;
  - API : PHPUnit complet (texte du mail changé).
- Vérifié dans Chrome, sur ordinateur et sur mobile.

## Reste ouvert
- **Adresse du client** : le formulaire ne la demande plus. Les frais kilométriques sont calculés à la prise de rendez-vous, où l'adresse est vérifiée.
- **Photos** : le formulaire n'en prend plus. Le client peut les envoyer en répondant au mail.
- **API à redéployer** pour le nouveau texte du mail. Le reste ne change pas, car le contrat `POST /demandes` est le même.
